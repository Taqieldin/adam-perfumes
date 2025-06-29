const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/**
 * Generate a unique ID
 * @returns {string} UUID v4
 */
const generateId = () => {
  return uuidv4();
};

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a secure random token
 * @param {number} length - Length of the token
 * @returns {string} Secure token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('base64url');
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (OMR, USD, etc.)
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount, currency = 'OMR', locale = 'en-OM') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(amount);
};

/**
 * Format date
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale for formatting
 * @param {object} options - Formatting options
 * @returns {string} Formatted date
 */
const formatDate = (date, locale = 'en-OM', options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Muscat'
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date));
};

/**
 * Sanitize string for database storage
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Omani format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
const isValidOmaniPhone = (phone) => {
  const phoneRegex = /^(\+968|968)?[79]\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Generate SKU for products
 * @param {string} category - Product category
 * @param {string} name - Product name
 * @returns {string} Generated SKU
 */
const generateSKU = (category, name) => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const nameCode = name.replace(/\s+/g, '').substring(0, 5).toUpperCase();
  const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${categoryCode}-${nameCode}-${randomCode}`;
};

/**
 * Calculate discount amount
 * @param {number} originalPrice - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {object} Discount calculation
 */
const calculateDiscount = (originalPrice, discountPercent) => {
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;
  
  return {
    originalPrice,
    discountPercent,
    discountAmount: Math.round(discountAmount * 1000) / 1000, // Round to 3 decimal places
    finalPrice: Math.round(finalPrice * 1000) / 1000,
    savings: Math.round(discountAmount * 1000) / 1000
  };
};

/**
 * Calculate loyalty points
 * @param {number} amount - Purchase amount
 * @param {number} pointsPerUnit - Points per currency unit (default: 1 point per OMR)
 * @returns {number} Loyalty points earned
 */
const calculateLoyaltyPoints = (amount, pointsPerUnit = 1) => {
  return Math.floor(amount * pointsPerUnit);
};

/**
 * Generate order number
 * @param {string} branchCode - Branch code
 * @returns {string} Order number
 */
const generateOrderNumber = (branchCode = 'AP') => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `${branchCode}${year}${month}${day}${random}`;
};

/**
 * Paginate results
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination info
 */
const getPagination = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    offset,
    limit: parseInt(limit),
    page: parseInt(page)
  };
};

/**
 * Create pagination response
 * @param {number} count - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination response
 */
const getPaginationResponse = (count, page, limit) => {
  const totalPages = Math.ceil(count / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return {
    totalItems: count,
    totalPages,
    currentPage: parseInt(page),
    itemsPerPage: parseInt(limit),
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null
  };
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove undefined/null values from object
 * @param {object} obj - Object to clean
 * @returns {object} Cleaned object
 */
const removeEmptyValues = (obj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

/**
 * Convert string to slug
 * @param {string} str - String to convert
 * @returns {string} Slug
 */
const createSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Mask sensitive data
 * @param {string} str - String to mask
 * @param {number} visibleChars - Number of visible characters at start/end
 * @returns {string} Masked string
 */
const maskSensitiveData = (str, visibleChars = 2) => {
  if (!str || str.length <= visibleChars * 2) return str;
  
  const start = str.substring(0, visibleChars);
  const end = str.substring(str.length - visibleChars);
  const middle = '*'.repeat(str.length - visibleChars * 2);
  
  return `${start}${middle}${end}`;
};

/**
 * Generate QR code data for orders
 * @param {string} orderId - Order ID
 * @param {string} customerPhone - Customer phone
 * @returns {string} QR code data
 */
const generateOrderQRData = (orderId, customerPhone) => {
  return JSON.stringify({
    orderId,
    customerPhone: maskSensitiveData(customerPhone, 3),
    timestamp: Date.now(),
    type: 'order_pickup'
  });
};

/**
 * Calculate shipping cost based on weight and distance
 * @param {number} weight - Package weight in kg
 * @param {number} distance - Distance in km
 * @param {string} shippingType - Type of shipping
 * @returns {number} Shipping cost
 */
const calculateShippingCost = (weight, distance, shippingType = 'standard') => {
  const baseCost = 2.000; // Base cost in OMR
  const weightCost = weight * 0.500; // 0.5 OMR per kg
  const distanceCost = distance * 0.100; // 0.1 OMR per km
  
  let multiplier = 1;
  switch (shippingType) {
    case 'express':
      multiplier = 1.5;
      break;
    case 'overnight':
      multiplier = 2.0;
      break;
    default:
      multiplier = 1;
  }
  
  const totalCost = (baseCost + weightCost + distanceCost) * multiplier;
  return Math.round(totalCost * 1000) / 1000; // Round to 3 decimal places
};

module.exports = {
  generateId,
  generateRandomString,
  generateSecureToken,
  formatCurrency,
  formatDate,
  sanitizeString,
  isValidEmail,
  isValidOmaniPhone,
  generateSKU,
  calculateDiscount,
  calculateLoyaltyPoints,
  generateOrderNumber,
  getPagination,
  getPaginationResponse,
  deepClone,
  removeEmptyValues,
  createSlug,
  maskSensitiveData,
  generateOrderQRData,
  calculateShippingCost
};