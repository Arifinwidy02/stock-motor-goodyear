"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("repairs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: "statuses",
        },
      },
      order_date: {
        type: Sequelize.DATE,
      },
      finish_date: {
        type: Sequelize.DATE,
      },
      motorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "motors",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("repairs");
  },
};
