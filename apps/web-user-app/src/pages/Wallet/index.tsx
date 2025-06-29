import React, { FC } from 'react';
import useSWR from 'swr';
import { MainLayout } from '../../layouts/MainLayout';
import walletService from '../../services/wallet.service';
import { WalletTransaction } from '@shared/types/wallet-transaction';

// The API returns an object with the wallet's balance and currency.
interface Wallet {
  balance: number;
  currency: string;
}

const fetchWallet = () => walletService.getWallet();
const fetchTransactions = () => walletService.getTransactions();

const WalletPage: FC = () => {
  const { data: wallet, error: walletError } = useSWR<Wallet>('/wallet', fetchWallet);
  const { data: transactions, error: transactionsError } = useSWR<WalletTransaction[]>('/wallet/transactions', fetchTransactions);

  const error = walletError || transactionsError;

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center text-red-500">Failed to load wallet data.</div>
      </MainLayout>
    );
  }

  if (!wallet || !transactions) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">My Wallet</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8 max-w-md mx-auto text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Current Balance</h2>
          <p className="text-4xl font-bold text-black">{wallet.currency} {wallet.balance.toFixed(2)}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">You have no transactions yet.</p>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-6 text-left font-semibold">Date</th>
                    <th className="py-3 px-6 text-left font-semibold">Type</th>
                    <th className="py-3 px-6 text-left font-semibold">Description</th>
                    <th className="py-3 px-6 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6 capitalize">{tx.transaction_type.replace(/_/g, ' ')}</td>
                      <td className="py-4 px-6">{tx.description || 'N/A'}</td>
                      <td className={`py-4 px-6 text-right font-semibold ${tx.amount >= 0 ? 'text-black' : 'text-gray-600'}`}>
                        {tx.amount >= 0 ? '+' : '-'}{wallet.currency} {Math.abs(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default WalletPage;
