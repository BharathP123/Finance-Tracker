import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const MonthlyProgress: React.FC = () => {
  const { getMonthlyIncome, getMonthlyExpenses } = useTransactions();
  const { formatCurrency } = useCurrency();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncome = getMonthlyIncome(currentMonth);
  const monthlyExpenses = getMonthlyExpenses(currentMonth);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">This Month</h3>
      </div>

      {/* Savings Rate */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Savings Rate</span>
          <span className={`text-lg font-bold ${
            savingsRate > 20 ? 'text-green-600 dark:text-green-400' : 
            savingsRate < 0 ? 'text-red-600 dark:text-red-400' : 
            'text-yellow-600 dark:text-yellow-400'
          }`}>
            {savingsRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              savingsRate > 20 ? 'bg-green-500' : 
              savingsRate < 0 ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}
            style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          {savingsRate > 20 ? 'Excellent! You\'re saving well.' :
           savingsRate < 0 ? 'You\'re spending more than earning.' :
           'Try to save at least 20% of your income.'}
        </p>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm font-medium text-green-700 dark:text-green-300">Income</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(monthlyIncome)}</p>
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">Expenses</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(monthlyExpenses)}</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyProgress;