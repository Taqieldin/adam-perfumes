import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
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
    confirmDelete: boolean;
    productForm: boolean;
    categoryForm: boolean;
    userForm: boolean;
    orderDetails: boolean;
    imageViewer: boolean;
  };
  filters: {
    productsOpen: boolean;
    ordersOpen: boolean;
    customersOpen: boolean;
  };
  selectedItems: string[];
  bulkActions: {
    active: boolean;
    type: string | null;
  };
}

const initialState: UiState = {
  theme: 'light',
  language: 'en',
  sidebarCollapsed: false,
  sidebarOpen: true,
  loading: {
    global: false,
    page: false,
  },
  notifications: [],
  modals: {
    confirmDelete: false,
    productForm: false,
    categoryForm: false,
    userForm: false,
    orderDetails: false,
    imageViewer: false,
  },
  filters: {
    productsOpen: false,
    ordersOpen: false,
    customersOpen: false,
  },
  selectedItems: [],
  bulkActions: {
    active: false,
    type: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },

    // Language
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'ar' : 'en';
      localStorage.setItem('language', state.language);
    },

    // Sidebar
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('sidebarCollapsed', action.payload.toString());
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed.toString());
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
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

    // Selection
    setSelectedItems: (state, action: PayloadAction<string[]>) => {
      state.selectedItems = action.payload;
    },
    addSelectedItem: (state, action: PayloadAction<string>) => {
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload);
      }
    },
    removeSelectedItem: (state, action: PayloadAction<string>) => {
      state.selectedItems = state.selectedItems.filter(id => id !== action.payload);
    },
    toggleSelectedItem: (state, action: PayloadAction<string>) => {
      const index = state.selectedItems.indexOf(action.payload);
      if (index > -1) {
        state.selectedItems.splice(index, 1);
      } else {
        state.selectedItems.push(action.payload);
      }
    },
    clearSelectedItems: (state) => {
      state.selectedItems = [];
    },

    // Bulk Actions
    setBulkActions: (state, action: PayloadAction<{ active: boolean; type: string | null }>) => {
      state.bulkActions = action.payload;
    },
    startBulkAction: (state, action: PayloadAction<string>) => {
      state.bulkActions = { active: true, type: action.payload };
    },
    endBulkAction: (state) => {
      state.bulkActions = { active: false, type: null };
      state.selectedItems = [];
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setLanguage,
  toggleLanguage,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  setSidebarOpen,
  toggleSidebar,
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
  setSelectedItems,
  addSelectedItem,
  removeSelectedItem,
  toggleSelectedItem,
  clearSelectedItems,
  setBulkActions,
  startBulkAction,
  endBulkAction,
} = uiSlice.actions;

export default uiSlice.reducer;