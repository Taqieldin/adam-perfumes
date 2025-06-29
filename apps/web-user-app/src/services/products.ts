import { Product } from '@shared/types/product';
import { Category } from '@shared/types/category';
import apiService from './api';

export interface ProductFilters {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  fragranceType?: string;
  season?: string[];
  occasion?: string[];
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  search?: string;
  trending?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  // Get all products with filters and pagination
  async getProducts(
    filters: ProductFilters = {},
    sort: ProductSort = { field: 'createdAt', direction: 'desc' },
    page: number = 1,
    limit: number = 20
  ): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    // Add sorting
    params.append('sortBy', sort.field);
    params.append('sortOrder', sort.direction);
    
    // Add pagination
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiService.get<ProductsResponse>(`/products?${params.toString()}`);
  }

  // Get single product by ID
  async getProduct(id: string): Promise<Product> {
    return apiService.get<Product>(`/products/${id}`);
  }

  // Get product by slug
  async getProductBySlug(slug: string, language: 'en' | 'ar' = 'en'): Promise<Product> {
    return apiService.get<Product>(`/products/slug/${slug}?lang=${language}`);
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const response = await this.getProducts(
      { featured: true },
      { field: 'createdAt', direction: 'desc' },
      1,
      limit
    );
    return response.products;
  }

  // Get trending products
  async getTrendingProducts(limit: number = 8): Promise<Product[]> {
    const response = await this.getProducts(
      { trending: true },
      { field: 'createdAt', direction: 'desc' },
      1,
      limit
    );
    return response.products;
  }

  // Get new arrivals
  async getNewArrivals(limit: number = 8): Promise<Product[]> {
    const response = await this.getProducts(
      { newArrival: true },
      { field: 'createdAt', direction: 'desc' },
      1,
      limit
    );
    return response.products;
  }

  // Get best sellers
  async getBestSellers(limit: number = 8): Promise<Product[]> {
    const response = await this.getProducts(
      { bestSeller: true },
      { field: 'createdAt', direction: 'desc' },
      1,
      limit
    );
    return response.products;
  }

  // Get products on sale
  async getSaleProducts(limit: number = 20): Promise<Product[]> {
    const response = await this.getProducts(
      { onSale: true },
      { field: 'createdAt', direction: 'desc' },
      1,
      limit
    );
    return response.products;
  }

  // Get related products
  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    return apiService.get<Product[]>(`/products/${productId}/related?limit=${limit}`);
  }

  // Search products
  async searchProducts(
    query: string,
    filters: ProductFilters = {},
    sort: ProductSort = { field: 'name', direction: 'asc' },
    page: number = 1,
    limit: number = 20
  ): Promise<ProductsResponse> {
    return this.getProducts(
      { ...filters, search: query },
      sort,
      page,
      limit
    );
  }

  // Get product categories
  async getCategories(): Promise<Category[]> {
    return apiService.get<Category[]>('/categories');
  }

  // Get category by ID
  async getCategory(id: string): Promise<Category> {
    return apiService.get<Category>(`/categories/${id}`);
  }

  // Get products by category
  async getProductsByCategory(
    categoryId: string,
    sort: ProductSort = { field: 'createdAt', direction: 'desc' },
    page: number = 1,
    limit: number = 20
  ): Promise<ProductsResponse> {
    return this.getProducts(
      { categoryId },
      sort,
      page,
      limit
    );
  }

  // Get product brands
  async getBrands(): Promise<string[]> {
    return apiService.get<string[]>('/products/brands');
  }

  // Get product attributes for filtering
  async getProductAttributes(): Promise<{
    fragranceTypes: string[];
    genders: string[];
    seasons: string[];
    occasions: string[];
    brands: string[];
  }> {
    return apiService.get('/products/attributes');
  }

  // Add product review
  async addReview(productId: string, review: {
    rating: number;
    comment?: string;
    title?: string;
  }): Promise<void> {
    return apiService.post(`/products/${productId}/reviews`, review);
  }

  // Get product reviews
  async getReviews(productId: string, page: number = 1, limit: number = 10): Promise<{
    reviews: any[];
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  }> {
    return apiService.get(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
  }

  // Check product availability
  async checkAvailability(productId: string, variantSku?: string): Promise<{
    available: boolean;
    stockQuantity: number;
    estimatedDelivery?: string;
  }> {
    const params = variantSku ? `?variantSku=${variantSku}` : '';
    return apiService.get(`/products/${productId}/availability${params}`);
  }

  // Get product recommendations
  async getRecommendations(userId?: string, limit: number = 8): Promise<Product[]> {
    const params = userId ? `?userId=${userId}&limit=${limit}` : `?limit=${limit}`;
    return apiService.get<Product[]>(`/products/recommendations${params}`);
  }

  // Track product view
  async trackView(productId: string): Promise<void> {
    try {
      await apiService.post(`/products/${productId}/view`);
    } catch (error) {
      // Silently fail for analytics
      console.warn('Failed to track product view:', error);
    }
  }

  // Get recently viewed products
  async getRecentlyViewed(limit: number = 8): Promise<Product[]> {
    return apiService.get<Product[]>(`/products/recently-viewed?limit=${limit}`);
  }

  // Add to wishlist
  async addToWishlist(productId: string): Promise<void> {
    return apiService.post(`/products/${productId}/wishlist`);
  }

  // Remove from wishlist
  async removeFromWishlist(productId: string): Promise<void> {
    return apiService.delete(`/products/${productId}/wishlist`);
  }

  // Get wishlist
  async getWishlist(): Promise<Product[]> {
    return apiService.get<Product[]>('/products/wishlist');
  }

  // Check if product is in wishlist
  async isInWishlist(productId: string): Promise<boolean> {
    try {
      await apiService.get(`/products/${productId}/wishlist/check`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const productService = new ProductService();
export default productService;