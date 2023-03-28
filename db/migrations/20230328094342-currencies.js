'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'budgets',
        'currency',
        {
          type: Sequelize.ENUM('USD', 'RUB', 'EUR', 'CNY', 'JRD', 'INR'),
          defaultValue: 'RUB',
        },
        {
          transaction,
        },
      );
      await queryInterface.addColumn(
        'transactions',
        'currency',
        {
          type: Sequelize.ENUM('USD', 'RUB', 'EUR', 'CNY', 'JRD', 'INR'),
          defaultValue: 'RUB',
        },
        {
          transaction,
        },
      );
      transaction.commit();
    } catch (er) {
      console.error('Error in CURRENCIES migration', er);
      transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('budgets', 'currency', {
        transaction,
      });
      await queryInterface.removeColumn('transacttions', 'currency', {
        transaction,
      });
      transaction.commit();
    } catch (er) {
      console.error('Error in CURRENCIES migration', er);
      transaction.rollback();
    }
  },
};
