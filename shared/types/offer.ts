export enum OfferType {
  FLASH_SALE = 'flash_sale',
  BUY_ONE_GET_ONE = 'buy_one_get_one',
  BULK_DISCOUNT = 'bulk_discount',
  SEASONAL = 'seasonal',
  CLEARANCE = 'clearance',
}

export enum OfferDiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
}

export interface Offer {
  id: string; // UUID
  title: string;
  description?: string | null;
  type: OfferType;
  discountType: OfferDiscountType;
  discountValue: number; // Decimal (10, 3)
  currency: string; // e.g., 'OMR'
  minimumOrderAmount?: number | null; // Decimal (10, 3)
  maximumDiscountAmount?: number | null; // Decimal (10, 3)
  applicableProducts?: string[] | null; // Array of product IDs
  applicableCategories?: string[] | null; // Array of category IDs
  excludedProducts?: string[] | null; // Array of product IDs
  excludedCategories?: string[] | null; // Array of category IDs
  validFrom: Date;
  validUntil?: Date | null;
  usageLimit?: number | null;
  usageCount: number;
  userUsageLimit?: number | null;
  isActive: boolean;
  priority: number;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  terms?: string | null;
  createdBy: string; // User ID (UUID)
  approvedBy?: string | null; // User ID (UUID)
  approvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
