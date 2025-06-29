import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  branches: [],
  loading: false,
  error: null,
};

const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = branchesSlice.actions;
export default branchesSlice.reducer;