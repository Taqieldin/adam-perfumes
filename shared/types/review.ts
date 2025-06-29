export interface Review {
  id: string; // UUID
  userId: string; // User ID (UUID)
  productId: string; // Product ID (UUID)
  orderId?: string | null; // Order ID (UUID)
  rating: number; // 1-5
  title?: string | null;
  comment?: string | null;
  pros: string[];
  cons: string[];
  images: string[]; // Array of image URLs
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  approvedAt?: Date | null;
  approvedBy?: string | null; // Admin User ID (UUID)
  isHelpful: number;
  isReported: boolean;
  reportCount: number;
  language: string; // e.g., 'en'
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
