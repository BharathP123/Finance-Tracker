import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown, ArrowRightLeft, X } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import CategoryBadge from './CategoryBadge';
import { getCategoryColor } from '../utils/categoryColors';

const CalendarView: React.FC = () => {
  const { transactions, getCategoryById, getAccountById, recurringRules } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get previous month's last days to fill the grid
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  const daysFromPrevMonth = startingDayOfWeek;

  // Calculate total cells needed (6 rows × 7 days = 42)
  const totalCells = 42;
  const daysFromNextMonth = totalCells - daysInMonth - daysFromPrevMonth;

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate recurring transactions for the current month
  const getRecurringTransactionsForDate = (date: Date) => {
    const recurringTransactions = [];
    
    recurringRules.filter(rule => rule.isActive).forEach(rule => {
      const startDate = new Date(rule.startDate);
      const endDate = rule.endDate ? new Date(rule.endDate) : new Date(date.getFullYear() + 1, 11, 31);
      
      if (date >= startDate && date <= endDate) {
        // Check if this date matches the recurring pattern
        const daysDiff = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let shouldInclude = false;
        
        switch (rule.interval) {
          case 'daily':
            shouldInclude = true;
            break;
          case 'weekly':
            shouldInclude = daysDiff % 7 === 0;
            break;
          case 'monthly':
            shouldInclude = date.getDate() === startDate.getDate();
            break;
          case 'yearly':
            shouldInclude = date.getDate() === startDate.getDate() && date.getMonth() === startDate.getMonth();
            break;
        }
        
        if (shouldInclude) {
          recurringTransactions.push({
            id: `recurring-${rule.id}-${date.toISOString()}`,
            description: rule.description,
            amount: rule.amount,
            type: rule.type,
            category: rule.category,
            accountId: rule.accountId,
            timestamp: date.getTime(),
            isPlanned: false,
            isRecurring: true
          });
        }
      }
    });
    
    return recurringTransactions;
  };

  // Get transactions for a specific date
  const getTransactionsForDate = (date: Date) => {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
    
    const actualTransactions = transactions.filter(t => 
      t.timestamp >= startOfDay && 
      t.timestamp < endOfDay && 
      !t.isPlanned
    );
    
    const recurringTransactions = getRecurringTransactionsForDate(date);
    
    return [...actualTransactions, ...recurringTransactions];
  };

  // Get monthly summary
  const getMonthlyData = () => {
    const monthStart = new Date(currentYear, currentMonth, 1).getTime();
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).getTime();
    
    const monthTransactions = transactions.filter(t => 
      t.timestamp >= monthStart && 
      t.timestamp <= monthEnd && 
      !t.isPlanned
    );

    // Add recurring transactions for the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const recurringForDay = getRecurringTransactionsForDate(date);
      monthTransactions.push(...recurringForDay);
    }
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  };

  // Get day summary
  const getDaySummary = (date: Date) => {
    const dayTransactions = getTransactionsForDate(date);
    
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categories = [...new Set(dayTransactions.map(t => t.category))];

    return { income, expenses, transactionCount: dayTransactions.length, categories };
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];

    // Previous month days
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i + 1);
      days.push({ date, isCurrentMonth: false, isPrevMonth: true });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({ date, isCurrentMonth: true, isPrevMonth: false });
    }

    // Next month days
    for (let day = 1; day <= daysFromNextMonth; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({ date, isCurrentMonth: false, isPrevMonth: false });
    }

    return days;
  };

  const monthlyData = getMonthlyData();
  const calendarDays = generateCalendarDays();
  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-2">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Calendar</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your daily transactions</p>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <span className="text-lg">💰</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
            </div>
            <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(monthlyData.income)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <span className="text-lg">💸</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
            </div>
            <p className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(monthlyData.expenses)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <span className="text-lg">💳</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
            </div>
            <p className={`text-lg md:text-xl font-bold ${
              monthlyData.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(monthlyData.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            {currentDate.getMonth() !== today.getMonth() || currentDate.getFullYear() !== today.getFullYear() ? (
              <button
                onClick={goToToday}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 mt-1"
              >
                Go to Today
              </button>
            ) : null}
          </div>
          
          <button
            onClick={goToNextMonth}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {dayNames.map((day) => (
            <div key={day} className="p-2 md:p-3 text-center text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((dayInfo, index) => {
            const { date, isCurrentMonth } = dayInfo;
            const daySummary = getDaySummary(date);
            const isCurrentDay = isToday(date);
            
            return (
              <button
                key={index}
                onClick={() => isCurrentMonth && handleDayClick(date)}
                className={`relative p-2 md:p-3 h-16 md:h-20 border-r border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  !isCurrentMonth ? 'text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800' : 
                  isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } ${isCurrentMonth ? 'cursor-pointer' : 'cursor-default'}`}
                disabled={!isCurrentMonth}
              >
                {/* Day Number */}
                <div className={`text-sm md:text-base font-medium ${
                  isCurrentDay ? 'text-blue-600 dark:text-blue-400' : 
                  isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'
                }`}>
                  {date.getDate()}
                  {isCurrentDay && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>

                {/* Transaction Summary */}
                {isCurrentMonth && daySummary.transactionCount > 0 && (
                  <div className="absolute bottom-1 left-1 right-1 space-y-0.5">
                    {/* Income */}
                    {daySummary.income > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium truncate">
                        +{formatCurrency(daySummary.income)}
                      </div>
                    )}
                    
                    {/* Expenses */}
                    {daySummary.expenses > 0 && (
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium truncate">
                        -{formatCurrency(daySummary.expenses)}
                      </div>
                    )}

                    {/* Category dots with enhanced colors */}
                    {daySummary.categories.length > 0 && (
                      <div className="flex items-center justify-center space-x-1">
                        {daySummary.categories.slice(0, 3).map((categoryId, idx) => {
                          const categoryInfo = getCategoryColor(categoryId);
                          return (
                            <div
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full border border-white dark:border-gray-800"
                              style={{
                                backgroundColor: categoryInfo.color.includes('orange') ? '#f97316' :
                                                categoryInfo.color.includes('blue') ? '#3b82f6' :
                                                categoryInfo.color.includes('green') ? '#10b981' :
                                                categoryInfo.color.includes('red') ? '#ef4444' :
                                                categoryInfo.color.includes('purple') ? '#8b5cf6' :
                                                categoryInfo.color.includes('yellow') ? '#f59e0b' :
                                                categoryInfo.color.includes('teal') ? '#06b6d4' :
                                                categoryInfo.color.includes('pink') ? '#ec4899' :
                                                '#6b7280'
                              }}
                            />
                          );
                        })}
                        {daySummary.categories.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">+{daySummary.categories.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Detail Modal */}
      {showDayModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto safe-area-bottom">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getTransactionsForDate(selectedDate).length} transaction{getTransactionsForDate(selectedDate).length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowDayModal(false)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg min-h-[44px] min-w-[44px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Day Summary */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <span className="text-sm">💰</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Income</p>
                  </div>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(getDaySummary(selectedDate).income)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <span className="text-sm">💸</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
                  </div>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(getDaySummary(selectedDate).expenses)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <span className="text-sm">💳</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Net</p>
                  </div>
                  <p className={`text-sm font-bold ${
                    (getDaySummary(selectedDate).income - getDaySummary(selectedDate).expenses) >= 0 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(getDaySummary(selectedDate).income - getDaySummary(selectedDate).expenses)}
                  </p>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="p-4 sm:p-6">
              {getTransactionsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No transactions on this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Transactions</h4>
                  {getTransactionsForDate(selectedDate).map((transaction) => {
                    const account = getAccountById(transaction.accountId);
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' :
                            transaction.type === 'transfer' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            {transaction.type === 'income' ? (
                              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : transaction.type === 'transfer' ? (
                              <ArrowRightLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {transaction.description}
                              {transaction.isRecurring && (
                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                  🔁 Recurring
                                </span>
                              )}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {transaction.type !== 'transfer' && (
                                <CategoryBadge categoryId={transaction.category} showEmoji={true} size="sm" />
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {account?.name}
                              </span>
                              {!transaction.isRecurring && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(transaction.timestamp).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className={`text-sm font-semibold ${
                          transaction.type === 'income' ? 'text-green-600 dark:text-green-400' :
                          transaction.type === 'transfer' ? 'text-blue-600 dark:text-blue-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' :
                           transaction.type === 'transfer' ? '↔' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;