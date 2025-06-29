/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/order-item').OrderItem, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Order reference
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  // Product reference
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  // Product snapshot (in case product details change after order)
  productSku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Product SKU at time of order'
  },
  productName: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Product name at time of order in multiple languages'
  },
  productImage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Primary product image URL at time of order'
  },
  // Variant information
  variantId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Product variant ID if applicable'
  },
  variantOptions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Variant options like size, color, etc.'
  },
  // Quantity and pricing
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price per unit at time of order'
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Original price before any discounts'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Total price for this line item (unitPrice * quantity)'
  },
  // Discounts
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Discount applied to this item'
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed', 'coupon', 'loyalty_points'),
    allowNull: true
  },
  discountReason: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Reason for discount (coupon code, promotion name, etc.)'
  },
  // Tax information
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    comment: 'Tax rate percentage applied'
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Tax amount for this item'
  },
  // Weight and dimensions (for shipping calculations)
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Item weight in grams'
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Item dimensions'
  },
  // Gift options
  isGift: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  giftMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  giftWrapCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  // Fulfillment status
  fulfillmentStatus: {
    type: DataTypes.ENUM(
      'pending',      // Awaiting fulfillment
      'processing',   // Being prepared
      'shipped',      // Shipped
      'delivered',    // Delivered
      'cancelled',    // Cancelled
      'returned',     // Returned
      'refunded'      // Refunded
    ),
    defaultValue: 'pending'
  },
  // Return/refund information
  returnQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Quantity returned'
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Amount refunded for this item'
  },
  returnReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Loyalty points
  pointsEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Loyalty points earned from this item'
  },
  // Commission (for affiliate/branch tracking)
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Commission rate for this item'
  },
  commissionAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Commission amount for this item'
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Special notes for this item'
  },
  // Soft delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['productSku']
    },
    {
      fields: ['fulfillmentStatus']
    },
    {
      fields: ['variantId']
    }
  ],
  hooks: {
    beforeCreate: async (orderItem) => {
      // Calculate total price
      orderItem.totalPrice = orderItem.unitPrice * orderItem.quantity;
      
      // Calculate tax amount
      if (orderItem.taxRate > 0) {
        orderItem.taxAmount = (orderItem.totalPrice * orderItem.taxRate) / 100;
      }
      
      // Calculate commission
      if (orderItem.commissionRate > 0) {
        orderItem.commissionAmount = (orderItem.totalPrice * orderItem.commissionRate) / 100;
      }
    },
    beforeUpdate: async (orderItem) => {
      // Recalculate totals if quantity or price changed
      if (orderItem.changed('quantity') || orderItem.changed('unitPrice')) {
        orderItem.totalPrice = orderItem.unitPrice * orderItem.quantity;
        
        if (orderItem.taxRate > 0) {
          orderItem.taxAmount = (orderItem.totalPrice * orderItem.taxRate) / 100;
        }
        
        if (orderItem.commissionRate > 0) {
          orderItem.commissionAmount = (orderItem.totalPrice * orderItem.commissionRate) / 100;
        }
      }
    }
  }
});

// Instance methods
OrderItem.prototype.getProductName = function(language = 'en') {
  return this.productName && this.productName[language] ? this.productName[language] : this.productName.en || '';
};

OrderItem.prototype.getSubtotal = function() {
  return this.totalPrice - this.discountAmount;
};

OrderItem.prototype.getTotalWithTax = function() {
  return this.getSubtotal() + this.taxAmount;
};

OrderItem.prototype.canBeReturned = function() {
  return ['delivered'].includes(this.fulfillmentStatus) && this.returnQuantity < this.quantity;
};

OrderItem.prototype.canBeCancelled = function() {
  return ['pending', 'processing'].includes(this.fulfillmentStatus);
};

OrderItem.prototype.getRemainingQuantity = function() {
  return this.quantity - this.returnQuantity;
};

OrderItem.prototype.getDiscountPercentage = function() {
  if (!this.originalPrice || this.originalPrice <= this.unitPrice) return 0;
  return Math.round(((this.originalPrice - this.unitPrice) / this.originalPrice) * 100);
};

OrderItem.prototype.calculatePointsEarned = function(pointsPerCurrency = 1) {
  // Calculate points based on final price after discounts
  const finalAmount = this.getSubtotal();
  this.pointsEarned = Math.floor(finalAmount * pointsPerCurrency);
  return this.pointsEarned;
};

OrderItem.prototype.applyDiscount = function(discountAmount, discountType = 'fixed', reason = '') {
  this.discountAmount = Math.min(discountAmount, this.totalPrice);
  this.discountType = discountType;
  this.discountReason = reason;
  
  // Recalculate tax on discounted amount
  if (this.taxRate > 0) {
    const discountedAmount = this.totalPrice - this.discountAmount;
    this.taxAmount = (discountedAmount * this.taxRate) / 100;
  }
};

OrderItem.prototype.processReturn = function(returnQuantity, returnReason = '') {
  if (returnQuantity > this.getRemainingQuantity()) {
    throw new Error('Return quantity cannot exceed remaining quantity');
  }
  
  this.returnQuantity += returnQuantity;
  this.returnReason = returnReason;
  
  // Calculate refund amount proportionally
  const refundPerUnit = this.getSubtotal() / this.quantity;
  const additionalRefund = refundPerUnit * returnQuantity;
  this.refundAmount += additionalRefund;
  
  // Update fulfillment status
  if (this.returnQuantity === this.quantity) {
    this.fulfillmentStatus = 'returned';
  }
  
  return additionalRefund;
};

// Class methods
OrderItem.findByOrder = function(orderId, options = {}) {
  return this.findAll({
    where: { orderId },
    order: [['createdAt', 'ASC']],
    ...options
  });
};

OrderItem.findByProduct = function(productId, options = {}) {
  return this.findAll({
    where: { productId },
    order: [['createdAt', 'DESC']],
    ...options
  });
};

OrderItem.findByFulfillmentStatus = function(status, options = {}) {
  return this.findAll({
    where: { fulfillmentStatus: status },
    order: [['createdAt', 'ASC']],
    ...options
  });
};

OrderItem.getTopSellingProducts = async function(limit = 10, startDate = null, endDate = null) {
  const { Op, fn, col } = require('sequelize');
  
  const whereClause = {};
  if (startDate && endDate) {
    whereClause.createdAt = {
      [Op.between]: [startDate, endDate]
    };
  }
  
  return this.findAll({
    where: whereClause,
    attributes: [
      'productId',
      'productSku',
      'productName',
      [fn('SUM', col('quantity')), 'totalQuantitySold'],
      [fn('SUM', col('totalPrice')), 'totalRevenue'],
      [fn('COUNT', col('id')), 'orderCount']
    ],
    group: ['productId', 'productSku', 'productName'],
    order: [[fn('SUM', col('quantity')), 'DESC']],
    limit,
    raw: true
  });
};

OrderItem.getRevenueByProduct = async function(productId, startDate = null, endDate = null) {
  const { Op, fn, col } = require('sequelize');
  
  const whereClause = { productId };
  if (startDate && endDate) {
    whereClause.createdAt = {
      [Op.between]: [startDate, endDate]
    };
  }
  
  return this.findAll({
    where: whereClause,
    attributes: [
      [fn('SUM', col('quantity')), 'totalQuantitySold'],
      [fn('SUM', col('totalPrice')), 'totalRevenue'],
      [fn('AVG', col('unitPrice')), 'averagePrice'],
      [fn('COUNT', col('id')), 'orderCount']
    ],
    raw: true
  });
};

module.exports = OrderItem;