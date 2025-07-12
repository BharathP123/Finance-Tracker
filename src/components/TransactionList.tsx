import React, { useState } from 'react';
import { Trash2, Edit3, Check, X, Calendar } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import type { Transaction, FilterOptions } from '../contexts/TransactionContext';
import Filters from './Filters';

const TransactionList: React.FC = () => {
  const { 
    updateTransaction, 
    deleteTransaction, 
    getGroupedTransactions, 
    getCategoryById,
    getCategoriesByType,
    getAccountById
  } = useTransactions();
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
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
  });

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupedTransactions = getGroupedTransactions(filters);
  const totalTransactions = Object.values(groupedTransactions).flat().length;

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: new Date(transaction.timestamp).toISOString().split('T')[0],
    });
  };

  const handleSaveEdit = (transaction: Transaction) => {
    if (!editForm.description.trim() || !editForm.amount || parseFloat(editForm.amount) <= 0 || !editForm.date) {
      return;
    }

    // Calculate new timestamp from date
    const selectedDate = new Date(editForm.date);
    const originalDate = new Date(transaction.timestamp);
    selectedDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());

    // Fix rounding precision before updating transaction
    const amount = Math.round(parseFloat(editForm.amount) * 100) / 100;
    updateTransaction(transaction.id, {
      description: editForm.description.trim(),
      amount: amount,
      category: editForm.category,
      timestamp: selectedDate.getTime(),
    });

    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ description: '', amount: '', category: '', date: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const getCategoryDisplay = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category ? (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
        {category.name}
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Unknown
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Filters filters={filters} onFiltersChange={setFilters} />
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Transaction History</h2>
          {totalTransactions > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalTransactions} transaction{totalTransactions !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {totalTransactions === 0 ? (
          <div className="text-center py-8 md:py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {Object.keys(filters).some(key => filters[key as keyof FilterOptions] && key !== 'type') || filters.type !== 'all'
                ? 'No transactions found matching your filters'
                : 'No transactions yet. Add your first transaction above!'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date} className="space-y-3">
                {/* Date Header */}
                <div className="sticky top-0 bg-gray-50 dark:bg-gray-700 -mx-4 md:-mx-6 px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {date}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({transactions.length} transaction{transactions.length !== 1 ? 's' : ''})
                    </span>
                  </h3>
                </div>

                {/* Transactions for this date */}
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 space-y-3 sm:space-y-0"
                    >
                      {editingId === transaction.id ? (
                        // Edit Mode
                        <div className="flex-1 grid grid-cols-1 gap-3 max-w-md">
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Description"
                          />
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Amount"
                            step="0.01"
                            min="0"
                          />
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            {getCategoriesByType(transaction.type).map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex space-x-2 sm:col-span-1">
                            <button
                              onClick={() => handleSaveEdit(transaction)}
                              className="flex-1 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 min-h-[44px]"
                              title="Save changes"
                            >
                              <Check className="w-4 h-4 mx-auto" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 min-h-[44px]"
                              title="Cancel editing"
                            >
                              <X className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex-1 min-w-0 w-full sm:w-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                {transaction.isPlanned && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 mr-2">
                                      ⏳ Planned
                                    </span>
                                  </span>
                                )}
                                {transaction.recurringRuleId && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mr-2">
                                      🔁 Recurring
                                    </span>
                                  </span>
                                )}
                                {transaction.description}
                                {transaction.type === 'transfer' && transaction.toAccountId && (
                                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 block sm:inline">
                                    → {getAccountById(transaction.toAccountId)?.name}
                                  </span>
                                )}
                                {transaction.tags && transaction.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {transaction.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {transaction.notes && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                    {transaction.notes}
                                  </p>
                                )}
                              </h3>
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`text-sm font-semibold whitespace-nowrap ${transaction.isPlanned ? 'opacity-60' : ''} ${
                                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 
                                    transaction.type === 'transfer' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                                  }`}
                                >
                                  {transaction.type === 'income' ? '+' : 
                                   transaction.type === 'transfer' ? '↔' : '-'}{formatCurrency(transaction.amount)}
                                </span>
                                {/* Allow editing of all transactions including planned ones */}
                                {(
                                  <div className="flex items-center space-x-2 sm:flex-row">
                                    <button
                                      onClick={() => handleEdit(transaction)}
                                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                      title="Edit transaction"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(transaction.id)}
                                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                      title="Delete transaction"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                              <div className="flex flex-wrap items-center gap-1 md:gap-2">
                                {transaction.type !== 'transfer' && getCategoryDisplay(transaction.category)}
                                {transaction.type === 'transfer' && (
                                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                      Transfer
                                    </span>
                                  </span>
                                )}
                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    {getAccountById(transaction.accountId)?.name || 'Unknown Account'}
                                  </span>
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                                  {formatTime(transaction.timestamp)}
                                </span>
                                {transaction.isPlanned && (
                                  <span className="text-xs text-orange-600 dark:text-orange-400 font-medium block sm:inline">
                                    {new Date(transaction.timestamp) > new Date() ? 'Scheduled for' : 'Was planned for'} {new Date(transaction.timestamp).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                                {formatTime(transaction.timestamp)}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;