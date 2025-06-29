export enum GiftCardTransactionType {
  PURCHASE = 'purchase',
  REDEMPTION = 'redemption',
  REFUND = 'refund',
  ADJUSTMENT = 'adjustment',
  EXPIRATION = 'expiration',
}

export interface GiftCardTransaction {
  id: string; // UUID
  gift_card_id: string; // GiftCard ID (UUID)
  user_id: string; // User ID (UUID)
  order_id?: string | null; // Order ID (UUID)
  transaction_type: GiftCardTransactionType;
  amount: number; // OMR, positive for credits, negative for debits
  balance_before: number; // OMR
  balance_after: number; // OMR
  description?: string | null;
  description_ar?: string | null;
  reference_number?: string | null;
  created_by?: string | null; // User ID (UUID) of admin
  metadata?: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
}
