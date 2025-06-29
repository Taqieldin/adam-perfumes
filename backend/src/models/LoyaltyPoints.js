/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/loyalty-points').LoyaltyPoints, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LoyaltyPoints = sequelize.define('LoyaltyPoints', {
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
    type: DataTypes.ENUM(
      'earned',
      'redeemed',
      'expired',
      'bonus',
      'referral',
      'adjustment'
    ),
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Positive for earned, negative for redeemed'
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    },
    comment: 'Related order for earned/redeemed points'
  },
  description: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Description in multiple languages'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When these points expire (null = never expire)'
  },
  isExpired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  referralUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User who was referred (for referral points)'
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional points metadata'
  }
}, {
  tableName: 'loyalty_points',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['orderId']
    },
    {
      fields: ['expiresAt']
    },
    {
      fields: ['isExpired']
    },
    {
      fields: ['referralUserId']
    }
  ]
});

// Instance methods
LoyaltyPoints.prototype.getDescription = function(language = 'en') {
  return this.description[language] || this.description.en || '';
};

LoyaltyPoints.prototype.isEarned = function() {
  return ['earned', 'bonus', 'referral'].includes(this.type);
};

LoyaltyPoints.prototype.isRedeemed = function() {
  return this.type === 'redeemed';
};

LoyaltyPoints.prototype.canExpire = function() {
  return this.expiresAt !== null && !this.isExpired;
};

LoyaltyPoints.prototype.markAsExpired = async function() {
  if (this.canExpire() && new Date() > this.expiresAt) {
    this.isExpired = true;
    await this.save();
    
    // Create expiration record
    await LoyaltyPoints.create({
      userId: this.userId,
      type: 'expired',
      points: -Math.abs(this.points), // Make negative
      description: {
        en: `Points expired from ${this.getDescription('en')}`,
        ar: `انتهت صلاحية النقاط من ${this.getDescription('ar')}`
      },
      metadata: {
        originalPointsId: this.id,
        originalEarnedAt: this.createdAt
      }
    });
    
    return true;
  }
  return false;
};

// Class methods
LoyaltyPoints.findByUser = function(userId, options = {}) {
  const { limit = 20, offset = 0, type } = options;
  const where = { userId };
  
  if (type) {
    where.type = type;
  }
  
  return this.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
};

LoyaltyPoints.getUserBalance = async function(userId) {
  const result = await this.findAll({
    where: { 
      userId,
      isExpired: false
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('points')), 'totalPoints']
    ],
    raw: true
  });
  
  return parseInt(result[0]?.totalPoints || 0);
};

LoyaltyPoints.getUserEarnedPoints = async function(userId) {
  const result = await this.findAll({
    where: { 
      userId,
      type: { [sequelize.Op.in]: ['earned', 'bonus', 'referral'] },
      isExpired: false
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('points')), 'totalEarned']
    ],
    raw: true
  });
  
  return parseInt(result[0]?.totalEarned || 0);
};

LoyaltyPoints.getUserRedeemedPoints = async function(userId) {
  const result = await this.findAll({
    where: { 
      userId,
      type: 'redeemed'
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.literal('ABS(points)')), 'totalRedeemed']
    ],
    raw: true
  });
  
  return parseInt(result[0]?.totalRedeemed || 0);
};

LoyaltyPoints.awardPoints = async function(userId, points, orderId = null, description = null, expiresAt = null) {
  if (points <= 0) {
    throw new Error('Points to award must be positive');
  }
  
  const defaultDescription = {
    en: `Earned ${points} points`,
    ar: `حصلت على ${points} نقطة`
  };
  
  const loyaltyPoints = await this.create({
    userId,
    type: 'earned',
    points,
    orderId,
    description: description || defaultDescription,
    expiresAt
  });
  
  // Update user's loyalty points balance
  const User = require('./User');
  const user = await User.findByPk(userId);
  if (user) {
    user.loyaltyPointsBalance = await this.getUserBalance(userId);
    await user.save();
  }
  
  return loyaltyPoints;
};

LoyaltyPoints.redeemPoints = async function(userId, points, orderId = null, description = null) {
  if (points <= 0) {
    throw new Error('Points to redeem must be positive');
  }
  
  const currentBalance = await this.getUserBalance(userId);
  if (currentBalance < points) {
    throw new Error('Insufficient loyalty points balance');
  }
  
  const defaultDescription = {
    en: `Redeemed ${points} points`,
    ar: `استخدمت ${points} نقطة`
  };
  
  const loyaltyPoints = await this.create({
    userId,
    type: 'redeemed',
    points: -points, // Negative for redemption
    orderId,
    description: description || defaultDescription
  });
  
  // Update user's loyalty points balance
  const User = require('./User');
  const user = await User.findByPk(userId);
  if (user) {
    user.loyaltyPointsBalance = await this.getUserBalance(userId);
    await user.save();
  }
  
  return loyaltyPoints;
};

LoyaltyPoints.awardReferralPoints = async function(referrerId, referredUserId, points) {
  const description = {
    en: `Referral bonus for inviting a friend`,
    ar: `مكافأة الإحالة لدعوة صديق`
  };
  
  return this.create({
    userId: referrerId,
    type: 'referral',
    points,
    referralUserId: referredUserId,
    description
  });
};

LoyaltyPoints.findExpiringPoints = function(daysFromNow = 30) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysFromNow);
  
  return this.findAll({
    where: {
      type: { [sequelize.Op.in]: ['earned', 'bonus', 'referral'] },
      isExpired: false,
      expiresAt: {
        [sequelize.Op.lte]: expiryDate,
        [sequelize.Op.ne]: null
      }
    },
    include: ['user'],
    order: [['expiresAt', 'ASC']]
  });
};

LoyaltyPoints.expireOldPoints = async function() {
  const now = new Date();
  const expiredPoints = await this.findAll({
    where: {
      type: { [sequelize.Op.in]: ['earned', 'bonus', 'referral'] },
      isExpired: false,
      expiresAt: {
        [sequelize.Op.lt]: now,
        [sequelize.Op.ne]: null
      }
    }
  });
  
  let expiredCount = 0;
  for (const points of expiredPoints) {
    await points.markAsExpired();
    expiredCount++;
  }
  
  return expiredCount;
};

LoyaltyPoints.getPointsStats = async function(userId = null) {
  const where = {};
  if (userId) where.userId = userId;
  
  const stats = await this.findAll({
    where,
    attributes: [
      'type',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('points')), 'totalPoints']
    ],
    group: ['type'],
    raw: true
  });
  
  return stats;
};

module.exports = LoyaltyPoints;