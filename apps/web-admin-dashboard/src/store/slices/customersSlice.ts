import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = customersSlice.actions;
export default customersSlice.reducer;