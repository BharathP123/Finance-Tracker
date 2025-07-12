import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, AlertTriangle, Target, BarChart3 } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const FutureProjections: React.FC = () => {
  const { 
    getTotalAccountsBalance, 
    recurringRules, 
    transactions,
    accounts 
  } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [projectionDays, setProjectionDays] = useState(30);

  const hasAccounts = accounts.length > 0;
  const currentBalance = getTotalAccountsBalance();

  // Calculate future projections
  const calculateProjections = () => {
    if (!hasAccounts) {
      return {
        projectedBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        projections: [],
        status: 'no-accounts' as const
      };
    }

    const today = new Date();
    const endDate = new Date(today.getTime() + projectionDays * 24 * 60 * 60 * 1000);
    
    let runningBalance = currentBalance;
    const projections = [];
    const dailyProjections = [];

    // Get planned transactions
    const plannedTransactions = transactions.filter(t => 
      t.isPlanned && 
      t.timestamp >= today.getTime() && 
      t.timestamp <= endDate.getTime()
    );

    // Generate recurring transactions for the period
    const recurringTransactions = [];
    
    recurringRules.filter(rule => rule.isActive).forEach(rule => {
      const startDate = new Date(Math.max(new Date(rule.startDate).getTime(), today.getTime()));
      const ruleEndDate = rule.endDate ? new Date(rule.endDate) : endDate;
      const actualEndDate = new Date(Math.min(ruleEndDate.getTime(), endDate.getTime()));
      
      let currentDate = new Date(startDate);
      
      while (currentDate <= actualEndDate) {
        recurringTransactions.push({
          date: new Date(currentDate),
          amount: rule.amount,
          type: rule.type,
          description: rule.description,
          isRecurring: true
        });
        
        // Calculate next occurrence
        switch (rule.interval) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case 'yearly':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        }
      }
    });

    // Combine all future transactions
    const allFutureTransactions = [
      ...plannedTransactions.map(t => ({
        date: new Date(t.timestamp),
        amount: t.amount,
        type: t.type,
        description: t.description,
        isRecurring: false
      })),
      ...recurringTransactions
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate daily projections
    for (let i = 0; i <= projectionDays; i++) {
      const currentDay = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const dayTransactions = allFutureTransactions.filter(t => 
        t.date.toDateString() === currentDay.toDateString()
      );
      
      const dayIncome = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const dayExpenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      runningBalance += dayIncome - dayExpenses;
      
      dailyProjections.push({
        date: new Date(currentDay),
        balance: runningBalance,
        income: dayIncome,
        expenses: dayExpenses,
        transactions: dayTransactions
      });
    }

    const totalIncome = allFutureTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = allFutureTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const finalBalance = runningBalance;
    
    let status: 'positive' | 'warning' | 'negative' = 'positive';
    if (finalBalance < 0) {
      status = 'negative';
    } else if (finalBalance < currentBalance * 0.2) {
      status = 'warning';
    }

    return {
      projectedBalance: finalBalance,
      totalIncome,
      totalExpenses,
      projections: dailyProjections,
      status
    };
  };

  const projectionData = calculateProjections();

  const getStatusColor = () => {
    switch (projectionData.status) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBgColor = () => {
    switch (projectionData.status) {
      case 'positive':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'negative':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusMessage = () => {
    if (projectionData.status === 'no-accounts') {
      return 'Add accounts to see balance projections';
    }
    
    switch (projectionData.status) {
      case 'positive':
        return 'Your finances look healthy for the projected period';
      case 'warning':
        return 'Your balance may get low. Consider reducing expenses';
      case 'negative':
        return 'Warning: Projected negative balance. Review your spending';
      default:
        return '';
    }
  };

  if (!hasAccounts) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Future Projections</h2>
        </div>
        
        <div className="text-center py-8">
          <Target className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No accounts added</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Add your accounts to see balance forecasting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Future Projections</h2>
        </div>
        
        {/* Projection Range Selector */}
        <select
          value={projectionDays}
          onChange={(e) => setProjectionDays(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value={7}>7 days</option>
          <option value={15}>15 days</option>
          <option value={30}>30 days</option>
          <option value={60}>60 days</option>
          <option value={90}>90 days</option>
        </select>
      </div>

      {/* Status Alert */}
      <div className={`p-4 rounded-lg border mb-6 ${getStatusBgColor()}`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            {projectionData.status === 'negative' ? (
              <AlertTriangle className={`w-5 h-5 ${getStatusColor()}`} />
            ) : projectionData.status === 'warning' ? (
              <AlertTriangle className={`w-5 h-5 ${getStatusColor()}`} />
            ) : (
              <TrendingUp className={`w-5 h-5 ${getStatusColor()}`} />
            )}
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${getStatusColor()}`}>
              {projectionData.status === 'negative' ? 'Balance Warning' :
               projectionData.status === 'warning' ? 'Low Balance Alert' :
               'Financial Forecast'}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {getStatusMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Projection Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Balance</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(currentBalance)}
          </p>
        </div>
        
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expected Income</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            +{formatCurrency(projectionData.totalIncome)}
          </p>
        </div>
        
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expected Expenses</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            -{formatCurrency(projectionData.totalExpenses)}
          </p>
        </div>
        
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Projected Balance</p>
          <p className={`text-lg font-bold ${getStatusColor()}`}>
            {formatCurrency(projectionData.projectedBalance)}
          </p>
        </div>
      </div>

      {/* Balance Trend Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Balance Trend</h3>
        <div className="h-32 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative overflow-hidden">
          {/* Simple line chart representation */}
          <div className="flex items-end justify-between h-full">
            {projectionData.projections.slice(0, Math.min(projectionDays, 30)).map((day, index) => {
              const maxBalance = Math.max(currentBalance, projectionData.projectedBalance, 0);
              const minBalance = Math.min(currentBalance, projectionData.projectedBalance, 0);
              const range = maxBalance - minBalance || 1;
              const height = Math.max(4, ((day.balance - minBalance) / range) * 80);
              
              return (
                <div
                  key={index}
                  className={`w-1 rounded-t ${
                    day.balance >= 0 ? 'bg-blue-500' : 'bg-red-500'
                  } opacity-70 hover:opacity-100 transition-opacity`}
                  style={{ height: `${height}%` }}
                  title={`${day.date.toLocaleDateString()}: ${formatCurrency(day.balance)}`}
                />
              );
            })}
          </div>
          
          {/* Zero line */}
          {projectionData.projectedBalance < 0 && (
            <div className="absolute left-0 right-0 border-t border-red-300 dark:border-red-600 border-dashed" 
                 style={{ bottom: '20%' }} />
          )}
        </div>
      </div>

      {/* Upcoming Transactions Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Upcoming Transactions (Next 7 days)
        </h3>
        
        {projectionData.projections.slice(0, 7).some(day => day.transactions.length > 0) ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {projectionData.projections.slice(0, 7).map((day) => 
              day.transactions.map((transaction, idx) => (
                <div key={`${day.date.toISOString()}-${idx}`} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg ${
                      transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                        {transaction.isRecurring && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                            🔁
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {day.date.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <Calendar className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming transactions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureProjections;