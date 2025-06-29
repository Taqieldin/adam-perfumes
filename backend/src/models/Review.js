const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
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
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    },
    comment: 'Order this review is based on'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pros: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of positive aspects'
  },
  cons: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of negative aspects'
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of review image URLs'
  },
  isVerifiedPurchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Admin who approved the review'
  },
  isHelpful: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    },
    comment: 'Number of helpful votes'
  },
  isReported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  reportCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  language: {
    type: DataTypes.STRING(2),
    defaultValue: 'en',
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional review metadata'
  }
}, {
  tableName: 'reviews',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['orderId']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['isApproved']
    },
    {
      fields: ['isVerifiedPurchase']
    },
    {
      fields: ['createdAt']
    },
    {
      unique: true,
      fields: ['userId', 'productId', 'orderId']
    }
  ]
});

// Instance methods
Review.prototype.approve = async function(approvedBy = null) {
  this.isApproved = true;
  this.approvedAt = new Date();
  this.approvedBy = approvedBy;
  await this.save();
  
  // Update product average rating
  await this.updateProductRating();
  
  return this;
};

Review.prototype.reject = async function() {
  this.isApproved = false;
  this.approvedAt = null;
  this.approvedBy = null;
  await this.save();
  
  // Update product average rating
  await this.updateProductRating();
  
  return this;
};

Review.prototype.markAsHelpful = async function() {
  this.isHelpful += 1;
  await this.save();
  return this;
};

Review.prototype.report = async function() {
  this.reportCount += 1;
  this.isReported = true;
  await this.save();
  return this;
};

Review.prototype.updateProductRating = async function() {
  const Product = require('./Product');
  
  // Calculate new average rating for the product
  const stats = await Review.findAll({
    where: {
      productId: this.productId,
      isApproved: true
    },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
    ],
    raw: true
  });
  
  const avgRating = parseFloat(stats[0]?.avgRating || 0);
  const reviewCount = parseInt(stats[0]?.reviewCount || 0);
  
  // Update product
  await Product.update(
    {
      averageRating: avgRating.toFixed(2),
      reviewCount: reviewCount
    },
    {
      where: { id: this.productId }
    }
  );
};

// Class methods
Review.findByProduct = function(productId, options = {}) {
  const { limit = 20, offset = 0, approvedOnly = true, rating = null } = options;
  
  const where = { productId };
  if (approvedOnly) where.isApproved = true;
  if (rating) where.rating = rating;
  
  return this.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: ['user']
  });
};

Review.findByUser = function(userId, options = {}) {
  const { limit = 20, offset = 0 } = options;
  
  return this.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: ['product']
  });
};

Review.findPendingApproval = function() {
  return this.findAll({
    where: { isApproved: false },
    order: [['createdAt', 'ASC']],
    include: ['user', 'product']
  });
};

Review.findReported = function() {
  return this.findAll({
    where: { isReported: true },
    order: [['reportCount', 'DESC']],
    include: ['user', 'product']
  });
};

Review.getProductRatingDistribution = async function(productId) {
  const distribution = await this.findAll({
    where: {
      productId,
      isApproved: true
    },
    attributes: [
      'rating',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['rating'],
    order: [['rating', 'DESC']],
    raw: true
  });
  
  // Fill in missing ratings with 0 count
  const result = {};
  for (let i = 5; i >= 1; i--) {
    result[i] = 0;
  }
  
  distribution.forEach(item => {
    result[item.rating] = parseInt(item.count);
  });
  
  return result;
};

Review.canUserReview = async function(userId, productId, orderId = null) {
  // Check if user has already reviewed this product
  const existingReview = await this.findOne({
    where: {
      userId,
      productId,
      ...(orderId && { orderId })
    }
  });
  
  if (existingReview) return false;
  
  // If orderId is provided, check if user actually purchased the product
  if (orderId) {
    const OrderItem = require('./OrderItem');
    const orderItem = await OrderItem.findOne({
      where: {
        orderId,
        productId
      },
      include: [{
        model: require('./Order'),
        as: 'order',
        where: {
          userId,
          status: 'delivered'
        }
      }]
    });
    
    return !!orderItem;
  }
  
  return true;
};

Review.createReview = async function(data) {
  const {
    userId,
    productId,
    orderId,
    rating,
    title,
    comment,
    pros = [],
    cons = [],
    images = [],
    language = 'en'
  } = data;
  
  // Check if user can review this product
  const canReview = await this.canUserReview(userId, productId, orderId);
  if (!canReview) {
    throw new Error('User cannot review this product');
  }
  
  // Check if this is a verified purchase
  let isVerifiedPurchase = false;
  if (orderId) {
    const OrderItem = require('./OrderItem');
    const orderItem = await OrderItem.findOne({
      where: { orderId, productId },
      include: [{
        model: require('./Order'),
        as: 'order',
        where: {
          userId,
          status: 'delivered'
        }
      }]
    });
    isVerifiedPurchase = !!orderItem;
  }
  
  const review = await this.create({
    userId,
    productId,
    orderId,
    rating,
    title,
    comment,
    pros,
    cons,
    images,
    isVerifiedPurchase,
    language,
    isApproved: false // Reviews need approval by default
  });
  
  // Log review creation
  const logger = require('../utils/logger');
  logger.logUserAction(userId, 'REVIEW_CREATED', {
    reviewId: review.id,
    productId,
    rating,
    isVerifiedPurchase
  });
  
  return review;
};

module.exports = Review;