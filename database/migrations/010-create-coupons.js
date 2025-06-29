'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
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
        comment: 'Coupon code (e.g., WELCOME20, SUMMER2024)'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name_ar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Discount details
      discount_type: {
        type: Sequelize.ENUM('percentage', 'fixed_amount', 'free_shipping'),
        allowNull: false
      },
      discount_value: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        comment: 'Percentage (0-100) or fixed amount in OMR'
      },
      max_discount_amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Maximum discount for percentage coupons in OMR'
      },
      // Usage limits
      usage_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Total usage limit (null = unlimited)'
      },
      usage_limit_per_user: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: 'Usage limit per user'
      },
      used_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Total times used'
      },
      // Validity period
      starts_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // Conditions
      minimum_order_amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Minimum order amount to use coupon in OMR'
      },
      maximum_order_amount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        comment: 'Maximum order amount to use coupon in OMR'
      },
      // Applicable products/categories
      applicable_to: {
        type: Sequelize.ENUM('all', 'specific_products', 'specific_categories', 'new_users', 'returning_users'),
        defaultValue: 'all'
      },
      applicable_products: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of product IDs if applicable_to is specific_products'
      },
      applicable_categories: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of category IDs if applicable_to is specific_categories'
      },
      // User restrictions
      applicable_user_types: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of user types/segments'
      },
      excluded_users: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of user IDs who cannot use this coupon'
      },
      // Status and visibility
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Public coupons are visible to all users'
      },
      // Auto-apply conditions
      auto_apply: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Automatically apply if conditions are met'
      },
      auto_apply_priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Priority for auto-apply (higher = more priority)'
      },
      // Combination rules
      can_combine_with_other_coupons: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      can_combine_with_loyalty_points: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
      // Additional metadata
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
    await queryInterface.addIndex('coupons', ['code']);
    await queryInterface.addIndex('coupons', ['is_active']);
    await queryInterface.addIndex('coupons', ['is_public']);
    await queryInterface.addIndex('coupons', ['starts_at']);
    await queryInterface.addIndex('coupons', ['expires_at']);
    await queryInterface.addIndex('coupons', ['applicable_to']);
    await queryInterface.addIndex('coupons', ['auto_apply']);
    await queryInterface.addIndex('coupons', ['created_by']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coupons');
  }
};