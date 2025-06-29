export enum CouponUsageStatus {
  APPLIED = 'applied',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface CouponUsage {
  id: string; // UUID
  coupon_id: string; // Coupon ID (UUID)
  user_id: string; // User ID (UUID)
  order_id: string; // Order ID (UUID)
  coupon_code: string;
  discount_amount: number; // OMR
  order_amount: number; // OMR
  status: CouponUsageStatus;
  used_at: Date;
  cancelled_at?: Date | null;
  refunded_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
