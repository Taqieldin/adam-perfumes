/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/notification').Notification, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Null for broadcast notifications'
  },
  type: {
    type: DataTypes.ENUM(
      'order_update',
      'payment_success',
      'payment_failed',
      'promotion',
      'welcome',
      'reminder',
      'system',
      'chat_message',
      'low_stock',
      'new_product',
      'price_drop'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Notification title in multiple languages'
  },
  message: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Notification message in multiple languages'
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Optional notification image'
  },
  actionUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Deep link or URL to navigate when tapped'
  },
  actionData: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional data for the action'
  },
  channels: {
    type: DataTypes.JSON,
    defaultValue: ['push'],
    comment: 'Delivery channels: push, email, sms, whatsapp'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal',
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  scheduledFor: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When to send the notification (null = send immediately)'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    },
    comment: 'Related order for order notifications'
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'products',
      key: 'id'
    },
    comment: 'Related product for product notifications'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Admin who created the notification'
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional notification metadata'
  }
}, {
  tableName: 'notifications',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['isRead']
    },
    {
      fields: ['scheduledFor']
    },
    {
      fields: ['orderId']
    },
    {
      fields: ['productId']
    }
  ]
});

// Instance methods
Notification.prototype.getTitle = function(language = 'en') {
  return this.title[language] || this.title.en || '';
};

Notification.prototype.getMessage = function(language = 'en') {
  return this.message[language] || this.message.en || '';
};

Notification.prototype.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

Notification.prototype.markAsSent = async function() {
  this.status = 'sent';
  this.sentAt = new Date();
  await this.save();
  return this;
};

Notification.prototype.markAsDelivered = async function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  await this.save();
  return this;
};

Notification.prototype.markAsFailed = async function(reason) {
  this.status = 'failed';
  this.failureReason = reason;
  await this.save();
  return this;
};

// Class methods
Notification.findByUser = function(userId, options = {}) {
  const { limit = 20, offset = 0, unreadOnly = false } = options;
  const where = { userId };
  
  if (unreadOnly) {
    where.isRead = false;
  }
  
  return this.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
};

Notification.findUnreadByUser = function(userId) {
  return this.findAll({
    where: { 
      userId, 
      isRead: false 
    },
    order: [['createdAt', 'DESC']]
  });
};

Notification.countUnreadByUser = function(userId) {
  return this.count({
    where: { 
      userId, 
      isRead: false 
    }
  });
};

Notification.findPendingScheduled = function() {
  const now = new Date();
  return this.findAll({
    where: {
      status: 'pending',
      scheduledFor: {
        [sequelize.Op.lte]: now
      }
    },
    order: [['scheduledFor', 'ASC']]
  });
};

Notification.findByOrder = function(orderId) {
  return this.findAll({
    where: { orderId },
    order: [['createdAt', 'DESC']]
  });
};

Notification.findByProduct = function(productId) {
  return this.findAll({
    where: { productId },
    order: [['createdAt', 'DESC']]
  });
};

Notification.markAllAsReadForUser = async function(userId) {
  await this.update(
    { 
      isRead: true, 
      readAt: new Date() 
    },
    { 
      where: { 
        userId, 
        isRead: false 
      } 
    }
  );
};

module.exports = Notification;