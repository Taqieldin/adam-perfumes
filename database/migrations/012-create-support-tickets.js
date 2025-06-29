'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('support_tickets', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      ticket_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Human-readable ticket number (e.g., SUP-2024-001234)'
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
        onDelete: 'SET NULL',
        comment: 'Related order if applicable'
      },
      // Ticket details
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subject_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Classification
      category: {
        type: Sequelize.ENUM(
          'order_inquiry',
          'product_question',
          'payment_issue',
          'delivery_problem',
          'return_request',
          'technical_support',
          'complaint',
          'compliment',
          'suggestion',
          'other'
        ),
        allowNull: false,
        defaultValue: 'other'
      },
      priority: {
        type: Sequelize.ENUM('low', 'normal', 'high', 'urgent'),
        defaultValue: 'normal'
      },
      status: {
        type: Sequelize.ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed', 'cancelled'),
        defaultValue: 'open'
      },
      // Assignment
      assigned_to: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Support agent assigned to this ticket'
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // Customer information
      customer_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      customer_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      customer_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Communication preferences
      preferred_language: {
        type: Sequelize.ENUM('en', 'ar'),
        defaultValue: 'en'
      },
      preferred_contact_method: {
        type: Sequelize.ENUM('email', 'phone', 'whatsapp', 'in_app'),
        defaultValue: 'in_app'
      },
      // Source and channel
      source: {
        type: Sequelize.ENUM('mobile_app', 'website', 'whatsapp', 'email', 'phone', 'branch'),
        defaultValue: 'mobile_app'
      },
      // Resolution details
      resolution: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      resolution_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Timestamps
      first_response_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      closed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // Customer satisfaction
      satisfaction_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Rating from 1-5'
      },
      satisfaction_feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Internal notes
      internal_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Tags for categorization
      tags: {
        type: Sequelize.JSON,
        allowNull: true
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
    await queryInterface.addIndex('support_tickets', ['ticket_number']);
    await queryInterface.addIndex('support_tickets', ['user_id']);
    await queryInterface.addIndex('support_tickets', ['order_id']);
    await queryInterface.addIndex('support_tickets', ['status']);
    await queryInterface.addIndex('support_tickets', ['priority']);
    await queryInterface.addIndex('support_tickets', ['category']);
    await queryInterface.addIndex('support_tickets', ['assigned_to']);
    await queryInterface.addIndex('support_tickets', ['source']);
    await queryInterface.addIndex('support_tickets', ['customer_email']);
    await queryInterface.addIndex('support_tickets', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('support_tickets');
  }
};