import React from 'react';
import { AlertTriangle, TrendingUp, Target, Lightbulb, CheckCircle, X } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const SmartAlertCard: React.FC = () => {
  const { 
    getBudgetPredictions, 
    getSavingsProgress, 
    getMonthlyIncome,
    getMonthlyExpenses,
    getCategoryById 
  } = useTransactions();
  const { formatCurrency } = useCurrency();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const budgetPredictions = getBudgetPredictions(currentMonth);
  const savingsProgress = getSavingsProgress();
  const monthlyIncome = getMonthlyIncome(currentMonth);
  const monthlyExpenses = getMonthlyExpenses(currentMonth);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  // Generate smart alerts
  const alerts = [];

  // Budget warnings
  if (budgetPredictions.length > 0) {
    const prediction = budgetPredictions[0];
    const category = getCategoryById(prediction.categoryId);
    alerts.push({
      type: 'warning' as const,
      icon: AlertTriangle,
      title: `Budget Alert: ${category?.name}`,
      message: `You're on track to exceed your budget by ${formatCurrency(prediction.projectedAmount - (prediction.projectedAmount / (1 + prediction.daysLeft / 30)))} this month.`,
      action: 'Review Budget',
      color: 'border-red-200 bg-red-50',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
    });
  }

  // Savings insights
  if (savingsRate > 20) {
    alerts.push({
      type: 'positive' as const,
      icon: TrendingUp,
      title: 'Excellent Savings!',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income this month. Keep up the great work!`,
      action: 'View Insights',
      color: 'border-green-200 bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
    });
  } else if (savingsRate < 0) {
    alerts.push({
      type: 'warning' as const,
      icon: AlertTriangle,
      title: 'Spending Alert',
      message: `You're spending ${Math.abs(savingsRate).toFixed(1)}% more than you earn this month. Consider reviewing your expenses.`,
      action: 'View Expenses',
      color: 'border-red-200 bg-red-50',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
    });
  } else if (savingsRate < 10) {
    alerts.push({
      type: 'suggestion' as const,
      icon: Lightbulb,
      title: 'Savings Opportunity',
      message: `You're saving only ${savingsRate.toFixed(1)}% this month. Try to aim for at least 20% savings rate.`,
      action: 'Set Goals',
      color: 'border-yellow-200 bg-yellow-50',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800',
    });
  }

  // Savings goals progress
  const activeGoals = savingsProgress.filter(goal => !goal.isCompleted);
  if (activeGoals.length > 0) {
    const goal = activeGoals[0];
    if (goal.progressPercentage >= 80) {
      alerts.push({
        type: 'positive' as const,
        icon: Target,
        title: 'Goal Almost Reached!',
        message: `You're ${goal.progressPercentage.toFixed(1)}% towards your "${goal.name}" goal. Just ${formatCurrency(goal.targetAmount - goal.currentAmount)} to go!`,
        action: 'View Goals',
        color: 'border-blue-200 bg-blue-50',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-800',
      });
    }
  }

  // Default tip if no alerts
  if (alerts.length === 0) {
    alerts.push({
      type: 'tip' as const,
      icon: Lightbulb,
      title: 'Financial Tip',
      message: 'Track your daily expenses to better understand your spending patterns and identify areas for improvement.',
      action: 'Add Transaction',
      color: 'border-blue-200 bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
    });
  }

  const alert = alerts[0]; // Show the first (most important) alert
  const Icon = alert.icon;

  return (
    <div className={`rounded-xl shadow-sm border p-4 ${alert.color.replace('bg-', 'bg-').replace('border-', 'border-')} dark:bg-opacity-20 dark:border-opacity-30`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg bg-white/60`}>
          <Icon className={`w-5 h-5 ${alert.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${alert.textColor.replace('text-', 'text-')} dark:text-opacity-90 mb-1`}>
            {alert.title}
          </h3>
          <p className={`text-sm ${alert.textColor.replace('text-', 'text-')} dark:text-opacity-80 opacity-90 mb-3 leading-relaxed`}>
            {alert.message}
          </p>
          <button className={`text-xs font-medium ${alert.iconColor.replace('text-', 'text-')} dark:text-opacity-90 hover:underline transition-colors duration-200`}>
            {alert.action} →
          </button>
        </div>
        {alert.type === 'positive' && (
          <CheckCircle className={`w-5 h-5 ${alert.iconColor} flex-shrink-0`} />
        )}
      </div>
    </div>
  );
};

export default SmartAlertCard;