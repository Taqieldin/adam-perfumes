import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
  salesData: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    image: string;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

interface AnalyticsState {
  stats: DashboardStats | null;
  salesData: any[];
  customerData: any[];
  productData: any[];
  loading: {
    stats: boolean;
    sales: boolean;
    customers: boolean;
    products: boolean;
  };
  error: string | null;
  dateRange: {
    start: string;
    end: string;
  };
}

const initialState: AnalyticsState = {
  stats: null,
  salesData: [],
  customerData: [],
  productData: [],
  loading: {
    stats: false,
    sales: false,
    customers: false,
    products: false,
  },
  error: null,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  },
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await apiService.get<DashboardStats>('/analytics/dashboard');
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSalesData = createAsyncThunk(
  'analytics/fetchSalesData',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const data = await apiService.getWithParams('/analytics/sales', {
        startDate,
        endDate,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomerAnalytics = createAsyncThunk(
  'analytics/fetchCustomerAnalytics',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const data = await apiService.getWithParams('/analytics/customers', {
        startDate,
        endDate,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductAnalytics = createAsyncThunk(
  'analytics/fetchProductAnalytics',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const data = await apiService.getWithParams('/analytics/products', {
        startDate,
        endDate,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload as string;
      });

    // Sales data
    builder
      .addCase(fetchSalesData.pending, (state) => {
        state.loading.sales = true;
        state.error = null;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.loading.sales = false;
        state.salesData = action.payload;
      })
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.loading.sales = false;
        state.error = action.payload as string;
      });

    // Customer analytics
    builder
      .addCase(fetchCustomerAnalytics.pending, (state) => {
        state.loading.customers = true;
        state.error = null;
      })
      .addCase(fetchCustomerAnalytics.fulfilled, (state, action) => {
        state.loading.customers = false;
        state.customerData = action.payload;
      })
      .addCase(fetchCustomerAnalytics.rejected, (state, action) => {
        state.loading.customers = false;
        state.error = action.payload as string;
      });

    // Product analytics
    builder
      .addCase(fetchProductAnalytics.pending, (state) => {
        state.loading.products = true;
        state.error = null;
      })
      .addCase(fetchProductAnalytics.fulfilled, (state, action) => {
        state.loading.products = false;
        state.productData = action.payload;
      })
      .addCase(fetchProductAnalytics.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDateRange, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;