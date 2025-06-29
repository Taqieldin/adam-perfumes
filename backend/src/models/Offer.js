/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/offer').Offer, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Offer = sequelize.define('Offer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('flash_sale', 'buy_one_get_one', 'bulk_discount', 'seasonal', 'clearance'),
    allowNull: false
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed_amount'),
    allowNull: false
  },
  discountValue: {
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
    allowNull: true
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
    allowNull: true
  },
  excludedCategories: {
    type: DataTypes.JSON,
    allowNull: true
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
    allowNull: true,
    defaultValue: 1
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  bannerUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'offers',
  timestamps: true,
  indexes: [
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
      fields: ['priority']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = Offer;