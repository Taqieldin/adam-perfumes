import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart } from '../../../../shared/types/cart';
import cartService, { AddToCartData, UpdateCartItemData, CartSummary } from '../../services/cart';

export interface CartState {
  cart: Cart | null;
  summary: CartSummary | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  isUpdating: boolean;
}

const initialState: CartState = {
  cart: null,
  summary: null,
  isLoading: false,
  error: null,
  itemCount: 0,
  isUpdating: false,
};

// Async thunks
export const getCartAsync = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartService.getCart();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (data: AddToCartData, { rejectWithValue }) => {
    try {
      const cart = await cartService.addToCart(data);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, data }: { itemId: string; data: UpdateCartItemData }, { rejectWithValue }) => {
    try {
      const cart = await cartService.updateCartItem(itemId, data);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const cart = await cartService.removeFromCart(itemId);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCartSummaryAsync = createAsyncThunk(
  'cart/getCartSummary',
  async (_, { rejectWithValue }) => {
    try {
      const summary = await cartService.getCartSummary();
      return summary;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyCouponAsync = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode: string, { rejectWithValue }) => {
    try {
      const cart = await cartService.applyCoupon(couponCode);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCouponAsync = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartService.removeCoupon();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyLoyaltyPointsAsync = createAsyncThunk(
  'cart/applyLoyaltyPoints',
  async (points: number, { rejectWithValue }) => {
    try {
      const cart = await cartService.applyLoyaltyPoints(points);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeLoyaltyPointsAsync = createAsyncThunk(
  'cart/removeLoyaltyPoints',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartService.removeLoyaltyPoints();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const calculateShippingAsync = createAsyncThunk(
  'cart/calculateShipping',
  async (addressId: string, { rejectWithValue }) => {
    try {
      const shipping = await cartService.calculateShipping(addressId);
      return shipping;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setShippingMethodAsync = createAsyncThunk(
  'cart/setShippingMethod',
  async (methodId: string, { rejectWithValue }) => {
    try {
      const cart = await cartService.setShippingMethod(methodId);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkItemsAvailabilityAsync = createAsyncThunk(
  'cart/checkItemsAvailability',
  async (_, { rejectWithValue }) => {
    try {
      const availability = await cartService.checkItemsAvailability();
      return availability;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const quickAddToCartAsync = createAsyncThunk(
  'cart/quickAddToCart',
  async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, { rejectWithValue }) => {
    try {
      const result = await cartService.quickAddToCart(productId, quantity);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCartItemCountAsync = createAsyncThunk(
  'cart/getCartItemCount',
  async (_, { rejectWithValue }) => {
    try {
      const count = await cartService.getCartItemCount();
      return count;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
      state.itemCount = action.payload?.items.reduce((total, item) => total + item.quantity, 0) || 0;
    },
    setSummary: (state, action: PayloadAction<CartSummary>) => {
      state.summary = action.payload;
    },
    setItemCount: (state, action: PayloadAction<number>) => {
      state.itemCount = action.payload;
    },
    optimisticUpdateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      if (state.cart) {
        const item = state.cart.items.find(item => item.id === action.payload.itemId);
        if (item) {
          item.quantity = action.payload.quantity;
          state.itemCount = state.cart.items.reduce((total, item) => total + item.quantity, 0);
        }
      }
    },
    optimisticRemoveItem: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter(item => item.id !== action.payload);
        state.itemCount = state.cart.items.reduce((total, item) => total + item.quantity, 0);
      }
    },
  },
  extraReducers: (builder) => {
    // Get Cart
    builder
      .addCase(getCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.itemCount = action.payload?.items.reduce((total, item) => total + item.quantity, 0) || 0;
      })
      .addCase(getCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add to Cart
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
        state.itemCount = action.payload.items.reduce((total, item) => total + item.quantity, 0);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Update Cart Item
    builder
      .addCase(updateCartItemAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
        state.itemCount = action.payload.items.reduce((total, item) => total + item.quantity, 0);
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Remove from Cart
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
        state.itemCount = action.payload.items.reduce((total, item) => total + item.quantity, 0);
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Clear Cart
    builder
      .addCase(clearCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = null;
        state.itemCount = 0;
        state.summary = null;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Cart Summary
    builder
      .addCase(getCartSummaryAsync.fulfilled, (state, action) => {
        state.summary = action.payload;
      });

    // Apply Coupon
    builder
      .addCase(applyCouponAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(applyCouponAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
      })
      .addCase(applyCouponAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Remove Coupon
    builder
      .addCase(removeCouponAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(removeCouponAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
      })
      .addCase(removeCouponAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Apply Loyalty Points
    builder
      .addCase(applyLoyaltyPointsAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(applyLoyaltyPointsAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
      })
      .addCase(applyLoyaltyPointsAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Remove Loyalty Points
    builder
      .addCase(removeLoyaltyPointsAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(removeLoyaltyPointsAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
      })
      .addCase(removeLoyaltyPointsAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Set Shipping Method
    builder
      .addCase(setShippingMethodAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(setShippingMethodAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
      })
      .addCase(setShippingMethodAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Quick Add to Cart
    builder
      .addCase(quickAddToCartAsync.fulfilled, (state, action) => {
        state.itemCount = action.payload.cartItemCount;
      });

    // Get Cart Item Count
    builder
      .addCase(getCartItemCountAsync.fulfilled, (state, action) => {
        state.itemCount = action.payload;
      });
  },
});

export const { 
  clearError, 
  setCart, 
  setSummary, 
  setItemCount, 
  optimisticUpdateQuantity, 
  optimisticRemoveItem 
} = cartSlice.actions;

export default cartSlice.reducer;