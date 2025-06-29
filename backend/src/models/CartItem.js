/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/cart-item').CartItem, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Cart reference
  cartId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'carts',
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
  // Product snapshot (cached for performance)
  productSku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Product SKU cached for performance'
  },
  productName: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Product name cached in multiple languages'
  },
  productImage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Primary product image URL cached'
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
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price per unit at time of adding to cart'
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
  // Discounts applied to this item
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Discount applied to this specific item'
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed', 'coupon', 'bulk'),
    allowNull: true
  },
  discountReason: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Reason for discount (coupon code, bulk discount, etc.)'
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
  giftWrapRequested: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Personalization options
  personalizationOptions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Custom personalization options (engraving, custom message, etc.)'
  },
  // Subscription/recurring options
  isSubscription: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  subscriptionInterval: {
    type: DataTypes.ENUM('weekly', 'monthly', 'quarterly', 'yearly'),
    allowNull: true
  },
  // Wishlist integration
  addedFromWishlist: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  wishlistId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Wishlist ID if item was added from wishlist'
  },
  // Inventory check
  lastStockCheck: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last time stock availability was checked'
  },
  stockAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether item is currently in stock'
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Special notes or instructions for this item'
  },
  // Soft delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'cart_items',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['cartId']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['variantId']
    },
    {
      fields: ['productSku']
    },
    {
      unique: true,
      fields: ['cartId', 'productId', 'variantOptions'],
      name: 'unique_cart_product_variant'
    }
  ],
  hooks: {
    beforeCreate: async (cartItem) => {
      // Calculate total price
      cartItem.totalPrice = cartItem.unitPrice * cartItem.quantity;
      
      // Set last stock check
      cartItem.lastStockCheck = new Date();
    },
    beforeUpdate: async (cartItem) => {
      // Recalculate total price if quantity or unit price changed
      if (cartItem.changed('quantity') || cartItem.changed('unitPrice')) {
        cartItem.totalPrice = cartItem.unitPrice * cartItem.quantity;
      }
    },
    afterCreate: async (cartItem) => {
      // Update cart totals
      const cart = await cartItem.getCart();
      if (cart) {
        await cart.updateTotals();
      }
    },
    afterUpdate: async (cartItem) => {
      // Update cart totals
      const cart = await cartItem.getCart();
      if (cart) {
        await cart.updateTotals();
      }
    },
    afterDestroy: async (cartItem) => {
      // Update cart totals
      const Cart = require('./Cart');
      const cart = await Cart.findByPk(cartItem.cartId);
      if (cart) {
        await cart.updateTotals();
      }
    }
  }
});

// Instance methods
CartItem.prototype.getProductName = function(language = 'en') {
  return this.productName && this.productName[language] ? this.productName[language] : this.productName.en || '';
};

CartItem.prototype.getSubtotal = function() {
  return this.totalPrice - this.discountAmount;
};

CartItem.prototype.getDiscountPercentage = function() {
  if (!this.originalPrice || this.originalPrice <= this.unitPrice) return 0;
  return Math.round(((this.originalPrice - this.unitPrice) / this.originalPrice) * 100);
};

CartItem.prototype.updateQuantity = async function(newQuantity) {
  if (newQuantity <= 0) {
    await this.destroy();
    return null;
  }
  
  this.quantity = newQuantity;
  this.totalPrice = this.unitPrice * newQuantity;
  await this.save();
  return this;
};

CartItem.prototype.applyDiscount = function(discountAmount, discountType = 'fixed', reason = '') {
  this.discountAmount = Math.min(discountAmount, this.totalPrice);
  this.discountType = discountType;
  this.discountReason = reason;
  return this.save();
};

CartItem.prototype.checkStockAvailability = async function() {
  const Product = require('./Product');
  
  const product = await Product.findByPk(this.productId);
  if (!product) {
    this.stockAvailable = false;
  } else if (product.trackInventory) {
    this.stockAvailable = product.stockQuantity >= this.quantity;
  } else {
    this.stockAvailable = true;
  }
  
  this.lastStockCheck = new Date();
  await this.save();
  
  return this.stockAvailable;
};

CartItem.prototype.getCart = function() {
  const Cart = require('./Cart');
  return Cart.findByPk(this.cartId);
};

CartItem.prototype.getProduct = function() {
  const Product = require('./Product');
  return Product.findByPk(this.productId);
};

CartItem.prototype.hasVariant = function() {
  return this.variantId !== null || (this.variantOptions && Object.keys(this.variantOptions).length > 0);
};

CartItem.prototype.getVariantDisplay = function(language = 'en') {
  if (!this.variantOptions) return '';
  
  const options = [];
  for (const [key, value] of Object.entries(this.variantOptions)) {
    if (typeof value === 'object' && value[language]) {
      options.push(`${key}: ${value[language]}`);
    } else {
      options.push(`${key}: ${value}`);
    }
  }
  
  return options.join(', ');
};

CartItem.prototype.canBeGifted = function() {
  // Check if product allows gift wrapping
  // This would typically check product settings
  return true;
};

CartItem.prototype.setGiftOptions = function(isGift, giftMessage = '', giftWrap = false) {
  this.isGift = isGift;
  this.giftMessage = giftMessage;
  this.giftWrapRequested = giftWrap;
  return this.save();
};

CartItem.prototype.setPersonalization = function(options) {
  this.personalizationOptions = options;
  return this.save();
};

CartItem.prototype.setSubscription = function(isSubscription, interval = null) {
  this.isSubscription = isSubscription;
  this.subscriptionInterval = interval;
  return this.save();
};

// Class methods
CartItem.findByCart = function(cartId, options = {}) {
  return this.findAll({
    where: { cartId },
    order: [['createdAt', 'ASC']],
    ...options
  });
};

CartItem.findByProduct = function(productId, options = {}) {
  return this.findAll({
    where: { productId },
    ...options
  });
};

CartItem.findOutOfStock = function(options = {}) {
  return this.findAll({
    where: { stockAvailable: false },
    ...options
  });
};

CartItem.findByVariant = function(variantId, options = {}) {
  return this.findAll({
    where: { variantId },
    ...options
  });
};

CartItem.getPopularItems = async function(limit = 10, startDate = null, endDate = null) {
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
      [fn('COUNT', col('id')), 'timesAdded'],
      [fn('SUM', col('quantity')), 'totalQuantity'],
      [fn('AVG', col('unitPrice')), 'averagePrice']
    ],
    group: ['productId', 'productSku', 'productName'],
    order: [[fn('COUNT', col('id')), 'DESC']],
    limit,
    raw: true
  });
};

CartItem.bulkUpdatePrices = async function(priceUpdates) {
  // priceUpdates should be an array of {productId, newPrice}
  const promises = priceUpdates.map(async ({ productId, newPrice }) => {
    return this.update(
      { 
        unitPrice: newPrice,
        totalPrice: sequelize.literal(`quantity * ${newPrice}`)
      },
      { 
        where: { productId }
      }
    );
  });
  
  return Promise.all(promises);
};

CartItem.cleanupExpiredItems = async function(daysOld = 30) {
  const { Op } = require('sequelize');
  const threshold = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
  
  return this.destroy({
    where: {
      createdAt: {
        [Op.lt]: threshold
      }
    },
    force: true // Hard delete old items
  });
};

module.exports = CartItem;