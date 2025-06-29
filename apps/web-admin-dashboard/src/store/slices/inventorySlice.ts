import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inventory: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = inventorySlice.actions;
export default inventorySlice.reducer;