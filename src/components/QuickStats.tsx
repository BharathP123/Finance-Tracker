import React from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

interface QuickStatsProps {
  todaySpending: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({ 
  todaySpending, 
  monthlyIncome, 
  monthlyExpenses 
}) => {
  const { formatCurrency } = useCurrency();

  const stats = [
    {
      label: 'Today',
      value: formatCurrency(todaySpending),
      icon: Calendar,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'This Month Income',
      value: formatCurrency(monthlyIncome),
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'This Month Spent',
      value: formatCurrency(monthlyExpenses),
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                <p className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;