import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../../../shared/types/product';
import { productService } from '../../services/products';

interface WishlistState {
  items: Product[];
  loading: {
    items: boolean;
    adding: boolean;
    removing: boolean;
  };
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: {
    items: false,
    adding: false,
    removing: false,
  },
  error: null,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async () => {
    const items = await productService.getWishlist();
    return items;
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string) => {
    await productService.addToWishlist(productId);
    return productId;
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string) => {
    await productService.removeFromWishlist(productId);
    return productId;
  }
);

export const checkIsInWishlist = createAsyncThunk(
  'wishlist/checkIsInWishlist',
  async (productId: string) => {
    const isInWishlist = await productService.isInWishlist(productId);
    return { productId, isInWishlist };
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading.items = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      });

    // Add to wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading.adding = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading.adding = false;
        // Note: We don't add the product here since we only have the ID
        // The UI should refetch the wishlist or we should return the full product
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading.adding = false;
        state.error = action.error.message || 'Failed to add to wishlist';
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading.removing = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading.removing = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading.removing = false;
        state.error = action.error.message || 'Failed to remove from wishlist';
      });
  },
});

export const {
  clearError,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;