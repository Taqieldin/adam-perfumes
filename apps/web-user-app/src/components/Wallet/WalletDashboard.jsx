import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon, 
  PlusIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CogIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-hot-toast';

const WalletDashboard = () => {
  const { t } = useTranslation('wallet');
  const [walletData, setWalletData] = useState({
    balance: 0,
    currency: 'OMR',
    transactions: [],
    loading: true
  });
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      // Fetch wallet balance
      const balanceResponse = await fetch('/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const balanceData = await balanceResponse.json();

      // Fetch recent transactions
      const transactionsResponse = await fetch('/api/wallet/transactions?limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const transactionsData = await transactionsResponse.json();

      setWalletData({
        balance: balanceData.data.balance,
        currency: balanceData.data.currency,
        transactions: transactionsData.data.transactions,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error(t('error.fetchFailed'));
      setWalletData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    
    if (!topUpAmount || parseFloat(topUpAmount) < 1) {
      toast.error(t('error.invalidAmount'));
      return;
    }

    try {
      const response = await fetch('/api/wallet/top-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(topUpAmount),
          paymentMethod: paymentMethod
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success(t('success.topUpCompleted'));
        setWalletData(prev => ({
          ...prev,
          balance: data.data.newBalance
        }));
        setShowTopUp(false);
        setTopUpAmount('');
        fetchWalletData(); // Refresh to get updated transactions
      } else {
        toast.error(data.message || t('error.topUpFailed'));
      }
    } catch (error) {
      console.error('Error topping up wallet:', error);
      toast.error(t('error.topUpFailed'));
    }
  };

  const formatCurrency = (amount) => {
    return `${amount.toFixed(2)} ${walletData.currency}`;
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? (
      <ArrowDownIcon className="w-5 h-5 text-green-500" />
    ) : (
      <ArrowUpIcon className="w-5 h-5 text-red-500" />
    );
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (walletData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium opacity-90">{t('walletBalance')}</h2>
            <p className="text-4xl font-bold mt-2">
              {formatCurrency(walletData.balance)}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <CreditCardIcon className="w-8 h-8" />
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setShowTopUp(true)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            {t('topUp')}
          </button>
          <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-colors">
            <CogIcon className="w-5 h-5" />
            {t('settings')}
          </button>
        </div>
      </motion.div>

      {/* Top Up Modal */}
      {showTopUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTopUp(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6">{t('topUpWallet')}</h3>
            
            <form onSubmit={handleTopUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('amount')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    max="1000"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {walletData.currency}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('paymentMethod')}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="card">{t('creditCard')}</option>
                  <option value="apple_pay">{t('applePay')}</option>
                  <option value="google_pay">{t('googlePay')}</option>
                  <option value="bank_transfer">{t('bankTransfer')}</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTopUp(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  {t('topUp')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold mb-6">{t('recentTransactions')}</h3>
        
        {walletData.transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CreditCardIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t('noTransactions')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {walletData.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {getStatusIcon(transaction.status)}
                      <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                    {transaction.transaction_type === 'credit' ? '+' : '-'}
                    {formatCurrency(parseFloat(transaction.amount))}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('balance')}: {formatCurrency(parseFloat(transaction.balance_after))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <button className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold mb-2">{t('sendMoney')}</h4>
          <p className="text-sm text-gray-600">{t('sendMoneyDescription')}</p>
        </button>

        <button className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCardIcon className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold mb-2">{t('payBills')}</h4>
          <p className="text-sm text-gray-600">{t('payBillsDescription')}</p>
        </button>

        <button className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CogIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold mb-2">{t('autoTopUp')}</h4>
          <p className="text-sm text-gray-600">{t('autoTopUpDescription')}</p>
        </button>
      </motion.div>
    </div>
  );
};

export default WalletDashboard;