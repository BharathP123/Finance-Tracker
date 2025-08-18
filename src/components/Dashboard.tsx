import React, { useState, useEffect } from 'react';
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
    getTotalIncome, // Get total income
    getAccountBalance,
    getMonthlyExpenses,
    getMonthlyIncome,
    accounts,
    recurringRules 
  } = useTransactions();
  const { formatCurrency } = useCurrency();

  const hasAccounts = accounts.length > 0;
  const hasRecurringRules = recurringRules.length > 0;

  // State for available balance
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  useEffect(() => {
    // Recalculate total income and total expenses when the transactions change
    const totalIncome = getTotalIncome();  // Get total income
    const totalSpent = getTotalExpenses(); // Get total expenses
    
    // If no income exists, ensure available balance is 0 or only reflect expenses
    const calculatedAvailableBalance = totalIncome > 0 ? totalIncome - totalSpent : 0;

    // Update the state with the new available balance
    setAvailableBalance(calculatedAvailableBalance);
  }, [getTotalIncome, getTotalExpenses, setAvailableBalance]); // Recalculate every time transactions change

  // This month's data
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncome = getMonthlyIncome(currentMonth);
  const monthlyExpenses = getMonthlyExpenses(currentMonth);

  // Today's spending (confirm only non-planned expenses)
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;

  const todaySpending = useTransactions().transactions
    .filter(t => t.type === 'expense' && t.timestamp >= todayStart && t.timestamp < todayEnd && !t.isPlanned)  // Ensure it's a confirmed expense
    .reduce((sum, t) => sum + t.amount, 0);

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
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 md:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm font-medium">Available Balance</p>
            <p className="text-2xl md:text-3xl font-bold">
              {formatCurrency(availableBalance)} {/* Updated Available Balance */}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:flex md:justify-between text-sm">
          <div>
            <p className="text-blue-100">Total Spent</p>
            <p className="font-semibold">{formatCurrency(getTotalExpenses())}</p> {/* Total Spent */}
          </div>
        </div>
      </div>

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

      {/* Future Projections */}
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
