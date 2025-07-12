import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCurrency, currencies, Currency } from '../contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { currentCurrency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencySelect = (currency: Currency) => {
    setCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[44px] text-base font-medium text-gray-700 dark:text-gray-300 touch-manipulation"
      >
        <span className="text-lg">{currentCurrency.symbol}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">{currentCurrency.code}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-72 sm:w-56 md:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                Select Currency
              </div>
              <div className="mt-1 space-y-1">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencySelect(currency)}
                    className={`w-full flex items-center justify-between px-3 py-3 text-sm rounded-lg transition-colors duration-200 min-h-[44px] touch-manipulation ${
                      currentCurrency.code === currency.code
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{currency.flag}</span>
                      <div className="text-left">
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{currency.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">{currency.symbol}</span>
                      {currentCurrency.code === currency.code && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;