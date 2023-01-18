'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'participants',
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          budgetId: {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'budgets',
              key: 'id',
            },
          },
          userId: {
            type: Sequelize.STRING(50),
            onDelete: 'CASCADE',
            references: {
              model: 'users',
              key: 'id',
            },
          },
          status: {
            type: Sequelize.INTEGER,
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
          indexes: [
            {
              unique: true,
              fields: ['userId', 'budgetId'],
            },
          ],
        },
      );
      transaction.commit();
    } catch (error) {
      console.error('Error in migration participants ', error);
      transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('participants');
  },
};
