import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Tab {
  id: 'overview' | 'money' | 'ai' | 'more';
  name: string;
  icon: LucideIcon;
  features: string[];
}

interface MobileNavTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: 'overview' | 'money' | 'ai' | 'more') => void;
}

const MobileNavTabs: React.FC<MobileNavTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 border-t border-gray-200 dark:border-gray-700 md:hidden z-50 backdrop-blur-sm transition-colors duration-200">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 relative group ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 active:text-gray-800 dark:active:text-gray-200'
              }`}
            >
              {/* Background highlight */}
              <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 scale-95' 
                  : 'group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 group-active:bg-gray-100 dark:group-active:bg-gray-700 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-95'
              }`} />
              
              {/* Icon */}
              <Icon className={`w-5 h-5 transition-all duration-200 relative z-10 ${
                isActive ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              
              {/* Label */}
              <span className={`text-xs transition-all duration-200 relative z-10 ${
                isActive ? 'font-semibold' : 'font-medium'
              }`}>
                {tab.name}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full animate-slideDown" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavTabs;