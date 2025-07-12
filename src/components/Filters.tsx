import React from 'react';
import { Filter, Search, Calendar, X } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import type { FilterOptions } from '../contexts/TransactionContext';

interface FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  tags: string;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFiltersChange }) => {
  const { categories, accounts } = useTransactions();

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 min-h-[44px]"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Description
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            onChange={(e) => handleFilterChange('account', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="From"
            />
          </div>
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="To"
            />
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <input
            type="text"
            placeholder="Filter by tags..."
            value={filters.tags}
            onChange={(e) => handleFilterChange('tags', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Show Planned Toggle */}
        <div className="flex flex-col justify-end sm:col-span-2 lg:col-span-1">
          <div className="flex items-center h-10 min-h-[44px]">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showPlanned}
                onChange={(e) => handleFilterChange('showPlanned', e.target.checked ? 'true' : 'false')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Planned</span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 text-sm">
            {filters.type !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  Type: {filters.type}
                  <button
                    onClick={() => handleFilterChange('type', 'all')}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                  Category: {categories.find(c => c.id === filters.category)?.name}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </span>
            )}
            {filters.account && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                  Account: {accounts.find(a => a.id === filters.account)?.name}
                  <button
                    onClick={() => handleFilterChange('account', '')}
                    className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  Search: "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </span>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
                  Date: {filters.dateFrom || '...'} to {filters.dateTo || '...'}
                  <button
                    onClick={() => {
                      handleFilterChange('dateFrom', '');
                      handleFilterChange('dateTo', '');
                    }}
                    className="ml-1 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </span>
            )}
            {filters.tags && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300">
                  Tags: "{filters.tags}"
                  <button
                    onClick={() => handleFilterChange('tags', '')}
                    className="ml-1 text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </span>
            )}
            {filters.showPlanned && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  Showing Planned
                  <button
                    onClick={() => handleFilterChange('showPlanned', 'false')}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;