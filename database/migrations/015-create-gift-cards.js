'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gift_cards', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique gift card code'
      },
      // Gift card details
      initial_amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Initial gift card value in OMR'
      },
      current_balance: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Current remaining balance in OMR'
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'OMR'
      },
      // Purchaser information
      purchased_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      purchase_order_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Recipient information
      recipient_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      recipient_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      recipient_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Gift message
      gift_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      gift_message_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Status and validity
      status: {
        type: Sequelize.ENUM('active', 'redeemed', 'expired', 'cancelled', 'suspended'),
        defaultValue: 'active'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // Validity period
      issued_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Expiration date (null = no expiration)'
      },
      activated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When the gift card was first used'
      },
      fully_redeemed_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When the gift card balance reached zero'
      },
      // Usage restrictions
      minimum_order_amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Minimum order amount to use gift card in OMR'
      },
      applicable_products: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of product IDs if restricted to specific products'
      },
      applicable_categories: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of category IDs if restricted to specific categories'
      },
      // Usage tracking
      usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Number of times this gift card has been used'
      },
      last_used_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_used_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Design and branding
      design_template: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Gift card design template'
      },
      background_image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Delivery method
      delivery_method: {
        type: Sequelize.ENUM('email', 'sms', 'whatsapp', 'physical', 'in_app'),
        defaultValue: 'email'
      },
      delivery_status: {
        type: Sequelize.ENUM('pending', 'sent', 'delivered', 'failed'),
        defaultValue: 'pending'
      },
      delivered_at: {
        type: Sequelize.DATE,
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
        onDelete: 'SET NULL'
      },
      // Notes and metadata
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
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
    await queryInterface.addIndex('gift_cards', ['code']);
    await queryInterface.addIndex('gift_cards', ['purchased_by']);
    await queryInterface.addIndex('gift_cards', ['recipient_email']);
    await queryInterface.addIndex('gift_cards', ['status']);
    await queryInterface.addIndex('gift_cards', ['is_active']);
    await queryInterface.addIndex('gift_cards', ['expires_at']);
    await queryInterface.addIndex('gift_cards', ['last_used_by']);
    await queryInterface.addIndex('gift_cards', ['delivery_status']);
    await queryInterface.addIndex('gift_cards', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gift_cards');
  }
};