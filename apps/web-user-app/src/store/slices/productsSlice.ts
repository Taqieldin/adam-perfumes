import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../../../shared/types/product';
import { Category } from '../../../../shared/types/category';
import { productService, ProductFilters, ProductSort, ProductsResponse } from '../../services/products';

interface ProductsState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
  saleProducts: Product[];
  relatedProducts: Product[];
  recentlyViewed: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  sort: ProductSort;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: {
    products: boolean;
    categories: boolean;
    featured: boolean;
    trending: boolean;
    newArrivals: boolean;
    bestSellers: boolean;
    sale: boolean;
    related: boolean;
    currentProduct: boolean;
  };
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  featuredProducts: [],
  trendingProducts: [],
  newArrivals: [],
  bestSellers: [],
  saleProducts: [],
  relatedProducts: [],
  recentlyViewed: [],
  currentProduct: null,
  filters: {},
  sort: { field: 'createdAt', direction: 'desc' },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  loading: {
    products: false,
    categories: false,
    featured: false,
    trending: false,
    newArrivals: false,
    bestSellers: false,
    sale: false,
    related: false,
    currentProduct: false,
  },
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ filters, sort, page, limit }: {
    filters?: ProductFilters;
    sort?: ProductSort;
    page?: number;
    limit?: number;
  }) => {
    const response = await productService.getProducts(filters, sort, page, limit);
    return response;
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const categories = await productService.getCategories();
    return categories;
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit: number = 8) => {
    const products = await productService.getFeaturedProducts(limit);
    return products;
  }
);

export const fetchTrendingProducts = createAsyncThunk(
  'products/fetchTrendingProducts',
  async (limit: number = 8) => {
    const products = await productService.getTrendingProducts(limit);
    return products;
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'products/fetchNewArrivals',
  async (limit: number = 8) => {
    const products = await productService.getNewArrivals(limit);
    return products;
  }
);

export const fetchBestSellers = createAsyncThunk(
  'products/fetchBestSellers',
  async (limit: number = 8) => {
    const products = await productService.getBestSellers(limit);
    return products;
  }
);

export const fetchSaleProducts = createAsyncThunk(
  'products/fetchSaleProducts',
  async (limit: number = 20) => {
    const products = await productService.getSaleProducts(limit);
    return products;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string) => {
    const product = await productService.getProduct(id);
    return product;
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async ({ slug, language }: { slug: string; language?: 'en' | 'ar' }) => {
    const product = await productService.getProductBySlug(slug, language);
    return product;
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async ({ productId, limit }: { productId: string; limit?: number }) => {
    const products = await productService.getRelatedProducts(productId, limit);
    return products;
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, filters, sort, page, limit }: {
    query: string;
    filters?: ProductFilters;
    sort?: ProductSort;
    page?: number;
    limit?: number;
  }) => {
    const response = await productService.searchProducts(query, filters, sort, page, limit);
    return response;
  }
);

export const trackProductView = createAsyncThunk(
  'products/trackProductView',
  async (productId: string) => {
    await productService.trackView(productId);
    return productId;
  }
);

export const fetchRecentlyViewed = createAsyncThunk(
  'products/fetchRecentlyViewed',
  async (limit: number = 8) => {
    const products = await productService.getRecentlyViewed(limit);
    return products;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSort: (state, action: PayloadAction<ProductSort>) => {
      state.sort = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<ProductsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading.products = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.error.message || 'Failed to fetch products';
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading.categories = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    // Fetch featured products
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading.featured = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading.featured = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading.featured = false;
        state.error = action.error.message || 'Failed to fetch featured products';
      });

    // Fetch trending products
    builder
      .addCase(fetchTrendingProducts.pending, (state) => {
        state.loading.trending = true;
      })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.loading.trending = false;
        state.trendingProducts = action.payload;
      })
      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.loading.trending = false;
        state.error = action.error.message || 'Failed to fetch trending products';
      });

    // Fetch new arrivals
    builder
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading.newArrivals = true;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading.newArrivals = false;
        state.newArrivals = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading.newArrivals = false;
        state.error = action.error.message || 'Failed to fetch new arrivals';
      });

    // Fetch best sellers
    builder
      .addCase(fetchBestSellers.pending, (state) => {
        state.loading.bestSellers = true;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.loading.bestSellers = false;
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.loading.bestSellers = false;
        state.error = action.error.message || 'Failed to fetch best sellers';
      });

    // Fetch sale products
    builder
      .addCase(fetchSaleProducts.pending, (state) => {
        state.loading.sale = true;
      })
      .addCase(fetchSaleProducts.fulfilled, (state, action) => {
        state.loading.sale = false;
        state.saleProducts = action.payload;
      })
      .addCase(fetchSaleProducts.rejected, (state, action) => {
        state.loading.sale = false;
        state.error = action.error.message || 'Failed to fetch sale products';
      });

    // Fetch single product
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading.currentProduct = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading.currentProduct = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading.currentProduct = false;
        state.error = action.error.message || 'Failed to fetch product';
      });

    // Fetch product by slug
    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading.currentProduct = true;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading.currentProduct = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading.currentProduct = false;
        state.error = action.error.message || 'Failed to fetch product';
      });

    // Fetch related products
    builder
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loading.related = true;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.loading.related = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loading.related = false;
        state.error = action.error.message || 'Failed to fetch related products';
      });

    // Search products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading.products = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.error.message || 'Failed to search products';
      });

    // Recently viewed
    builder
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.recentlyViewed = action.payload;
      });
  },
});

export const {
  setFilters,
  updateFilters,
  clearFilters,
  setSort,
  setPagination,
  clearCurrentProduct,
  clearError,
} = productsSlice.actions;

export default productsSlice.reducer;