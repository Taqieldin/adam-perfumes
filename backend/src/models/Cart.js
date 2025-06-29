/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/cart').Cart, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // User reference
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // One cart per user
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Session support for guest users
  sessionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Session ID for guest carts'
  },
  // Cart totals (denormalized for performance)
  itemCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total number of items in cart'
  },
  totalQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total quantity of all items'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Subtotal before discounts and taxes'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Total discount applied'
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Total tax amount'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Final total amount'
  },
  // Currency
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'OMR'
  },
  // Applied coupons
  appliedCoupons: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of applied coupon codes'
  },
  // Loyalty points usage
  pointsToUse: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Loyalty points to be used for discount'
  },
  pointsValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Monetary value of points to be used'
  },
  // Wallet usage
  walletAmountToUse: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Wallet amount to be used'
  },
  // Shipping information
  shippingAddressId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'addresses',
      key: 'id'
    }
  },
  shippingMethod: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  // Pickup option
  isPickup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pickupBranchId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'branches',
      key: 'id'
    }
  },
  // Cart status
  status: {
    type: DataTypes.ENUM('active', 'abandoned', 'converted', 'expired'),
    defaultValue: 'active'
  },
  // Abandonment tracking
  lastActivityAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  abandonedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Conversion tracking
  convertedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Order ID if cart was converted'
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Customer notes or special instructions'
  },
  // Soft delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'carts',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['sessionId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['lastActivityAt']
    },
    {
      fields: ['abandonedAt']
    }
  ],
  hooks: {
    beforeUpdate: async (cart) => {
      // Update last activity timestamp
      cart.lastActivityAt = new Date();
      
      // Mark as abandoned if inactive for too long
      const abandonmentThreshold = 24 * 60 * 60 * 1000; // 24 hours
      const now = new Date();
      if (cart.status === 'active' && (now - cart.lastActivityAt) > abandonmentThreshold) {
        cart.status = 'abandoned';
        cart.abandonedAt = now;
      }
    }
  }
});

// Instance methods
Cart.prototype.updateTotals = async function() {
  const CartItem = require('./CartItem');
  
  // Get all cart items
  const items = await CartItem.findAll({
    where: { cartId: this.id }
  });
  
  // Calculate totals
  this.itemCount = items.length;
  this.totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  this.subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Apply discounts (this would involve coupon logic)
  // For now, just calculate basic totals
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount - this.pointsValue - this.walletAmountToUse;
  
  await this.save();
  return this;
};

Cart.prototype.addItem = async function(productId, quantity = 1, variantOptions = null) {
  const CartItem = require('./CartItem');
  const Product = require('./Product');
  
  // Get product details
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  // Check if item already exists in cart
  const existingItem = await CartItem.findOne({
    where: {
      cartId: this.id,
      productId,
      variantOptions: variantOptions || null
    }
  });
  
  if (existingItem) {
    // Update quantity
    existingItem.quantity += quantity;
    existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
    await existingItem.save();
    return existingItem;
  } else {
    // Create new cart item
    const cartItem = await CartItem.create({
      cartId: this.id,
      productId,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
      productName: product.name,
      productImage: product.getPrimaryImage(),
      productSku: product.sku,
      variantOptions
    });
    
    await this.updateTotals();
    return cartItem;
  }
};

Cart.prototype.removeItem = async function(cartItemId) {
  const CartItem = require('./CartItem');
  
  const item = await CartItem.findOne({
    where: { id: cartItemId, cartId: this.id }
  });
  
  if (item) {
    await item.destroy();
    await this.updateTotals();
    return true;
  }
  
  return false;
};

Cart.prototype.updateItemQuantity = async function(cartItemId, quantity) {
  const CartItem = require('./CartItem');
  
  if (quantity <= 0) {
    return this.removeItem(cartItemId);
  }
  
  const item = await CartItem.findOne({
    where: { id: cartItemId, cartId: this.id }
  });
  
  if (item) {
    item.quantity = quantity;
    item.totalPrice = item.unitPrice * quantity;
    await item.save();
    await this.updateTotals();
    return item;
  }
  
  return null;
};

Cart.prototype.clear = async function() {
  const CartItem = require('./CartItem');
  
  await CartItem.destroy({
    where: { cartId: this.id }
  });
  
  // Reset cart totals
  this.itemCount = 0;
  this.totalQuantity = 0;
  this.subtotal = 0;
  this.discountAmount = 0;
  this.taxAmount = 0;
  this.totalAmount = 0;
  this.appliedCoupons = [];
  this.pointsToUse = 0;
  this.pointsValue = 0;
  this.walletAmountToUse = 0;
  
  await this.save();
  return this;
};

Cart.prototype.applyCoupon = async function(couponCode) {
  const Coupon = require('./Coupon');
  
  // Find and validate coupon
  const coupon = await Coupon.findOne({
    where: { code: couponCode, status: 'active' }
  });
  
  if (!coupon) {
    throw new Error('Invalid coupon code');
  }
  
  if (!coupon.isValid()) {
    throw new Error('Coupon is expired or not valid');
  }
  
  // Check if coupon is already applied
  if (this.appliedCoupons.includes(couponCode)) {
    throw new Error('Coupon already applied');
  }
  
  // Apply coupon discount
  const discount = coupon.calculateDiscount(this.subtotal);
  this.discountAmount += discount;
  this.appliedCoupons = [...this.appliedCoupons, couponCode];
  
  await this.updateTotals();
  return discount;
};

Cart.prototype.removeCoupon = async function(couponCode) {
  if (!this.appliedCoupons.includes(couponCode)) {
    return false;
  }
  
  // Recalculate discount without this coupon
  this.appliedCoupons = this.appliedCoupons.filter(code => code !== couponCode);
  
  // Recalculate all discounts
  this.discountAmount = 0;
  for (const code of this.appliedCoupons) {
    const Coupon = require('./Coupon');
    const coupon = await Coupon.findOne({ where: { code } });
    if (coupon && coupon.isValid()) {
      this.discountAmount += coupon.calculateDiscount(this.subtotal);
    }
  }
  
  await this.updateTotals();
  return true;
};

Cart.prototype.applyLoyaltyPoints = function(points, pointValue = 0.01) {
  this.pointsToUse = points;
  this.pointsValue = points * pointValue;
  return this.updateTotals();
};

Cart.prototype.applyWalletAmount = function(amount) {
  this.walletAmountToUse = Math.min(amount, this.totalAmount);
  return this.updateTotals();
};

Cart.prototype.convertToOrder = async function() {
  this.status = 'converted';
  this.convertedAt = new Date();
  await this.save();
};

Cart.prototype.markAsAbandoned = async function() {
  this.status = 'abandoned';
  this.abandonedAt = new Date();
  await this.save();
};

Cart.prototype.isEmpty = function() {
  return this.itemCount === 0;
};

Cart.prototype.getItems = function() {
  const CartItem = require('./CartItem');
  return CartItem.findAll({
    where: { cartId: this.id },
    include: [
      {
        model: require('./Product'),
        as: 'product'
      }
    ],
    order: [['createdAt', 'ASC']]
  });
};

// Class methods
Cart.findByUser = function(userId) {
  return this.findOne({ where: { userId } });
};

Cart.findBySession = function(sessionId) {
  return this.findOne({ where: { sessionId } });
};

Cart.findOrCreateForUser = async function(userId) {
  let cart = await this.findByUser(userId);
  if (!cart) {
    cart = await this.create({ userId });
  }
  return cart;
};

Cart.findAbandonedCarts = function(hoursAgo = 24) {
  const { Op } = require('sequelize');
  const threshold = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
  
  return this.findAll({
    where: {
      status: 'active',
      lastActivityAt: {
        [Op.lt]: threshold
      },
      itemCount: {
        [Op.gt]: 0
      }
    }
  });
};

Cart.getAbandonmentStats = async function(startDate, endDate) {
  const { Op, fn, col } = require('sequelize');
  
  return this.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    },
    attributes: [
      [fn('COUNT', col('id')), 'totalCarts'],
      [fn('SUM', fn('CASE', fn('WHEN', { status: 'converted' }, 1), 0)), 'convertedCarts'],
      [fn('SUM', fn('CASE', fn('WHEN', { status: 'abandoned' }, 1), 0)), 'abandonedCarts'],
      [fn('AVG', col('subtotal')), 'averageCartValue']
    ],
    raw: true
  });
};

module.exports = Cart;