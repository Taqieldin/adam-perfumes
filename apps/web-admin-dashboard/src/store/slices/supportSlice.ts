import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = supportSlice.actions;
export default supportSlice.reducer;