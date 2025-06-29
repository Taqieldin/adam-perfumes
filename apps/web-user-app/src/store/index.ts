import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';
import walletReducer from './slices/walletSlice';
import uiReducer from './slices/uiSlice';
import wishlistReducer from './slices/wishlistSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'ui'], // Only persist these reducers
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
  orders: ordersReducer,
  wallet: walletReducer,
  ui: uiReducer,
  wishlist: wishlistReducer,
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
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;