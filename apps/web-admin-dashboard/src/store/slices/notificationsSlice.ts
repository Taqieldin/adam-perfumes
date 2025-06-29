import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer;