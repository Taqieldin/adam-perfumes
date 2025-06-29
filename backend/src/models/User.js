const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firebaseUid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true, // Allow null for admin users created directly
    comment: 'Firebase Authentication UID'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      is: /^[+]?[\d\s\-()]+$/
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
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'URL to user profile picture'
  },
  role: {
    type: DataTypes.ENUM('customer', 'admin', 'super_admin', 'branch_manager'),
    defaultValue: 'customer',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending_verification'),
    defaultValue: 'pending_verification',
    allowNull: false
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  preferredLanguage: {
    type: DataTypes.ENUM('en', 'ar'),
    defaultValue: 'en'
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'Asia/Muscat'
  },
  // Admin specific fields
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Only for admin users, Firebase handles customer auth
    validate: {
      len: [6, 255]
    }
  },
  branchId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'For branch managers - which branch they manage'
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Admin permissions array'
  },
  // Customer specific fields
  loyaltyTier: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze'
  },
  totalSpent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  referralCode: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: true
  },
  referredBy: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'User ID who referred this user'
  },
  // Notification preferences
  notificationPreferences: {
    type: DataTypes.JSON,
    defaultValue: {
      email: true,
      sms: true,
      push: true,
      whatsapp: true,
      marketing: true,
      orderUpdates: true,
      promotions: true
    }
  },
  // Marketing preferences
  marketingConsent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Device tokens for push notifications
  deviceTokens: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of FCM device tokens'
  },
  // Last activity tracking
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastActiveAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Soft delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true, // Enable soft delete
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['phone']
    },
    {
      fields: ['firebaseUid']
    },
    {
      fields: ['role']
    },
    {
      fields: ['status']
    },
    {
      fields: ['referralCode']
    },
    {
      fields: ['branchId']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      // Hash password for admin users
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
      
      // Generate referral code for customers
      if (user.role === 'customer' && !user.referralCode) {
        user.referralCode = generateReferralCode();
      }
    },
    beforeUpdate: async (user) => {
      // Hash password if changed
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

User.prototype.isAdmin = function() {
  return ['admin', 'super_admin', 'branch_manager'].includes(this.role);
};

User.prototype.canAccessBranch = function(branchId) {
  if (this.role === 'super_admin') return true;
  if (this.role === 'branch_manager') return this.branchId === branchId;
  return false;
};

User.prototype.addDeviceToken = function(token) {
  const tokens = this.deviceTokens || [];
  if (!tokens.includes(token)) {
    tokens.push(token);
    this.deviceTokens = tokens;
  }
};

User.prototype.removeDeviceToken = function(token) {
  const tokens = this.deviceTokens || [];
  this.deviceTokens = tokens.filter(t => t !== token);
};

// Class methods
User.findByEmail = function(email) {
  return this.findOne({ where: { email } });
};

User.findByPhone = function(phone) {
  return this.findOne({ where: { phone } });
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
  let result = 'AP'; // Adam Perfumes prefix
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = User;