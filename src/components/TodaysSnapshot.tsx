import React from 'react';
import { Calendar, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const TodaysSnapshot: React.FC = () => {
  const { transactions, getCategoryById, getAccountById } = useTransactions();
  const { formatCurrency } = useCurrency();

  // Get today's transactions
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;

  const todaysTransactions = transactions
    .filter(t => t.timestamp >= todayStart && t.timestamp < todayEnd)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  // Calculate today's totals
  const todaysIncome = todaysTransactions
    .filter(t => t.type === 'income' && !t.isPlanned)
    .reduce((sum, t) => sum + t.amount, 0);

  const todaysExpenses = todaysTransactions
    .filter(t => t.type === 'expense' && !t.isPlanned)
    .reduce((sum, t) => sum + t.amount, 0);

  // Get week's spending by category for mini chart
  const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
  const weekTransactions = transactions.filter(t => 
    !t.isPlanned && t.type === 'expense' && t.timestamp >= weekStart && t.timestamp < todayEnd
  );

  const categorySpending = weekTransactions.reduce((acc, t) => {
    const category = getCategoryById(t.category);
    if (category) {
      acc[category.name] = (acc[category.name] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Activity</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Net</p>
          <p className={`text-sm font-bold ${
            (todaysIncome - todaysExpenses) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(todaysIncome - todaysExpenses)}
          </p>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Income</span>
          </div>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(todaysIncome)}</p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">Expenses</span>
          </div>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(todaysExpenses)}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Latest Transactions</h3>
        {todaysTransactions.length > 0 ? (
          <div className="space-y-2">
            {todaysTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`p-1.5 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 
                    transaction.type === 'transfer' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                    ) : transaction.type === 'transfer' ? (
                      <TrendingUp className="w-3 h-3 text-blue-600 dark:text-blue-400 transform rotate-90" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {transaction.isPlanned && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 mr-2">
                          ⏳
                        </span>
                      )}
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      {transaction.type !== 'transfer' && getCategoryDisplay(transaction.category)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(transaction.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${
                  transaction.isPlanned ? 'opacity-70' : ''
                } ${
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 
                  transaction.type === 'transfer' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : 
                   transaction.type === 'transfer' ? '↔' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No transactions today</p>
        )}
      </div>

      {/* Week's Top Categories */}
      {topCategories.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <PieChart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">This Week's Top Spending</h3>
          </div>
          <div className="space-y-2">
            {topCategories.map(([category, amount], index) => {
              const percentage = (amount / topCategories.reduce((sum, [,amt]) => sum + amt, 0)) * 100;
              const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500'];
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(amount)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(0)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysSnapshot;