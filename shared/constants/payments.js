// Payment system constants
const PAYMENT_CONSTANTS = {
  METHODS: {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    WALLET: 'wallet',
    CASH_ON_DELIVERY: 'cash_on_delivery',
    BANK_TRANSFER: 'bank_transfer',
    GIFT_CARD: 'gift_card',
    LOYALTY_POINTS: 'loyalty_points'
  },
  
  GATEWAYS: {
    TAP: 'tap',
    STRIPE: 'stripe',
    PAYPAL: 'paypal'
  },
  
  STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    PARTIALLY_REFUNDED: 'partially_refunded'
  },
  
  CARD_TYPES: {
    VISA: 'visa',
    MASTERCARD: 'mastercard',
    AMERICAN_EXPRESS: 'amex',
    DISCOVER: 'discover',
    MADA: 'mada'
  }
};

const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  WALLET: 'wallet',
  CASH_ON_DELIVERY: 'cash_on_delivery',
  BANK_TRANSFER: 'bank_transfer',
  GIFT_CARD: 'gift_card',
  LOYALTY_POINTS: 'loyalty_points'
};

const PAYMENT_GATEWAYS = {
  TAP: 'tap',
  STRIPE: 'stripe',
  PAYPAL: 'paypal'
};

// Payment gateway configurations
const GATEWAY_CONFIG = {
  TAP: {
    name: 'Tap Payments',
    supportedMethods: ['credit_card', 'debit_card', 'mada'],
    supportedCurrencies: ['OMR', 'AED', 'SAR', 'USD'],
    fees: {
      percentage: 2.9,
      fixed: 0.000 // No fixed fee
    },
    regions: ['OM', 'AE', 'SA'],
    isDefault: true
  },
  
  STRIPE: {
    name: 'Stripe',
    supportedMethods: ['credit_card', 'debit_card'],
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    fees: {
      percentage: 2.9,
      fixed: 0.300 // $0.30
    },
    regions: ['US', 'EU', 'GB'],
    isDefault: false
  },
  
  PAYPAL: {
    name: 'PayPal',
    supportedMethods: ['paypal_account'],
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    fees: {
      percentage: 3.4,
      fixed: 0.300
    },
    regions: ['GLOBAL'],
    isDefault: false
  }
};

// Payment validation rules
const PAYMENT_VALIDATION = {
  CARD_NUMBER: {
    MIN_LENGTH: 13,
    MAX_LENGTH: 19,
    LUHN_CHECK: true
  },
  
  CVV: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 4
  },
  
  EXPIRY: {
    FORMAT: 'MM/YY',
    MIN_YEAR: new Date().getFullYear(),
    MAX_YEAR: new Date().getFullYear() + 20
  },
  
  AMOUNT: {
    MIN_VALUE: 1.000, // 1 OMR
    MAX_VALUE: 1000.000, // 1000 OMR
    DECIMAL_PLACES: 3
  }
};

// Wallet configuration
const WALLET_CONFIG = {
  MIN_TOPUP: 5.000, // 5 OMR
  MAX_TOPUP: 500.000, // 500 OMR
  MAX_BALANCE: 1000.000, // 1000 OMR
  AUTO_TOPUP: {
    ENABLED: true,
    THRESHOLD: 10.000, // Auto top-up when balance < 10 OMR
    AMOUNT: 50.000 // Top-up amount
  },
  TRANSACTION_LIMITS: {
    DAILY: 200.000, // 200 OMR per day
    MONTHLY: 1000.000 // 1000 OMR per month
  }
};

// Gift card configuration
const GIFT_CARD_CONFIG = {
  DENOMINATIONS: [10, 25, 50, 100, 200], // OMR
  VALIDITY_PERIOD: 365, // days
  MIN_AMOUNT: 10.000,
  MAX_AMOUNT: 500.000,
  CODE_LENGTH: 12,
  CODE_FORMAT: 'AP-XXXX-XXXX-XXXX'
};

// Loyalty points configuration
const LOYALTY_CONFIG = {
  EARN_RATE: 1, // 1 point per 1 OMR spent
  REDEEM_RATE: 0.010, // 1 point = 0.01 OMR
  MIN_REDEEM: 100, // Minimum 100 points to redeem
  MAX_REDEEM_PERCENTAGE: 50, // Max 50% of order value can be paid with points
  EXPIRY_PERIOD: 365, // Points expire after 1 year
  BONUS_MULTIPLIERS: {
    BIRTHDAY: 2, // 2x points on birthday
    FIRST_ORDER: 3, // 3x points on first order
    REFERRAL: 5 // 5x points for successful referral
  }
};

// Payment error codes
const PAYMENT_ERRORS = {
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  CARD_DECLINED: 'card_declined',
  EXPIRED_CARD: 'expired_card',
  INVALID_CARD: 'invalid_card',
  PROCESSING_ERROR: 'processing_error',
  GATEWAY_ERROR: 'gateway_error',
  NETWORK_ERROR: 'network_error',
  FRAUD_DETECTED: 'fraud_detected',
  LIMIT_EXCEEDED: 'limit_exceeded',
  INVALID_AMOUNT: 'invalid_amount'
};

// Refund policies
const REFUND_POLICY = {
  FULL_REFUND_PERIOD: 7, // days
  PARTIAL_REFUND_PERIOD: 14, // days
  NO_REFUND_ITEMS: ['samples', 'gift_cards'],
  PROCESSING_TIME: {
    CREDIT_CARD: '5-7 business days',
    WALLET: 'Instant',
    BANK_TRANSFER: '3-5 business days'
  },
  FEES: {
    PROCESSING_FEE: 1.000, // 1 OMR processing fee
    RESTOCKING_FEE: 0.05 // 5% restocking fee for opened items
  }
};

module.exports = {
  PAYMENT_CONSTANTS,
  PAYMENT_METHODS,
  PAYMENT_GATEWAYS,
  GATEWAY_CONFIG,
  PAYMENT_VALIDATION,
  WALLET_CONFIG,
  GIFT_CARD_CONFIG,
  LOYALTY_CONFIG,
  PAYMENT_ERRORS,
  REFUND_POLICY
};