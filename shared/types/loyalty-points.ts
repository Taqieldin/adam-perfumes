import { LocalizedString } from './branch';

export enum LoyaltyPointsType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  BONUS = 'bonus',
  REFERRAL = 'referral',
  ADJUSTMENT = 'adjustment',
}

export interface LoyaltyPoints {
  id: string; // UUID
  userId: string; // User ID (UUID)
  type: LoyaltyPointsType;
  points: number; // Positive for earned, negative for redeemed
  orderId?: string | null; // Order ID (UUID)
  description: LocalizedString;
  expiresAt?: Date | null;
  isExpired: boolean;
  referralUserId?: string | null; // User ID (UUID)
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
