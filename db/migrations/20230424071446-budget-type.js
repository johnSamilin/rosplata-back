'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'budgets',
        'type',
        {
          type: Sequelize.ENUM('open', 'private'),
          defaultValue: 'private',
        },
        {
          transaction,
        },
      );
      transaction.commit();
    } catch (er) {
      console.error('Error in BUDGET TYPE migration', er);
      transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('budgets', 'type', {
        transaction,
      });
      transaction.commit();
    } catch (er) {
      console.error('Error in BUDGET TYPE migration', er);
      transaction.rollback();
    }
  }
};
