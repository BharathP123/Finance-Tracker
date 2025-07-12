import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { getChartColor, getCategoryDisplayName, getCategoryEmoji } from '../utils/categoryColors';

interface ChartsProps {
  selectedMonth: string;
}

const Charts: React.FC<ChartsProps> = ({ selectedMonth }) => {
  const { getExpensesByCategory, getMonthlyTrends, getMonthlyIncome, getMonthlyExpenses } = useTransactions();
  const { formatCurrency } = useCurrency();

  const expenseData = getExpensesByCategory(selectedMonth);
  const monthlyTrends = getMonthlyTrends();
  const monthlyIncome = getMonthlyIncome(selectedMonth);
  const monthlyExpenses = getMonthlyExpenses(selectedMonth);

  // Enhanced expense data with colors and emojis
  const enhancedExpenseData = expenseData.map((item, index) => ({
    ...item,
    color: getChartColor(item.category, index),
    emoji: getCategoryEmoji(item.category),
    displayName: getCategoryDisplayName(item.category)
  }));

  // Custom tooltip for pie chart
  const renderPieTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{data.payload.emoji}</span>
            <p className="font-medium text-gray-900 dark:text-white">{data.payload.displayName}</p>
          </div>
          <p className="text-blue-600 dark:text-blue-400 font-semibold">{formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {((data.value / enhancedExpenseData.reduce((sum, item) => sum + item.amount, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const renderBarTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{props.label}</p>
          {props.payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {entry.dataKey === 'income' ? 'Income' : entry.dataKey === 'expenses' ? 'Expenses' : 'Balance'}: 
                <span className="font-semibold ml-1">{formatCurrency(entry.value)}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Monthly Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Monthly Income</h3>
            <div className="flex items-center space-x-1">
              <span className="text-lg">💰</span>
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(monthlyIncome)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Monthly Expenses</h3>
            <div className="flex items-center space-x-1">
              <span className="text-lg">💸</span>
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400 transform rotate-180" />
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(monthlyExpenses)}</p>
        </div>
      </div>

      {/* Expenses by Category - Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <PieChartIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Expenses by Category</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>

        {enhancedExpenseData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enhancedExpenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {enhancedExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={renderPieTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 md:space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Category Breakdown</h4>
              {enhancedExpenseData.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.displayName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {((item.amount / enhancedExpenseData.reduce((sum, item) => sum + item.amount, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <PieChartIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No expense data for this month</p>
          </div>
        )}
      </div>

      {/* Monthly Trends - Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Monthly Trends</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">(Last 12 months)</span>
        </div>

        {monthlyTrends.length > 0 ? (
          <div className="h-64 md:h-80 overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={renderBarTooltip} />
                <Bar dataKey="income" fill="#10B981" name="Income" radius={[2, 2, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No data available for trends</p>
          </div>
        )}
      </div>

      {/* Balance Trend - Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Balance Trend</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">(Monthly Net Balance)</span>
        </div>

        {monthlyTrends.length > 0 ? (
          <div className="h-64 md:h-80 overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={renderBarTooltip} />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No data available for balance trend</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;