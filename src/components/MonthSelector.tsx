import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onMonthChange }) => {
  const getCurrentMonth = () => {
    return new Date().toISOString().slice(0, 7);
  };

  const formatMonthDisplay = (month: string) => {
    return new Date(month + '-01').toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedMonth + '-01');
    if (direction === 'prev') {
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    onMonthChange(currentDate.toISOString().slice(0, 7));
  };

  const goToCurrentMonth = () => {
    onMonthChange(getCurrentMonth());
  };

  const isCurrentMonth = selectedMonth === getCurrentMonth();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-4 mb-4 md:mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Viewing:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <h2 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white min-w-[120px] md:min-w-[180px] text-center">
              {formatMonthDisplay(selectedMonth)}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isCurrentMonth && (
          <button
            onClick={goToCurrentMonth}
            className="px-3 md:px-4 py-2 text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 min-h-[44px]"
          >
            <span className="hidden sm:inline">Current Month</span>
            <span className="sm:hidden">Current</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MonthSelector;