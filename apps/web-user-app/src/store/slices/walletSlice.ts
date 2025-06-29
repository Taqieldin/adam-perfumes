import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WalletTransaction } from '../../../../shared/types/wallet-transaction';
import { walletService } from '../../services/wallet';

interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
  loading: {
    balance: boolean;
    transactions: boolean;
    topup: boolean;
    transfer: boolean;
  };
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  loading: {
    balance: false,
    transactions: false,
    topup: false,
    transfer: false,
  },
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async () => {
    const balance = await walletService.getBalance();
    return balance;
  }
);

export const fetchWalletTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await walletService.getTransactions(page, limit);
    return response;
  }
);

export const topupWallet = createAsyncThunk(
  'wallet/topup',
  async ({ amount, paymentMethod }: { amount: number; paymentMethod: string }) => {
    const transaction = await walletService.topup(amount, paymentMethod);
    return transaction;
  }
);

export const transferFromWallet = createAsyncThunk(
  'wallet/transfer',
  async ({ amount, recipient, description }: { 
    amount: number; 
    recipient: string; 
    description?: string;
  }) => {
    const transaction = await walletService.transfer(amount, recipient, description);
    return transaction;
  }
);

export const useWalletForPayment = createAsyncThunk(
  'wallet/useForPayment',
  async ({ amount, orderId }: { amount: number; orderId: string }) => {
    const transaction = await walletService.useForPayment(amount, orderId);
    return transaction;
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action: PayloadAction<Partial<WalletState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch wallet balance
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading.balance = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading.balance = false;
        state.balance = action.payload;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading.balance = false;
        state.error = action.error.message || 'Failed to fetch wallet balance';
      });

    // Fetch wallet transactions
    builder
      .addCase(fetchWalletTransactions.pending, (state) => {
        state.loading.transactions = true;
        state.error = null;
      })
      .addCase(fetchWalletTransactions.fulfilled, (state, action) => {
        state.loading.transactions = false;
        state.transactions = action.payload.transactions;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        state.loading.transactions = false;
        state.error = action.error.message || 'Failed to fetch wallet transactions';
      });

    // Topup wallet
    builder
      .addCase(topupWallet.pending, (state) => {
        state.loading.topup = true;
        state.error = null;
      })
      .addCase(topupWallet.fulfilled, (state, action) => {
        state.loading.topup = false;
        state.transactions.unshift(action.payload);
        state.balance += action.payload.amount;
      })
      .addCase(topupWallet.rejected, (state, action) => {
        state.loading.topup = false;
        state.error = action.error.message || 'Failed to topup wallet';
      });

    // Transfer from wallet
    builder
      .addCase(transferFromWallet.pending, (state) => {
        state.loading.transfer = true;
        state.error = null;
      })
      .addCase(transferFromWallet.fulfilled, (state, action) => {
        state.loading.transfer = false;
        state.transactions.unshift(action.payload);
        state.balance -= action.payload.amount;
      })
      .addCase(transferFromWallet.rejected, (state, action) => {
        state.loading.transfer = false;
        state.error = action.error.message || 'Failed to transfer from wallet';
      });

    // Use wallet for payment
    builder
      .addCase(useWalletForPayment.pending, (state) => {
        state.loading.transfer = true;
        state.error = null;
      })
      .addCase(useWalletForPayment.fulfilled, (state, action) => {
        state.loading.transfer = false;
        state.transactions.unshift(action.payload);
        state.balance -= action.payload.amount;
      })
      .addCase(useWalletForPayment.rejected, (state, action) => {
        state.loading.transfer = false;
        state.error = action.error.message || 'Failed to use wallet for payment';
      });
  },
});

export const {
  clearError,
  setPagination,
  updateBalance,
} = walletSlice.actions;

export default walletSlice.reducer;