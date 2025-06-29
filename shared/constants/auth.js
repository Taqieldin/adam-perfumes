// Authentication constants
const AUTH_CONSTANTS = {
  ROLES: {
    CUSTOMER: 'customer',
    BRANCH_MANAGER: 'branch_manager',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
  },
  
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET: 'reset',
    VERIFICATION: 'verification'
  },
  
  LOGIN_PROVIDERS: {
    EMAIL: 'email',
    GOOGLE: 'google',
    APPLE: 'apple',
    FACEBOOK: 'facebook',
    FIREBASE: 'firebase'
  },
  
  PASSWORD_REQUIREMENTS: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    SPECIAL_CHARS: '@$!%*?&'
  },
  
  TOKEN_EXPIRY: {
    ACCESS_TOKEN: '7d',
    REFRESH_TOKEN: '30d',
    RESET_TOKEN: '1h',
    VERIFICATION_TOKEN: '24h'
  },
  
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: 5,
    REGISTRATION_ATTEMPTS: 3,
    PASSWORD_RESET_ATTEMPTS: 3,
    WINDOW_MS: 15 * 60 * 1000 // 15 minutes
  },
  
  SESSION_CONFIG: {
    SECURE: process.env.NODE_ENV === 'production',
    HTTP_ONLY: true,
    SAME_SITE: 'strict',
    MAX_AGE: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};

// User status constants
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_VERIFICATION: 'pending_verification',
  BANNED: 'banned'
};

// Authentication error messages
const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_DISABLED: 'Your account has been disabled',
  ACCOUNT_SUSPENDED: 'Your account has been suspended',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PHONE_ALREADY_EXISTS: 'Phone number already exists',
  WEAK_PASSWORD: 'Password does not meet security requirements',
  RATE_LIMIT_EXCEEDED: 'Too many attempts, please try again later'
};

// Success messages
const AUTH_SUCCESS = {
  REGISTRATION_SUCCESS: 'Account created successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};

module.exports = {
  AUTH_CONSTANTS,
  USER_STATUS,
  AUTH_ERRORS,
  AUTH_SUCCESS
};