const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  const message = `🔍 Route not found: ${req.method} ${req.originalUrl}`;
  
  // Log the 404 attempt
  logger.warn(message, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Send 404 response
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments',
      admin: '/api/admin',
      chat: '/api/chat',
      notifications: '/api/notifications',
      analytics: '/api/analytics'
    }
  });
};

module.exports = notFound;