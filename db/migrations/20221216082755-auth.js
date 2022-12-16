'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.STRING(50),
            autoIncrement: false,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING(50),
          },
          email: {
            type: Sequelize.STRING(50),
          },
          picture: {
            type: Sequelize.STRING(100),
          },
          createdAt: {
            type: Sequelize.DATE,
          },
          updatedAt: {
            type: Sequelize.DATE,
          },
        },
        {
          transaction,
        },
      );
      await queryInterface.addColumn(
        'budgets',
        'userId',
        {
          type: Sequelize.STRING(50),
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        {
          transaction,
        },
      );
      transaction.commit();
    } catch (error) {
      console.error('Error in migration Auth', error);
      transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn(
        'budgets',
        'userId',
        { force: true },
        {
          transaction,
        },
      );
      await queryInterface.dropTable('users', {
        transaction,
      });
    } catch (error) {
      console.error('Error in migration Auth', error);
      transaction.rollback();
    }
  },
};
