'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'prefersDarkMode', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'lastLogin' // Placing it after the lastLogin column for logical grouping
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'prefersDarkMode');
  }
};
