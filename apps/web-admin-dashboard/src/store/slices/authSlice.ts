import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { User as UserType } from '../../../../shared/types/user';
import authService, { LoginCredentials } from '../../services/authService';

export interface AuthState {
  user: User | null;
  userData: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  permissions: string[];
}

const initialState: AuthState = {
  user: null,
  userData: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
  permissions: [],
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const userData = await authService.getCurrentUserData();
        return { user: user.toJSON(), userData };
      }
      return { user: null, userData: null };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await authService.login(credentials);
      const userData = await authService.getCurrentUserData();
      
      // Check if user has admin permissions
      if (!userData || !['admin', 'super_admin', 'branch_manager'].includes(userData.role)) {
        await authService.logout();
        throw new Error('Insufficient permissions to access admin dashboard');
      }
      
      return { user: user.toJSON(), userData };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<UserType>, { rejectWithValue }) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      return 'Password changed successfully';
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User | null; userData: UserType | null }>) => {
      state.user = action.payload.user;
      state.userData = action.payload.userData;
      state.isAuthenticated = !!action.payload.user;
      state.permissions = action.payload.userData?.permissions || [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    updateUserData: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Initialize auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.userData = action.payload.userData;
        state.isAuthenticated = !!action.payload.user;
        state.permissions = action.payload.userData?.permissions || [];
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      });

    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.userData = action.payload.userData;
        state.isAuthenticated = true;
        state.permissions = action.payload.userData?.permissions || [];
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.userData = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Change password
    builder
      .addCase(changePasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError, setInitialized, updateUserData, setLoading } = authSlice.actions;
export default authSlice.reducer;