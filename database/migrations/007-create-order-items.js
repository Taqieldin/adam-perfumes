'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      // Product details at time of order (for historical accuracy)
      product_sku: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_name_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      product_image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Quantity and pricing
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Price per unit at time of order in OMR'
      },
      original_price: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Original price before any discounts in OMR'
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10, 3),
        defaultValue: 0.000,
        comment: 'Discount applied to this item in OMR'
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Total price for this line item in OMR'
      },
      // Product attributes at time of order
      product_attributes: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Product attributes like volume, fragrance type, etc.'
      },
      // Fulfillment details
      fulfillment_status: {
        type: Sequelize.ENUM('pending', 'allocated', 'picked', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'),
        defaultValue: 'pending'
      },
      allocated_branch_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'branches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Branch from which this item will be fulfilled'
      },
      // Return/exchange information
      is_returnable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      return_deadline: {
        type: Sequelize.DATE,
        allowNull: true
      },
      returned_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      return_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Gift options for individual items
      is_gift_item: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      gift_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Special instructions
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('order_items', ['order_id']);
    await queryInterface.addIndex('order_items', ['product_id']);
    await queryInterface.addIndex('order_items', ['product_sku']);
    await queryInterface.addIndex('order_items', ['fulfillment_status']);
    await queryInterface.addIndex('order_items', ['allocated_branch_id']);
    await queryInterface.addIndex('order_items', ['is_returnable']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_items');
  }
};