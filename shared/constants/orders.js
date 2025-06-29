// Order management constants
const ORDER_CONSTANTS = {
  STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    PACKED: 'packed',
    SHIPPED: 'shipped',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned',
    REFUNDED: 'refunded',
    FAILED: 'failed'
  },
  
  TYPES: {
    REGULAR: 'regular',
    EXPRESS: 'express',
    SAME_DAY: 'same_day',
    PICKUP: 'pickup'
  },
  
  PRIORITY: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
  },
  
  SOURCES: {
    WEB: 'web',
    MOBILE_APP: 'mobile_app',
    ADMIN_PANEL: 'admin_panel',
    PHONE: 'phone',
    WHATSAPP: 'whatsapp'
  }
};

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUNDED: 'refunded',
  FAILED: 'failed'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
};

const SHIPPING_STATUS = {
  NOT_SHIPPED: 'not_shipped',
  PREPARING: 'preparing',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  DELIVERY_FAILED: 'delivery_failed',
  RETURNED: 'returned'
};

// Order validation rules
const ORDER_VALIDATION = {
  MIN_ORDER_VALUE: 5.000, // 5 OMR
  MAX_ORDER_VALUE: 1000.000, // 1000 OMR
  MAX_ITEMS_PER_ORDER: 50,
  MAX_QUANTITY_PER_ITEM: 10,
  DELIVERY_ZONES: {
    MUSCAT: { name: 'Muscat', fee: 2.000, estimatedDays: 1 },
    SALALAH: { name: 'Salalah', fee: 5.000, estimatedDays: 2 },
    NIZWA: { name: 'Nizwa', fee: 3.000, estimatedDays: 2 },
    SOHAR: { name: 'Sohar', fee: 4.000, estimatedDays: 2 },
    SUR: { name: 'Sur', fee: 4.000, estimatedDays: 2 },
    OTHER: { name: 'Other Areas', fee: 6.000, estimatedDays: 3 }
  }
};

// Order status flow
const ORDER_STATUS_FLOW = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.PACKED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PACKED]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.RETURNED],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.RETURNED],
  [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.RETURNED],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.RETURNED]: [ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.REFUNDED]: [],
  [ORDER_STATUS.FAILED]: []
};

// Order notifications
const ORDER_NOTIFICATIONS = {
  [ORDER_STATUS.CONFIRMED]: {
    title: 'Order Confirmed! 🎉',
    message: 'Your order has been confirmed and is being prepared.',
    channels: ['push', 'whatsapp', 'email']
  },
  [ORDER_STATUS.SHIPPED]: {
    title: 'Order Shipped! 📦',
    message: 'Your order is on its way to you.',
    channels: ['push', 'whatsapp', 'sms']
  },
  [ORDER_STATUS.DELIVERED]: {
    title: 'Order Delivered! ✅',
    message: 'Your order has been delivered successfully.',
    channels: ['push', 'whatsapp']
  },
  [ORDER_STATUS.CANCELLED]: {
    title: 'Order Cancelled ❌',
    message: 'Your order has been cancelled.',
    channels: ['push', 'whatsapp', 'email']
  }
};

module.exports = {
  ORDER_CONSTANTS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  SHIPPING_STATUS,
  ORDER_VALIDATION,
  ORDER_STATUS_FLOW,
  ORDER_NOTIFICATIONS
};