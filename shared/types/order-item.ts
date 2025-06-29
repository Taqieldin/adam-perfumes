import { LocalizedString } from './branch';
import { Dimensions } from './product';

export enum OrderItemFulfillmentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  COUPON = 'coupon',
  LOYALTY_POINTS = 'loyalty_points',
}

export interface OrderItem {
  id: string; // UUID
  orderId: string; // Order ID (UUID)
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
  discountType?: DiscountType | null;
  discountReason?: string | null;
  taxRate: number; // Decimal (5, 2)
  taxAmount: number; // Decimal (10, 2)
  weight?: number | null; // Decimal (8, 2) in grams
  dimensions?: Dimensions | null;
  isGift: boolean;
  giftMessage?: string | null;
  giftWrapCost: number; // Decimal (10, 2)
  fulfillmentStatus: OrderItemFulfillmentStatus;
  returnQuantity: number;
  refundAmount: number; // Decimal (10, 2)
  returnReason?: string | null;
  pointsEarned: number;
  commissionRate?: number | null; // Decimal (5, 2)
  commissionAmount: number; // Decimal (10, 2)
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
