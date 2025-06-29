import { LocalizedString } from './branch'; // Re-use from branch.ts

// --- Nested Interfaces for Product JSON fields ---

export interface Dimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
}

// Represents a specific variant of a product (e.g., size or color)
export interface ProductVariant {
  sku: string;
  price?: number; // Can override base price
  stockQuantity: number;
  attributes: Record<string, string | number>; // e.g., { size: '100ml', color: 'blue' }
  image?: string; // URL for variant-specific image
}

// --- Enums for Product Attributes (can be used for filtering/display) ---

export enum FragranceType {
  EAU_DE_PARFUM = 'eau_de_parfum',
  EAU_DE_TOILETTE = 'eau_de_toilette',
  PARFUM = 'parfum',
  EAU_DE_COLOGNE = 'eau_de_cologne',
  EAU_FRAICHE = 'eau_fraiche',
  PERFUME_OIL = 'perfume_oil',
}

export enum ProductGender {
  MEN = 'men',
  WOMEN = 'women',
  UNISEX = 'unisex',
}

export enum Longevity {
  VERY_WEAK = 'very_weak',
  WEAK = 'weak',
  MODERATE = 'moderate',
  LONG_LASTING = 'long_lasting',
  ETERNAL = 'eternal',
}

export enum Sillage {
  INTIMATE = 'intimate',
  MODERATE = 'moderate',
  STRONG = 'strong',
  ENORMOUS = 'enormous',
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter',
}

export enum Occasion {
  DAILY = 'daily',
  EVENING = 'evening',
  OFFICE = 'office',
  SPECIAL = 'special',
}

// --- Main Product Interface ---

export interface Product {
  id: string; // UUID
  sku: string;
  barcode?: string | null;
  name: LocalizedString;
  description?: LocalizedString | null;
  shortDescription?: LocalizedString | null;
  categoryId: string; // Category ID (UUID)
  brand?: string | null;
  price: number; // OMR
  comparePrice?: number | null; // OMR
  costPrice?: number | null; // OMR
  currency: 'OMR';
  weight?: number | null; // grams
  dimensions?: Dimensions | null;
  images: string[]; // Array of URLs
  videos: string[]; // Array of URLs
  tags: string[];
  attributes: {
    fragranceType?: FragranceType;
    concentration?: string;
    gender?: ProductGender;
    fragranceFamily?: string;
    topNotes?: string[];
    middleNotes?: string[];
    baseNotes?: string[];
    longevity?: Longevity;
    sillage?: Sillage;
    season?: Season[];
    occasion?: Occasion[];
    [key: string]: any; // For other dynamic attributes
  };
  variants: ProductVariant[];
  isActive: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  trackQuantity: boolean;
  allowBackorder: boolean;
  minQuantity: number;
  maxQuantity?: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  seoTitle?: LocalizedString | null;
  seoDescription?: LocalizedString | null;
  seoKeywords?: LocalizedString | null;
  slug: LocalizedString;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  onSale: boolean;
  saleStartDate?: Date | null;
  saleEndDate?: Date | null;
  rating: number; // Decimal (3, 2)
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
