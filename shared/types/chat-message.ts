export enum ChatMessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
  LOCATION = 'location',
  PRODUCT = 'product',
}

export enum ChatMessageSenderType {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  SYSTEM = 'system',
  BOT = 'bot',
}

export interface ChatAttachment {
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize?: number; // in bytes
}

export interface ChatMessage {
  id: string; // UUID
  conversationId: string; // UUID
  userId?: string | null; // User ID (UUID)
  senderType: ChatMessageSenderType;
  senderName?: string | null;
  message: string;
  messageType: ChatMessageType;
  attachments: ChatAttachment[];
  metadata: Record<string, any>;
  isRead: boolean;
  readAt?: Date | null;
  isEdited: boolean;
  editedAt?: Date | null;
  originalMessage?: string | null;
  replyToId?: string | null; // ChatMessage ID (UUID)
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: string | null; // User ID (UUID)
  language: string; // e.g., 'en'
  isAutoReply: boolean;
  autoReplyContext?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}
