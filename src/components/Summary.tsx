import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const Summary: React.FC = () => {
  const { getBalance, getTotalIncome, getTotalExpenses, getTotalAccountsBalance, getAccountBalance, accounts } = useTransactions();
  const { formatCurrency } = useCurrency();

  const totalAccountBalance = getTotalAccountsBalance(); // Sum of all account balances
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  
  const hasAccounts = accounts.length > 0;
  
  // Available Balance: ONLY show account balances, NOT affected by transactions when no accounts exist
  const realAvailableBalance = hasAccounts ? totalAccountBalance : 0;
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {/* Current Balance - Only show if accounts exist */}
      {hasAccounts ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium mb-1">Available Balance</p>
              <p className={`text-xl md:text-3xl font-bold ${realAvailableBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(realAvailableBalance)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Account Total ({formatCurrency(totalAccountBalance)}) - Spent ({formatCurrency(totalExpenses)})
              </p>
            </div>
            <div className={`p-2 md:p-3 rounded-lg ${realAvailableBalance >= 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
              <DollarSign className={`w-5 h-5 md:w-6 md:h-6 ${realAvailableBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm font-medium mb-1">Available Balance</p>
              <p className="text-xl md:text-3xl font-bold text-gray-500 dark:text-gray-400">
                {formatCurrency(0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add accounts to view available balance</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-gray-200 dark:bg-gray-600">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Total Income */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium mb-1">Total Income</p>
            <p className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="p-2 md:p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Your Spends (Total Expenses) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium mb-1">Your Spends</p>
            <p className="text-xl md:text-3xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="p-2 md:p-3 rounded-lg bg-red-50 dark:bg-red-900/30">
            <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;