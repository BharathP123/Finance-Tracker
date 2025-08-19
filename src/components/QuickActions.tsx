import React, { useState } from 'react';
import { Plus, RotateCcw, Target, TrendingUp, ArrowRightLeft, PiggyBank, Download } from 'lucide-react';

interface QuickActionsProps {
  onAddTransaction: () => void;
  onAddRecurring: () => void;
  onAddGoal: () => void;
  onTransfer: () => void;
  onViewInsights: () => void;
  onExport: () => void;
  onAddExpense: () => void;
  onAddIncome: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddTransaction,
  onAddRecurring,
  onAddGoal,
  onTransfer,
  onViewInsights,
  onExport,
  onAddExpense,
  onAddIncome,
}) => {
  const [categoryType, setCategoryType] = useState<string>('expense'); // track category type

  const handleAddExpense = () => {
    setCategoryType('expense'); // Set to Expense form
    onAddExpense(); // Call the Add Expense function
  };

  const handleAddIncome = () => {
    setCategoryType('income'); // Set to Income form
    onAddIncome(); // Call the Add Income function
  };

  const actions = [
    {
      id: 'add-transaction',
      name: 'Add Transaction',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white',
      onClick: onAddTransaction,
      primary: true,
    },
    {
      id: 'add-expense',
      name: 'Add Expense',
      icon: RotateCcw,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white',
      onClick: handleAddExpense, // Trigger the expense action
    },
    {
      id: 'add-income',
      name: 'Add Income',
      icon: PiggyBank,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      textColor: 'text-white',
      onClick: handleAddIncome, // Trigger the income action
    },
    {
      id: 'add-recurring',
      name: 'Add Recurring',
      icon: RotateCcw,
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-white',
      onClick: onAddRecurring,
    },
    {
      id: 'add-goal',
      name: 'Savings Goal',
      icon: PiggyBank,
      color: 'bg-pink-500 hover:bg-pink-600',
      textColor: 'text-white',
      onClick: onAddGoal,
    },
    {
      id: 'transfer',
      name: 'Transfer',
      icon: ArrowRightLeft,
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white',
      onClick: onTransfer,
    },
    {
      id: 'insights',
      name: 'AI Insights',
      icon: TrendingUp,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-white',
      onClick: onViewInsights,
    },
    {
      id: 'export',
      name: 'Export Data',
      icon: Download,
      color: 'bg-gray-500 hover:bg-gray-600',
      textColor: 'text-white',
      onClick: onExport,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`${action.color} dark:brightness-90 ${action.textColor} rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md group ${
                action.primary ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-200">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-center leading-tight">
                  {action.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Conditionally render the form based on the categoryType */}
      <div>
        {categoryType === 'expense' ? (
          <div>Add Expense Form - Show expense related form</div>
        ) : (
          <div>Add Income Form - Show income related form</div>
        )}
      </div>
    </div>
  );
};

export default QuickActions;
