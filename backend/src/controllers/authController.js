const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { verifyIdToken } = require('../config/firebase');
const logger = require('../utils/logger');
const { AppError, catchAsync } = require('../middlewares/errorHandler');

// Import shared utilities
const { generateId } = require('../../../shared/utils/helpers');
const { AUTH_CONSTANTS } = require('../../../shared/constants/auth');

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

// Helper function to create user response
const createUserResponse = (user) => {
  const userObj = user.toJSON ? user.toJSON() : user;
  delete userObj.password;
  delete userObj.refreshToken;
  return userObj;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName, phone, language = 'en' } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const userData = {
    id: generateId(),
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phone,
    language,
    isActive: true,
    emailVerified: false,
    role: 'customer',
    walletBalance: 0.000,
    loyaltyPoints: 0
  };

  const user = await User.create(userData);

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

  // Save refresh token to database
  await user.update({ refreshToken });

  // Log user registration
  logger.logUserAction(user.id, 'REGISTER', {
    email: user.email,
    language: user.language,
    ip: req.ip
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: createUserResponse(user),
      token,
      refreshToken
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findOne({ 
    where: { email },
    attributes: { include: ['password'] }
  });

  if (!user) {
    logger.logSecurityEvent('INVALID_LOGIN_ATTEMPT', {
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      reason: 'user_not_found'
    });
    return next(new AppError('Invalid email or password', 401));
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    logger.logSecurityEvent('INVALID_LOGIN_ATTEMPT', {
      email,
      userId: user.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      reason: 'invalid_password'
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

  // Save refresh token and update last login
  await user.update({ 
    refreshToken,
    lastLoginAt: new Date(),
    lastLoginIp: req.ip
  });

  // Log successful login
  logger.logUserAction(user.id, 'LOGIN', {
    email: user.email,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: createUserResponse(user),
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
    
    // Find or create user
    let user = await User.findOne({ where: { firebaseUid: decodedToken.uid } });
    
    if (!user) {
      // Create new user from Firebase data
      const userData = {
        id: generateId(),
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        firstName: decodedToken.name?.split(' ')[0] || 'User',
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
        emailVerified: decodedToken.email_verified,
        profilePicture: decodedToken.picture,
        role: 'customer',
        isActive: true,
        language: 'en',
        walletBalance: 0.000,
        loyaltyPoints: 0
      };

      user = await User.create(userData);
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

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

    // Update user with refresh token and login info
    await user.update({
      refreshToken,
      lastLoginAt: new Date(),
      lastLoginIp: req.ip
    });

    // Log Firebase authentication
    logger.logUserAction(user.id, 'FIREBASE_AUTH', {
      email: user.email,
      provider: decodedToken.firebase.sign_in_provider,
      ip: req.ip
    });

    res.status(200).json({
      status: 'success',
      message: 'Firebase authentication successful',
      data: {
        user: createUserResponse(user),
        token,
        refreshToken
      }
    });
  } catch (error) {
    logger.logSecurityEvent('INVALID_FIREBASE_TOKEN', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
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
    
    // Verify user still exists and token matches
    const user = await User.findOne({
      where: { 
        id: decoded.id,
        refreshToken: token
      }
    });

    if (!user || !user.isActive) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Generate new access token
    const newToken = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    // Log token refresh
    logger.logUserAction(user.id, 'TOKEN_REFRESH', {
      ip: req.ip
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
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    return next(new AppError('Invalid refresh token', 401));
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = catchAsync(async (req, res, next) => {
  // Clear refresh token from database
  if (req.user) {
    await req.user.update({ refreshToken: null });
    
    logger.logUserAction(req.user.id, 'LOGOUT', {
      ip: req.ip
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    // Don't reveal if email exists or not
    return res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Save reset token to database
  await user.update({
    passwordResetToken: resetToken,
    passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  });

  // TODO: Send email with reset link
  // await emailService.sendPasswordResetEmail(user.email, resetToken);

  logger.logUserAction(user.id, 'PASSWORD_RESET_REQUEST', {
    email: user.email,
    ip: req.ip
  });

  res.status(200).json({
    status: 'success',
    message: 'Password reset link has been sent to your email'
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return next(new AppError('Token and new password are required', 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne({
      where: {
        id: decoded.id,
        passwordResetToken: token,
        passwordResetExpires: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return next(new AppError('Invalid or expired reset token', 400));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset token
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshToken: null // Invalidate all sessions
    });

    logger.logUserAction(user.id, 'PASSWORD_RESET', {
      ip: req.ip
    });

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    return next(new AppError('Invalid or expired reset token', 400));
  }
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Current password and new password are required', 400));
  }

  // Get user with password
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: { include: ['password'] }
  });

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    return next(new AppError('Current password is incorrect', 400));
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await user.update({
    password: hashedPassword,
    refreshToken: null // Invalidate all sessions
  });

  logger.logUserAction(user.id, 'PASSWORD_CHANGE', {
    ip: req.ip
  });

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully'
  });
});

module.exports = {
  register,
  login,
  firebaseAuth,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
};