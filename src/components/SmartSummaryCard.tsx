import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, CreditCard } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const SmartSummaryCard: React.FC = () => {
  const { getBalance, getMonthlyIncome, getMonthlyExpenses, getTotalExpenses, getTotalAccountsBalance, getAccountBalance, accounts } = useTransactions();
  const { formatCurrency } = useCurrency();

  const totalExpenses = getTotalExpenses();
  const totalAccountBalance = getTotalAccountsBalance(); // Sum of all account balances
  
  const hasAccounts = accounts.length > 0;
  
  // Available Balance: ONLY show account balances, NOT affected by transactions when no accounts exist
  const realAvailableBalance = hasAccounts ? totalAccountBalance : 0;
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncome = getMonthlyIncome(currentMonth);
  const monthlyExpenses = getMonthlyExpenses(currentMonth);
  
  // Calculate savings rate
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Overview</h2>
        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
          <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Main Balance - Only show if accounts exist */}
      <div className="mb-6">
        {hasAccounts ? (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Balance</p>
            <p className={`text-3xl font-bold ${realAvailableBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(realAvailableBalance)}
            </p>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Account Total: {formatCurrency(totalAccountBalance)}</span>
              <span>Total Spent: {formatCurrency(totalExpenses)}</span>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-gray-400 dark:text-gray-500">
              {formatCurrency(0)}
            </p>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>No accounts added</span>
              <span>Total Spent: {formatCurrency(totalExpenses)}</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Add accounts to track your balance
            </p>
          </>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">This Month</span>
          </div>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(monthlyIncome)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Income</p>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Spent</span>
          </div>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(monthlyExpenses)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Balance</span>
          </div>
          <p className={`text-lg font-bold ${hasAccounts ? ((totalAccountBalance - totalExpenses) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400') : 'text-gray-400 dark:text-gray-500'}`}>
            {hasAccounts ? formatCurrency(realAvailableBalance) : formatCurrency(0)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {hasAccounts ? 'Current' : 'Add accounts'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default SmartSummaryCard;