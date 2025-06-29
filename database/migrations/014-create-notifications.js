'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Null for broadcast notifications'
      },
      // Notification content
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      message_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Notification type and category
      type: {
        type: Sequelize.ENUM(
          'order_update',
          'payment_confirmation',
          'delivery_update',
          'promotion',
          'new_product',
          'low_stock',
          'price_drop',
          'loyalty_points',
          'wallet_update',
          'support_response',
          'system_update',
          'marketing',
          'reminder'
        ),
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('transactional', 'promotional', 'system', 'support'),
        allowNull: false,
        defaultValue: 'system'
      },
      priority: {
        type: Sequelize.ENUM('low', 'normal', 'high', 'urgent'),
        defaultValue: 'normal'
      },
      // Delivery channels
      channels: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Array of channels: push, email, sms, whatsapp, in_app'
      },
      // Related entities
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
      product_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Action and deep linking
      action_type: {
        type: Sequelize.ENUM('none', 'open_app', 'open_url', 'open_product', 'open_order', 'open_chat'),
        defaultValue: 'none'
      },
      action_data: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Data for the action (URL, product ID, etc.)'
      },
      // Media
      image_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Status and delivery
      status: {
        type: Sequelize.ENUM('pending', 'sent', 'delivered', 'failed', 'cancelled'),
        defaultValue: 'pending'
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // Scheduling
      scheduled_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When to send the notification'
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When the notification expires'
      },
      // Delivery tracking
      push_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      email_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sms_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      whatsapp_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // Error tracking
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      retry_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      max_retries: {
        type: Sequelize.INTEGER,
        defaultValue: 3
      },
      // Targeting (for broadcast notifications)
      target_audience: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Targeting criteria for broadcast notifications'
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
    await queryInterface.addIndex('notifications', ['user_id']);
    await queryInterface.addIndex('notifications', ['type']);
    await queryInterface.addIndex('notifications', ['category']);
    await queryInterface.addIndex('notifications', ['priority']);
    await queryInterface.addIndex('notifications', ['status']);
    await queryInterface.addIndex('notifications', ['is_read']);
    await queryInterface.addIndex('notifications', ['order_id']);
    await queryInterface.addIndex('notifications', ['product_id']);
    await queryInterface.addIndex('notifications', ['scheduled_at']);
    await queryInterface.addIndex('notifications', ['sent_at']);
    await queryInterface.addIndex('notifications', ['expires_at']);
    await queryInterface.addIndex('notifications', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};