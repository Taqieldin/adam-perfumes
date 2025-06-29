/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/inventory').Inventory, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  branchId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'branches',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  reservedQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  availableQuantity: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.quantity - this.reservedQuantity;
    }
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  maxStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reorderPoint: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true
  },
  lastRestockedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastSoldAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'inventory',
  timestamps: true,
  indexes: [
    {
      fields: ['productId', 'branchId'],
      unique: true
    },
    {
      fields: ['productId']
    },
    {
      fields: ['branchId']
    },
    {
      fields: ['quantity']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Inventory;