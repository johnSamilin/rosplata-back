'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 'rosplataapp',
          name: 'Demo Account',
          email: 'rosplataap@mail.ru',
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { id: 'rosplataapp' }, {});
  },
};
