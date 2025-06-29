/** 
 * @typedef {import('@shared/types/wallet-transaction').WalletTransaction} WalletTransaction 
 */

/**
 * Represents the user's wallet.
 * @typedef {{ balance: number; currency: string; }} Wallet
 */

import apiClient from '../utils/api';

const walletService = {
  /**
   * Get the current user's wallet
   * @returns {Promise<Wallet>} The user's wallet data
   */
  getWallet: async () => {
    try {
      const response = await apiClient.get('/wallet');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get the user's wallet transactions
   * @returns {Promise<WalletTransaction[]>} A list of wallet transactions
   */
  getTransactions: async () => {
    try {
      const response = await apiClient.get('/wallet/transactions');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      throw error.response?.data || error;
    }
  },
};

export default walletService;
