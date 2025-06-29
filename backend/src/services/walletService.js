const { sequelize } = require('../config/database');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class WalletService {
  /**
   * Get user wallet balance
   */
  async getWalletBalance(userId) {
    try {
      // TODO: Replace with actual User model
      const user = await sequelize.query(
        'SELECT wallet_balance FROM users WHERE id = ?',
        {
          replacements: [userId],
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (!user.length) {
        throw new AppError('User not found', 404);
      }

      return {
        balance: parseFloat(user[0].wallet_balance || 0),
        currency: 'OMR'
      };
    } catch (error) {
      logger.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  /**
   * Get wallet transaction history
   */
  async getTransactionHistory(userId, options = {}) {
    try {
      const { page = 1, limit = 20, type = null, startDate = null, endDate = null } = options;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE user_id = ?';
      const replacements = [userId];

      if (type) {
        whereClause += ' AND transaction_type = ?';
        replacements.push(type);
      }

      if (startDate) {
        whereClause += ' AND created_at >= ?';
        replacements.push(startDate);
      }

      if (endDate) {
        whereClause += ' AND created_at <= ?';
        replacements.push(endDate);
      }

      const transactions = await sequelize.query(
        `SELECT * FROM wallet_transactions 
         ${whereClause} 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        {
          replacements: [...replacements, limit, offset],
          type: sequelize.QueryTypes.SELECT
        }
      );

      const totalCount = await sequelize.query(
        `SELECT COUNT(*) as count FROM wallet_transactions ${whereClause}`,
        {
          replacements: replacements,
          type: sequelize.QueryTypes.SELECT
        }
      );

      return {
        transactions,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          pages: Math.ceil(totalCount[0].count / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting transaction history:', error);
      throw error;
    }
  }

  /**
   * Add money to wallet (Top-up)
   */
  async topUpWallet(userId, amount, paymentMethod, paymentReference = null) {
    const transaction = await sequelize.transaction();

    try {
      // Get current balance
      const currentBalance = await this.getWalletBalance(userId);

      // Create wallet transaction record
      const walletTransaction = await sequelize.query(
        `INSERT INTO wallet_transactions 
         (id, user_id, transaction_type, amount, description, reference_type, 
          payment_method, payment_reference, status, balance_before, balance_after, created_at, updated_at)
         VALUES (UUID(), ?, 'credit', ?, ?, 'top_up', ?, ?, 'completed', ?, ?, NOW(), NOW())`,
        {
          replacements: [
            userId,
            amount,
            `Wallet top-up via ${paymentMethod}`,
            paymentMethod,
            paymentReference,
            currentBalance.balance,
            currentBalance.balance + amount
          ],
          transaction
        }
      );

      // Update user wallet balance
      await sequelize.query(
        'UPDATE users SET wallet_balance = wallet_balance + ?, updated_at = NOW() WHERE id = ?',
        {
          replacements: [amount, userId],
          transaction
        }
      );

      await transaction.commit();

      logger.logUserAction(userId, 'WALLET_TOP_UP', {
        amount,
        paymentMethod,
        newBalance: currentBalance.balance + amount
      });

      return {
        success: true,
        newBalance: currentBalance.balance + amount,
        transactionId: walletTransaction[0]?.insertId
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error topping up wallet:', error);
      throw error;
    }
  }

  /**
   * Deduct money from wallet (Purchase)
   */
  async deductFromWallet(userId, amount, description, referenceId = null, referenceType = 'purchase') {
    const transaction = await sequelize.transaction();

    try {
      // Get current balance
      const currentBalance = await this.getWalletBalance(userId);

      // Check if sufficient balance
      if (currentBalance.balance < amount) {
        throw new AppError('Insufficient wallet balance', 400);
      }

      // Create wallet transaction record
      await sequelize.query(
        `INSERT INTO wallet_transactions 
         (id, user_id, transaction_type, amount, description, reference_type, 
          reference_id, status, balance_before, balance_after, created_at, updated_at)
         VALUES (UUID(), ?, 'debit', ?, ?, ?, ?, 'completed', ?, ?, NOW(), NOW())`,
        {
          replacements: [
            userId,
            amount,
            description,
            referenceType,
            referenceId,
            currentBalance.balance,
            currentBalance.balance - amount
          ],
          transaction
        }
      );

      // Update user wallet balance
      await sequelize.query(
        'UPDATE users SET wallet_balance = wallet_balance - ?, updated_at = NOW() WHERE id = ?',
        {
          replacements: [amount, userId],
          transaction
        }
      );

      await transaction.commit();

      logger.logUserAction(userId, 'WALLET_DEDUCTION', {
        amount,
        description,
        newBalance: currentBalance.balance - amount
      });

      return {
        success: true,
        newBalance: currentBalance.balance - amount,
        deductedAmount: amount
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deducting from wallet:', error);
      throw error;
    }
  }

  /**
   * Process wallet refund
   */
  async refundToWallet(userId, amount, description, referenceId = null) {
    const transaction = await sequelize.transaction();

    try {
      // Get current balance
      const currentBalance = await this.getWalletBalance(userId);

      // Create wallet transaction record
      await sequelize.query(
        `INSERT INTO wallet_transactions 
         (id, user_id, transaction_type, amount, description, reference_type, 
          reference_id, status, balance_before, balance_after, created_at, updated_at)
         VALUES (UUID(), ?, 'credit', ?, ?, 'refund', ?, 'completed', ?, ?, NOW(), NOW())`,
        {
          replacements: [
            userId,
            amount,
            description,
            referenceId,
            currentBalance.balance,
            currentBalance.balance + amount
          ],
          transaction
        }
      );

      // Update user wallet balance
      await sequelize.query(
        'UPDATE users SET wallet_balance = wallet_balance + ?, updated_at = NOW() WHERE id = ?',
        {
          replacements: [amount, userId],
          transaction
        }
      );

      await transaction.commit();

      logger.logUserAction(userId, 'WALLET_REFUND', {
        amount,
        description,
        newBalance: currentBalance.balance + amount
      });

      return {
        success: true,
        newBalance: currentBalance.balance + amount,
        refundAmount: amount
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error processing wallet refund:', error);
      throw error;
    }
  }

  /**
   * Transfer money between wallets (for gift cards, etc.)
   */
  async transferBetweenWallets(fromUserId, toUserId, amount, description) {
    const transaction = await sequelize.transaction();

    try {
      // Deduct from sender
      await this.deductFromWallet(fromUserId, amount, `Transfer: ${description}`, toUserId, 'transfer');

      // Add to receiver
      await this.topUpWallet(toUserId, amount, 'transfer', `From user ${fromUserId}`);

      await transaction.commit();

      logger.logUserAction(fromUserId, 'WALLET_TRANSFER_SENT', {
        amount,
        toUserId,
        description
      });

      logger.logUserAction(toUserId, 'WALLET_TRANSFER_RECEIVED', {
        amount,
        fromUserId,
        description
      });

      return {
        success: true,
        transferAmount: amount
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error transferring between wallets:', error);
      throw error;
    }
  }

  /**
   * Get wallet settings for user
   */
  async getWalletSettings(userId) {
    try {
      const settings = await sequelize.query(
        'SELECT * FROM wallet_settings WHERE user_id = ?',
        {
          replacements: [userId],
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (!settings.length) {
        // Create default settings
        await sequelize.query(
          `INSERT INTO wallet_settings 
           (id, user_id, created_at, updated_at) 
           VALUES (UUID(), ?, NOW(), NOW())`,
          {
            replacements: [userId]
          }
        );

        return {
          auto_top_up_enabled: false,
          auto_top_up_threshold: 10.00,
          auto_top_up_amount: 50.00,
          preferred_payment_method: null,
          daily_spending_limit: null,
          monthly_spending_limit: null,
          notifications_enabled: true,
          low_balance_alert: true,
          low_balance_threshold: 5.00
        };
      }

      return settings[0];
    } catch (error) {
      logger.error('Error getting wallet settings:', error);
      throw error;
    }
  }

  /**
   * Update wallet settings
   */
  async updateWalletSettings(userId, settings) {
    try {
      const allowedFields = [
        'auto_top_up_enabled',
        'auto_top_up_threshold',
        'auto_top_up_amount',
        'preferred_payment_method',
        'daily_spending_limit',
        'monthly_spending_limit',
        'notifications_enabled',
        'low_balance_alert',
        'low_balance_threshold'
      ];

      const updateFields = [];
      const values = [];

      Object.keys(settings).forEach(key => {
        if (allowedFields.includes(key)) {
          updateFields.push(`${key} = ?`);
          values.push(settings[key]);
        }
      });

      if (updateFields.length === 0) {
        throw new AppError('No valid fields to update', 400);
      }

      values.push(userId);

      await sequelize.query(
        `UPDATE wallet_settings SET ${updateFields.join(', ')}, updated_at = NOW() WHERE user_id = ?`,
        {
          replacements: values
        }
      );

      logger.logUserAction(userId, 'WALLET_SETTINGS_UPDATED', settings);

      return { success: true };
    } catch (error) {
      logger.error('Error updating wallet settings:', error);
      throw error;
    }
  }

  /**
   * Check if auto top-up should be triggered
   */
  async checkAutoTopUp(userId) {
    try {
      const balance = await this.getWalletBalance(userId);
      const settings = await this.getWalletSettings(userId);

      if (settings.auto_top_up_enabled && 
          balance.balance <= settings.auto_top_up_threshold &&
          settings.preferred_payment_method) {
        
        // Trigger auto top-up
        return {
          shouldTopUp: true,
          amount: settings.auto_top_up_amount,
          paymentMethod: settings.preferred_payment_method
        };
      }

      return { shouldTopUp: false };
    } catch (error) {
      logger.error('Error checking auto top-up:', error);
      throw error;
    }
  }

  /**
   * Get wallet statistics for admin
   */
  async getWalletStatistics(startDate = null, endDate = null) {
    try {
      let dateFilter = '';
      const replacements = [];

      if (startDate && endDate) {
        dateFilter = 'WHERE created_at BETWEEN ? AND ?';
        replacements.push(startDate, endDate);
      }

      const stats = await sequelize.query(
        `SELECT 
           COUNT(*) as total_transactions,
           SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) as total_credits,
           SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) as total_debits,
           AVG(amount) as average_transaction,
           COUNT(DISTINCT user_id) as active_users
         FROM wallet_transactions ${dateFilter}`,
        {
          replacements,
          type: sequelize.QueryTypes.SELECT
        }
      );

      const totalWalletBalance = await sequelize.query(
        'SELECT SUM(wallet_balance) as total_balance FROM users WHERE wallet_balance > 0',
        {
          type: sequelize.QueryTypes.SELECT
        }
      );

      return {
        ...stats[0],
        total_wallet_balance: totalWalletBalance[0].total_balance || 0
      };
    } catch (error) {
      logger.error('Error getting wallet statistics:', error);
      throw error;
    }
  }
}

module.exports = new WalletService();