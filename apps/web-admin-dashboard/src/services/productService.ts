import { Product, ProductVariant } from '../../../../shared/types/product';
import { apiService } from './apiService';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  onSale?: boolean;
  inStock?: boolean;
  tags?: string[];
  fragranceType?: string;
  gender?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating' | 'stockQuantity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductData {
  name: { en: string; ar: string };
  description?: { en: string; ar: string };
  shortDescription?: { en: string; ar: string };
  categoryId: string;
  brand?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  videos?: string[];
  tags: string[];
  attributes: Record<string, any>;
  variants: Omit<ProductVariant, 'sku'>[];
  isActive: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  trackQuantity: boolean;
  allowBackorder: boolean;
  minQuantity: number;
  maxQuantity?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  seoTitle?: { en: string; ar: string };
  seoDescription?: { en: string; ar: string };
  seoKeywords?: { en: string; ar: string };
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  onSale: boolean;
  saleStartDate?: Date;
  saleEndDate?: Date;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface BulkUpdateData {
  productIds: string[];
  updates: Partial<Pick<Product, 'isActive' | 'featured' | 'trending' | 'newArrival' | 'bestSeller' | 'onSale' | 'categoryId' | 'tags'>>;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStock: number;
  lowStock: number;
  featuredProducts: number;
  newArrivals: number;
  bestSellers: number;
  onSaleProducts: number;
}

class ProductService {
  private readonly baseUrl = '/admin/products';

  // Get all products with filters
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    return apiService.getWithParams<ProductsResponse>(this.baseUrl, filters);
  }

  // Get single product by ID
  async getProduct(id: string): Promise<Product> {
    return apiService.get<Product>(`${this.baseUrl}/${id}`);
  }

  // Create new product
  async createProduct(data: CreateProductData): Promise<Product> {
    return apiService.post<Product>(this.baseUrl, data);
  }

  // Update product
  async updateProduct(data: UpdateProductData): Promise<Product> {
    const { id, ...updateData } = data;
    return apiService.patch<Product>(`${this.baseUrl}/${id}`, updateData);
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Bulk delete products
  async bulkDeleteProducts(productIds: string[]): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/bulk-delete`, { productIds });
  }

  // Bulk update products
  async bulkUpdateProducts(data: BulkUpdateData): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/bulk-update`, data);
  }

  // Duplicate product
  async duplicateProduct(id: string): Promise<Product> {
    return apiService.post<Product>(`${this.baseUrl}/${id}/duplicate`);
  }

  // Get product variants
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    return apiService.get<ProductVariant[]>(`${this.baseUrl}/${productId}/variants`);
  }

  // Add product variant
  async addProductVariant(productId: string, variant: Omit<ProductVariant, 'sku'>): Promise<ProductVariant> {
    return apiService.post<ProductVariant>(`${this.baseUrl}/${productId}/variants`, variant);
  }

  // Update product variant
  async updateProductVariant(productId: string, variantSku: string, variant: Partial<ProductVariant>): Promise<ProductVariant> {
    return apiService.patch<ProductVariant>(`${this.baseUrl}/${productId}/variants/${variantSku}`, variant);
  }

  // Delete product variant
  async deleteProductVariant(productId: string, variantSku: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${productId}/variants/${variantSku}`);
  }

  // Upload product images
  async uploadProductImages(productId: string, files: File[]): Promise<string[]> {
    return apiService.uploadMultiple<string[]>(`${this.baseUrl}/${productId}/images`, files);
  }

  // Delete product image
  async deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${productId}/images`, {
      data: { imageUrl }
    });
  }

  // Get product statistics
  async getProductStats(): Promise<ProductStats> {
    return apiService.get<ProductStats>(`${this.baseUrl}/stats`);
  }

  // Search products (for autocomplete)
  async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    return apiService.getWithParams<Product[]>(`${this.baseUrl}/search`, {
      q: query,
      limit
    });
  }

  // Get related products
  async getRelatedProducts(productId: string, limit: number = 5): Promise<Product[]> {
    return apiService.get<Product[]>(`${this.baseUrl}/${productId}/related?limit=${limit}`);
  }

  // Update product stock
  async updateProductStock(productId: string, stockQuantity: number, variantSku?: string): Promise<void> {
    return apiService.patch<void>(`${this.baseUrl}/${productId}/stock`, {
      stockQuantity,
      variantSku
    });
  }

  // Bulk update stock
  async bulkUpdateStock(updates: Array<{ productId: string; stockQuantity: number; variantSku?: string }>): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/bulk-stock-update`, { updates });
  }

  // Export products
  async exportProducts(filters: ProductFilters = {}): Promise<void> {
    const params = new URLSearchParams(filters as any).toString();
    return apiService.download(`${this.baseUrl}/export?${params}`, 'products.xlsx');
  }

  // Import products
  async importProducts(file: File): Promise<{ success: number; errors: string[] }> {
    return apiService.upload<{ success: number; errors: string[] }>(`${this.baseUrl}/import`, file);
  }

  // Get low stock products
  async getLowStockProducts(): Promise<Product[]> {
    return apiService.get<Product[]>(`${this.baseUrl}/low-stock`);
  }

  // Get out of stock products
  async getOutOfStockProducts(): Promise<Product[]> {
    return apiService.get<Product[]>(`${this.baseUrl}/out-of-stock`);
  }

  // Toggle product status
  async toggleProductStatus(id: string): Promise<Product> {
    return apiService.patch<Product>(`${this.baseUrl}/${id}/toggle-status`);
  }

  // Get product reviews summary
  async getProductReviewsSummary(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  }> {
    return apiService.get(`${this.baseUrl}/${productId}/reviews/summary`);
  }
}

export const productService = new ProductService();
export default productService;