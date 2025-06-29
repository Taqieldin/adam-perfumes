export enum BranchType {
  RETAIL = 'retail',
  WAREHOUSE = 'warehouse',
  OUTLET = 'outlet',
  FLAGSHIP = 'flagship',
}

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface BranchAddress {
  street?: string;
  area?: string;
  city: string;
  governorate: string;
  postalCode?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface OperatingHours {
  // Based on the model, this is a flexible JSON object.
  // Example structure, can be adapted as needed.
  [day: string]: { open: string; close: string; isClosed: boolean };
}

export interface Branch {
  id: string; // UUID
  name: LocalizedString;
  code: string;
  type: BranchType;
  address: BranchAddress;
  coordinates?: Coordinates | null;
  phone?: string | null;
  email?: string | null;
  managerId?: string | null; // User ID (UUID)
  operatingHours: OperatingHours;
  isActive: boolean;
  canFulfillOrders: boolean;
  totalSales: number;
  totalOrders: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
