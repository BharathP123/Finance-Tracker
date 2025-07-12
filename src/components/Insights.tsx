import React from 'react';
import { Brain, AlertTriangle, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const Insights: React.FC = () => {
  const { 
    getBudgetPredictions, 
    getSavingsProgress, 
    getCategoryById,
    getMonthlyIncome,
    getMonthlyExpenses,
    getTotalIncome,
    getTotalExpenses 
  } = useTransactions();
  const { formatCurrency } = useCurrency();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const budgetPredictions = getBudgetPredictions(currentMonth);
  const savingsProgress = getSavingsProgress();
  const monthlyIncome = getMonthlyIncome(currentMonth);
  const monthlyExpenses = getMonthlyExpenses(currentMonth);
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();

  // Calculate insights
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  const overallSavingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  
  const insights = [
    // Budget warnings
    ...budgetPredictions.map(prediction => {
      const category = getCategoryById(prediction.categoryId);
      return {
        type: 'warning' as const,
        icon: AlertTriangle,
        title: `Budget Alert: ${category?.name}`,
        description: `At current pace, you'll exceed your budget by ${formatCurrency(prediction.projectedAmount - (prediction.projectedAmount / (1 + prediction.daysLeft / 30)))} this month.`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }),
    
    // Savings insights
    ...(savingsRate > 20 ? [{
      type: 'positive' as const,
      icon: TrendingUp,
      title: 'Excellent Savings Rate!',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income this month. Keep up the great work!`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    }] : savingsRate < 0 ? [{
      type: 'warning' as const,
      icon: AlertTriangle,
      title: 'Spending More Than Earning',
      description: `You're spending ${Math.abs(savingsRate).toFixed(1)}% more than you earn this month. Consider reviewing your expenses.`,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    }] : savingsRate < 10 ? [{
      type: 'suggestion' as const,
      icon: Lightbulb,
      title: 'Low Savings Rate',
      description: `You're saving only ${savingsRate.toFixed(1)}% this month. Try to aim for at least 20% savings rate.`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    }] : []),
    
    // Savings goals insights
    ...savingsProgress
      .filter(goal => !goal.isCompleted && goal.estimatedCompletionDate)
      .slice(0, 2)
      .map(goal => ({
        type: 'info' as const,
        icon: Target,
        title: `Goal Progress: ${goal.name}`,
        description: `You're ${goal.progressPercentage.toFixed(1)}% towards your goal. At current pace, you'll reach it by ${new Date(goal.estimatedCompletionDate!).toLocaleDateString()}.`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      })),
  ];

  // Add general financial health insight
  if (overallSavingsRate > 15) {
    insights.push({
      type: 'positive' as const,
      icon: TrendingUp,
      title: 'Strong Financial Health',
      description: `Your overall savings rate is ${overallSavingsRate.toFixed(1)}%. You're building wealth consistently!`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Smart Insights</h2>
        <span className="text-sm text-gray-500">AI-powered Finance Pouch analysis</span>
      </div>

      {insights.length > 0 ? (
        <div className="space-y-4">
          {insights.slice(0, 6).map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-white`}>
                    <Icon className={`w-4 h-4 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${insight.color} mb-1`}>
                      {insight.title}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No insights available yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add more transactions and budgets to get personalized insights</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Monthly Savings Rate</p>
            <p className={`text-lg font-semibold ${
              savingsRate > 20 ? 'text-green-600' : 
              savingsRate < 0 ? 'text-red-600' : 
              savingsRate < 10 ? 'text-yellow-600' : 'text-blue-600'
            }`}>
              {savingsRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Overall Savings Rate</p>
            <p className={`text-lg font-semibold ${
              overallSavingsRate > 15 ? 'text-green-600' : 
              overallSavingsRate < 0 ? 'text-red-600' : 
              overallSavingsRate < 10 ? 'text-yellow-600' : 'text-blue-600'
            }`}>
              {overallSavingsRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Active Goals</p>
            <p className="text-lg font-semibold text-blue-600">
              {savingsProgress.filter(g => !g.isCompleted).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Budget Alerts</p>
            <p className="text-lg font-semibold text-red-600">
              {budgetPredictions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;