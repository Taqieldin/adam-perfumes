/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/address').Address, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Address = sequelize.define('Address', {
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
  type: {
    type: DataTypes.ENUM('shipping', 'billing', 'both'),
    allowNull: false,
    defaultValue: 'both'
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  addressLine1: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  addressLine2: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true // Some countries don't have states
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(2), // ISO country code
    allowNull: false,
    defaultValue: 'OM' // Oman
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true // Delivery instructions
  }
}, {
  tableName: 'addresses',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['isDefault']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['country']
    }
  ]
});

module.exports = Address;