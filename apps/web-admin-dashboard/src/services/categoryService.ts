import { Category } from '../../../../shared/types/category';
import { apiService } from './apiService';

export interface CategoryFilters {
  search?: string;
  parentId?: string;
  isActive?: boolean;
  level?: number;
  sortBy?: 'name' | 'createdAt' | 'productCount' | 'order';
  sortOrder?: 'asc' | 'desc';
  includeProductCount?: boolean;
}

export interface CreateCategoryData {
  name: { en: string; ar: string };
  description?: { en: string; ar: string };
  parentId?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  seoTitle?: { en: string; ar: string };
  seoDescription?: { en: string; ar: string };
  seoKeywords?: { en: string; ar: string };
  slug: { en: string; ar: string };
  attributes?: Record<string, any>;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

export interface CategoryWithStats extends Category {
  productCount: number;
  activeProductCount: number;
  totalRevenue: number;
  level: number;
  children?: CategoryWithStats[];
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  rootCategories: number;
  maxDepth: number;
  categoriesWithProducts: number;
  averageProductsPerCategory: number;
}

export interface CategoryAnalytics {
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    revenue: number;
    orders: number;
    conversionRate: number;
  }>;
  categoryPerformance: Array<{
    categoryId: string;
    categoryName: string;
    views: number;
    clicks: number;
    orders: number;
    revenue: number;
    averageOrderValue: number;
  }>;
  categoryTrends: Array<{
    categoryId: string;
    categoryName: string;
    trend: 'up' | 'down' | 'stable';
    changePercentage: number;
    period: string;
  }>;
}

class CategoryService {
  private readonly baseUrl = '/admin/categories';

  // Get all categories
  async getCategories(filters: CategoryFilters = {}): Promise<Category[]> {
    return apiService.getWithParams<Category[]>(this.baseUrl, filters);
  }

  // Get categories tree structure
  async getCategoriesTree(includeStats: boolean = false): Promise<CategoryWithStats[]> {
    const params = includeStats ? { includeStats: true } : {};
    return apiService.getWithParams<CategoryWithStats[]>(`${this.baseUrl}/tree`, params);
  }

  // Get single category by ID
  async getCategory(id: string): Promise<Category> {
    return apiService.get<Category>(`${this.baseUrl}/${id}`);
  }

  // Get category with statistics
  async getCategoryWithStats(id: string): Promise<CategoryWithStats> {
    return apiService.get<CategoryWithStats>(`${this.baseUrl}/${id}/stats`);
  }

  // Create new category
  async createCategory(data: CreateCategoryData): Promise<Category> {
    return apiService.post<Category>(this.baseUrl, data);
  }

  // Update category
  async updateCategory(data: UpdateCategoryData): Promise<Category> {
    const { id, ...updateData } = data;
    return apiService.patch<Category>(`${this.baseUrl}/${id}`, updateData);
  }

  // Delete category
  async deleteCategory(id: string, moveProductsTo?: string): Promise<void> {
    const params = moveProductsTo ? { moveProductsTo } : {};
    return apiService.delete<void>(`${this.baseUrl}/${id}`, { params });
  }

  // Toggle category status
  async toggleCategoryStatus(id: string): Promise<Category> {
    return apiService.patch<Category>(`${this.baseUrl}/${id}/toggle-status`);
  }

  // Reorder categories
  async reorderCategories(updates: Array<{ id: string; order: number; parentId?: string }>): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/reorder`, { updates });
  }

  // Move category
  async moveCategory(id: string, newParentId?: string, newOrder?: number): Promise<Category> {
    return apiService.patch<Category>(`${this.baseUrl}/${id}/move`, {
      parentId: newParentId,
      order: newOrder
    });
  }

  // Get category children
  async getCategoryChildren(id: string, includeStats: boolean = false): Promise<CategoryWithStats[]> {
    const params = includeStats ? { includeStats: true } : {};
    return apiService.getWithParams<CategoryWithStats[]>(`${this.baseUrl}/${id}/children`, params);
  }

  // Get category ancestors (breadcrumb)
  async getCategoryAncestors(id: string): Promise<Category[]> {
    return apiService.get<Category[]>(`${this.baseUrl}/${id}/ancestors`);
  }

  // Get root categories
  async getRootCategories(includeStats: boolean = false): Promise<CategoryWithStats[]> {
    const params = includeStats ? { includeStats: true } : {};
    return apiService.getWithParams<CategoryWithStats[]>(`${this.baseUrl}/root`, params);
  }

  // Search categories
  async searchCategories(query: string, limit: number = 10): Promise<Category[]> {
    return apiService.getWithParams<Category[]>(`${this.baseUrl}/search`, {
      q: query,
      limit
    });
  }

  // Get featured categories
  async getFeaturedCategories(): Promise<Category[]> {
    return apiService.get<Category[]>(`${this.baseUrl}/featured`);
  }

  // Set featured categories
  async setFeaturedCategories(categoryIds: string[]): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/featured`, { categoryIds });
  }

  // Upload category image
  async uploadCategoryImage(categoryId: string, file: File): Promise<string> {
    return apiService.upload<string>(`${this.baseUrl}/${categoryId}/image`, file);
  }

  // Delete category image
  async deleteCategoryImage(categoryId: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${categoryId}/image`);
  }

  // Get category statistics
  async getCategoryStats(): Promise<CategoryStats> {
    return apiService.get<CategoryStats>(`${this.baseUrl}/stats`);
  }

  // Get category analytics
  async getCategoryAnalytics(dateFrom?: Date, dateTo?: Date): Promise<CategoryAnalytics> {
    const params: any = {};
    if (dateFrom) params.dateFrom = dateFrom.toISOString();
    if (dateTo) params.dateTo = dateTo.toISOString();
    
    return apiService.getWithParams<CategoryAnalytics>(`${this.baseUrl}/analytics`, params);
  }

  // Get products in category
  async getCategoryProducts(id: string, page: number = 1, limit: number = 20, includeSubcategories: boolean = true): Promise<{
    products: Array<{
      id: string;
      name: { en: string; ar: string };
      price: number;
      image: string;
      isActive: boolean;
      stockQuantity: number;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return apiService.getWithParams(`${this.baseUrl}/${id}/products`, {
      page,
      limit,
      includeSubcategories
    });
  }

  // Bulk update categories
  async bulkUpdateCategories(updates: Array<{
    id: string;
    isActive?: boolean;
    isFeatured?: boolean;
    order?: number;
  }>): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/bulk-update`, { updates });
  }

  // Export categories
  async exportCategories(format: 'xlsx' | 'csv' = 'xlsx'): Promise<void> {
    return apiService.download(`${this.baseUrl}/export?format=${format}`, `categories.${format}`);
  }

  // Import categories
  async importCategories(file: File): Promise<{
    successful: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    return apiService.upload(`${this.baseUrl}/import`, file);
  }

  // Duplicate category
  async duplicateCategory(id: string, newName?: { en: string; ar: string }): Promise<Category> {
    return apiService.post<Category>(`${this.baseUrl}/${id}/duplicate`, { newName });
  }

  // Merge categories
  async mergeCategories(sourceId: string, targetId: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/${sourceId}/merge`, { targetId });
  }

  // Get category attributes
  async getCategoryAttributes(id: string): Promise<Record<string, any>> {
    return apiService.get(`${this.baseUrl}/${id}/attributes`);
  }

  // Update category attributes
  async updateCategoryAttributes(id: string, attributes: Record<string, any>): Promise<void> {
    return apiService.patch<void>(`${this.baseUrl}/${id}/attributes`, { attributes });
  }

  // Get category SEO data
  async getCategorySEO(id: string): Promise<{
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    keywords: { en: string; ar: string };
    slug: { en: string; ar: string };
    canonicalUrl?: string;
    metaTags?: Record<string, string>;
  }> {
    return apiService.get(`${this.baseUrl}/${id}/seo`);
  }

  // Update category SEO
  async updateCategorySEO(id: string, seoData: {
    title?: { en: string; ar: string };
    description?: { en: string; ar: string };
    keywords?: { en: string; ar: string };
    slug?: { en: string; ar: string };
    canonicalUrl?: string;
    metaTags?: Record<string, string>;
  }): Promise<void> {
    return apiService.patch<void>(`${this.baseUrl}/${id}/seo`, seoData);
  }

  // Validate category slug
  async validateSlug(slug: string, language: 'en' | 'ar', excludeId?: string): Promise<{ isValid: boolean; suggestion?: string }> {
    const params: any = { slug, language };
    if (excludeId) params.excludeId = excludeId;
    
    return apiService.getWithParams(`${this.baseUrl}/validate-slug`, params);
  }

  // Get category hierarchy path
  async getCategoryPath(id: string, language: 'en' | 'ar' = 'en'): Promise<string> {
    return apiService.get(`${this.baseUrl}/${id}/path?language=${language}`);
  }
}

export const categoryService = new CategoryService();
export default categoryService;