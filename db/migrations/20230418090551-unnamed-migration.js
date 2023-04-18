'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'transactions',
        'deleted',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        {
          transaction,
        },
      );
      transaction.commit();
    } catch (er) {
      console.error('Error in REMOVE TRANSACTIONS migration', er);
      transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('transactions', 'deleted', {
        transaction,
      });
      transaction.commit();
    } catch (er) {
      console.error('Error in REMOVE TRANSACTIONS migration', er);
      transaction.rollback();
    }
  }
};
