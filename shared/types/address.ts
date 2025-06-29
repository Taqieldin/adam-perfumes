export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
  BOTH = 'both',
}

export interface Address {
  id: string; // UUID
  userId: string; // User ID (UUID)
  type: AddressType;
  firstName: string;
  lastName: string;
  company?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string; // ISO country code
  phone?: string | null;
  isDefault: boolean;
  isActive: boolean;
  latitude?: number | null; // Decimal (10, 8)
  longitude?: number | null; // Decimal (11, 8)
  instructions?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
