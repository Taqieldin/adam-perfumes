const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Human-readable order number (e.g., AP-2024-000001)'
  },
  // Customer information
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Guest order support
  guestEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Email for guest orders'
  },
  guestPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Phone for guest orders'
  },
  // Order status
  status: {
    type: DataTypes.ENUM(
      'pending',           // Order created, awaiting payment
      'confirmed',         // Payment confirmed, processing
      'processing',        // Order being prepared
      'shipped',          // Order shipped
      'out_for_delivery', // Out for delivery
      'delivered',        // Successfully delivered
      'cancelled',        // Order cancelled
      'refunded',         // Order refunded
      'returned',         // Order returned
      'failed'            // Payment or processing failed
    ),
    defaultValue: 'pending',
    allowNull: false
  },
  // Payment information
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('card', 'wallet', 'cod', 'bank_transfer', 'gift_card'),
    allowNull: true
  },
  paymentGateway: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Payment gateway used (stripe, tap, etc.)'
  },
  paymentTransactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Transaction ID from payment gateway'
  },
  // Pricing
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Sum of all item prices before discounts'
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Total tax amount'
  },
  shippingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Shipping cost'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Total discount applied'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Final amount to be paid'
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Amount actually paid'
  },
  // Currency
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'OMR',
    comment: 'Currency code (OMR, USD, etc.)'
  },
  // Coupon and discounts
  couponId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'coupons',
      key: 'id'
    }
  },
  couponCode: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  couponDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  // Loyalty points
  pointsEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Loyalty points earned from this order'
  },
  pointsUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Loyalty points used for discount'
  },
  pointsValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Monetary value of points used'
  },
  // Wallet usage
  walletAmountUsed: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: 'Amount paid from wallet'
  },
  // Addresses
  shippingAddressId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'addresses',
      key: 'id'
    }
  },
  billingAddressId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'addresses',
      key: 'id'
    }
  },
  // Shipping information
  shippingMethod: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  shippingCarrier: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estimatedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Branch information (for pickup orders)
  branchId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'branches',
      key: 'id'
    },
    comment: 'Branch for pickup orders'
  },
  isPickup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Order notes
  customerNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notes from customer'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes for admin'
  },
  // Timestamps for status tracking
  confirmedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Cancellation/Return information
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Gift order
  isGift: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  giftMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  giftWrapCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  // Recurring order
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurringInterval: {
    type: DataTypes.ENUM('weekly', 'monthly', 'quarterly', 'yearly'),
    allowNull: true
  },
  nextRecurringDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Source tracking
  source: {
    type: DataTypes.ENUM('web', 'mobile_app', 'admin', 'api'),
    defaultValue: 'web'
  },
  deviceInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Device information for analytics'
  },
  // Soft delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['orderNumber']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentStatus']
    },
    {
      fields: ['paymentMethod']
    },
    {
      fields: ['branchId']
    },
    {
      fields: ['trackingNumber']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['confirmedAt']
    },
    {
      fields: ['shippedAt']
    },
    {
      fields: ['deliveredAt']
    }
  ],
  hooks: {
    beforeCreate: async (order) => {
      // Generate order number if not provided
      if (!order.orderNumber) {
        order.orderNumber = await generateOrderNumber();
      }
    },
    afterUpdate: async (order) => {
      // Update timestamps based on status changes
      if (order.changed('status')) {
        const now = new Date();
        switch (order.status) {
          case 'confirmed':
            if (!order.confirmedAt) order.confirmedAt = now;
            break;
          case 'shipped':
            if (!order.shippedAt) order.shippedAt = now;
            break;
          case 'delivered':
            if (!order.deliveredAt) order.deliveredAt = now;
            break;
          case 'cancelled':
            if (!order.cancelledAt) order.cancelledAt = now;
            break;
        }
        await order.save();
      }
    }
  }
});

// Instance methods
Order.prototype.canBeCancelled = function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
};

Order.prototype.canBeRefunded = function() {
  return ['delivered', 'cancelled'].includes(this.status) && this.paymentStatus === 'paid';
};

Order.prototype.isCompleted = function() {
  return this.status === 'delivered';
};

Order.prototype.isPaid = function() {
  return this.paymentStatus === 'paid';
};

Order.prototype.getRemainingAmount = function() {
  return Math.max(0, this.totalAmount - this.paidAmount);
};

Order.prototype.getStatusHistory = async function() {
  // This would typically come from an order_status_history table
  // For now, we'll return basic status info
  const history = [];
  
  if (this.createdAt) {
    history.push({
      status: 'pending',
      timestamp: this.createdAt,
      note: 'Order created'
    });
  }
  
  if (this.confirmedAt) {
    history.push({
      status: 'confirmed',
      timestamp: this.confirmedAt,
      note: 'Order confirmed'
    });
  }
  
  if (this.shippedAt) {
    history.push({
      status: 'shipped',
      timestamp: this.shippedAt,
      note: 'Order shipped'
    });
  }
  
  if (this.deliveredAt) {
    history.push({
      status: 'delivered',
      timestamp: this.deliveredAt,
      note: 'Order delivered'
    });
  }
  
  if (this.cancelledAt) {
    history.push({
      status: 'cancelled',
      timestamp: this.cancelledAt,
      note: 'Order cancelled'
    });
  }
  
  return history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

Order.prototype.calculateTotals = function() {
  // This would typically be called when order items change
  // The actual calculation would involve summing order items
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingAmount - this.discountAmount - this.pointsValue - this.walletAmountUsed;
  return this.totalAmount;
};

Order.prototype.addStatusNote = function(note) {
  // This would typically add to an order_notes table
  const notes = this.adminNotes ? `${this.adminNotes}\n${new Date().toISOString()}: ${note}` : note;
  this.adminNotes = notes;
};

// Class methods
Order.findByOrderNumber = function(orderNumber) {
  return this.findOne({ where: { orderNumber } });
};

Order.findByTrackingNumber = function(trackingNumber) {
  return this.findOne({ where: { trackingNumber } });
};

Order.findByUser = function(userId, options = {}) {
  return this.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    ...options
  });
};

Order.findByStatus = function(status, options = {}) {
  return this.findAll({
    where: { status },
    order: [['createdAt', 'DESC']],
    ...options
  });
};

Order.findPendingOrders = function(options = {}) {
  return this.findAll({
    where: { 
      status: ['pending', 'confirmed', 'processing'],
      paymentStatus: 'paid'
    },
    order: [['createdAt', 'ASC']],
    ...options
  });
};

Order.getRevenueStats = async function(startDate, endDate) {
  const { Op, fn, col } = require('sequelize');
  
  return this.findAll({
    where: {
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    },
    attributes: [
      [fn('COUNT', col('id')), 'orderCount'],
      [fn('SUM', col('totalAmount')), 'totalRevenue'],
      [fn('AVG', col('totalAmount')), 'averageOrderValue']
    ],
    raw: true
  });
};

// Helper function to generate order number
async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const prefix = `AP-${year}-`;
  
  // Find the last order number for this year
  const lastOrder = await Order.findOne({
    where: {
      orderNumber: {
        [require('sequelize').Op.like]: `${prefix}%`
      }
    },
    order: [['orderNumber', 'DESC']]
  });
  
  let nextNumber = 1;
  if (lastOrder) {
    const lastNumber = parseInt(lastOrder.orderNumber.split('-').pop());
    nextNumber = lastNumber + 1;
  }
  
  return `${prefix}${nextNumber.toString().padStart(6, '0')}`;
}

module.exports = Order;