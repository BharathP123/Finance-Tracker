import React from 'react';
import { Calendar, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const UpcomingTransactions: React.FC = () => {
  const { getUpcomingTransactions, getCategoryById, getAccountById } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const upcomingTransactions = getUpcomingTransactions(30); // Next 30 days

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const diffInDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Tomorrow';
    } else if (diffInDays <= 7) {
      return `In ${diffInDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
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

  const groupedTransactions = upcomingTransactions.reduce((groups, transaction) => {
    const dateKey = new Date(transaction.timestamp).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, typeof upcomingTransactions>);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Transactions</h2>
        <span className="text-sm text-gray-500">
          ({upcomingTransactions.length} scheduled)
        </span>
      </div>

      {upcomingTransactions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No upcoming transactions</p>
          <p className="text-sm text-gray-400 mt-1">Schedule transactions to see them here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([dateKey, transactions]) => (
            <div key={dateKey} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <Clock className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700">
                  {formatDate(transactions[0].timestamp)}
                </h3>
                <span className="text-xs text-gray-500">
                  ({transactions.length} transaction{transactions.length !== 1 ? 's' : ''})
                </span>
              </div>

              {/* Transactions for this date */}
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' ? 'bg-green-50' : 
                        transaction.type === 'transfer' ? 'bg-blue-50' : 'bg-red-50'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : transaction.type === 'transfer' ? (
                          <TrendingUp className="w-4 h-4 text-blue-600 transform rotate-90" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                            ⏳ Planned
                          </span>
                          {transaction.description}
                          {transaction.type === 'transfer' && transaction.toAccountId && (
                            <span className="ml-1 text-xs text-gray-500">
                              → {getAccountById(transaction.toAccountId)?.name}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {transaction.type !== 'transfer' && getCategoryDisplay(transaction.category)}
                          {transaction.type === 'transfer' && (
                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Transfer
                            </span>
                          )}
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getAccountById(transaction.accountId)?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 
                        transaction.type === 'transfer' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : 
                         transaction.type === 'transfer' ? '↔' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTransactions;