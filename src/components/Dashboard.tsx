import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, PiggyBank } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import QuickStats from './QuickStats';
import RecentActivity from './RecentActivity';
import MonthlyProgress from './MonthlyProgress';
import SmartInsights from './SmartInsights';
import FutureProjections from './FutureProjections';

interface DashboardProps {
  onAddTransaction: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAddTransaction }) => {
  const { 
    getTotalAccountsBalance, 
    getTotalExpenses,
    getAccountBalance,
    getMonthlyExpenses,
    getMonthlyIncome,
    accounts,
    recurringRules 
  } = useTransactions();
  const { formatCurrency } = useCurrency();

  const hasAccounts = accounts.length > 0;
  const hasRecurringRules = recurringRules.length > 0;

  // Calculate actual available balance from accounts
  const totalAccountBalance = getTotalAccountsBalance(); // Initial account balances
  const totalSpent = getTotalExpenses();
  
  // Available Balance: ONLY show account balances, NOT affected by transactions when no accounts exist
  const realAvailableBalance = hasAccounts ? totalAccountBalance : 0;
  

  // Today's spending
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;
  
  const todaySpending = useTransactions().transactions
    .filter(t => t.type === 'expense' && t.timestamp >= todayStart && t.timestamp < todayEnd && !t.isPlanned)
    .reduce((sum, t) => sum + t.amount, 0);

  // This month's data
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncome = getMonthlyIncome(currentMonth);
  const monthlyExpenses = getMonthlyExpenses(currentMonth);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-3 md:py-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Good {(() => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Morning';
            if (hour < 17) return 'Afternoon';
            return 'Evening';
          })()}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Here's your financial overview</p>
      </div>

      {/* Main Balance Card */}
      {hasAccounts ? (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Available Balance</p>
              <p className="text-2xl md:text-3xl font-bold">
                {formatCurrency(realAvailableBalance)}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:flex md:justify-between text-sm">
            <div>
              <p className="text-blue-100">Total in Accounts</p>
              <p className="font-semibold">{formatCurrency(totalAccountBalance)}</p>
            </div>
            <div className="text-right md:text-right">
              <p className="text-blue-100">Total Spent</p>
              <p className="font-semibold">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 md:p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors duration-200">
          <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full w-fit mx-auto mb-4">
            <PiggyBank className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Accounts Added</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Add your wallet, bank account, or any money source to see your available balance
          </p>
          <div className="mb-4 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <p className="text-xl md:text-2xl font-bold text-gray-500 dark:text-gray-400">₹0.00</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Available Balance</p>
          </div>
          <button
            onClick={() => {
              // This would navigate to settings/accounts tab
              // For now, we'll show a simple message
              alert('Go to Manage > Accounts to add your first account');
            }}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 touch-manipulation min-h-[44px]"
          >
            Add Account
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <QuickStats 
        todaySpending={todaySpending}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
      />

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <button
            onClick={onAddTransaction}
            className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 active:bg-blue-200 dark:active:bg-blue-900/40 transition-colors duration-200 touch-manipulation min-h-[60px]"
          >
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Add Expense</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Track your spending</p>
            </div>
          </button>

          <button
            onClick={onAddTransaction}
            className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 active:bg-green-200 dark:active:bg-green-900/40 transition-colors duration-200 touch-manipulation min-h-[60px]"
          >
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Add Income</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Record earnings</p>
            </div>
          </button>
        </div>
      </div>

      {/* Future Projections - Show if user has accounts and recurring rules */}
      {(hasAccounts || hasRecurringRules) && <FutureProjections />}
      
      {/* Monthly Progress */}
      <MonthlyProgress />


      {/* Recent Activity */}
      <RecentActivity />

      {/* Smart Insights */}
      <SmartInsights variant="dashboard" />

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-3 md:p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
              {todaySpending === 0 
                ? "Great start! No expenses recorded today." 
                : todaySpending < 500 
                  ? "You're doing well with your spending today!" 
                  : "Keep track of your expenses to stay on budget."}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {todaySpending > 0 && `Today's spending: ${formatCurrency(todaySpending)}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;