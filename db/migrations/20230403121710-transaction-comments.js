'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'transactions',
        'comment',
        {
          type: Sequelize.TEXT,
        },
        {
          transaction,
        },
      );
      transaction.commit();
    } catch (er) {
      console.error('Error in COMMENTS migration', er);
      transaction.rollback();
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('transactions', 'comment', {
        transaction,
      });
      transaction.commit();
    } catch (er) {
      console.error('Error in COMMENTS migration', er);
      transaction.rollback();
    }
  }
};
