const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const logger = require('../utils/logger');
const { AppError, catchAsync } = require('../middlewares/errorHandler');
const { verifyIdToken } = require('../config/firebase');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .isMobilePhone('ar-OM')
    .withMessage('Please provide a valid Omani phone number'),
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Helper function to generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Helper function to generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const { email, password, firstName, lastName, phone, language = 'en' } = req.body;

  // TODO: Check if user already exists in database
  // const existingUser = await User.findOne({ where: { email } });
  // if (existingUser) {
  //   return next(new AppError('User already exists with this email', 400));
  // }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // TODO: Create user in database
  const userData = {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phone,
    language,
    isActive: true,
    emailVerified: false,
    role: 'customer'
  };

  // For now, simulate user creation
  const user = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Generate tokens
  const token = generateToken({ 
    id: user.id, 
    email: user.email, 
    role: user.role 
  });
  
  const refreshToken = generateRefreshToken({ 
    id: user.id, 
    email: user.email 
  });

  // Log user registration
  logger.logUserAction(user.id, 'REGISTER', {
    email: user.email,
    language: user.language
  });

  // Remove password from response
  delete user.password;

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user,
      token,
      refreshToken
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400));
  }

  const { email, password } = req.body;

  // TODO: Find user in database
  // const user = await User.findOne({ where: { email } });
  // if (!user) {
  //   return next(new AppError('Invalid email or password', 401));
  // }

  // For now, simulate user lookup
  const user = {
    id: '1',
    email: email,
    password: await bcrypt.hash('password123!', 12), // Simulated hashed password
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    isActive: true,
    emailVerified: true
  };

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    logger.logSecurityEvent('INVALID_LOGIN_ATTEMPT', {
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  // Generate tokens
  const token = generateToken({ 
    id: user.id, 
    email: user.email, 
    role: user.role 
  });
  
  const refreshToken = generateRefreshToken({ 
    id: user.id, 
    email: user.email 
  });

  // Log successful login
  logger.logUserAction(user.id, 'LOGIN', {
    email: user.email,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Remove password from response
  delete user.password;

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user,
      token,
      refreshToken
    }
  });
});

// @desc    Firebase authentication
// @route   POST /api/auth/firebase
// @access  Public
const firebaseAuth = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new AppError('Firebase ID token is required', 400));
  }

  try {
    // Verify Firebase ID token
    const decodedToken = await verifyIdToken(idToken);
    
    // TODO: Find or create user in database
    // let user = await User.findOne({ where: { firebaseUid: decodedToken.uid } });
    
    // if (!user) {
    //   // Create new user from Firebase data
    //   user = await User.create({
    //     firebaseUid: decodedToken.uid,
    //     email: decodedToken.email,
    //     firstName: decodedToken.name?.split(' ')[0] || '',
    //     lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
    //     emailVerified: decodedToken.email_verified,
    //     profilePicture: decodedToken.picture,
    //     role: 'customer',
    //     isActive: true
    //   });
    // }

    // Simulate user data
    const user = {
      id: decodedToken.uid,
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      firstName: decodedToken.name?.split(' ')[0] || 'User',
      lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
      emailVerified: decodedToken.email_verified,
      profilePicture: decodedToken.picture,
      role: 'customer',
      isActive: true
    };

    // Generate JWT tokens
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });
    
    const refreshToken = generateRefreshToken({ 
      id: user.id, 
      email: user.email 
    });

    // Log Firebase authentication
    logger.logUserAction(user.id, 'FIREBASE_AUTH', {
      email: user.email,
      provider: decodedToken.firebase.sign_in_provider
    });

    res.status(200).json({
      status: 'success',
      message: 'Firebase authentication successful',
      data: {
        user,
        token,
        refreshToken
      }
    });
  } catch (error) {
    logger.logSecurityEvent('INVALID_FIREBASE_TOKEN', {
      error: error.message,
      ip: req.ip
    });
    return next(new AppError('Invalid Firebase token', 401));
  }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return next(new AppError('Refresh token is required', 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    // TODO: Verify user still exists and is active
    // const user = await User.findByPk(decoded.id);
    // if (!user || !user.isActive) {
    //   return next(new AppError('User not found or inactive', 401));
    // }

    // Generate new access token
    const newToken = generateToken({ 
      id: decoded.id, 
      email: decoded.email, 
      role: 'customer' // TODO: Get from database
    });

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    logger.logSecurityEvent('INVALID_REFRESH_TOKEN', {
      error: error.message,
      ip: req.ip
    });
    return next(new AppError('Invalid refresh token', 401));
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = catchAsync(async (req, res, next) => {
  // TODO: Add token to blacklist or remove from database
  
  logger.logUserAction(req.user?.id || 'unknown', 'LOGOUT', {
    ip: req.ip
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Apply rate limiting to auth routes
router.use(authLimiter);

// Routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/firebase', firebaseAuth);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;