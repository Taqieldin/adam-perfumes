'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create wallet_transactions table
    await queryInterface.createTable('wallet_transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
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
      transaction_type: {
        type: Sequelize.ENUM('credit', 'debit'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'OMR'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reference_type: {
        type: Sequelize.ENUM('top_up', 'purchase', 'refund', 'gift_card', 'loyalty_points', 'admin_adjustment'),
        allowNull: false
      },
      reference_id: {
        type: Sequelize.UUID,
        allowNull: true // Can be order_id, payment_id, etc.
      },
      payment_method: {
        type: Sequelize.ENUM('card', 'bank_transfer', 'cash', 'gift_card', 'loyalty_points'),
        allowNull: true // Only for credit transactions
      },
      payment_reference: {
        type: Sequelize.STRING,
        allowNull: true // Payment gateway transaction ID
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled'),
        defaultValue: 'pending'
      },
      balance_before: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      balance_after: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        defaultValue: {}
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

    // Create wallet_top_ups table for tracking top-up requests
    await queryInterface.createTable('wallet_top_ups', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
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
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'OMR'
      },
      payment_method: {
        type: Sequelize.ENUM('card', 'bank_transfer', 'apple_pay', 'google_pay'),
        allowNull: false
      },
      payment_gateway: {
        type: Sequelize.ENUM('tap', 'stripe'),
        allowNull: false
      },
      payment_intent_id: {
        type: Sequelize.STRING,
        allowNull: true // Payment gateway payment intent ID
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: true // Payment gateway transaction ID
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
        defaultValue: 'pending'
      },
      failure_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      wallet_transaction_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'wallet_transactions',
          key: 'id'
        }
      },
      metadata: {
        type: Sequelize.JSON,
        defaultValue: {}
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

    // Create wallet_settings table for user wallet preferences
    await queryInterface.createTable('wallet_settings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      auto_top_up_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      auto_top_up_threshold: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 10.00
      },
      auto_top_up_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 50.00
      },
      preferred_payment_method: {
        type: Sequelize.ENUM('card', 'bank_transfer', 'apple_pay', 'google_pay'),
        allowNull: true
      },
      daily_spending_limit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      monthly_spending_limit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      notifications_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      low_balance_alert: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      low_balance_threshold: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 5.00
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

    // Add indexes for better performance
    await queryInterface.addIndex('wallet_transactions', ['user_id']);
    await queryInterface.addIndex('wallet_transactions', ['transaction_type']);
    await queryInterface.addIndex('wallet_transactions', ['reference_type']);
    await queryInterface.addIndex('wallet_transactions', ['status']);
    await queryInterface.addIndex('wallet_transactions', ['created_at']);
    
    await queryInterface.addIndex('wallet_top_ups', ['user_id']);
    await queryInterface.addIndex('wallet_top_ups', ['status']);
    await queryInterface.addIndex('wallet_top_ups', ['payment_gateway']);
    await queryInterface.addIndex('wallet_top_ups', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wallet_settings');
    await queryInterface.dropTable('wallet_top_ups');
    await queryInterface.dropTable('wallet_transactions');
  }
};