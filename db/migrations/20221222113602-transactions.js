'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'transactions',
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          ownerId: {
            type: Sequelize.STRING(50),
            onDelete: 'CASCADE',
            references: {
              model: 'users',
              key: 'id',
            },
          },
          budgetId: {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'budgets',
              key: 'id',
            },
          },
          amount: {
            type: Sequelize.DECIMAL(10, 2),
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
      transaction.commit();
    } catch (error) {
      console.error('Error in migration Transactions ', error);
      transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};
