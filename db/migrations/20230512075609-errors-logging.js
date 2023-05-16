'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn(
        'Stats',
        'eventType',
        {
          type: Sequelize.ENUM('lang', 'useragent', 'error'),
        },
        {
          transaction,
        },
      );
      await queryInterface.addColumn(
        'Stats',
        'requestId',
        {
          type: Sequelize.STRING,
        },
        {
          transaction,
        },
      );
      transaction.commit();
    } catch (er) {
      console.error('Error in ERRORS LOGGING migration', er);
      transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn(
        'Stats',
        'eventType',
        {
          type: Sequelize.ENUM('lang', 'useragent'),
        },
        {
          transaction,
        },
      );
      await queryInterface.removeColumn('Stats', 'requestId', {
        transaction,
      });
      transaction.commit();
    } catch (er) {
      console.error('Error in ERRORS LOGGING migration', er);
      transaction.rollback();
    }
  },
};
