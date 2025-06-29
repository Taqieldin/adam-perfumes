const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Address = require('./Address');
const Coupon = require('./Coupon');
const Review = require('./Review');
const Notification = require('./Notification');
const Branch = require('./Branch');
const LoyaltyPoints = require('./LoyaltyPoints');
const ChatMessage = require('./ChatMessage');
const Inventory = require('./Inventory');
const GiftCard = require('./GiftCard');
const WishList = require('./WishList');
const Offer = require('./Offer');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
  User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
  User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
  User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
  User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
  User.hasMany(LoyaltyPoints, { foreignKey: 'userId', as: 'loyaltyPoints' });
  User.hasMany(ChatMessage, { foreignKey: 'userId', as: 'messages' });
  User.hasMany(GiftCard, { foreignKey: 'purchasedBy', as: 'purchasedGiftCards' });
  User.hasMany(GiftCard, { foreignKey: 'usedBy', as: 'usedGiftCards' });
  User.hasMany(WishList, { foreignKey: 'userId', as: 'wishlist' });

  // Product associations
  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
  Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
  Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
  Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
  Product.hasMany(Inventory, { foreignKey: 'productId', as: 'inventory' });
  Product.hasMany(WishList, { foreignKey: 'productId', as: 'wishlists' });

  // Category associations
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
  Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
  Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  Order.belongsTo(Address, { foreignKey: 'shippingAddressId', as: 'shippingAddress' });
  Order.belongsTo(Address, { foreignKey: 'billingAddressId', as: 'billingAddress' });
  Order.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });

  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // Cart associations
  Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });

  // CartItem associations
  CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
  CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // Address associations
  Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Review associations
  Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Review.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Notification.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  Notification.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // LoyaltyPoints associations
  LoyaltyPoints.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  LoyaltyPoints.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  // ChatMessage associations
  ChatMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  ChatMessage.belongsTo(ChatMessage, { foreignKey: 'replyToId', as: 'replyTo' });

  // Branch associations
  Branch.hasMany(Inventory, { foreignKey: 'branchId', as: 'inventory' });

  // Inventory associations
  Inventory.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Inventory.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

  // GiftCard associations
  GiftCard.belongsTo(User, { foreignKey: 'purchasedBy', as: 'purchaser' });
  GiftCard.belongsTo(User, { foreignKey: 'usedBy', as: 'user' });

  // WishList associations
  WishList.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  WishList.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // Offer associations
  Offer.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
  Offer.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });
};

// Initialize associations
defineAssociations();

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Address,
  Coupon,
  Review,
  Notification,
  Branch,
  LoyaltyPoints,
  ChatMessage,
  Inventory,
  GiftCard,
  WishList,
  Offer
};