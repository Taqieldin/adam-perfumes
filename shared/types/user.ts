export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Language {
  EN = 'en',
  AR = 'ar',
}

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  BRANCH_MANAGER = 'branch_manager',
  STAFF = 'staff',
}

export enum CustomerSegment {
  NEW = 'new',
  REGULAR = 'regular',
  VIP = 'vip',
  PREMIUM = 'premium',
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  marketing: NotificationPreferences;
  theme: 'light' | 'dark';
  currency: 'OMR';
}

export interface Address {
  id: string; // UUID
  userId: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string; // UUID
  firebaseUid?: string | null;
  email: string;
  password?: string | null;
  firstName: string;
  lastName: string;
  phone?: string | null;
  dateOfBirth?: string | null; // YYYY-MM-DD
  gender?: Gender | null;
  profilePicture?: string | null;
  language: Language;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date | null;
  loginCount: number;
  walletBalance: number; // OMR
  loyaltyPoints: number;
  fcmTokens: string[];
  preferences: UserPreferences;
  metadata: Record<string, any>;
  referralCode?: string | null;
  referredBy?: string | null; // User ID (UUID)
  totalSpent: number; // OMR
  totalOrders: number;
  averageOrderValue: number;
  lastOrderAt?: Date | null;
  customerSegment: CustomerSegment;
  branchId?: string | null; // Branch ID (UUID)
  permissions: any[];
  Addresses?: Address[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
