/**
 * @type {import('sequelize').ModelCtor<import('sequelize').Model<import('../../../shared/types/chat-message').ChatMessage, any>>}
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Unique conversation identifier'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Null for system/bot messages'
  },
  senderType: {
    type: DataTypes.ENUM('customer', 'admin', 'system', 'bot'),
    allowNull: false
  },
  senderName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file', 'audio', 'video', 'location', 'product'),
    defaultValue: 'text',
    allowNull: false
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of attachment URLs and metadata'
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional message metadata (product info, location, etc.)'
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
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  originalMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Original message before editing'
  },
  replyToId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'chat_messages',
      key: 'id'
    },
    comment: 'Message this is replying to'
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deletedBy: {
    type: DataTypes.UUID,
    allowNull: true
  },
  language: {
    type: DataTypes.STRING(2),
    defaultValue: 'en',
    allowNull: false
  },
  isAutoReply: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'True if this is an AI/ChatGPT auto-reply'
  },
  autoReplyContext: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Context used for auto-reply generation'
  }
}, {
  tableName: 'chat_messages',
  indexes: [
    {
      fields: ['conversationId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['senderType']
    },
    {
      fields: ['messageType']
    },
    {
      fields: ['isRead']
    },
    {
      fields: ['replyToId']
    },
    {
      fields: ['isDeleted']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Instance methods
ChatMessage.prototype.markAsRead = async function(readBy = null) {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
    
    // Log read event
    const logger = require('../utils/logger');
    logger.logUserAction(readBy || 'system', 'MESSAGE_READ', {
      messageId: this.id,
      conversationId: this.conversationId
    });
  }
  return this;
};

ChatMessage.prototype.edit = async function(newMessage, editedBy = null) {
  if (this.isDeleted) {
    throw new Error('Cannot edit deleted message');
  }
  
  this.originalMessage = this.message;
  this.message = newMessage;
  this.isEdited = true;
  this.editedAt = new Date();
  await this.save();
  
  // Log edit event
  const logger = require('../utils/logger');
  logger.logUserAction(editedBy || this.userId, 'MESSAGE_EDITED', {
    messageId: this.id,
    conversationId: this.conversationId
  });
  
  return this;
};

ChatMessage.prototype.delete = async function(deletedBy = null, soft = true) {
  if (soft) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    this.message = '[Message deleted]';
    await this.save();
  } else {
    await this.destroy();
  }
  
  // Log delete event
  const logger = require('../utils/logger');
  logger.logUserAction(deletedBy || this.userId, 'MESSAGE_DELETED', {
    messageId: this.id,
    conversationId: this.conversationId,
    softDelete: soft
  });
  
  return this;
};

ChatMessage.prototype.hasAttachments = function() {
  return this.attachments && this.attachments.length > 0;
};

ChatMessage.prototype.isFromCustomer = function() {
  return this.senderType === 'customer';
};

ChatMessage.prototype.isFromAdmin = function() {
  return this.senderType === 'admin';
};

ChatMessage.prototype.isSystemMessage = function() {
  return this.senderType === 'system';
};

ChatMessage.prototype.isBotMessage = function() {
  return this.senderType === 'bot' || this.isAutoReply;
};

// Class methods
ChatMessage.findByConversation = function(conversationId, options = {}) {
  const { limit = 50, offset = 0, includeDeleted = false } = options;
  
  const where = { conversationId };
  if (!includeDeleted) {
    where.isDeleted = false;
  }
  
  return this.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'ASC']],
    include: ['user', 'replyTo']
  });
};

ChatMessage.findUnreadByConversation = function(conversationId) {
  return this.findAll({
    where: {
      conversationId,
      isRead: false,
      isDeleted: false
    },
    order: [['createdAt', 'ASC']]
  });
};

ChatMessage.countUnreadByConversation = function(conversationId) {
  return this.count({
    where: {
      conversationId,
      isRead: false,
      isDeleted: false
    }
  });
};

ChatMessage.findByUser = function(userId, options = {}) {
  const { limit = 20, offset = 0 } = options;
  
  return this.findAndCountAll({
    where: {
      userId,
      isDeleted: false
    },
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
};

ChatMessage.createMessage = async function(data) {
  const {
    conversationId,
    userId,
    senderType,
    senderName,
    message,
    messageType = 'text',
    attachments = [],
    metadata = {},
    replyToId = null,
    language = 'en'
  } = data;
  
  const chatMessage = await this.create({
    conversationId,
    userId,
    senderType,
    senderName,
    message,
    messageType,
    attachments,
    metadata,
    replyToId,
    language
  });
  
  // Log message creation
  const logger = require('../utils/logger');
  logger.logUserAction(userId || 'system', 'MESSAGE_SENT', {
    messageId: chatMessage.id,
    conversationId,
    messageType,
    senderType
  });
  
  return chatMessage;
};

ChatMessage.createAutoReply = async function(conversationId, message, context = {}) {
  const chatMessage = await this.create({
    conversationId,
    userId: null,
    senderType: 'bot',
    senderName: 'Adam Perfumes Assistant',
    message,
    messageType: 'text',
    isAutoReply: true,
    autoReplyContext: context,
    language: context.language || 'en'
  });
  
  // Log auto-reply
  const logger = require('../utils/logger');
  logger.logUserAction('system', 'AUTO_REPLY_SENT', {
    messageId: chatMessage.id,
    conversationId,
    context
  });
  
  return chatMessage;
};

ChatMessage.markConversationAsRead = async function(conversationId, readBy = null) {
  await this.update(
    {
      isRead: true,
      readAt: new Date()
    },
    {
      where: {
        conversationId,
        isRead: false,
        isDeleted: false
      }
    }
  );
  
  // Log conversation read
  const logger = require('../utils/logger');
  logger.logUserAction(readBy || 'system', 'CONVERSATION_READ', {
    conversationId
  });
};

ChatMessage.getConversationStats = async function(conversationId) {
  const stats = await this.findAll({
    where: { conversationId, isDeleted: false },
    attributes: [
      'senderType',
      [sequelize.fn('COUNT', sequelize.col('id')), 'messageCount'],
      [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastMessageAt']
    ],
    group: ['senderType'],
    raw: true
  });
  
  const unreadCount = await this.countUnreadByConversation(conversationId);
  
  return {
    messageStats: stats,
    unreadCount
  };
};

ChatMessage.searchMessages = function(query, options = {}) {
  const { conversationId, userId, limit = 20, offset = 0 } = options;
  
  const where = {
    message: {
      [sequelize.Op.like]: `%${query}%`
    },
    isDeleted: false
  };
  
  if (conversationId) where.conversationId = conversationId;
  if (userId) where.userId = userId;
  
  return this.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: ['user']
  });
};

module.exports = ChatMessage;