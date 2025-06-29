export enum SupportTicketCategory {
  ORDER_INQUIRY = 'order_inquiry',
  PRODUCT_QUESTION = 'product_question',
  PAYMENT_ISSUE = 'payment_issue',
  DELIVERY_PROBLEM = 'delivery_problem',
  RETURN_REQUEST = 'return_request',
  TECHNICAL_SUPPORT = 'technical_support',
  COMPLAINT = 'complaint',
  COMPLIMENT = 'compliment',
  SUGGESTION = 'suggestion',
  OTHER = 'other',
}

export enum SupportTicketPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum SupportTicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_CUSTOMER = 'waiting_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export enum SupportTicketLanguage {
  EN = 'en',
  AR = 'ar',
}

export enum SupportTicketContactMethod {
  EMAIL = 'email',
  PHONE = 'phone',
  WHATSAPP = 'whatsapp',
  IN_APP = 'in_app',
}

export enum SupportTicketSource {
  MOBILE_APP = 'mobile_app',
  WEBSITE = 'website',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  PHONE = 'phone',
  BRANCH = 'branch',
}

export interface SupportTicket {
  id: string; // UUID
  ticket_number: string;
  user_id: string; // User ID (UUID)
  order_id?: string | null; // Order ID (UUID)
  subject: string;
  subject_ar?: string | null;
  description: string;
  description_ar?: string | null;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  assigned_to?: string | null; // User ID (UUID) of support agent
  assigned_at?: Date | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  preferred_language: SupportTicketLanguage;
  preferred_contact_method: SupportTicketContactMethod;
  source: SupportTicketSource;
  resolution?: string | null;
  resolution_ar?: string | null;
  first_response_at?: Date | null;
  resolved_at?: Date | null;
  closed_at?: Date | null;
  satisfaction_rating?: number | null; // 1-5
  satisfaction_feedback?: string | null;
  internal_notes?: string | null;
  tags?: string[] | null;
  metadata?: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
}
