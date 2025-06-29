// Notification system constants
const NOTIFICATION_CONSTANTS = {
  TYPES: {
    ORDER_UPDATE: 'order_update',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed',
    PROMOTION: 'promotion',
    WELCOME: 'welcome',
    REMINDER: 'reminder',
    SYSTEM: 'system',
    CHAT_MESSAGE: 'chat_message',
    LOYALTY_POINTS: 'loyalty_points',
    GIFT_CARD: 'gift_card',
    REVIEW_REQUEST: 'review_request',
    STOCK_ALERT: 'stock_alert',
    PRICE_DROP: 'price_drop'
  },
  
  CHANNELS: {
    PUSH: 'push',
    EMAIL: 'email',
    SMS: 'sms',
    WHATSAPP: 'whatsapp',
    IN_APP: 'in_app'
  },
  
  PRIORITY: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
  },
  
  STATUS: {
    PENDING: 'pending',
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
  }
};

const NOTIFICATION_TYPES = {
  ORDER_UPDATE: 'order_update',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  PROMOTION: 'promotion',
  WELCOME: 'welcome',
  REMINDER: 'reminder',
  SYSTEM: 'system',
  CHAT_MESSAGE: 'chat_message',
  LOYALTY_POINTS: 'loyalty_points',
  GIFT_CARD: 'gift_card',
  REVIEW_REQUEST: 'review_request',
  STOCK_ALERT: 'stock_alert',
  PRICE_DROP: 'price_drop'
};

const NOTIFICATION_CHANNELS = {
  PUSH: 'push',
  EMAIL: 'email',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  IN_APP: 'in_app'
};

// Notification templates
const NOTIFICATION_TEMPLATES = {
  ORDER_CONFIRMED: {
    title: 'Order Confirmed! 🎉',
    body: 'Your order #{orderId} has been confirmed. Total: {currency} {total}',
    channels: ['push', 'whatsapp', 'email'],
    priority: 'high'
  },
  
  ORDER_SHIPPED: {
    title: 'Order Shipped! 📦',
    body: 'Your order #{orderId} is on its way. Track: {trackingNumber}',
    channels: ['push', 'whatsapp', 'sms'],
    priority: 'high'
  },
  
  ORDER_DELIVERED: {
    title: 'Order Delivered! ✅',
    body: 'Your order #{orderId} has been delivered successfully.',
    channels: ['push', 'whatsapp'],
    priority: 'normal'
  },
  
  PAYMENT_SUCCESS: {
    title: 'Payment Successful! 💳',
    body: 'Payment of {currency} {amount} for order #{orderId} was successful.',
    channels: ['push', 'email'],
    priority: 'high'
  },
  
  PAYMENT_FAILED: {
    title: 'Payment Failed ❌',
    body: 'Payment for order #{orderId} failed. Please try again.',
    channels: ['push', 'email', 'whatsapp'],
    priority: 'urgent'
  },
  
  WELCOME: {
    title: 'Welcome to Adam Perfumes! 🌹',
    body: 'Discover our luxury fragrance collection and enjoy exclusive offers.',
    channels: ['push', 'email'],
    priority: 'normal'
  },
  
  PROMOTION: {
    title: 'Special Offer! 🎁',
    body: '{offerTitle} - {discount}% off. Valid until {validUntil}',
    channels: ['push', 'whatsapp', 'email'],
    priority: 'normal'
  },
  
  LOYALTY_POINTS_EARNED: {
    title: 'Points Earned! ⭐',
    body: 'You earned {points} points from your recent purchase. Total: {totalPoints}',
    channels: ['push', 'in_app'],
    priority: 'low'
  },
  
  ABANDONED_CART: {
    title: 'Don\'t forget your cart! 🛍️',
    body: 'Complete your purchase and get your favorite fragrances.',
    channels: ['push', 'email'],
    priority: 'low'
  },
  
  STOCK_ALERT: {
    title: 'Back in Stock! 📦',
    body: '{productName} is now available. Order before it\'s gone!',
    channels: ['push', 'email'],
    priority: 'normal'
  },
  
  PRICE_DROP: {
    title: 'Price Drop Alert! 💰',
    body: '{productName} is now {newPrice} (was {oldPrice}). Save {savings}!',
    channels: ['push', 'email'],
    priority: 'normal'
  },
  
  REVIEW_REQUEST: {
    title: 'How was your experience? ⭐',
    body: 'Please rate and review your recent purchase from Adam Perfumes.',
    channels: ['push', 'email'],
    priority: 'low'
  }
};

// Notification settings
const NOTIFICATION_SETTINGS = {
  DEFAULT_PREFERENCES: {
    push: true,
    email: true,
    sms: false,
    whatsapp: true,
    in_app: true
  },
  
  CATEGORY_PREFERENCES: {
    order_updates: {
      push: true,
      email: true,
      sms: true,
      whatsapp: true,
      in_app: true
    },
    promotions: {
      push: true,
      email: true,
      sms: false,
      whatsapp: true,
      in_app: true
    },
    system: {
      push: true,
      email: false,
      sms: false,
      whatsapp: false,
      in_app: true
    }
  },
  
  QUIET_HOURS: {
    enabled: true,
    start: '22:00',
    end: '08:00',
    timezone: 'Asia/Muscat'
  }
};

// Notification rate limits
const NOTIFICATION_LIMITS = {
  PUSH: {
    PER_MINUTE: 10,
    PER_HOUR: 100,
    PER_DAY: 500
  },
  EMAIL: {
    PER_MINUTE: 5,
    PER_HOUR: 50,
    PER_DAY: 200
  },
  SMS: {
    PER_MINUTE: 2,
    PER_HOUR: 20,
    PER_DAY: 50
  },
  WHATSAPP: {
    PER_MINUTE: 5,
    PER_HOUR: 100,
    PER_DAY: 1000
  }
};

module.exports = {
  NOTIFICATION_CONSTANTS,
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_TEMPLATES,
  NOTIFICATION_SETTINGS,
  NOTIFICATION_LIMITS
};