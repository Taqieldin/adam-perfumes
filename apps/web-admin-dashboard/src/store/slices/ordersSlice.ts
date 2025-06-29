import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Order } from '../../../../shared/types/order';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: {
    orders: boolean;
    currentOrder: boolean;
    updating: boolean;
  };
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: {
    orders: false,
    currentOrder: false,
    updating: false,
  },
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    // Mock implementation
    return { orders: [], page: 1, limit: 20, total: 0, totalPages: 0 };
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload.orders;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;