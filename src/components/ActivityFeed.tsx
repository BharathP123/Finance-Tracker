import React from 'react';
import { Activity, Plus, Target, Download, Settings, RotateCcw } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const ActivityFeed: React.FC = () => {
  const { transactions, budgets, savingsGoals, recurringRules } = useTransactions();
  const { formatCurrency } = useCurrency();

  // Generate activity feed from recent actions
  const activities = [];

  // Recent transactions (last 5)
  const recentTransactions = transactions
    .filter(t => !t.isPlanned)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  recentTransactions.forEach(transaction => {
    activities.push({
      id: `transaction-${transaction.id}`,
      type: 'transaction',
      icon: Plus,
      title: `Added ${transaction.type}`,
      description: `${transaction.description} - ${formatCurrency(transaction.amount)}`,
      timestamp: transaction.timestamp,
      color: transaction.type === 'income' ? 'text-green-600' : 'text-red-600',
      bgColor: transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50',
    });
  });

  // Recent budgets (last 2)
  const recentBudgets = budgets
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-2);

  recentBudgets.forEach(budget => {
    activities.push({
      id: `budget-${budget.id}`,
      type: 'budget',
      icon: Target,
      title: 'Budget created',
      description: `Set ${formatCurrency(budget.amount)} budget for ${budget.month}`,
      timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Random recent time
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    });
  });

  // Recent goals (last 2)
  const recentGoals = savingsGoals
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  recentGoals.forEach(goal => {
    activities.push({
      id: `goal-${goal.id}`,
      type: 'goal',
      icon: Target,
      title: 'Savings goal created',
      description: `Target: ${formatCurrency(goal.targetAmount)} by ${new Date(goal.targetDate).toLocaleDateString()}`,
      timestamp: new Date(goal.createdAt).getTime(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    });
  });

  // Recent recurring rules (last 2)
  const recentRecurring = recurringRules
    .filter(rule => rule.isActive)
    .slice(-2);

  recentRecurring.forEach(rule => {
    activities.push({
      id: `recurring-${rule.id}`,
      type: 'recurring',
      icon: RotateCcw,
      title: 'Recurring rule added',
      description: `${rule.description} - ${formatCurrency(rule.amount)} ${rule.interval}`,
      timestamp: Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000, // Random recent time
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    });
  });

  // Sort by timestamp and take last 6
  const sortedActivities = activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6);

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
      </div>

      {sortedActivities.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {sortedActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <div className={`p-1.5 rounded-lg ${activity.bgColor.replace('bg-', 'bg-')} dark:bg-opacity-30 flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <Activity className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Start using the app to see your activity here</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;