'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.STRING(50),
          autoIncrement: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(50),
        },
        email: {
          type: Sequelize.STRING(50),
        },
        picture: {
          type: Sequelize.STRING(100),
        },
        lang: {
          type: Sequelize.STRING(6),
        },
        createdAt: {
          type: Sequelize.DATE,
        },
        updatedAt: {
          type: Sequelize.DATE,
        },
      },
      {
        freezeTableName: true,
      },
    );
    await queryInterface.createTable(
      'budgets',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(50),
        },
        createdAt: {
          type: Sequelize.DATE,
        },
        updatedAt: {
          type: Sequelize.DATE,
        },
        userId: {
          type: Sequelize.STRING(50),
          onDelete: 'CASCADE',
          references: {
            model: 'users',
            key: 'id',
          },
        },
        currency: {
          type: Sequelize.ENUM('USD', 'RUB', 'EUR', 'CNY', 'JRD', 'INR'),
          defaultValue: 'RUB',
        },
        type: {
          type: Sequelize.ENUM('open', 'private'),
          defaultValue: 'open',
        },
        bannedUserTransactionsAction: {
          type: Sequelize.ENUM('keep', 'ignore'),
          defaultValue: 'keep',
        }
      },
      {
        freezeTableName: true,
      },
    );
    await queryInterface.createTable(
      'transactions',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        ownerId: {
          type: Sequelize.STRING(50),
          onDelete: 'CASCADE',
          references: {
            model: 'users',
            key: 'id',
          },
        },
        budgetId: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          references: {
            model: 'budgets',
            key: 'id',
          },
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
        },
        currency: {
          type: Sequelize.ENUM('USD', 'RUB', 'EUR', 'CNY', 'JRD', 'INR'),
          defaultValue: 'RUB',
        },
        comment: {
          type: Sequelize.TEXT,
        },
        deleted: {
          type: Sequelize.BOOLEAN,
        },
        createdAt: {
          type: Sequelize.DATE,
        },
        updatedAt: {
          type: Sequelize.DATE,
        },
      },
      {
        freezeTableName: true,
      },
    );
    await queryInterface.createTable(
      'participants',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        budgetId: {
          type: Sequelize.UUID,
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
        freezeTableName: true,
      },
    );
    await queryInterface.createTable(
      'Stats',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        eventType: {
          type: Sequelize.ENUM('lang', 'useragent', 'error'),
        },
        requestId: {
          type: Sequelize.STRING,
        },
        value: {
          type: Sequelize.TEXT,
        },
        createdAt: {
          type: Sequelize.DATE,
        },
        updatedAt: {
          type: Sequelize.DATE,
        },
      },
      {
        freezeTableName: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('budgets');
  },
};
