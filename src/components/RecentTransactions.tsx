import React from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const RecentTransactions: React.FC = () => {
  const { getRecentTransactions, getCategoryById, getAccountById } = useTransactions();
  const { formatCurrency } = useCurrency();
  const recentTransactions = getRecentTransactions(5);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    const isFuture = date.getTime() > now.getTime();

    if (isFuture) {
      // For future dates, show "in X hours/days"
      if (diffInHours < 24) {
        const hours = Math.ceil(diffInHours);
        return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        const days = Math.ceil(diffInHours / 24);
        return `in ${days} day${days !== 1 ? 's' : ''}`;
      }
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getCategoryDisplay = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category ? (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
        {category.name}
      </span>
    ) : null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="text-center py-6 md:py-8">
          <Clock className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No recent transactions</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add a transaction to get started</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-start sm:items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' ? 'bg-green-50 dark:bg-green-900/30' : 
                  transaction.type === 'transfer' ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-red-50 dark:bg-red-900/30'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-600 dark:text-green-400" />
                  ) : transaction.type === 'transfer' ? (
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-600 dark:text-blue-400 transform rotate-90" />
                  ) : (
                    <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 sm:truncate">
                    {transaction.isPlanned && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 mr-2">
                        ⏳ Planned
                      </span>
                    )}
                    {transaction.description}
                    {transaction.type === 'transfer' && transaction.toAccountId && (
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400 block sm:inline">
                        → {getAccountById(transaction.toAccountId)?.name}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                    {transaction.type !== 'transfer' && getCategoryDisplay(transaction.category)}
                    {transaction.type === 'transfer' && (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Transfer
                      </span>
                    )}
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {getAccountById(transaction.accountId)?.name || 'Unknown'}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                      {formatDate(transaction.timestamp)}
                      {transaction.isPlanned && (
                        <span className="ml-1 text-orange-600 dark:text-orange-400 font-medium">
                          • {new Date(transaction.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold whitespace-nowrap ${
                  transaction.isPlanned ? 'opacity-70' : ''
                } ${
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 
                  transaction.type === 'transfer' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : 
                   transaction.type === 'transfer' ? '↔' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                  {formatDate(transaction.timestamp)}
                  {transaction.isPlanned && (
                    <span className="block text-orange-600 dark:text-orange-400 font-medium">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;