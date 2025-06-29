import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;