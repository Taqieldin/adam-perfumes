'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupon_usage', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      coupon_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'coupons',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      // Usage details
      coupon_code: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Coupon code at time of usage'
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Actual discount amount applied in OMR'
      },
      order_amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Order amount before discount in OMR'
      },
      // Status
      status: {
        type: Sequelize.ENUM('applied', 'cancelled', 'refunded'),
        defaultValue: 'applied'
      },
      // Timestamps
      used_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      refunded_at: {
        type: Sequelize.DATE,
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

    // Add unique constraint to prevent duplicate usage in same order
    await queryInterface.addConstraint('coupon_usage', {
      fields: ['coupon_id', 'order_id'],
      type: 'unique',
      name: 'unique_coupon_per_order'
    });

    // Add indexes
    await queryInterface.addIndex('coupon_usage', ['coupon_id']);
    await queryInterface.addIndex('coupon_usage', ['user_id']);
    await queryInterface.addIndex('coupon_usage', ['order_id']);
    await queryInterface.addIndex('coupon_usage', ['status']);
    await queryInterface.addIndex('coupon_usage', ['used_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coupon_usage');
  }
};