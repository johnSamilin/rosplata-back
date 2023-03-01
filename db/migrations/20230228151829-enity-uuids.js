'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'transactions',
        'transactions_ibfk_2',
        {
          transaction,
        },
      );
      await queryInterface.removeIndex('transactions', 'budgetId', {
        transaction,
      });
      await queryInterface.removeConstraint(
        'participants',
        'participants_ibfk_1',
        {
          transaction,
        },
      );
      await queryInterface.changeColumn(
        'transactions',
        'id',
        {
          type: Sequelize.UUID,
          autoIncrement: false,
        },
        {
          transaction,
        },
      );
      await queryInterface.changeColumn('transactions', 'budgetId', {
        type: Sequelize.UUID,
        transaction,
      });
      await queryInterface.changeColumn('participants', 'budgetId', {
        type: Sequelize.UUID,
        transaction,
      });
      await queryInterface.changeColumn(
        'budgets',
        'id',
        {
          type: Sequelize.UUID,
          autoIncrement: false,
        },
        {
          transaction,
        },
      );
      await queryInterface.addConstraint('transactions', {
        type: 'FOREIGN KEY',
        fields: ['budgetId'],
        references: {
          table: 'budgets',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        transaction,
      });
      await queryInterface.addConstraint('participants', {
        type: 'FOREIGN KEY',
        fields: ['budgetId'],
        references: {
          table: 'budgets',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        transaction,
      });
      transaction.commit();
    } catch (error) {
      console.error('Error in migration entity-uuids ', error);
      transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'transactions',
        'transactions_budgetId_budgets_fk',
        {
          transaction,
        },
      );
      await queryInterface.removeConstraint(
        'participants',
        'participants_budgetId_budgets_fk',
        {
          transaction,
        },
      );
      await queryInterface.changeColumn(
        'budgets',
        'id',
        {
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        {
          transaction,
        },
      );
      await queryInterface.changeColumn('transactions', 'budgetId', {
        type: Sequelize.INTEGER,
        transaction,
      });
      await queryInterface.changeColumn('participants', 'budgetId', {
        type: Sequelize.INTEGER,
        transaction,
      });
      await queryInterface.changeColumn(
        'transactions',
        'id',
        {
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        {
          transaction,
        },
      );
      await queryInterface.addConstraint('participants', {
        type: 'FOREIGN KEY',
        fields: ['budgetId'],
        references: {
          table: 'budgets',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        transaction,
      });
      await queryInterface.addConstraint('transactions', {
        type: 'FOREIGN KEY',
        fields: ['budgetId'],
        references: {
          table: 'budgets',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        transaction,
      });
      transaction.commit();
    } catch (error) {
      console.error('Error in undoing migration entity-uuids ', error);
      transaction.rollback();
      throw error;
    }
  },
};
