import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { User as UserType } from '../../../../shared/types/user';
import authService, { LoginCredentials, RegisterData } from '../../services/auth';

export interface AuthState {
  user: User | null;
  userData: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  userData: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await authService.login(credentials);
      const userData = await authService.getCurrentUserData();
      return { user: user.toJSON(), userData };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const user = await authService.register(data);
      const userData = await authService.getCurrentUserData();
      return { user: user.toJSON(), userData };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogleAsync = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.loginWithGoogle();
      const userData = await authService.getCurrentUserData();
      return { user: user.toJSON(), userData };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithFacebookAsync = createAsyncThunk(
  'auth/loginWithFacebook',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.loginWithFacebook();
      const userData = await authService.getCurrentUserData();
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

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.resetPassword(email);
      return 'Password reset email sent successfully';
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

export const getCurrentUserDataAsync = createAsyncThunk(
  'auth/getCurrentUserData',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await authService.getCurrentUserData();
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFCMTokenAsync = createAsyncThunk(
  'auth/updateFCMToken',
  async (token: string, { rejectWithValue }) => {
    try {
      await authService.updateFCMToken(token);
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
      state.isInitialized = true;
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
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.userData = action.payload.userData;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Google Login
    builder
      .addCase(loginWithGoogleAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogleAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.userData = action.payload.userData;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithGoogleAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Facebook Login
    builder
      .addCase(loginWithFacebookAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithFacebookAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.userData = action.payload.userData;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithFacebookAsync.rejected, (state, action) => {
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
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Change Password
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

    // Get Current User Data
    builder
      .addCase(getCurrentUserDataAsync.fulfilled, (state, action) => {
        state.userData = action.payload;
      });

    // Update FCM Token
    builder
      .addCase(updateFCMTokenAsync.fulfilled, (state) => {
        // Token updated successfully
      });
  },
});

export const { setUser, clearError, setInitialized, updateUserData, setLoading } = authSlice.actions;
export default authSlice.reducer;