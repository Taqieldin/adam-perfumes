// System-wide constants
const SYSTEM_CONSTANTS = {
  APP_NAME: 'Adam Perfumes',
  APP_VERSION: '1.0.0',
  API_VERSION: 'v1',
  
  ENVIRONMENTS: {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production'
  },
  
  LANGUAGES: {
    ENGLISH: 'en',
    ARABIC: 'ar'
  },
  
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  },
  
  PLATFORMS: {
    WEB: 'web',
    MOBILE: 'mobile',
    ADMIN: 'admin'
  }
};

// API endpoints
const API_ENDPOINTS = {
  BASE_URL: process.env.API_BASE_URL || 'https://api.adamperfumes.com',
  
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    FIREBASE_AUTH: '/auth/firebase'
  },
  
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    ADDRESSES: '/users/addresses',
    ORDERS: '/users/orders',
    WISHLIST: '/users/wishlist',
    LOYALTY_POINTS: '/users/loyalty-points',
    PREFERENCES: '/users/preferences'
  },
  
  PRODUCTS: {
    LIST: '/products',
    DETAILS: '/products/:id',
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
    REVIEWS: '/products/:id/reviews',
    RECOMMENDATIONS: '/products/recommendations'
  },
  
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: '/cart/items/:id',
    REMOVE_ITEM: '/cart/items/:id',
    CLEAR: '/cart/clear',
    APPLY_COUPON: '/cart/coupon'
  },
  
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAILS: '/orders/:id',
    CANCEL: '/orders/:id/cancel',
    TRACK: '/orders/:id/track'
  },
  
  PAYMENTS: {
    PROCESS: '/payments/process',
    WEBHOOK: '/payments/webhook',
    REFUND: '/payments/refund',
    METHODS: '/payments/methods'
  },
  
  WALLET: {
    BALANCE: '/wallet/balance',
    TOPUP: '/wallet/topup',
    TRANSACTIONS: '/wallet/transactions',
    TRANSFER: '/wallet/transfer'
  },
  
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    PREFERENCES: '/notifications/preferences',
    SUBSCRIBE: '/notifications/subscribe'
  },
  
  CHAT: {
    MESSAGES: '/chat/messages',
    SEND: '/chat/send',
    HISTORY: '/chat/history'
  },
  
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings'
  }
};

// Error codes
const ERROR_CODES = {
  // General errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  
  // Product errors
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  PRODUCT_OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK',
  INVALID_PRODUCT_DATA: 'INVALID_PRODUCT_DATA',
  
  // Order errors
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  INVALID_ORDER_STATUS: 'INVALID_ORDER_STATUS',
  ORDER_CANNOT_BE_CANCELLED: 'ORDER_CANNOT_BE_CANCELLED',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  
  // Payment errors
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INVALID_PAYMENT_METHOD: 'INVALID_PAYMENT_METHOD',
  PAYMENT_GATEWAY_ERROR: 'PAYMENT_GATEWAY_ERROR',
  
  // Cart errors
  CART_EMPTY: 'CART_EMPTY',
  INVALID_CART_ITEM: 'INVALID_CART_ITEM',
  CART_ITEM_NOT_FOUND: 'CART_ITEM_NOT_FOUND',
  
  // Coupon errors
  COUPON_NOT_FOUND: 'COUPON_NOT_FOUND',
  COUPON_EXPIRED: 'COUPON_EXPIRED',
  COUPON_NOT_APPLICABLE: 'COUPON_NOT_APPLICABLE',
  COUPON_USAGE_LIMIT_EXCEEDED: 'COUPON_USAGE_LIMIT_EXCEEDED'
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1
};

// File upload limits
const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    DOCUMENTS: ['pdf', 'doc', 'docx'],
    VIDEOS: ['mp4', 'mov', 'avi']
  },
  MAX_FILES: 10
};

// Cache settings
const CACHE_SETTINGS = {
  DEFAULT_TTL: 3600, // 1 hour
  SHORT_TTL: 300, // 5 minutes
  LONG_TTL: 86400, // 24 hours
  KEYS: {
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    USER_PROFILE: 'user_profile',
    CART: 'cart',
    SETTINGS: 'settings'
  }
};

// Rate limiting
const RATE_LIMITS = {
  GENERAL: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 1000
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 5
  },
  API: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 100
  }
};

// Security settings
const SECURITY = {
  BCRYPT_ROUNDS: 12,
  JWT_ALGORITHM: 'HS256',
  CORS_ORIGINS: [
    'https://adamperfumes.com',
    'https://www.adamperfumes.com',
    'https://admin.adamperfumes.com'
  ],
  HELMET_CONFIG: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.adamperfumes.com"]
      }
    }
  }
};

module.exports = {
  SYSTEM_CONSTANTS,
  API_ENDPOINTS,
  ERROR_CODES,
  HTTP_STATUS,
  PAGINATION,
  FILE_UPLOAD,
  CACHE_SETTINGS,
  RATE_LIMITS,
  SECURITY
};