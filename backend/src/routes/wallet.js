const express = require('express');
const { body, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const walletService = require('../services/walletService');
const { AppError, catchAsync } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Rate limiting for wallet operations
const walletLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 wallet operations per windowMs
  message: {
    error: 'Too many wallet operations, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateTopUp = [
  body('amount')
    .isFloat({ min: 1, max: 1000 })
    .withMessage('Amount must be between 1 and 1000 OMR'),
  body('paymentMethod')
    .isIn(['card', 'bank_transfer', 'apple_pay', 'google_pay'])
    .withMessage('Invalid payment method'),
  body('paymentReference')
    .optional()
    .isString()
    .withMessage('Payment reference must be a string'),
];

const validateTransfer = [
  body('toUserId')
    .isUUID()
    .withMessage('Valid recipient user ID is required'),
  body('amount')
    .isFloat({ min: 1, max: 500 })
    .withMessage('Transfer amount must be between 1 and 500 OMR'),
  body('description')
    .isString()
    .isLength({ min: 5, max: 100 })
    .withMessage('Description must be between 5 and 100 characters'),
];

const validateSettings = [
  body('auto_top_up_enabled')
    .optional()
    .isBoolean()
    .withMessage('Auto top-up enabled must be boolean'),
  body('auto_top_up_threshold')
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage('Auto top-up threshold must be between 1 and 100 OMR'),
  body('auto_top_up_amount')
    .optional()
    .isFloat({ min: 10, max: 500 })
    .withMessage('Auto top-up amount must be between 10 and 500 OMR'),
  body('preferred_payment_method')
    .optional()
    .isIn(['card', 'bank_transfer', 'apple_pay', 'google_pay'])
    .withMessage('Invalid preferred payment method'),
  body('daily_spending_limit')
    .optional()
    .isFloat({ min: 10, max: 1000 })
    .withMessage('Daily spending limit must be between 10 and 1000 OMR'),
  body('monthly_spending_limit')
    .optional()
    .isFloat({ min: 50, max: 5000 })
    .withMessage('Monthly spending limit must be between 50 and 5000 OMR'),
];

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
const getWalletBalance = catchAsync(async (req, res, next) => {
  const userId = req.user?.id || '1'; // TODO: Get from auth middleware

  const balance = await walletService.getWalletBalance(userId);

  res.status(200).json({
    status: 'success',
    data: {
      balance: balance.balance,
      currency: balance.currency,
      formatted: `${balance.balance.toFixed(2)} ${balance.currency}`
    }
  });
});

// @desc    Get wallet transaction history
// @route   GET /api/wallet/transactions
// @access  Private
const getTransactionHistory = catchAsync(async (req, res, next) => {
  const userId = req.user?.id || '1'; // TODO: Get from auth middleware
  
  const { page = 1, limit = 20, type, startDate, endDate } = req.query;

  const result = await walletService.getTransactionHistory(userId, {
    page: parseInt(page),
    limit: parseInt(limit),
    type,
    startDate,
    endDate
  });

  res.status(200).json({
    status: 'success',
    data: {
      transactions: result.transactions,
      pagination: result.pagination
    }
  });
});

// @desc    Top up wallet
// @route   POST /api/wallet/top-up
// @access  Private
const topUpWallet = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const userId = req.user?.id || '1'; // TODO: Get from auth middleware
  const { amount, paymentMethod, paymentReference } = req.body;

  // TODO: Process payment with payment gateway first
  // For now, we'll simulate successful payment
  const paymentResult = {
    success: true,
    transactionId: `tap_${Date.now()}`,
    amount: amount
  };

  if (!paymentResult.success) {
    return next(new AppError('Payment failed', 400));
  }

  const result = await walletService.topUpWallet(
    userId,
    amount,
    paymentMethod,
    paymentResult.transactionId
  );

  // Emit real-time update
  const io = req.app.get('io');
  if (io) {
    io.to(`user-${userId}`).emit('wallet-updated', {
      balance: result.newBalance,
      transaction: {
        type: 'credit',
        amount: amount,
        description: `Wallet top-up via ${paymentMethod}`
      }
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Wallet topped up successfully',
    data: {
      newBalance: result.newBalance,
      transactionId: result.transactionId,
      amount: amount
    }
  });
});

// @desc    Transfer money to another user
// @route   POST /api/wallet/transfer
// @access  Private
const transferMoney = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const fromUserId = req.user?.id || '1'; // TODO: Get from auth middleware
  const { toUserId, amount, description } = req.body;

  // Prevent self-transfer
  if (fromUserId === toUserId) {
    return next(new AppError('Cannot transfer to yourself', 400));
  }

  const result = await walletService.transferBetweenWallets(
    fromUserId,
    toUserId,
    amount,
    description
  );

  // Emit real-time updates to both users
  const io = req.app.get('io');
  if (io) {
    io.to(`user-${fromUserId}`).emit('wallet-updated', {
      type: 'transfer_sent',
      amount: amount,
      recipient: toUserId
    });

    io.to(`user-${toUserId}`).emit('wallet-updated', {
      type: 'transfer_received',
      amount: amount,
      sender: fromUserId
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Money transferred successfully',
    data: {
      transferAmount: result.transferAmount,
      recipient: toUserId
    }
  });
});

// @desc    Get wallet settings
// @route   GET /api/wallet/settings
// @access  Private
const getWalletSettings = catchAsync(async (req, res, next) => {
  const userId = req.user?.id || '1'; // TODO: Get from auth middleware

  const settings = await walletService.getWalletSettings(userId);

  res.status(200).json({
    status: 'success',
    data: settings
  });
});

// @desc    Update wallet settings
// @route   PUT /api/wallet/settings
// @access  Private
const updateWalletSettings = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const userId = req.user?.id || '1'; // TODO: Get from auth middleware

  await walletService.updateWalletSettings(userId, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Wallet settings updated successfully'
  });
});

// @desc    Check auto top-up eligibility
// @route   GET /api/wallet/auto-top-up/check
// @access  Private
const checkAutoTopUp = catchAsync(async (req, res, next) => {
  const userId = req.user?.id || '1'; // TODO: Get from auth middleware

  const result = await walletService.checkAutoTopUp(userId);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

// @desc    Get wallet statistics (Admin only)
// @route   GET /api/wallet/admin/statistics
// @access  Private (Admin)
const getWalletStatistics = catchAsync(async (req, res, next) => {
  // TODO: Add admin role check
  const { startDate, endDate } = req.query;

  const stats = await walletService.getWalletStatistics(startDate, endDate);

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

// @desc    Process refund to wallet (Admin only)
// @route   POST /api/wallet/admin/refund
// @access  Private (Admin)
const processRefund = catchAsync(async (req, res, next) => {
  // TODO: Add admin role check
  const { userId, amount, description, referenceId } = req.body;

  const result = await walletService.refundToWallet(userId, amount, description, referenceId);

  // Emit real-time update
  const io = req.app.get('io');
  if (io) {
    io.to(`user-${userId}`).emit('wallet-updated', {
      type: 'refund',
      amount: amount,
      description: description
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Refund processed successfully',
    data: {
      newBalance: result.newBalance,
      refundAmount: result.refundAmount
    }
  });
});

// Apply rate limiting to sensitive operations
router.use('/top-up', walletLimiter);
router.use('/transfer', walletLimiter);

// Routes
router.get('/balance', getWalletBalance);
router.get('/transactions', getTransactionHistory);
router.post('/top-up', validateTopUp, topUpWallet);
router.post('/transfer', validateTransfer, transferMoney);
router.get('/settings', getWalletSettings);
router.put('/settings', validateSettings, updateWalletSettings);
router.get('/auto-top-up/check', checkAutoTopUp);

// Admin routes
router.get('/admin/statistics', getWalletStatistics);
router.post('/admin/refund', processRefund);

module.exports = router;