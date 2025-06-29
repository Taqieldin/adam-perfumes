'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns for address references
    await queryInterface.addColumn('orders', 'shipping_address_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'user_addresses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('orders', 'billing_address_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'user_addresses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'shipping_address_id');
    await queryInterface.removeColumn('orders', 'billing_address_id');
  }
};
