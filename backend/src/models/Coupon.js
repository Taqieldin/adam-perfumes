/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/coupon').Coupon, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isUppercase: true,
      len: [3, 50]
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('percentage', 'fixed_amount', 'free_shipping'),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'OMR'
  },
  minimumOrderAmount: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true,
    defaultValue: 0
  },
  maximumDiscountAmount: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true // For percentage coupons
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true // null means unlimited
  },
  usageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  userUsageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true, // How many times one user can use this coupon
    defaultValue: 1
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  applicableProducts: {
    type: DataTypes.JSON,
    allowNull: true // Array of product IDs, null means all products
  },
  applicableCategories: {
    type: DataTypes.JSON,
    allowNull: true // Array of category IDs
  },
  excludedProducts: {
    type: DataTypes.JSON,
    allowNull: true // Array of product IDs to exclude
  },
  excludedCategories: {
    type: DataTypes.JSON,
    allowNull: true // Array of category IDs to exclude
  },
  firstTimeUserOnly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  indexes: [
    {
      fields: ['code'],
      unique: true
    },
    {
      fields: ['type']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['validFrom']
    },
    {
      fields: ['validUntil']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = Coupon;