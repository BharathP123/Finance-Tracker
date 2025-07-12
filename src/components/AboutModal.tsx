import React from 'react';
import { X, DollarSign, BarChart3, Bot, Target, Calculator, Download, Settings, Wallet } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: DollarSign,
      name: 'Overview',
      description: 'Complete financial dashboard with smart insights and real-time balance tracking'
    },
    {
      icon: Wallet,
      name: 'Money',
      description: 'Manage transactions, accounts, and transfers with ease'
    },
    {
      icon: Bot,
      name: 'AI',
      description: 'Smart categorization, recurring transactions, and savings goals with AI insights'
    },
    {
      icon: Calculator,
      name: 'Tools',
      description: 'Financial calculators, export options, and customizable settings'
    }
  ];

  const currencies = [
    '🇮🇳 Indian Rupee (₹)',
    '🇺🇸 US Dollar ($)',
    '🇪🇺 Euro (€)',
    '🇬🇧 British Pound (£)',
    '🇦🇪 UAE Dirham (د.إ)',
    '🇨🇦 Canadian Dollar (C$)',
    '🇦🇺 Australian Dollar (A$)'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img 
              src="/cash-pouch-icon.svg" 
              alt="Finance Pouch" 
              className="w-8 h-8 object-contain"
            />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About Finance Pouch</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* App Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Smart Personal Finance Tool</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Finance Pouch is a comprehensive personal finance management application designed to help you track expenses, 
              manage budgets, and achieve your financial goals with intelligent insights and automation.
            </p>
          </div>

          {/* Core Features */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Core Features</h4>
            <div className="space-y-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.name} className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">{feature.name}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Currency Support */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Multi-Currency Support</h4>
            <div className="grid grid-cols-1 gap-2">
              {currencies.map((currency, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                  {currency}
                </div>
              ))}
            </div>
          </div>

          {/* Key Benefits */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Key Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                Real-time expense tracking and categorization
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                AI-powered insights and spending analysis
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                Automated recurring transactions and budgets
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                Comprehensive data export and backup options
              </li>
            </ul>
          </div>

          {/* Closing Note */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-center text-gray-700 dark:text-gray-300 font-medium">
              "Built for simplicity. Designed for control."
            </p>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              Take charge of your financial future with Finance Pouch
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;