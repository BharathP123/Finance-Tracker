import React, { useState, useRef, useEffect } from 'react';
import { TransactionProvider } from './contexts/TransactionContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider, useNavigation } from './components/NavigationProvider';
import Dashboard from './components/Dashboard';
import AddTransactionModal from './components/AddTransactionModal';
import TransactionHistory from './components/TransactionHistory';
import CalendarView from './components/CalendarView';
import InsightsPage from './components/InsightsPage';
import SettingsPage from './components/SettingsPage';
import CurrencySelector from './components/CurrencySelector';
import ThemeToggle from './components/ThemeToggle';
import AboutModal from './components/AboutModal';
import HelpGuide from './components/HelpGuide';
import { Home, Plus, List, Calendar, TrendingUp, Settings, ArrowLeft } from 'lucide-react';

type TabType = 'home' | 'transactions' | 'calendar' | 'insights' | 'settings';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false);
  const { pushToHistory, goBack, canGoBack, clearHistory } = useNavigation();

  const tabs = [
    { id: 'home' as const, name: 'Home', icon: Home },
    { id: 'transactions' as const, name: 'History', icon: List },
    { id: 'calendar' as const, name: 'Calendar', icon: Calendar },
    { id: 'insights' as const, name: 'Insights', icon: TrendingUp },
    { id: 'settings' as const, name: 'Manage', icon: Settings },
  ];

  // Track navigation history when tab changes
  useEffect(() => {
    pushToHistory(activeTab);
  }, [activeTab, pushToHistory]);

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
  };

  const handleBackNavigation = () => {
    const previousScreen = goBack();
    if (previousScreen) {
      setActiveTab(previousScreen.screen as TabType);
    } else {
      // Fallback to home if no history
      setActiveTab('home');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard onAddTransaction={() => setIsAddModalOpen(true)} />;
      case 'transactions':
        return <TransactionHistory />;
      case 'calendar':
        return <CalendarView />;
      case 'insights':
        return <InsightsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onAddTransaction={() => setIsAddModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-8 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-200 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Left side - Logo/Back button */}
            <div className="flex items-center space-x-3">
              {/* Back button for mobile when not on home */}
              {activeTab !== 'home' && canGoBack() && (
                <button
                  onClick={handleBackNavigation}
                  className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg min-h-[44px] min-w-[44px] -ml-2"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              <img 
                src="/rupee icon.png" 
                alt="Finance Pouch" 
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Finance Pouch</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Your smart money companion</p>
              </div>
            </div>
            
            {/* Right side - Controls */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <ThemeToggle />
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>
              <button
                onClick={() => setIsHelpGuideOpen(true)}
                className="p-2 md:flex md:items-center md:space-x-1 md:px-3 md:py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md min-h-[44px] min-w-[44px]"
                title="How to use Finance Pouch"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Help</span>
              </button>
              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg min-h-[44px] min-w-[44px]"
                title="About Finance Pouch"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-6">
        {renderContent()}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-30 active:scale-95 touch-manipulation"
      >
        <Plus className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm z-50 safe-area-bottom">
        <div className="grid grid-cols-5 h-20 md:h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 relative touch-manipulation ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {/* Background highlight */}
                <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 scale-95' 
                    : 'scale-90 opacity-0'
                }`} />
                
                {/* Icon */}
                <Icon className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-200 relative z-10 ${
                  isActive ? 'scale-110' : ''
                }`} />
                
                {/* Label */}
                <span className={`text-xs md:text-sm transition-all duration-200 relative z-10 ${
                  isActive ? 'font-semibold' : 'font-medium'
                }`}>
                  {tab.name}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 md:w-8 h-1 bg-blue-600 rounded-b-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Creator Credit */}
      <div className="mt-6 md:mt-8 text-center text-xs text-gray-500 dark:text-gray-400 pb-4">
        Designed & Created<br />by<br /><strong className="text-gray-700 dark:text-gray-300">Bharath Paladugula</strong>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />

      {/* Help Guide */}
      <HelpGuide 
        isOpen={isHelpGuideOpen} 
        onClose={() => setIsHelpGuideOpen(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <TransactionProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </TransactionProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
