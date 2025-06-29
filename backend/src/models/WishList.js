/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/wish-list').WishList, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WishList = sequelize.define('WishList', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  addedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 5
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'wishlists',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'productId'],
      unique: true
    },
    {
      fields: ['userId']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = WishList;