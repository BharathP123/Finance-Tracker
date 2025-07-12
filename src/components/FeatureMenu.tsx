import React from 'react';
import { BarChart3, Target, List, Wallet, ArrowRightLeft, RotateCcw, TrendingUp, Brain, Calculator, Download, Settings, Home, DivideIcon as LucideIcon } from 'lucide-react';
import EnhancedDashboard from './EnhancedDashboard';

interface Tab {
  id: 'overview' | 'money' | 'ai' | 'more';
  name: string;
  icon: LucideIcon;
  features: string[];
}

interface FeatureMenuProps {
  activeTab: 'overview' | 'money' | 'ai' | 'more';
  tabs: Tab[];
  onFeatureSelect: (feature: string) => void;
}

const FeatureMenu: React.FC<FeatureMenuProps> = ({ activeTab, tabs, onFeatureSelect }) => {
  const featureConfig = {
    dashboard: { name: 'Dashboard', icon: Home, description: 'Overview of your finances' },
    budgets: { name: 'Budget', icon: Target, description: 'Track spending limits' },
    charts: { name: 'Charts', icon: BarChart3, description: 'Visual analytics' },
    transactions: { name: 'Transactions', icon: List, description: 'View all transactions' },
    accounts: { name: 'Accounts', icon: Wallet, description: 'Manage your accounts' },
    transfers: { name: 'Transfers', icon: ArrowRightLeft, description: 'Move money between accounts' },
    recurring: { name: 'Recurring', icon: RotateCcw, description: 'Automated transactions' },
    goals: { name: 'Goals', icon: Target, description: 'Savings targets' },
    insights: { name: 'Insights', icon: Brain, description: 'AI-powered analysis' },
    tools: { name: 'Tools', icon: Calculator, description: 'Financial calculators' },
    export: { name: 'Export', icon: Download, description: 'Backup & export data' },
    settings: { name: 'Settings', icon: Settings, description: 'Categories & preferences' },
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);
  
  if (!currentTab) return null;

  const TabIcon = currentTab.icon;

  // Show enhanced dashboard for overview tab when no specific feature is selected
  if (activeTab === 'overview') {
    return <EnhancedDashboard onFeatureSelect={onFeatureSelect} />;
  }
  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
            <TabIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{currentTab.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Choose a feature to get started</p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-staggerIn">
        {currentTab.features.map((featureId) => {
          const feature = featureConfig[featureId as keyof typeof featureConfig];
          if (!feature) return null;

          const FeatureIcon = feature.icon;

          return (
            <button
              key={featureId}
              onClick={() => onFeatureSelect(featureId)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1 active:translate-y-0 active:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:scale-110 transition-all duration-200">
                  <FeatureIcon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors duration-200" style={{ fontSize: '16px', lineHeight: '1.3' }}>
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    {feature.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg 
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-200 group-hover:translate-x-1 group-active:scale-95" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats for Overview Tab */}

      {/* AI Features Highlight */}
      {activeTab === 'ai' && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Features</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Leverage artificial intelligence to automate your finances and gain valuable insights into your spending patterns.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeatureMenu;