import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import ordersReducer from './slices/ordersSlice';
import customersReducer from './slices/customersSlice';
import inventoryReducer from './slices/inventorySlice';
import branchesReducer from './slices/branchesSlice';
import staffReducer from './slices/staffSlice';
import analyticsReducer from './slices/analyticsSlice';
import notificationsReducer from './slices/notificationsSlice';
import couponsReducer from './slices/couponsSlice';
import reviewsReducer from './slices/reviewsSlice';
import supportReducer from './slices/supportSlice';

// Persist config
const persistConfig = {
  key: 'admin-root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist these reducers
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  products: productsReducer,
  categories: categoriesReducer,
  orders: ordersReducer,
  customers: customersReducer,
  inventory: inventoryReducer,
  branches: branchesReducer,
  staff: staffReducer,
  analytics: analyticsReducer,
  notifications: notificationsReducer,
  coupons: couponsReducer,
  reviews: reviewsReducer,
  support: supportReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Create persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;