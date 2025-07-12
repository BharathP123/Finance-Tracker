import React, { useState } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import type { FilterOptions } from '../contexts/TransactionContext';
import TransactionItem from './TransactionItem';

const TransactionHistory: React.FC = () => {
  const { getGroupedTransactions, categories, accounts } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    category: '',
    account: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    showPlanned: false,
    tags: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const groupedTransactions = getGroupedTransactions(filters);
  const totalTransactions = Object.values(groupedTransactions).flat().length;

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: '',
      account: '',
      search: '',
      dateFrom: '',
      dateTo: '',
      showPlanned: false,
      tags: '',
    });
  };

  const hasActiveFilters = filters.type !== 'all' || filters.category || filters.account || filters.search || filters.dateFrom || filters.dateTo || filters.showPlanned || filters.tags;

  return (
    <div className="space-y-4 md:space-y-6 pb-4">
      {/* Header */}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalTransactions} transaction{totalTransactions !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 transition-colors duration-200 touch-manipulation min-h-[44px] w-full sm:w-auto"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {[filters.type !== 'all', filters.category, filters.account, filters.search, filters.dateFrom, filters.dateTo, filters.showPlanned, filters.tags].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 scroll-smooth">
          {[
            { label: 'All', value: 'all' },
            { label: 'Expenses', value: 'expense' },
            { label: 'Income', value: 'income' },
            { label: 'Transfers', value: 'transfer' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilters(prev => ({ ...prev, type: filter.value as any }))}
              className={`px-4 py-3 rounded-lg whitespace-nowrap transition-colors duration-200 touch-manipulation min-h-[44px] flex-shrink-0 ${
                filters.type === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto safe-area-bottom">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg min-h-[44px] min-w-[44px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account
                </label>
                <select
                  value={filters.account}
                  onChange={(e) => setFilters(prev => ({ ...prev, account: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
                >
                  <option value="">All Accounts</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
                  />
                </div>
              </div>

              {/* Show Planned Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Planned Transactions
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showPlanned}
                    onChange={(e) => setFilters(prev => ({ ...prev, showPlanned: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation min-h-[44px]"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Active Filters</span>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.type !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                Type: {filters.type}
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                Category: {categories.find(c => c.id === filters.category)?.name}
              </span>
            )}
            {filters.account && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                Account: {accounts.find(a => a.id === filters.account)?.name}
              </span>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
                Date: {filters.dateFrom || '...'} to {filters.dateTo || '...'}
              </span>
            )}
            {filters.showPlanned && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                Including Planned
              </span>
            )}
          </div>
        </div>
      )}

      {/* Transactions List */}
      {totalTransactions === 0 ? (
        <div className="text-center py-8 md:py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {hasActiveFilters
              ? 'No transactions found matching your filters'
              : 'No transactions yet. Add your first transaction!'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
            >
              Clear filters to see all transactions
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 sticky top-14 md:top-16 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 -mx-3 px-3 md:mx-0 md:px-0 md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:static">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {date}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Transactions for this date */}
              <div className="space-y-2 md:space-y-3">
                {transactions.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;