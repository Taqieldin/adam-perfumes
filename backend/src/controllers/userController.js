const { User, Address, Order, LoyaltyPoints } = require('../models');
const { AppError, catchAsync } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const { 
  formatCurrency, 
  formatDate, 
  sanitizeString,
  getPagination,
  getPaginationResponse,
  removeEmptyValues
} = require('../../../shared/utils/helpers');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Address,
        as: 'addresses',
        where: { isActive: true },
        required: false
      }
    ],
    attributes: { exclude: ['password', 'refreshToken', 'passwordResetToken'] }
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Format response data
  const profileData = {
    ...user.toJSON(),
    walletBalance: formatCurrency(user.walletBalance),
    formattedCreatedAt: formatDate(user.createdAt),
    formattedLastLogin: user.lastLoginAt ? formatDate(user.lastLoginAt) : null
  };

  res.status(200).json({
    status: 'success',
    data: {
      user: profileData
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = catchAsync(async (req, res, next) => {
  const allowedFields = [
    'firstName', 'lastName', 'phone', 'dateOfBirth', 
    'gender', 'language', 'profilePicture', 'preferences'
  ];

  // Filter and sanitize input
  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = typeof req.body[field] === 'string' 
        ? sanitizeString(req.body[field]) 
        : req.body[field];
    }
  });

  // Remove empty values
  const cleanedData = removeEmptyValues(updateData);

  if (Object.keys(cleanedData).length === 0) {
    return next(new AppError('No valid fields to update', 400));
  }

  // Update user
  const [updatedRowsCount] = await User.update(cleanedData, {
    where: { id: req.user.id },
    returning: true
  });

  if (updatedRowsCount === 0) {
    return next(new AppError('User not found', 404));
  }

  // Get updated user
  const updatedUser = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password', 'refreshToken', 'passwordResetToken'] }
  });

  // Log profile update
  logger.logUserAction(req.user.id, 'PROFILE_UPDATE', {
    updatedFields: Object.keys(cleanedData),
    ip: req.ip
  });

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
});

// @desc    Update user theme preference
// @route   PATCH /api/users/me/theme
// @access  Private
const updateThemePreference = catchAsync(async (req, res, next) => {
  const { prefersDarkMode } = req.body;

  if (typeof prefersDarkMode !== 'boolean') {
    return next(new AppError('Invalid value for prefersDarkMode. It must be a boolean.', 400));
  }

  await User.update(
    { prefersDarkMode },
    { where: { id: req.user.id } }
  );

  logger.logUserAction(req.user.id, 'THEME_PREFERENCE_UPDATE', {
    prefersDarkMode,
    ip: req.ip
  });

  res.status(200).json({
    status: 'success',
    message: 'Theme preference updated successfully.',
    data: {
      prefersDarkMode
    }
  });
});

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = catchAsync(async (req, res, next) => {
  const addresses = await Address.findAll({
    where: { 
      userId: req.user.id,
      isActive: true
    },
    order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    data: {
      addresses
    }
  });
});

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = catchAsync(async (req, res, next) => {
  const {
    type, title, firstName, lastName, phone, addressLine1,
    addressLine2, city, state, postalCode, country, isDefault
  } = req.body;

  // If this is set as default, unset other default addresses
  if (isDefault) {
    await Address.update(
      { isDefault: false },
      { where: { userId: req.user.id } }
    );
  }

  const addressData = {
    userId: req.user.id,
    type: type || 'home',
    title: sanitizeString(title),
    firstName: sanitizeString(firstName),
    lastName: sanitizeString(lastName),
    phone: sanitizeString(phone),
    addressLine1: sanitizeString(addressLine1),
    addressLine2: addressLine2 ? sanitizeString(addressLine2) : null,
    city: sanitizeString(city),
    state: sanitizeString(state),
    postalCode: sanitizeString(postalCode),
    country: country || 'OM',
    isDefault: isDefault || false,
    isActive: true
  };

  const address = await Address.create(addressData);

  logger.logUserAction(req.user.id, 'ADDRESS_ADDED', {
    addressId: address.id,
    type: address.type,
    city: address.city
  });

  res.status(201).json({
    status: 'success',
    message: 'Address added successfully',
    data: {
      address
    }
  });
});

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    type, title, firstName, lastName, phone, addressLine1,
    addressLine2, city, state, postalCode, country, isDefault
  } = req.body;

  // Check if address belongs to user
  const address = await Address.findOne({
    where: { id, userId: req.user.id, isActive: true }
  });

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  // If this is set as default, unset other default addresses
  if (isDefault) {
    await Address.update(
      { isDefault: false },
      { where: { userId: req.user.id, id: { [require('sequelize').Op.ne]: id } } }
    );
  }

  const updateData = removeEmptyValues({
    type,
    title: title ? sanitizeString(title) : undefined,
    firstName: firstName ? sanitizeString(firstName) : undefined,
    lastName: lastName ? sanitizeString(lastName) : undefined,
    phone: phone ? sanitizeString(phone) : undefined,
    addressLine1: addressLine1 ? sanitizeString(addressLine1) : undefined,
    addressLine2: addressLine2 ? sanitizeString(addressLine2) : undefined,
    city: city ? sanitizeString(city) : undefined,
    state: state ? sanitizeString(state) : undefined,
    postalCode: postalCode ? sanitizeString(postalCode) : undefined,
    country,
    isDefault
  });

  await address.update(updateData);

  logger.logUserAction(req.user.id, 'ADDRESS_UPDATED', {
    addressId: address.id,
    updatedFields: Object.keys(updateData)
  });

  res.status(200).json({
    status: 'success',
    message: 'Address updated successfully',
    data: {
      address
    }
  });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const address = await Address.findOne({
    where: { id, userId: req.user.id, isActive: true }
  });

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  // Soft delete
  await address.update({ isActive: false });

  logger.logUserAction(req.user.id, 'ADDRESS_DELETED', {
    addressId: address.id,
    type: address.type
  });

  res.status(200).json({
    status: 'success',
    message: 'Address deleted successfully'
  });
});

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
const getOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;
  const { offset, limit: queryLimit } = getPagination(page, limit);

  const whereClause = { userId: req.user.id };
  if (status) {
    whereClause.status = status;
  }

  const { count, rows: orders } = await Order.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: require('../models').OrderItem,
        as: 'items',
        include: [
          {
            model: require('../models').Product,
            as: 'product',
            attributes: ['id', 'name', 'nameAr', 'images', 'sku']
          }
        ]
      },
      {
        model: Address,
        as: 'shippingAddress',
        attributes: ['id', 'title', 'addressLine1', 'city', 'phone']
      }
    ],
    order: [['createdAt', 'DESC']],
    offset,
    limit: queryLimit
  });

  const pagination = getPaginationResponse(count, page, limit);

  // Format orders data
  const formattedOrders = orders.map(order => ({
    ...order.toJSON(),
    formattedTotal: formatCurrency(order.totalAmount),
    formattedCreatedAt: formatDate(order.createdAt),
    formattedUpdatedAt: formatDate(order.updatedAt)
  }));

  res.status(200).json({
    status: 'success',
    data: {
      orders: formattedOrders,
      pagination
    }
  });
});

// @desc    Get user loyalty points
// @route   GET /api/users/loyalty-points
// @access  Private
const getLoyaltyPoints = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const { offset, limit: queryLimit } = getPagination(page, limit);

  // Get current balance
  const user = await User.findByPk(req.user.id, {
    attributes: ['loyaltyPoints']
  });

  // Get transaction history
  const { count, rows: transactions } = await LoyaltyPoints.findAndCountAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    offset,
    limit: queryLimit
  });

  const pagination = getPaginationResponse(count, page, limit);

  // Format transactions
  const formattedTransactions = transactions.map(transaction => ({
    ...transaction.toJSON(),
    formattedCreatedAt: formatDate(transaction.createdAt)
  }));

  res.status(200).json({
    status: 'success',
    data: {
      currentBalance: user.loyaltyPoints,
      transactions: formattedTransactions,
      pagination
    }
  });
});

// @desc    Get user preferences
// @route   GET /api/users/preferences
// @access  Private
const getPreferences = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['preferences', 'language', 'notificationSettings']
  });

  const defaultPreferences = {
    theme: 'light',
    currency: 'OMR',
    notifications: {
      email: true,
      push: true,
      sms: false,
      whatsapp: true
    },
    privacy: {
      profileVisibility: 'private',
      showPurchaseHistory: false,
      allowRecommendations: true
    },
    shopping: {
      savePaymentMethods: true,
      autoApplyCoupons: true,
      wishlistPublic: false
    }
  };

  const preferences = {
    ...defaultPreferences,
    ...user.preferences,
    language: user.language
  };

  res.status(200).json({
    status: 'success',
    data: {
      preferences
    }
  });
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = catchAsync(async (req, res, next) => {
  const { preferences, language, notificationSettings } = req.body;

  const updateData = removeEmptyValues({
    preferences,
    language,
    notificationSettings
  });

  if (Object.keys(updateData).length === 0) {
    return next(new AppError('No valid preferences to update', 400));
  }

  await User.update(updateData, {
    where: { id: req.user.id }
  });

  logger.logUserAction(req.user.id, 'PREFERENCES_UPDATED', {
    updatedFields: Object.keys(updateData),
    ip: req.ip
  });

  res.status(200).json({
    status: 'success',
    message: 'Preferences updated successfully'
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = catchAsync(async (req, res, next) => {
  const { password, reason } = req.body;

  if (!password) {
    return next(new AppError('Password is required to delete account', 400));
  }

  // Verify password
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: { include: ['password'] }
  });

  const bcrypt = require('bcryptjs');
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid password', 400));
  }

  // Soft delete user account
  await user.update({
    isActive: false,
    deletedAt: new Date(),
    deletionReason: reason || 'User requested deletion'
  });

  // Log account deletion
  logger.logUserAction(req.user.id, 'ACCOUNT_DELETED', {
    reason: reason || 'User requested deletion',
    ip: req.ip
  });

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully'
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getOrders,
  getLoyaltyPoints,
  getPreferences,
  updatePreferences,
  deleteAccount
};