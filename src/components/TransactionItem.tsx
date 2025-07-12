import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRightLeft, Edit3, Trash2, Check, X } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import CategoryBadge from './CategoryBadge';
import type { Transaction } from '../contexts/TransactionContext';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { 
    getCategoryById, 
    getAccountById, 
    updateTransaction, 
    deleteTransaction,
    getCategoriesByType,
    accounts 
  } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    description: transaction.description,
    amount: transaction.amount.toString(),
    category: transaction.category,
    date: new Date(transaction.timestamp).toISOString().split('T')[0],
    accountId: transaction.accountId,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const category = getCategoryById(transaction.category);
  const account = getAccountById(transaction.accountId);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIcon = () => {
    switch (transaction.type) {
      case 'income':
        return <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'transfer':
        return <ArrowRightLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />;
    }
  };

  const getAmountColor = () => {
    switch (transaction.type) {
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'transfer':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getAmountPrefix = () => {
    switch (transaction.type) {
      case 'income':
        return '+';
      case 'transfer':
        return '↔';
      default:
        return '-';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: new Date(transaction.timestamp).toISOString().split('T')[0],
      accountId: transaction.accountId,
    });
  };

  const handleSaveEdit = () => {
    if (!editForm.description.trim() || !editForm.amount || parseFloat(editForm.amount) <= 0) {
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
      accountId: editForm.accountId,
    });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: new Date(transaction.timestamp).toISOString().split('T')[0],
      accountId: transaction.accountId,
    });
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    setShowDeleteConfirm(false);
  };

  const availableCategories = getCategoriesByType(transaction.type);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[44px]"
                  placeholder="Transaction description"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[44px]"
                  placeholder="0.00"
                  step="any"
                  min="0"
                  inputMode="decimal"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[44px]"
                />
              </div>
              {transaction.type !== 'transfer' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[44px]"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account
                </label>
                <select
                  value={editForm.accountId}
                  onChange={(e) => setEditForm(prev => ({ ...prev, accountId: e.target.value }))}
                  className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[44px]"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2 gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-4 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition-colors duration-200 text-sm touch-manipulation min-h-[44px]"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white rounded-lg transition-colors duration-200 text-sm touch-manipulation min-h-[44px]"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' ? 'bg-green-50 dark:bg-green-900/30' :
                transaction.type === 'transfer' ? 'bg-blue-50 dark:bg-blue-900/30' :
                'bg-red-50 dark:bg-red-900/30'
              }`}>
                {getIcon()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 sm:truncate">
                    {transaction.description}
                  </h3>
                  {transaction.isPlanned && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 w-fit">
                      Planned
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm">
                  {transaction.type !== 'transfer' && (
                    <CategoryBadge categoryId={transaction.category} showEmoji={true} size="sm" />
                  )}
                  {transaction.type === 'transfer' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <ArrowRightLeft className="w-3 h-3 mr-1" />
                      Transfer
                    </span>
                  )}
                  <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">•</span>
                  <span className="text-gray-500 dark:text-gray-400">{account?.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">•</span>
                  <span className="text-gray-500 dark:text-gray-400">{formatTime(transaction.timestamp)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:space-x-3">
              <div className="text-left sm:text-right">
                <p className={`text-base sm:text-lg font-semibold ${getAmountColor()}`}>
                  {getAmountPrefix()}{formatCurrency(transaction.amount)}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-1 ml-auto">
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 dark:active:bg-blue-900/30 rounded-lg transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px]"
                  title="Edit transaction"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 rounded-lg transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px]"
                  title="Delete transaction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-sm mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Transaction</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <p className={`font-semibold ${getAmountColor()}`}>
                  {getAmountPrefix()}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors duration-200 touch-manipulation min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors duration-200 touch-manipulation min-h-[44px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionItem;