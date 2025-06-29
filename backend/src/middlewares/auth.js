const jwt = require('jsonwebtoken');
const { verifyIdToken } = require('../config/firebase');
const { AppError, catchAsync } = require('./errorHandler');
const logger = require('../utils/logger');
const { User } = require('../models');

// JWT Authentication Middleware
const authenticateJWT = catchAsync(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Access token is required', 401));
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    logger.logSecurityEvent('INVALID_JWT_TOKEN', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    return next(new AppError('Invalid or expired token', 401));
  }
});

// Firebase Authentication Middleware
const authenticateFirebase = catchAsync(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Firebase token is required', 401));
  }

  try {
    // Verify Firebase ID token
    const decodedToken = await verifyIdToken(token);
    
    // Find or create user in database
    let user = await User.findOne({ where: { firebaseUid: decodedToken.uid } });
    
    if (!user) {
      // Create new user from Firebase data
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        firstName: decodedToken.name?.split(' ')[0] || '',
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
        emailVerified: decodedToken.email_verified,
        profilePicture: decodedToken.picture,
        role: 'customer',
        isActive: true,
        language: 'en'
      });
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    logger.logSecurityEvent('INVALID_FIREBASE_TOKEN', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    return next(new AppError('Invalid Firebase token', 401));
  }
});

// Admin Role Authorization
const requireAdmin = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    logger.logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS', {
      userId: req.user.id,
      role: req.user.role,
      ip: req.ip,
      endpoint: req.originalUrl
    });
    return next(new AppError('Admin access required', 403));
  }

  next();
});

// Super Admin Role Authorization
const requireSuperAdmin = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.role !== 'super_admin') {
    logger.logSecurityEvent('UNAUTHORIZED_SUPER_ADMIN_ACCESS', {
      userId: req.user.id,
      role: req.user.role,
      ip: req.ip,
      endpoint: req.originalUrl
    });
    return next(new AppError('Super admin access required', 403));
  }

  next();
});

// Branch Manager Authorization
const requireBranchManager = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const allowedRoles = ['branch_manager', 'admin', 'super_admin'];
  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError('Branch manager access required', 403));
  }

  next();
});

// Optional Authentication (for public endpoints that can benefit from user context)
const optionalAuth = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      logger.info('Optional auth failed:', error.message);
    }
  }

  next();
});

// Rate limiting per user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(userId)) {
      const userRequests = requests.get(userId).filter(time => time > windowStart);
      requests.set(userId, userRequests);
    }

    const userRequests = requests.get(userId) || [];
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        status: 'error',
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    userRequests.push(now);
    requests.set(userId, userRequests);
    next();
  };
};

module.exports = {
  authenticateJWT,
  authenticateFirebase,
  requireAdmin,
  requireSuperAdmin,
  requireBranchManager,
  optionalAuth,
  userRateLimit
};