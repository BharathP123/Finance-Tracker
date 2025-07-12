import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigationHistory, NavigationState } from '../hooks/useNavigationHistory';

interface NavigationContextType {
  pushToHistory: (screen: string, data?: any) => void;
  goBack: () => NavigationState | null;
  getCurrentScreen: () => NavigationState | null;
  canGoBack: () => boolean;
  clearHistory: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigation = useNavigationHistory();

  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};