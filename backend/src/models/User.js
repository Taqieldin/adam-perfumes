const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/user').User, any>>}
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firebaseUid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    comment: 'Firebase UID for social login'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Can be null for social login users
    validate: {
      len: [8, 255]
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^(\+968|968)?[79]\d{7}$/ // Oman phone number format
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  profilePicture: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  language: {
    type: DataTypes.ENUM('en', 'ar'),
    defaultValue: 'en'
  },
  role: {
    type: DataTypes.ENUM('customer', 'admin', 'super_admin', 'branch_manager', 'staff'),
    defaultValue: 'customer'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  prefersDarkMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  loginCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Wallet balance stored directly in user table (as per database migration)
  walletBalance: {
    type: DataTypes.DECIMAL(10, 3),
    defaultValue: 0.000,
    comment: 'User wallet balance in OMR'
  },
  loyaltyPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'User loyalty points'
  },
  fcmTokens: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Firebase Cloud Messaging tokens for push notifications'
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      notifications: {
        email: true,
        push: true,
        sms: false,
        whatsapp: true
      },
      marketing: {
        email: true,
        push: true,
        sms: false,
        whatsapp: true
      },
      theme: 'light',
      currency: 'OMR'
    }
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional user metadata'
  },
  referralCode: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: true
  },
  referredBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  totalSpent: {
    type: DataTypes.DECIMAL(10, 3),
    defaultValue: 0.000,
    comment: 'Total amount spent by user in OMR'
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageOrderValue: {
    type: DataTypes.DECIMAL(10, 3),
    defaultValue: 0.000
  },
  lastOrderAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  customerSegment: {
    type: DataTypes.ENUM('new', 'regular', 'vip', 'premium'),
    defaultValue: 'new'
  },
  branchId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Associated branch for staff members'
  },
  permissions: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Specific permissions for admin users'
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  paranoid: true, // Soft delete
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['firebaseUid']
    },
    {
      fields: ['phone']
    },
    {
      fields: ['referralCode']
    },
    {
      fields: ['role']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['customerSegment']
    },
    {
      fields: ['branchId']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      // Hash password if provided
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
      
      // Generate referral code
      if (!user.referralCode) {
        user.referralCode = generateReferralCode();
      }
    },
    beforeUpdate: async (user) => {
      // Hash password if changed
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    afterCreate: async (user) => {
      // Create cart for new user
      const Cart = require('./Cart');
      await Cart.create({
        userId: user.id
      });
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

User.prototype.updateLoginInfo = async function() {
  this.lastLoginAt = new Date();
  this.loginCount += 1;
  await this.save();
};

User.prototype.addFCMToken = async function(token) {
  if (!this.fcmTokens.includes(token)) {
    this.fcmTokens.push(token);
    await this.save();
  }
};

User.prototype.removeFCMToken = async function(token) {
  this.fcmTokens = this.fcmTokens.filter(t => t !== token);
  await this.save();
};

User.prototype.updateCustomerSegment = async function() {
  if (this.totalOrders === 0) {
    this.customerSegment = 'new';
  } else if (this.totalSpent >= 1000) {
    this.customerSegment = 'premium';
  } else if (this.totalSpent >= 500) {
    this.customerSegment = 'vip';
  } else {
    this.customerSegment = 'regular';
  }
  await this.save();
};

// Class methods
User.findByEmail = function(email) {
  return this.findOne({ where: { email: email.toLowerCase() } });
};

User.findByFirebaseUid = function(firebaseUid) {
  return this.findOne({ where: { firebaseUid } });
};

User.findByReferralCode = function(referralCode) {
  return this.findOne({ where: { referralCode } });
};

// Helper function to generate referral code
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = User;