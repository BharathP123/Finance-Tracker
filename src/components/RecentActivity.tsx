import React, { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Edit3, Trash2, Check, X } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import type { Transaction } from '../contexts/TransactionContext';

const RecentActivity: React.FC = () => {
  const { 
    getRecentTransactions, 
    getCategoryById, 
    updateTransaction, 
    deleteTransaction,
    getCategoriesByType,
    accounts 
  } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const recentTransactions = getRecentTransactions(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    accountId: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: new Date(transaction.timestamp).toISOString().split('T')[0],
      accountId: transaction.accountId,
    });
  };

  const handleSaveEdit = (transaction: Transaction) => {
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

    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId);
    setShowDeleteConfirm(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const category = getCategoryById(transaction.category);
              const availableCategories = getCategoriesByType(transaction.type);
              const isEditing = editingId === transaction.id;
              
              return (
                <div
                  key={transaction.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Description"
                        />
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Amount"
                          step="any"
                          min="0"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        {transaction.type !== 'transfer' && (
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            {availableCategories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        )}
                        <select
                          value={editForm.accountId}
                          onChange={(e) => setEditForm(prev => ({ ...prev, accountId: e.target.value }))}
                          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(transaction)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors duration-200"
                        >
                          <Check className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors duration-200"
                        >
                          <X className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {transaction.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            {category && (
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                                {category.name}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(transaction.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${
                            transaction.type === 'income' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all duration-200"
                            title="Edit transaction"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(transaction.id)}
                            className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Transaction</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            
            {(() => {
              const transaction = recentTransactions.find(t => t.id === showDeleteConfirm);
              if (!transaction) return null;
              
              return (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              );
            })()}
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
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

export default RecentActivity;