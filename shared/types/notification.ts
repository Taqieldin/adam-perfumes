import { LocalizedString } from './branch';

export enum NotificationType {
  ORDER_UPDATE = 'order_update',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PROMOTION = 'promotion',
  WELCOME = 'welcome',
  REMINDER = 'reminder',
  SYSTEM = 'system',
  CHAT_MESSAGE = 'chat_message',
  LOW_STOCK = 'low_stock',
  NEW_PRODUCT = 'new_product',
  PRICE_DROP = 'price_drop',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum NotificationChannel {
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
}

export interface Notification {
  id: string; // UUID
  userId?: string | null; // User ID (UUID), null for broadcast
  type: NotificationType;
  title: LocalizedString;
  message: LocalizedString;
  imageUrl?: string | null;
  actionUrl?: string | null;
  actionData?: Record<string, any> | null;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: Date | null;
  scheduledFor?: Date | null;
  sentAt?: Date | null;
  deliveredAt?: Date | null;
  status: NotificationStatus;
  failureReason?: string | null;
  orderId?: string | null; // Order ID (UUID)
  productId?: string | null; // Product ID (UUID)
  createdBy?: string | null; // Admin User ID (UUID)
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
