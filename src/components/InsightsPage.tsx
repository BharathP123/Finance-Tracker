import React from 'react';
import { Brain, TrendingUp, Target, PieChart } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Charts from './Charts';
import MonthSelector from './MonthSelector';
import SmartInsights from './SmartInsights';

const InsightsPage: React.FC = () => {
  const { 
    getMonthlyIncome, 
    getMonthlyExpenses, 
    getSavingsProgress 
  } = useTransactions();
  const { formatCurrency } = useCurrency();

  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    return new Date().toISOString().slice(0, 7);
  });

  const monthlyIncome = getMonthlyIncome(selectedMonth);
  const monthlyExpenses = getMonthlyExpenses(selectedMonth);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  const savingsProgress = getSavingsProgress();

  const insights = [
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      description: savingsRate > 20 ? 'Excellent! You\'re saving well.' :
                   savingsRate < 0 ? 'You\'re spending more than earning.' :
                   'Try to save at least 20% of your income.',
      color: savingsRate > 20 ? 'text-green-600' : savingsRate < 0 ? 'text-red-600' : 'text-yellow-600',
      bgColor: savingsRate > 20 ? 'bg-green-50' : savingsRate < 0 ? 'bg-red-50' : 'bg-yellow-50',
      icon: TrendingUp,
    },
    {
      title: 'Savings Goals',
      value: savingsProgress.filter(g => !g.isCompleted).length.toString(),
      description: `${savingsProgress.filter(g => g.isCompleted).length} completed`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: Target,
    },
    {
      title: 'Net Balance',
      value: formatCurrency(monthlyIncome - monthlyExpenses),
      description: savingsRate > 0 ? 'Positive this month' : 'Negative this month',
      color: savingsRate > 0 ? 'text-green-600' : 'text-red-600',
      bgColor: savingsRate > 0 ? 'bg-green-50' : 'bg-red-50',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Financial Insights</h1>
        <p className="text-gray-600 dark:text-gray-400">Understand your spending patterns and progress</p>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className={`${insight.bgColor.replace('bg-', 'bg-')} dark:bg-opacity-20 rounded-xl p-4 border border-opacity-20`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/60 rounded-lg">
                  <Icon className={`w-5 h-5 ${insight.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{insight.title}</p>
                  <p className={`text-xl font-bold ${insight.color.replace('text-', 'text-')} dark:text-opacity-90`}>
                    {insight.value}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Month Selector */}
      <MonthSelector 
        selectedMonth={selectedMonth} 
        onMonthChange={setSelectedMonth} 
      />

      {/* Charts */}
      <Charts selectedMonth={selectedMonth} />

      {/* Smart AI Insights */}
      <SmartInsights variant="full" />
    </div>
  );
};

export default InsightsPage;