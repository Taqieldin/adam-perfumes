'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_messages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      ticket_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'support_tickets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // Message details
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      message_type: {
        type: Sequelize.ENUM('text', 'image', 'file', 'audio', 'video', 'system'),
        defaultValue: 'text'
      },
      // Sender information
      sender_type: {
        type: Sequelize.ENUM('customer', 'agent', 'system', 'bot'),
        allowNull: false
      },
      sender_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Language
      language: {
        type: Sequelize.ENUM('en', 'ar'),
        defaultValue: 'en'
      },
      // File attachments
      attachments: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of file attachments'
      },
      // Message status
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_internal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Internal messages not visible to customer'
      },
      // AI/Bot related
      is_bot_message: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      bot_confidence: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
        comment: 'AI confidence score (0.00-1.00)'
      },
      requires_human_review: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // Reply to message (threading)
      reply_to_message_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'chat_messages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Message metadata
      metadata: {
        type: Sequelize.JSON,
        allowNull: true
      },
      // Timestamps
      sent_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
    await queryInterface.addIndex('chat_messages', ['ticket_id']);
    await queryInterface.addIndex('chat_messages', ['sender_id']);
    await queryInterface.addIndex('chat_messages', ['sender_type']);
    await queryInterface.addIndex('chat_messages', ['message_type']);
    await queryInterface.addIndex('chat_messages', ['is_read']);
    await queryInterface.addIndex('chat_messages', ['is_internal']);
    await queryInterface.addIndex('chat_messages', ['is_bot_message']);
    await queryInterface.addIndex('chat_messages', ['reply_to_message_id']);
    await queryInterface.addIndex('chat_messages', ['sent_at']);
    await queryInterface.addIndex('chat_messages', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chat_messages');
  }
};