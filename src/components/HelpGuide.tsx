import React from 'react';
import { X, Home, Plus, List, TrendingUp, Settings, Wallet, Target, BarChart3, Calculator, Download, DollarSign, ArrowRightLeft, RotateCcw, PiggyBank, Brain, Tag, HelpCircle } from 'lucide-react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpGuide: React.FC<HelpGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      id: 'dashboard',
      title: '🏠 Dashboard',
      icon: Home,
      content: [
        'Shows your total balance, income, and expenses at a glance',
        'Available Balance only appears if you\'ve added accounts with money',
        'View today\'s spending and this month\'s financial summary',
        'Quick actions to add expenses or income instantly',
        'Recent activity shows your latest transactions'
      ]
    },
    {
      id: 'add-transaction',
      title: '➕ Add Transaction',
      icon: Plus,
      content: [
        'Click the blue ➕ button to add expenses or income',
        'Choose between Expense (money spent) or Income (money earned)',
        'Enter amount, description, date, category, and account',
        'Use quick amount buttons for common values',
        'All transactions are saved automatically and appear in your dashboard'
      ]
    },
    {
      id: 'accounts',
      title: '💳 Accounts',
      icon: Wallet,
      content: [
        'Add your wallets, bank accounts, UPI, or cash balances',
        'Account balances are used to calculate your total available funds',
        'Support for different account types: Cash, Bank, Credit Card, etc.',
        'View individual account balances and recent transactions',
        'Default accounts (Cash, Savings) are provided to get started'
      ]
    },
    {
      id: 'transactions',
      title: '📋 Transaction History',
      icon: List,
      content: [
        'View and search your complete transaction history',
        'Filter by date, category, type (income/expense), or account',
        'Search transactions by description or keywords',
        'Edit or delete transactions if needed',
        'Transactions are grouped by date for easy viewing'
      ]
    },
    {
      id: 'insights',
      title: '📊 Insights & Charts',
      icon: BarChart3,
      content: [
        'Visual charts showing your spending patterns over time',
        'Monthly trends comparing income vs expenses',
        'Category-wise expense breakdown with pie charts',
        'Savings rate calculation and financial health indicators',
        'Smart insights powered by AI to help improve your finances'
      ]
    },
    {
      id: 'goals',
      title: '🐷 Savings Goals',
      icon: PiggyBank,
      content: [
        'Set savings goals like "Trip to Goa ₹20,000" or "Emergency Fund ₹50,000"',
        'Track progress by manually adding contributions',
        'View completion percentage and estimated completion date',
        'Get motivated with visual progress indicators',
        'Mark goals as completed when you reach your target'
      ]
    },
    {
      id: 'tools',
      title: '🧮 Financial Tools',
      icon: Calculator,
      content: [
        'EMI Calculator: Calculate loan monthly payments',
        'Savings Calculator: Plan your future savings with interest',
        'Interest Calculator: Calculate simple interest on investments',
        'All calculators work with your preferred currency',
        'Useful for financial planning and decision making'
      ]
    },
    {
      id: 'export',
      title: '💾 Export & Backup',
      icon: Download,
      content: [
        'Download your transaction data as CSV for Excel/Google Sheets',
        'Create full backup of all your financial data in JSON format',
        'Import backup files to restore your data',
        'Filter and export specific date ranges or transaction types',
        'Keep your data safe with regular backups'
      ]
    },
    {
      id: 'currency',
      title: '💱 Multi-Currency Support',
      icon: DollarSign,
      content: [
        'Support for 7+ major currencies: ₹, $, €, £, د.إ, C$, A$',
        'Change currency from the top-right dropdown',
        'All amounts automatically format in your selected currency',
        'Default currency is Indian Rupee (₹)',
        'Currency preference is saved for future sessions'
      ]
    },
    {
      id: 'tips',
      title: '💡 Pro Tips',
      icon: Brain,
      content: [
        'Add accounts first to see your real available balance',
        'Use descriptive transaction names for easier searching',
        'Check insights regularly to understand spending patterns',
        'Export data monthly as backup and for tax purposes',
        'Set realistic savings goals to stay motivated'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How to Use Finance Pouch</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete guide to managing your finances</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-white/50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to Finance Pouch! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Your smart personal finance companion. This guide will help you understand all features 
                and get the most out of your financial management experience.
              </p>
            </div>

            {/* Quick Start */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">🚀</span> Quick Start Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">For Beginners:</h4>
                  <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Go to Manage → Accounts and add your first account</li>
                    <li>Click the ➕ button to add your first expense</li>
                    <li>Check your dashboard to see the updated balance</li>
                    <li>Set savings goals in Manage → Goals</li>
                  </ol>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Advanced Users:</h4>
                  <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Set up multiple accounts for different money sources</li>
                    <li>Create savings goals and track progress</li>
                    <li>Use insights to analyze spending patterns</li>
                    <li>Export data for detailed analysis</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Feature Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id} className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {section.content.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Navigation Guide */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">🧭</span> Navigation Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg mb-2 mx-auto w-fit">
                    <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Home</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Dashboard & overview</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-green-100 dark:bg-green-800 rounded-lg mb-2 mx-auto w-fit">
                    <List className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">History</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">All transactions</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-lg mb-2 mx-auto w-fit">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Insights</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Charts & analysis</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-lg mb-2 mx-auto w-fit">
                    <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Manage</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Settings & tools</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">❓</span> Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Why is my Available Balance showing ₹0?</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Available Balance only shows when you add accounts with money. Go to Manage → Accounts to add your first account.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Can I change the currency?</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Yes! Click the currency selector in the top-right corner to choose from ₹, $, €, £, د.إ, C$, A$.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">How do I track my spending?</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Add transactions using the ➕ button, then view insights and charts to understand your spending patterns over time.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Is my data safe?</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">All data is stored locally on your device. Use the Export feature to create backups of your financial data.</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Need More Help?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Finance Pouch is designed to be intuitive and easy to use. Start with adding an account and your first transaction!
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>💡 Tip: Hover over buttons to see helpful tooltips</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Finance Pouch - Smart Personal Finance Management
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpGuide;