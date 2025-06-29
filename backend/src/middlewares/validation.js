const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return next(new AppError('Validation failed', 400, errorMessages));
  }
  next();
};

// Common validation rules
const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  phone: body('phone')
    .isMobilePhone('ar-OM')
    .withMessage('Please provide a valid Omani phone number'),
    
  name: (field) => body(field)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(`${field} must be between 2 and 50 characters`),
    
  uuid: (field) => param(field)
    .isUUID()
    .withMessage(`${field} must be a valid UUID`),
    
  positiveNumber: (field) => body(field)
    .isFloat({ min: 0 })
    .withMessage(`${field} must be a positive number`),
    
  currency: body('currency')
    .isIn(['OMR', 'USD', 'AED', 'SAR'])
    .withMessage('Currency must be one of: OMR, USD, AED, SAR'),
    
  language: body('language')
    .isIn(['en', 'ar'])
    .withMessage('Language must be either en or ar'),
    
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ]
};

// User validation schemas
const userValidations = {
  register: [
    commonValidations.email,
    commonValidations.password,
    commonValidations.name('firstName'),
    commonValidations.name('lastName'),
    commonValidations.phone,
    body('language').optional().isIn(['en', 'ar']).withMessage('Language must be either en or ar'),
    handleValidationErrors
  ],
  
  login: [
    commonValidations.email,
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ],
  
  updateProfile: [
    commonValidations.name('firstName').optional(),
    commonValidations.name('lastName').optional(),
    commonValidations.phone.optional(),
    commonValidations.language.optional(),
    body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    handleValidationErrors
  ]
};

// Product validation schemas
const productValidations = {
  create: [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
    body('nameAr').trim().isLength({ min: 2, max: 100 }).withMessage('Arabic product name must be between 2 and 100 characters'),
    body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('descriptionAr').trim().isLength({ min: 10, max: 1000 }).withMessage('Arabic description must be between 10 and 1000 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('categoryId').isUUID().withMessage('Category ID must be a valid UUID'),
    body('sku').trim().isLength({ min: 3, max: 50 }).withMessage('SKU must be between 3 and 50 characters'),
    body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('volume').optional().isFloat({ min: 0 }).withMessage('Volume must be a positive number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.uuid('id'),
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
    body('nameAr').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Arabic product name must be between 2 and 100 characters'),
    body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('descriptionAr').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Arabic description must be between 10 and 1000 characters'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('categoryId').optional().isUUID().withMessage('Category ID must be a valid UUID'),
    body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('volume').optional().isFloat({ min: 0 }).withMessage('Volume must be a positive number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    handleValidationErrors
  ],
  
  getById: [
    commonValidations.uuid('id'),
    handleValidationErrors
  ]
};

// Order validation schemas
const orderValidations = {
  create: [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId').isUUID().withMessage('Product ID must be a valid UUID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('shippingAddressId').isUUID().withMessage('Shipping address ID must be a valid UUID'),
    body('paymentMethod').isIn(['card', 'wallet', 'cod', 'bank_transfer']).withMessage('Invalid payment method'),
    body('couponCode').optional().trim().isLength({ min: 3, max: 20 }).withMessage('Coupon code must be between 3 and 20 characters'),
    body('walletAmountUsed').optional().isFloat({ min: 0 }).withMessage('Wallet amount must be a positive number'),
    handleValidationErrors
  ],
  
  updateStatus: [
    commonValidations.uuid('id'),
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
      .withMessage('Invalid order status'),
    body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters'),
    handleValidationErrors
  ]
};

// Wallet validation schemas
const walletValidations = {
  topUp: [
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
    body('paymentMethod').isIn(['card', 'bank_transfer']).withMessage('Invalid payment method'),
    body('paymentReference').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Payment reference must be between 3 and 100 characters'),
    handleValidationErrors
  ],
  
  transfer: [
    body('toUserId').isUUID().withMessage('Recipient user ID must be a valid UUID'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
    body('description').optional().trim().isLength({ max: 200 }).withMessage('Description must not exceed 200 characters'),
    handleValidationErrors
  ]
};

// Chat validation schemas
const chatValidations = {
  sendMessage: [
    body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
    body('type').optional().isIn(['text', 'image', 'file']).withMessage('Message type must be text, image, or file'),
    handleValidationErrors
  ]
};

// Admin validation schemas
const adminValidations = {
  createUser: [
    commonValidations.email,
    commonValidations.name('firstName'),
    commonValidations.name('lastName'),
    commonValidations.phone,
    body('role').isIn(['customer', 'branch_manager', 'admin', 'super_admin']).withMessage('Invalid role'),
    body('branchId').optional().isUUID().withMessage('Branch ID must be a valid UUID'),
    handleValidationErrors
  ],
  
  updateUser: [
    commonValidations.uuid('id'),
    commonValidations.name('firstName').optional(),
    commonValidations.name('lastName').optional(),
    commonValidations.phone.optional(),
    body('role').optional().isIn(['customer', 'branch_manager', 'admin', 'super_admin']).withMessage('Invalid role'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('branchId').optional().isUUID().withMessage('Branch ID must be a valid UUID'),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  commonValidations,
  userValidations,
  productValidations,
  orderValidations,
  walletValidations,
  chatValidations,
  adminValidations
};