import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const currencies: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
];

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]); // Default to INR

  // Load currency from localStorage on mount
  useEffect(() => {
    const storedCurrency = localStorage.getItem('finance-pouch-currency');
    if (storedCurrency) {
      try {
        const parsed = JSON.parse(storedCurrency);
        const currency = currencies.find(c => c.code === parsed.code);
        if (currency) {
          setCurrentCurrency(currency);
        }
      } catch (error) {
        console.error('Error loading currency from localStorage:', error);
      }
    }
  }, []);

  // Save currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('finance-pouch-currency', JSON.stringify(currentCurrency));
  }, [currentCurrency]);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
  };

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    
    // Format based on currency
    switch (currentCurrency.code) {
      case 'INR':
        // Indian number format with lakhs and crores
        return `${currentCurrency.symbol}${absAmount.toLocaleString('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`;
      case 'USD':
      case 'CAD':
      case 'AUD':
        return `${currentCurrency.symbol}${absAmount.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`;
      case 'EUR':
        return `${currentCurrency.symbol}${absAmount.toLocaleString('de-DE', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`;
      case 'GBP':
        return `${currentCurrency.symbol}${absAmount.toLocaleString('en-GB', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`;
      case 'AED':
        return `${currentCurrency.symbol}${absAmount.toLocaleString('ar-AE', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`;
      default:
        return `${currentCurrency.symbol}${absAmount.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`;
    }
  };

  const value: CurrencyContextType = {
    currentCurrency,
    setCurrency,
    formatCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};