import { useState, useCallback } from 'react';

export interface NavigationState {
  screen: string;
  data?: any;
  timestamp: number;
}

export const useNavigationHistory = () => {
  const [history, setHistory] = useState<NavigationState[]>([]);

  const pushToHistory = useCallback((screen: string, data?: any) => {
    setHistory(prev => [
      ...prev,
      {
        screen,
        data,
        timestamp: Date.now()
      }
    ]);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      return newHistory[newHistory.length - 1];
    }
    return null;
  }, [history]);

  const getCurrentScreen = useCallback(() => {
    return history[history.length - 1] || null;
  }, [history]);

  const canGoBack = useCallback(() => {
    return history.length > 1;
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    pushToHistory,
    goBack,
    getCurrentScreen,
    canGoBack,
    clearHistory
  };
};