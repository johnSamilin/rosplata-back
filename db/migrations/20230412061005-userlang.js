'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'users',
        'lang',
        {
          type: Sequelize.STRING(6),
        },
        {
          transaction,
        },
      );
      transaction.commit();
    } catch (er) {
      console.error('Error in USERLANG migration', er);
      transaction.rollback();
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('users', 'lang', {
        transaction,
      });
      transaction.commit();
    } catch (er) {
      console.error('Error in USERLANG migration', er);
      transaction.rollback();
    }
  }
};
