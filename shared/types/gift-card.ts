export enum GiftCardStatus {
  ACTIVE = 'active',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export enum GiftCardDeliveryMethod {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PHYSICAL = 'physical',
  IN_APP = 'in_app',
}

export enum GiftCardDeliveryStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export interface GiftCard {
  id: string; // UUID
  code: string;
  initial_amount: number; // OMR
  current_balance: number; // OMR
  currency: 'OMR';
  purchased_by?: string | null; // User ID (UUID)
  purchase_order_id?: string | null; // Order ID (UUID)
  recipient_name?: string | null;
  recipient_email?: string | null;
  recipient_phone?: string | null;
  gift_message?: string | null;
  gift_message_ar?: string | null;
  status: GiftCardStatus;
  is_active: boolean;
  issued_at: Date;
  expires_at?: Date | null;
  activated_at?: Date | null;
  fully_redeemed_at?: Date | null;
  minimum_order_amount?: number | null; // OMR
  applicable_products?: string[] | null; // Array of product IDs
  applicable_categories?: string[] | null; // Array of category IDs
  usage_count: number;
  last_used_at?: Date | null;
  last_used_by?: string | null; // User ID (UUID)
  design_template?: string | null;
  background_image?: string | null;
  delivery_method: GiftCardDeliveryMethod;
  delivery_status: GiftCardDeliveryStatus;
  delivered_at?: Date | null;
  created_by?: string | null; // User ID (UUID) of admin
  notes?: string | null;
  metadata?: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
}
