'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
      order_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Transaction details
      transaction_type: {
        type: Sequelize.ENUM(
          'topup',           // Money added to wallet
          'payment',         // Used for order payment
          'refund',          // Refund to wallet
          'bonus',           // Bonus credit
          'cashback',        // Cashback reward
          'gift_card',       // Gift card redemption
          'adjustment',      // Manual adjustment
          'transfer_in',     // Transfer from another user
          'transfer_out'     // Transfer to another user
        ),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Positive for credit, negative for debit in OMR'
      },
      balance_before: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Wallet balance before transaction in OMR'
      },
      balance_after: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Wallet balance after transaction in OMR'
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'OMR'
      },
      // Payment method for topups
      payment_method: {
        type: Sequelize.ENUM('card', 'bank_transfer', 'cash', 'gift_card', 'admin'),
        allowNull: true
      },
      payment_gateway: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Gateway used for topup (stripe, tap, etc.)'
      },
      payment_transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'External payment transaction ID'
      },
      payment_reference: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Status
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded'),
        defaultValue: 'completed'
      },
      // Transfer details (for user-to-user transfers)
      transfer_to_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      transfer_from_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Description and notes
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Admin tracking
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Admin who created manual transactions'
      },
      // Metadata
      metadata: {
        type: Sequelize.JSON,
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
    await queryInterface.addIndex('wallet_transactions', ['user_id']);
    await queryInterface.addIndex('wallet_transactions', ['order_id']);
    await queryInterface.addIndex('wallet_transactions', ['transaction_type']);
    await queryInterface.addIndex('wallet_transactions', ['status']);
    await queryInterface.addIndex('wallet_transactions', ['transfer_to_user_id']);
    await queryInterface.addIndex('wallet_transactions', ['transfer_from_user_id']);
    await queryInterface.addIndex('wallet_transactions', ['created_at']);
    await queryInterface.addIndex('wallet_transactions', ['payment_transaction_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wallet_transactions');
  }
};