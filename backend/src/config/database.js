const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'adam_perfumes',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  timezone: '+04:00' // Oman timezone (GST)
};

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Test database connection
async function connectDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully');
    
    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('📊 Database models synchronized');
    }
    
    return sequelize;
  } catch (error) {
    logger.error('❌ Unable to connect to database:', error);
    throw error;
  }
}

// Close database connection
async function closeDatabase() {
  try {
    await sequelize.close();
    logger.info('🔒 Database connection closed');
  } catch (error) {
    logger.error('❌ Error closing database connection:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  connectDatabase,
  closeDatabase,
  Sequelize
};