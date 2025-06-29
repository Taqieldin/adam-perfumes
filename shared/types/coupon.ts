export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
}

export interface Coupon {
  id: string; // UUID
  code: string;
  name: string;
  description?: string | null;
  type: CouponType;
  value: number; // Decimal (10, 3)
  currency: string; // e.g., 'OMR'
  minimumOrderAmount?: number | null; // Decimal (10, 3)
  maximumDiscountAmount?: number | null; // Decimal (10, 3)
  usageLimit?: number | null;
  usageCount: number;
  userUsageLimit?: number | null;
  validFrom: Date;
  validUntil?: Date | null;
  isActive: boolean;
  applicableProducts?: string[] | null; // Array of product IDs
  applicableCategories?: string[] | null; // Array of category IDs
  excludedProducts?: string[] | null; // Array of product IDs
  excludedCategories?: string[] | null; // Array of category IDs
  firstTimeUserOnly: boolean;
  createdBy: string; // User ID (UUID)
  createdAt: Date;
  updatedAt: Date;
}
