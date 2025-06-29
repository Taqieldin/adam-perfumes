import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../../../shared/types/product';
import { Category } from '../../../../shared/types/category';
import apiService from '../../services/apiService';

interface ProductsState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
  loading: {
    products: boolean;
    categories: boolean;
    currentProduct: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
  };
  error: string | null;
  filters: {
    search: string;
    category: string;
    status: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  currentProduct: null,
  loading: {
    products: false,
    categories: false,
    currentProduct: false,
    creating: false,
    updating: false,
    deleting: false,
  },
  error: null,
  filters: {
    search: '',
    category: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: any = {}) => {
    const response = await apiService.getWithParams('/admin/products', params);
    return response;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string) => {
    const product = await apiService.get<Product>(`/admin/products/${id}`);
    return product;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Partial<Product>) => {
    const product = await apiService.post<Product>('/admin/products', productData);
    return product;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: Partial<Product> }) => {
    const product = await apiService.put<Product>(`/admin/products/${id}`, data);
    return product;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await apiService.delete(`/admin/products/${id}`);
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductsState['filters']>>) => {
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
  },
});

export const { setFilters, setPagination, clearCurrentProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;