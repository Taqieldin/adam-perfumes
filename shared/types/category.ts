import { LocalizedString } from './branch'; // Re-use from branch.ts

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Category {
  id: string; // UUID
  name: LocalizedString;
  description?: LocalizedString | null;
  parentId?: string | null; // Category ID (UUID)
  level: number;
  path?: string | null;
  slug: string;
  sortOrder: number;
  image?: string | null; // URL
  icon?: string | null; // URL or class
  banner?: string | null; // URL
  metaTitle?: LocalizedString | null;
  metaDescription?: LocalizedString | null;
  metaKeywords?: LocalizedString | null;
  status: CategoryStatus;
  isVisible: boolean;
  isFeatured: boolean;
  productCount: number;
  commissionRate?: number | null; // Decimal
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
