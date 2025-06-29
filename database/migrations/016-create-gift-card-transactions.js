'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gift_card_transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      gift_card_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'gift_cards',
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
        type: Sequelize.ENUM('purchase', 'redemption', 'refund', 'adjustment', 'expiration'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Positive for credits, negative for debits in OMR'
      },
      balance_before: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Gift card balance before transaction in OMR'
      },
      balance_after: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Gift card balance after transaction in OMR'
      },
      // Description
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Reference information
      reference_number: {
        type: Sequelize.STRING,
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
    await queryInterface.addIndex('gift_card_transactions', ['gift_card_id']);
    await queryInterface.addIndex('gift_card_transactions', ['user_id']);
    await queryInterface.addIndex('gift_card_transactions', ['order_id']);
    await queryInterface.addIndex('gift_card_transactions', ['transaction_type']);
    await queryInterface.addIndex('gift_card_transactions', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gift_card_transactions');
  }
};