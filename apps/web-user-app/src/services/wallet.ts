import { WalletTransaction } from '../../../shared/types/wallet-transaction';
import { GiftCard } from '../../../shared/types/gift-card';
import { LoyaltyTransaction } from '../../../shared/types/loyalty-transaction';
import apiService from './api';

export interface WalletBalance {
  balance: number;
  currency: 'OMR';
  pendingBalance: number;
  lastUpdated: Date;
}

export interface TopUpData {
  amount: number;
  paymentMethodId: string;
  description?: string;
}

export interface TransferData {
  recipientEmail: string;
  amount: number;
  message?: string;
}

export interface WalletTransactionsResponse {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoyaltyPointsBalance {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTierPoints: number;
  expiringPoints: number;
  expirationDate?: Date;
}

export interface LoyaltyTransactionsResponse {
  transactions: LoyaltyTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GiftCardData {
  recipientEmail: string;
  recipientName: string;
  amount: number;
  message?: string;
  deliveryDate?: Date;
  design?: string;
}

class WalletService {
  // Get wallet balance
  async getBalance(): Promise<WalletBalance> {
    return apiService.get<WalletBalance>('/wallet/balance');
  }

  // Top up wallet
  async topUp(data: TopUpData): Promise<{
    transactionId: string;
    paymentIntentId: string;
    clientSecret: string;
  }> {
    return apiService.post('/wallet/top-up', data);
  }

  // Transfer money to another user
  async transfer(data: TransferData): Promise<WalletTransaction> {
    return apiService.post<WalletTransaction>('/wallet/transfer', data);
  }

  // Get wallet transactions
  async getTransactions(
    page: number = 1,
    limit: number = 20,
    type?: 'credit' | 'debit'
  ): Promise<WalletTransactionsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (type) params.append('type', type);

    return apiService.get<WalletTransactionsResponse>(`/wallet/transactions?${params.toString()}`);
  }

  // Get single transaction
  async getTransaction(transactionId: string): Promise<WalletTransaction> {
    return apiService.get<WalletTransaction>(`/wallet/transactions/${transactionId}`);
  }

  // Get wallet transaction receipt
  async getTransactionReceipt(transactionId: string): Promise<Blob> {
    const response = await apiService.get(`/wallet/transactions/${transactionId}/receipt`, {
      responseType: 'blob'
    });
    return response as unknown as Blob;
  }

  // Download transaction receipt
  async downloadReceipt(transactionId: string): Promise<void> {
    const blob = await this.getTransactionReceipt(transactionId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${transactionId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Set up auto top-up
  async setupAutoTopUp(data: {
    enabled: boolean;
    threshold: number;
    amount: number;
    paymentMethodId: string;
  }): Promise<void> {
    return apiService.post('/wallet/auto-top-up', data);
  }

  // Get auto top-up settings
  async getAutoTopUpSettings(): Promise<{
    enabled: boolean;
    threshold: number;
    amount: number;
    paymentMethodId: string;
  } | null> {
    try {
      return await apiService.get('/wallet/auto-top-up');
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Loyalty Points Methods

  // Get loyalty points balance
  async getLoyaltyBalance(): Promise<LoyaltyPointsBalance> {
    return apiService.get<LoyaltyPointsBalance>('/loyalty/balance');
  }

  // Get loyalty transactions
  async getLoyaltyTransactions(
    page: number = 1,
    limit: number = 20
  ): Promise<LoyaltyTransactionsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiService.get<LoyaltyTransactionsResponse>(`/loyalty/transactions?${params.toString()}`);
  }

  // Redeem loyalty points
  async redeemPoints(points: number): Promise<{
    success: boolean;
    walletCredit: number;
    transactionId: string;
  }> {
    return apiService.post('/loyalty/redeem', { points });
  }

  // Get loyalty program details
  async getLoyaltyProgram(): Promise<{
    tiers: Array<{
      name: string;
      minPoints: number;
      benefits: string[];
      multiplier: number;
    }>;
    pointsValue: number; // OMR per point
    expirationPeriod: number; // months
  }> {
    return apiService.get('/loyalty/program');
  }

  // Get available loyalty rewards
  async getLoyaltyRewards(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    type: 'discount' | 'product' | 'experience';
    value: number;
    available: boolean;
  }>> {
    return apiService.get('/loyalty/rewards');
  }

  // Claim loyalty reward
  async claimReward(rewardId: string): Promise<{
    success: boolean;
    couponCode?: string;
    message: string;
  }> {
    return apiService.post(`/loyalty/rewards/${rewardId}/claim`);
  }

  // Gift Card Methods

  // Purchase gift card
  async purchaseGiftCard(data: GiftCardData): Promise<{
    giftCardId: string;
    code: string;
    paymentIntentId: string;
    clientSecret: string;
  }> {
    return apiService.post('/gift-cards/purchase', data);
  }

  // Get user's gift cards
  async getGiftCards(): Promise<GiftCard[]> {
    return apiService.get<GiftCard[]>('/gift-cards');
  }

  // Get gift card by code
  async getGiftCard(code: string): Promise<GiftCard> {
    return apiService.get<GiftCard>(`/gift-cards/${code}`);
  }

  // Redeem gift card
  async redeemGiftCard(code: string): Promise<{
    success: boolean;
    amount: number;
    message: string;
  }> {
    return apiService.post('/gift-cards/redeem', { code });
  }

  // Check gift card balance
  async checkGiftCardBalance(code: string): Promise<{
    balance: number;
    originalAmount: number;
    expirationDate?: Date;
  }> {
    return apiService.get(`/gift-cards/${code}/balance`);
  }

  // Get gift card designs
  async getGiftCardDesigns(): Promise<Array<{
    id: string;
    name: string;
    preview: string;
    category: string;
  }>> {
    return apiService.get('/gift-cards/designs');
  }

  // Send gift card reminder
  async sendGiftCardReminder(giftCardId: string): Promise<void> {
    return apiService.post(`/gift-cards/${giftCardId}/remind`);
  }

  // Get wallet statistics
  async getWalletStats(): Promise<{
    totalTopUps: number;
    totalSpent: number;
    totalTransfers: number;
    monthlyActivity: Array<{
      month: string;
      topUps: number;
      spending: number;
      transfers: number;
    }>;
  }> {
    return apiService.get('/wallet/stats');
  }

  // Get loyalty statistics
  async getLoyaltyStats(): Promise<{
    totalEarned: number;
    totalRedeemed: number;
    currentTier: string;
    nextTier?: string;
    progressToNextTier: number;
    monthlyEarnings: Array<{
      month: string;
      earned: number;
      redeemed: number;
    }>;
  }> {
    return apiService.get('/loyalty/stats');
  }

  // Validate wallet transaction PIN
  async validateTransactionPin(pin: string): Promise<boolean> {
    try {
      await apiService.post('/wallet/validate-pin', { pin });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Set wallet transaction PIN
  async setTransactionPin(pin: string): Promise<void> {
    return apiService.post('/wallet/set-pin', { pin });
  }

  // Change wallet transaction PIN
  async changeTransactionPin(currentPin: string, newPin: string): Promise<void> {
    return apiService.post('/wallet/change-pin', { currentPin, newPin });
  }
}

export const walletService = new WalletService();
export default walletService;