'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loyalty_transactions', {
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
        type: Sequelize.ENUM('earned', 'redeemed', 'expired', 'bonus', 'referral', 'adjustment'),
        allowNull: false
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Positive for earned, negative for redeemed'
      },
      balance_after: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'User balance after this transaction'
      },
      // Related amounts
      order_amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Order amount that generated these points in OMR'
      },
      redemption_value: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'OMR value when points were redeemed'
      },
      // Expiration
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When these points expire (for earned points)'
      },
      // Description and metadata
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
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
        comment: 'Admin who created manual adjustments'
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
    await queryInterface.addIndex('loyalty_transactions', ['user_id']);
    await queryInterface.addIndex('loyalty_transactions', ['order_id']);
    await queryInterface.addIndex('loyalty_transactions', ['transaction_type']);
    await queryInterface.addIndex('loyalty_transactions', ['expires_at']);
    await queryInterface.addIndex('loyalty_transactions', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loyalty_transactions');
  }
};