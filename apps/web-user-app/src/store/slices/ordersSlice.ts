import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../../../shared/types/order';
import { orderService } from '../../services/orders';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: {
    orders: boolean;
    currentOrder: boolean;
    creating: boolean;
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
    creating: false,
    updating: false,
  },
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await orderService.getOrders(page, limit);
    return response;
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId: string) => {
    const order = await orderService.getOrder(orderId);
    return order;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any) => {
    const order = await orderService.createOrder(orderData);
    return order;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: string }) => {
    const order = await orderService.updateOrderStatus(orderId, status);
    return order;
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string) => {
    const order = await orderService.cancelOrder(orderId);
    return order;
  }
);

export const trackOrder = createAsyncThunk(
  'orders/trackOrder',
  async (orderId: string) => {
    const tracking = await orderService.trackOrder(orderId);
    return { orderId, tracking };
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action: PayloadAction<Partial<OrdersState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true;
        state.error = null;
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

    // Fetch single order
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading.currentOrder = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading.currentOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading.currentOrder = false;
        state.error = action.error.message || 'Failed to fetch order';
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading.creating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.error.message || 'Failed to create order';
      });

    // Update order status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading.updating = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading.updating = false;
        state.error = action.error.message || 'Failed to update order status';
      });

    // Cancel order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.loading.updating = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading.updating = false;
        state.error = action.error.message || 'Failed to cancel order';
      });

    // Track order
    builder
      .addCase(trackOrder.fulfilled, (state, action) => {
        const { orderId, tracking } = action.payload;
        const index = state.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], tracking };
        }
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = { ...state.currentOrder, tracking };
        }
      });
  },
});

export const {
  clearCurrentOrder,
  clearError,
  setPagination,
} = ordersSlice.actions;

export default ordersSlice.reducer;