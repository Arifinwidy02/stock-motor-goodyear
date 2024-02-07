"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const data = require("../data/motor_table.json").Motor_table;
    const mapData = data.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      delete el.id;
      return el;
    });
    await queryInterface.bulkInsert("motors", mapData, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("motors", null, {});
  },
};
