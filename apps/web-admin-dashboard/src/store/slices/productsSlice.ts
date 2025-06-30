import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../../../../shared/types/product';
import { Category } from '../../../../../shared/types/category';
import { productService, ProductFilters, CreateProductData, UpdateProductData } from '../../services/productService';

interface ProductsState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
  stats: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    outOfStock: number;
    lowStock: number;
    featuredProducts: number;
    newArrivals: number;
    bestSellers: number;
    onSaleProducts: number;
  } | null;
  loading: {
    products: boolean;
    categories: boolean;
    currentProduct: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    bulkDeleting: boolean;
    duplicating: boolean;
    stats: boolean;
  };
  error: string | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  selectedProducts: string[];
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  currentProduct: null,
  stats: null,
  loading: {
    products: false,
    categories: false,
    currentProduct: false,
    creating: false,
    updating: false,
    deleting: false,
    bulkDeleting: false,
    duplicating: false,
    stats: false,
  },
  error: null,
  filters: {
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  selectedProducts: [],
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters = {}) => {
    const response = await productService.getProducts(filters);
    return response;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string) => {
    const product = await productService.getProduct(id);
    return product;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: CreateProductData) => {
    const product = await productService.createProduct(productData);
    return product;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (data: UpdateProductData) => {
    const product = await productService.updateProduct(data);
    return product;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await productService.deleteProduct(id);
    return id;
  }
);

export const bulkDeleteProducts = createAsyncThunk(
  'products/bulkDeleteProducts',
  async (productIds: string[]) => {
    await productService.bulkDeleteProducts(productIds);
    return productIds;
  }
);

export const duplicateProduct = createAsyncThunk(
  'products/duplicateProduct',
  async (id: string) => {
    const product = await productService.duplicateProduct(id);
    return product;
  }
);

export const toggleProductStatus = createAsyncThunk(
  'products/toggleProductStatus',
  async (id: string) => {
    const product = await productService.toggleProductStatus(id);
    return product;
  }
);

export const fetchProductStats = createAsyncThunk(
  'products/fetchProductStats',
  async () => {
    const stats = await productService.getProductStats();
    return stats;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
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
    setSelectedProducts: (state, action: PayloadAction<string[]>) => {
      state.selectedProducts = action.payload;
    },
    toggleProductSelection: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.selectedProducts.indexOf(productId);
      if (index > -1) {
        state.selectedProducts.splice(index, 1);
      } else {
        state.selectedProducts.push(productId);
      }
    },
    selectAllProducts: (state) => {
      state.selectedProducts = state.products.map(p => p.id);
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = [];
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

    // Fetch single product
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading.currentProduct = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading.currentProduct = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading.currentProduct = false;
        state.error = action.error.message || 'Failed to fetch product';
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading.creating = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.error.message || 'Failed to create product';
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading.updating = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.currentProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading.updating = false;
        state.error = action.error.message || 'Failed to update product';
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading.deleting = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error = action.error.message || 'Failed to delete product';
      });

    // Bulk delete products
    builder
      .addCase(bulkDeleteProducts.pending, (state) => {
        state.loading.bulkDeleting = true;
        state.error = null;
      })
      .addCase(bulkDeleteProducts.fulfilled, (state, action) => {
        state.loading.bulkDeleting = false;
        state.products = state.products.filter(p => !action.payload.includes(p.id));
        state.selectedProducts = [];
      })
      .addCase(bulkDeleteProducts.rejected, (state, action) => {
        state.loading.bulkDeleting = false;
        state.error = action.error.message || 'Failed to delete products';
      });

    // Duplicate product
    builder
      .addCase(duplicateProduct.pending, (state) => {
        state.loading.duplicating = true;
        state.error = null;
      })
      .addCase(duplicateProduct.fulfilled, (state, action) => {
        state.loading.duplicating = false;
        state.products.unshift(action.payload);
      })
      .addCase(duplicateProduct.rejected, (state, action) => {
        state.loading.duplicating = false;
        state.error = action.error.message || 'Failed to duplicate product';
      });

    // Toggle product status
    builder
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      });

    // Fetch product stats
    builder
      .addCase(fetchProductStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchProductStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.error.message || 'Failed to fetch product stats';
      });
  },
});

export const { 
  setFilters, 
  setPagination, 
  clearCurrentProduct, 
  clearError,
  setSelectedProducts,
  toggleProductSelection,
  selectAllProducts,
  clearSelectedProducts
} = productsSlice.actions;

export default productsSlice.reducer;