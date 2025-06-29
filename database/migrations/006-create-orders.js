'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      order_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Human-readable order number (e.g., AP-2024-001234)'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      // Order status
      status: {
        type: Sequelize.ENUM(
          'pending',           // Order placed, awaiting payment
          'paid',             // Payment confirmed
          'processing',       // Being prepared
          'ready_for_pickup', // Ready for collection
          'shipped',          // Shipped to customer
          'out_for_delivery', // Out for delivery
          'delivered',        // Successfully delivered
          'cancelled',        // Cancelled by customer/admin
          'refunded',         // Refunded
          'returned'          // Returned by customer
        ),
        defaultValue: 'pending'
      },
      // Fulfillment method
      fulfillment_method: {
        type: Sequelize.ENUM('delivery', 'pickup', 'branch_visit'),
        allowNull: false,
        defaultValue: 'delivery'
      },
      pickup_branch_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'branches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Branch for pickup orders'
      },
      // Customer information
      customer_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      customer_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customer_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Shipping address
      shipping_address: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Complete shipping address object'
      },
      // Billing address
      billing_address: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Complete billing address object'
      },
      // Pricing in OMR
      subtotal: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Subtotal before discounts and taxes in OMR'
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10, 3),
        defaultValue: 0.000,
        comment: 'Total discount amount in OMR'
      },
      tax_amount: {
        type: Sequelize.DECIMAL(10, 3),
        defaultValue: 0.000,
        comment: 'Tax amount in OMR'
      },
      shipping_cost: {
        type: Sequelize.DECIMAL(10, 3),
        defaultValue: 0.000,
        comment: 'Shipping cost in OMR'
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Final total amount in OMR'
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'OMR'
      },
      // Payment information
      payment_method: {
        type: Sequelize.ENUM('card', 'wallet', 'cod', 'bank_transfer', 'points'),
        allowNull: true
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
        defaultValue: 'pending'
      },
      payment_gateway: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Payment gateway used (stripe, tap, etc.)'
      },
      payment_transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Gateway transaction ID'
      },
      payment_reference: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Payment reference number'
      },
      // Discounts and promotions
      coupon_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      coupon_discount: {
        type: Sequelize.DECIMAL(10, 3),
        defaultValue: 0.000
      },
      loyalty_points_used: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      loyalty_points_earned: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      wallet_amount_used: {
        type: Sequelize.DECIMAL(10, 3),
        defaultValue: 0.000,
        comment: 'Amount paid from wallet in OMR'
      },
      // Delivery information
      delivery_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delivery_time_slot: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Preferred delivery time slot'
      },
      delivery_instructions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tracking_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      delivery_partner: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Delivery company/partner'
      },
      estimated_delivery: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actual_delivery: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // Order source and channel
      source: {
        type: Sequelize.ENUM('mobile_app', 'website', 'admin_panel', 'branch', 'whatsapp'),
        defaultValue: 'mobile_app'
      },
      platform: {
        type: Sequelize.ENUM('android', 'ios', 'web', 'admin'),
        allowNull: true
      },
      // Special instructions and notes
      customer_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      internal_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Gift options
      is_gift: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      gift_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      gift_wrapping: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      gift_wrapping_cost: {
        type: Sequelize.DECIMAL(10, 3),
        defaultValue: 0.000
      },
      // Timestamps for order lifecycle
      placed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      confirmed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      shipped_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancellation_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Additional metadata
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional order metadata'
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
    await queryInterface.addIndex('orders', ['order_number']);
    await queryInterface.addIndex('orders', ['user_id']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['payment_status']);
    await queryInterface.addIndex('orders', ['fulfillment_method']);
    await queryInterface.addIndex('orders', ['pickup_branch_id']);
    await queryInterface.addIndex('orders', ['customer_email']);
    await queryInterface.addIndex('orders', ['customer_phone']);
    await queryInterface.addIndex('orders', ['source']);
    await queryInterface.addIndex('orders', ['placed_at']);
    await queryInterface.addIndex('orders', ['delivered_at']);
    await queryInterface.addIndex('orders', ['total_amount']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};