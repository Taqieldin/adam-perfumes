export enum LoyaltyTransactionType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  BONUS = 'bonus',
  REFERRAL = 'referral',
  ADJUSTMENT = 'adjustment',
}

export interface LoyaltyTransaction {
  id: string; // UUID
  user_id: string; // User ID (UUID)
  order_id?: string | null; // Order ID (UUID)
  transaction_type: LoyaltyTransactionType;
  points: number; // Positive for earned, negative for redeemed
  balance_after: number;
  order_amount?: number | null; // OMR
  redemption_value?: number | null; // OMR
  expires_at?: Date | null;
  description?: string | null;
  description_ar?: string | null;
  metadata?: Record<string, any> | null;
  created_by?: string | null; // User ID (UUID) of admin
  created_at: Date;
  updated_at: Date;
}
