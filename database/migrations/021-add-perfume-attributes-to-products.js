'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'brand', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('products', 'gender', {
      type: Sequelize.ENUM('unisex', 'male', 'female'),
      defaultValue: 'unisex'
    });
    await queryInterface.addColumn('products', 'concentration', {
      type: Sequelize.ENUM('parfum', 'eau_de_parfum', 'eau_de_toilette', 'eau_de_cologne', 'eau_fraiche'),
      allowNull: true
    });
    await queryInterface.addColumn('products', 'size_ml', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('products', 'is_featured', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('products', 'is_published', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
    await queryInterface.addColumn('products', 'published_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'brand');
    await queryInterface.removeColumn('products', 'gender');
    await queryInterface.removeColumn('products', 'concentration');
    await queryInterface.removeColumn('products', 'size_ml');
    await queryInterface.removeColumn('products', 'is_featured');
    await queryInterface.removeColumn('products', 'is_published');
    await queryInterface.removeColumn('products', 'published_at');
  }
};
