import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  staff: [],
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = staffSlice.actions;
export default staffSlice.reducer;