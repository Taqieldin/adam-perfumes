export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  RETURNED = 'returned',
  FAILED = 'failed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

import { OrderItem } from './order-item';

export enum PaymentMethod {
  CARD = 'card',
  WALLET = 'wallet',
  COD = 'cod',
  BANK_TRANSFER = 'bank_transfer',
  GIFT_CARD = 'gift_card',
}

export interface Order {
  id: string; // UUID
  orderNumber: string;
  userId: string; // User ID (UUID)
  guestEmail?: string | null;
  guestPhone?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  paymentGateway?: string | null;
  paymentTransactionId?: string | null;
  subtotal: number; // Decimal (10, 2)
  taxAmount: number; // Decimal (10, 2)
  shippingAmount: number; // Decimal (10, 2)
  discountAmount: number; // Decimal (10, 2)
  totalAmount: number; // Decimal (10, 2)
  paidAmount: number; // Decimal (10, 2)
  currency: 'OMR';
  couponId?: string | null; // Coupon ID (UUID)
  couponCode?: string | null;
  couponDiscount?: number; // Decimal (10, 2)
  pointsEarned: number;
  pointsUsed: number;
  pointsValue: number; // Decimal (10, 2)
  walletAmountUsed: number; // Decimal (10, 2)
  shippingAddressId?: string | null; // Address ID (UUID)
  billingAddressId?: string | null; // Address ID (UUID)
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  shippingCarrier?: string | null;
  estimatedDeliveryDate?: Date | null;
  actualDeliveryDate?: Date | null;
  branchId?: string | null; // Branch ID (UUID) for pickup
  isPickup: boolean;
  items: OrderItem[];
  // Timestamps and other fields will be added as we see them in the model file
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
