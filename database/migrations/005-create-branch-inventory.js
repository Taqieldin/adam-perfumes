'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('branch_inventory', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      branch_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'branches',
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
        onDelete: 'CASCADE'
      },
      // Stock levels
      quantity_on_hand: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Current physical stock'
      },
      quantity_available: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Available for sale (on_hand - reserved)'
      },
      quantity_reserved: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Reserved for pending orders'
      },
      quantity_damaged: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Damaged/unsellable stock'
      },
      // Reorder levels
      min_stock_level: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
        comment: 'Minimum stock before reorder alert'
      },
      max_stock_level: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Maximum stock capacity for this product'
      },
      reorder_point: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Stock level that triggers reorder'
      },
      reorder_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Standard reorder quantity'
      },
      // Cost and pricing at branch level
      unit_cost: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Cost per unit in OMR'
      },
      last_cost: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Last purchase cost in OMR'
      },
      average_cost: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Weighted average cost in OMR'
      },
      // Location within branch
      shelf_location: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Physical location within branch (e.g., A1-B2)'
      },
      storage_location: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Storage/warehouse location'
      },
      // Last movements
      last_received_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_sold_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_counted_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Last physical inventory count'
      },
      // Status flags
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Is this product active at this branch'
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Featured product at this branch'
      },
      needs_reorder: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Automatic flag when stock is low'
      },
      // Performance metrics
      total_sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Total units sold from this branch'
      },
      total_received: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Total units received at this branch'
      },
      // Notes and comments
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

    // Add unique constraint for branch-product combination
    await queryInterface.addConstraint('branch_inventory', {
      fields: ['branch_id', 'product_id'],
      type: 'unique',
      name: 'unique_branch_product_inventory'
    });

    // Add indexes
    await queryInterface.addIndex('branch_inventory', ['branch_id']);
    await queryInterface.addIndex('branch_inventory', ['product_id']);
    await queryInterface.addIndex('branch_inventory', ['quantity_available']);
    await queryInterface.addIndex('branch_inventory', ['needs_reorder']);
    await queryInterface.addIndex('branch_inventory', ['is_active']);
    await queryInterface.addIndex('branch_inventory', ['last_sold_date']);
    await queryInterface.addIndex('branch_inventory', ['last_received_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('branch_inventory');
  }
};