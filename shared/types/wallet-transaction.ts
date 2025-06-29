export enum WalletTransactionType {
  TOPUP = 'topup',
  PAYMENT = 'payment',
  REFUND = 'refund',
  BONUS = 'bonus',
  CASHBACK = 'cashback',
  GIFT_CARD = 'gift_card',
  ADJUSTMENT = 'adjustment',
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
}

export enum WalletPaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  GIFT_CARD = 'gift_card',
  ADMIN = 'admin',
}

export enum WalletTransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface WalletTransaction {
  id: string; // UUID
  user_id: string; // User ID (UUID)
  order_id?: string | null; // Order ID (UUID)
  transaction_type: WalletTransactionType;
  amount: number; // OMR, positive for credit, negative for debit
  balance_before: number; // OMR
  balance_after: number; // OMR
  currency: 'OMR';
  payment_method?: WalletPaymentMethod | null;
  payment_gateway?: string | null;
  payment_transaction_id?: string | null;
  payment_reference?: string | null;
  status: WalletTransactionStatus;
  transfer_to_user_id?: string | null; // User ID (UUID)
  transfer_from_user_id?: string | null; // User ID (UUID)
  description?: string | null;
  description_ar?: string | null;
  notes?: string | null;
  created_by?: string | null; // User ID (UUID) of admin
  metadata?: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
}
