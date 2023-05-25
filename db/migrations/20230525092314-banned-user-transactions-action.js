'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'budgets',
        'bannedUserTransactionsAction',
        {
          type: Sequelize.ENUM('keep', 'ignore'),
          defaultValue: 'keep',
        },
        {
          transaction,
        },
      );
      transaction.commit();
    } catch (er) {
      console.error('Error in BANNED USER TRANSACTIONS ACTION migration', er);
      transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn(
        'budgets',
        'bannedUserTransactionsAction',
        {
          transaction,
        },
      );
      transaction.commit();
    } catch (er) {
      console.error('Error in BANNED USER TRANSACTIONS ACTION migration', er);
      transaction.rollback();
    }
  },
};
