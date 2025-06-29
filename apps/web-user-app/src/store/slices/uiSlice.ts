import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  cartOpen: boolean;
  wishlistOpen: boolean;
  loading: {
    global: boolean;
    page: boolean;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    timestamp: number;
  }>;
  modals: {
    auth: boolean;
    productQuickView: boolean;
    addressForm: boolean;
    paymentMethod: boolean;
    orderConfirmation: boolean;
  };
  filters: {
    productsOpen: boolean;
    ordersOpen: boolean;
  };
}

const initialState: UiState = {
  theme: 'light',
  language: 'en',
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  cartOpen: false,
  wishlistOpen: false,
  loading: {
    global: false,
    page: false,
  },
  notifications: [],
  modals: {
    auth: false,
    productQuickView: false,
    addressForm: false,
    paymentMethod: false,
    orderConfirmation: false,
  },
  filters: {
    productsOpen: false,
    ordersOpen: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Language
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload;
    },
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'ar' : 'en';
    },

    // Navigation
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    // Search
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },

    // Cart
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.cartOpen = action.payload;
    },
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen;
    },

    // Wishlist
    setWishlistOpen: (state, action: PayloadAction<boolean>) => {
      state.wishlistOpen = action.payload;
    },
    toggleWishlist: (state) => {
      state.wishlistOpen = !state.wishlistOpen;
    },

    // Loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.page = action.payload;
    },

    // Notifications
    addNotification: (state, action: PayloadAction<Omit<UiState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modals
    setModalOpen: (state, action: PayloadAction<{ modal: keyof UiState['modals']; open: boolean }>) => {
      state.modals[action.payload.modal] = action.payload.open;
    },
    toggleModal: (state, action: PayloadAction<keyof UiState['modals']>) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UiState['modals']] = false;
      });
    },

    // Filters
    setFilterOpen: (state, action: PayloadAction<{ filter: keyof UiState['filters']; open: boolean }>) => {
      state.filters[action.payload.filter] = action.payload.open;
    },
    toggleFilter: (state, action: PayloadAction<keyof UiState['filters']>) => {
      state.filters[action.payload] = !state.filters[action.payload];
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setLanguage,
  toggleLanguage,
  setSidebarOpen,
  toggleSidebar,
  setMobileMenuOpen,
  toggleMobileMenu,
  setSearchOpen,
  toggleSearch,
  setCartOpen,
  toggleCart,
  setWishlistOpen,
  toggleWishlist,
  setGlobalLoading,
  setPageLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setModalOpen,
  toggleModal,
  closeAllModals,
  setFilterOpen,
  toggleFilter,
} = uiSlice.actions;

export default uiSlice.reducer;