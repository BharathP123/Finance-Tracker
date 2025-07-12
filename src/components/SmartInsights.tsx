import React, { useState } from 'react';
import { Brain, AlertTriangle, TrendingUp, Target, Lightbulb, CheckCircle, X, RefreshCw, Calendar, DollarSign, PieChart } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface SmartInsightsProps {
  variant?: 'dashboard' | 'full';
}

const SmartInsights: React.FC<SmartInsightsProps> = ({ variant = 'dashboard' }) => {
  const { 
    getMonthlyIncome,
    getMonthlyExpenses,
    getSavingsProgress,
    getCategorySpending,
    getRecentTransactions,
    transactions,
    recurringRules,
    getTotalAccountsBalance,
    accounts
  } = useTransactions();
  const { formatCurrency } = useCurrency();

  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  
  const monthlyIncome = getMonthlyIncome(currentMonth);
  const monthlyExpenses = getMonthlyExpenses(currentMonth);
  const lastMonthExpenses = getMonthlyExpenses(lastMonth);
  const savingsProgress = getSavingsProgress();
  const recentTransactions = getRecentTransactions(10);
  const totalAccountBalance = getTotalAccountsBalance();
  const hasAccounts = accounts.length > 0;

  // Calculate insights
  const generateInsights = () => {
    const insights = [];

    // 1. Monthly Spending Comparison
    if (lastMonthExpenses > 0 && monthlyExpenses > 0) {
      const percentageChange = ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
      if (Math.abs(percentageChange) > 15) {
        insights.push({
          id: 'monthly-comparison',
          type: percentageChange > 0 ? 'warning' as const : 'positive' as const,
          icon: TrendingUp,
          title: percentageChange > 0 ? 'Spending Increased' : 'Great Job Saving!',
          message: `Your spending is ${Math.abs(percentageChange).toFixed(1)}% ${percentageChange > 0 ? 'higher' : 'lower'} than last month (${formatCurrency(Math.abs(monthlyExpenses - lastMonthExpenses))}).`,
          color: percentageChange > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400',
          bgColor: percentageChange > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-green-50 dark:bg-green-900/20',
          borderColor: percentageChange > 0 ? 'border-orange-200 dark:border-orange-800' : 'border-green-200 dark:border-green-800',
          priority: 2
        });
      }
    }

    // 2. Weekend vs Weekday Spending
    const last7Days = recentTransactions.filter(t => {
      const daysDiff = (Date.now() - t.timestamp) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7 && t.type === 'expense' && !t.isPlanned;
    });

    const weekendSpending = last7Days.filter(t => {
      const day = new Date(t.timestamp).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    }).reduce((sum, t) => sum + t.amount, 0);

    const weekdaySpending = last7Days.filter(t => {
      const day = new Date(t.timestamp).getDay();
      return day >= 1 && day <= 5; // Monday to Friday
    }).reduce((sum, t) => sum + t.amount, 0);

    if (weekendSpending > 0 && weekdaySpending > 0 && weekendSpending > weekdaySpending * 1.5) {
      insights.push({
        id: 'weekend-spike',
        type: 'suggestion' as const,
        icon: Calendar,
        title: 'Weekend Spending Spike',
        message: `Your weekend spending (${formatCurrency(weekendSpending)}) was ${(weekendSpending / weekdaySpending).toFixed(1)}x higher than weekdays. Consider planning weekend activities within budget.`,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        priority: 3
      });
    }

    // 3. Recurring Transactions Review
    const activeRecurring = recurringRules.filter(r => r.isActive);
    if (activeRecurring.length >= 5) {
      const totalRecurringAmount = activeRecurring.reduce((sum, r) => sum + r.amount, 0);
      insights.push({
        id: 'recurring-review',
        type: 'suggestion' as const,
        icon: RefreshCw,
        title: 'Subscription Review Time',
        message: `You have ${activeRecurring.length} recurring transactions totaling ${formatCurrency(totalRecurringAmount)}/month. Consider reviewing if all are still needed.`,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        borderColor: 'border-purple-200 dark:border-purple-800',
        priority: 4
      });
    }

    // 4. Low Balance Warning
    if (hasAccounts && totalAccountBalance > 0 && totalAccountBalance < 1000) {
      insights.push({
        id: 'low-balance',
        type: 'warning' as const,
        icon: DollarSign,
        title: 'Low Balance Alert',
        message: `Your available balance is ${formatCurrency(totalAccountBalance)}. Consider holding off on non-essential expenses.`,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        priority: 1
      });
    }

    // 5. Savings Goal Progress
    const activeGoals = savingsProgress.filter(g => !g.isCompleted && g.progressPercentage > 0);
    if (activeGoals.length > 0) {
      const goal = activeGoals.sort((a, b) => b.progressPercentage - a.progressPercentage)[0];
      if (goal.progressPercentage >= 25) {
        insights.push({
          id: 'goal-progress',
          type: 'positive' as const,
          icon: Target,
          title: `Goal Progress: ${goal.name}`,
          message: `Great progress! You've reached ${goal.progressPercentage.toFixed(0)}% of your ${goal.name} goal (${formatCurrency(goal.currentAmount)} of ${formatCurrency(goal.targetAmount)}).`,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          priority: 3
        });
      }
    }

    // 6. Savings Rate Insights
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    if (monthlyIncome > 0) {
      if (savingsRate > 30) {
        insights.push({
          id: 'excellent-savings',
          type: 'positive' as const,
          icon: TrendingUp,
          title: 'Excellent Savings Rate!',
          message: `Outstanding! You're saving ${savingsRate.toFixed(1)}% of your income this month. You're building wealth effectively.`,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          priority: 3
        });
      } else if (savingsRate < 0) {
        insights.push({
          id: 'negative-savings',
          type: 'warning' as const,
          icon: AlertTriangle,
          title: 'Spending Alert',
          message: `You're spending ${Math.abs(savingsRate).toFixed(1)}% more than you earn this month. Review your expenses to get back on track.`,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          priority: 1
        });
      } else if (savingsRate < 10) {
        insights.push({
          id: 'low-savings',
          type: 'suggestion' as const,
          icon: Lightbulb,
          title: 'Savings Opportunity',
          message: `You're saving ${savingsRate.toFixed(1)}% this month. Try to increase this to 20% by reducing discretionary spending.`,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          priority: 3
        });
      }
    }

    // 7. Category Spending Pattern
    const foodSpending = getCategorySpending('food', currentMonth);
    const transportSpending = getCategorySpending('transport', currentMonth);
    if (foodSpending > transportSpending * 3 && transportSpending > 0) {
      insights.push({
        id: 'food-transport-ratio',
        type: 'suggestion' as const,
        icon: PieChart,
        title: 'Spending Pattern Insight',
        message: `Your food spending (${formatCurrency(foodSpending)}) is much higher than transport (${formatCurrency(transportSpending)}). Consider meal planning to optimize costs.`,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        priority: 4
      });
    }

    // 8. No Activity Insight
    if (monthlyIncome === 0 && monthlyExpenses === 0) {
      insights.push({
        id: 'no-activity',
        type: 'suggestion' as const,
        icon: Lightbulb,
        title: 'Get Started with Finance Pouch',
        message: 'Start tracking your finances by adding your first transaction. Click the + button to record an expense or income.',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        priority: 5
      });
    }

    // Sort by priority and filter dismissed
    return insights
      .filter(insight => !dismissedInsights.includes(insight.id))
      .sort((a, b) => a.priority - b.priority);
  };

  const insights = generateInsights();
  const displayInsights = variant === 'dashboard' ? insights.slice(0, 3) : insights;

  const handleDismiss = (insightId: string) => {
    setDismissedInsights(prev => [...prev, insightId]);
  };

  const handleRefresh = () => {
    setDismissedInsights([]);
    setRefreshKey(prev => prev + 1);
  };

  if (displayInsights.length === 0) {
    return variant === 'dashboard' ? null : (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Insights</h3>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg"
            title="Refresh insights"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 dark:text-green-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">All caught up!</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No new insights at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {variant === 'dashboard' ? 'Smart Insights' : 'AI-Powered Financial Insights'}
          </h3>
          {variant === 'dashboard' && insights.length > 3 && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
              +{insights.length - 3} more
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg"
          title="Refresh insights"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className={`space-y-4 ${variant === 'dashboard' ? 'max-h-80 overflow-y-auto' : ''}`}>
        {displayInsights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={`${insight.id}-${refreshKey}`}
              className={`p-4 rounded-lg border ${insight.bgColor.replace('bg-', 'bg-')} ${insight.borderColor.replace('border-', 'border-')} transition-all duration-200 hover:shadow-sm`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg flex-shrink-0">
                  <Icon className={`w-4 h-4 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold ${insight.color.replace('text-', 'text-')} dark:text-opacity-90 mb-1`}>
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {insight.message}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismiss(insight.id)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 ml-2 flex-shrink-0"
                      title="Dismiss insight"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {variant === 'dashboard' && insights.length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            View all insights in the Insights tab for more detailed analysis
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartInsights;