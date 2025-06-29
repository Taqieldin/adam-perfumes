const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GiftCard = sequelize.define('GiftCard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  purchasedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  recipientEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  recipientName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  recipientPhone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  initialAmount: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    validate: {
      min: 1
    }
  },
  currentBalance: {
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
  status: {
    type: DataTypes.ENUM('active', 'used', 'expired', 'cancelled'),
    allowNull: false,
    defaultValue: 'active'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  activatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deliveryMethod: {
    type: DataTypes.ENUM('email', 'sms', 'physical'),
    allowNull: false,
    defaultValue: 'email'
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isRedeemable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'gift_cards',
  timestamps: true,
  indexes: [
    {
      fields: ['code'],
      unique: true
    },
    {
      fields: ['purchasedBy']
    },
    {
      fields: ['usedBy']
    },
    {
      fields: ['status']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

module.exports = GiftCard;