import React, { useState } from 'react';
import { Settings, Wallet, Target, Tag, Download, Calculator, RotateCcw } from 'lucide-react';
import CurrencySelector from './CurrencySelector';
import AccountsManager from './AccountsManager';
import SavingsGoals from './SavingsGoals';
import ExportManager from './ExportManager';
import Tools from './Tools';
import RecurringTransactions from './RecurringTransactions';

type SettingsTab = 'accounts' | 'goals' | 'recurring' | 'export' | 'tools';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('accounts');

  const tabs = [
    { id: 'accounts' as const, name: 'Accounts', icon: Wallet },
    { id: 'goals' as const, name: 'Goals', icon: Target },
    { id: 'recurring' as const, name: 'Recurring', icon: RotateCcw },
    { id: 'export' as const, name: 'Export', icon: Download },
    { id: 'tools' as const, name: 'Tools', icon: Calculator },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'accounts':
        return <AccountsManager />;
      case 'goals':
        return <SavingsGoals />;
      case 'recurring':
        return <RecurringTransactions />;
      case 'export':
        return <ExportManager />;
      case 'tools':
        return <Tools />;
      default:
        return <AccountsManager />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-2">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Manage</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your accounts, budgets, and preferences</p>
      </div>

      {/* Mobile Currency Selector */}
      <div className="sm:hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Currency</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred currency</p>
          </div>
          <CurrencySelector />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-1 md:p-2 overflow-x-auto">
        <div className="flex sm:grid sm:grid-cols-5 gap-1 md:gap-2 min-w-max sm:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all duration-200 touch-manipulation min-h-[60px] min-w-[80px] sm:min-w-0 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;