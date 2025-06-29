import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coupons: [],
  loading: false,
  error: null,
};

const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = couponsSlice.actions;
export default couponsSlice.reducer;