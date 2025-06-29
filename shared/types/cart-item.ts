import { LocalizedString } from './branch';

export enum CartItemDiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  COUPON = 'coupon',
  BULK = 'bulk',
}

export enum SubscriptionInterval {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export interface CartItem {
  id: string; // UUID
  cartId: string; // Cart ID (UUID)
  productId: string; // Product ID (UUID)
  productSku: string;
  productName: LocalizedString;
  productImage?: string | null; // URL
  variantId?: string | null; // Product variant ID
  variantOptions?: Record<string, any> | null; // e.g., { size: '100ml' }
  quantity: number;
  unitPrice: number; // Decimal (10, 2)
  originalPrice?: number | null; // Decimal (10, 2)
  totalPrice: number; // Decimal (10, 2)
  discountAmount: number; // Decimal (10, 2)
  discountType?: CartItemDiscountType | null;
  discountReason?: string | null;
  isGift: boolean;
  giftMessage?: string | null;
  giftWrapRequested: boolean;
  personalizationOptions?: Record<string, any> | null;
  isSubscription: boolean;
  subscriptionInterval?: SubscriptionInterval | null;
  addedFromWishlist: boolean;
  wishlistId?: string | null; // Wishlist ID (UUID)
  lastStockCheck?: Date | null;
  stockAvailable: boolean;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
