import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Check, RotateCcw, Calendar } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransactionWithDate, addRecurringRule, getCategoriesByType, accounts } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    isRecurring: false,
    recurringInterval: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    recurringEndDate: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Quick amount presets
  const quickAmounts = [100, 500, 1000, 2000, 5000];

  React.useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        accountId: accounts.length > 0 ? accounts[0].id : '',
        date: new Date().toISOString().split('T')[0], // Reset to today's date
        isRecurring: false,
        recurringInterval: 'monthly',
        recurringEndDate: '',
      });
      setShowSuccess(false);
    }
  }, [isOpen, accounts]);

  // Set default category when type changes
  React.useEffect(() => {
    const categories = getCategoriesByType(formData.type);
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ 
        ...prev, 
        category: formData.type === 'income' ? 'other-income' : 'other-expense' 
      }));
    }
  }, [formData.type, getCategoriesByType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description.trim() || !formData.category || !formData.accountId || !formData.date) {
      return;
    }

    // Parse amount precisely - use parseFloat and let context handle precision
    const amount = parseFloat(formData.amount);
    
    // Validate amount is a valid number
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    
    if (formData.isRecurring) {
      // Add recurring rule
      addRecurringRule({
        description: formData.description.trim(),
        amount: amount,
        type: formData.type,
        category: formData.category,
        accountId: formData.accountId,
        interval: formData.recurringInterval,
        startDate: formData.date,
        endDate: formData.recurringEndDate || undefined,
        isActive: true,
      });
    } else {
      // Add regular transaction
      addTransactionWithDate({
        description: formData.description.trim(),
        amount: amount,
        type: formData.type,
        category: formData.category,
        accountId: formData.accountId,
      }, formData.date);
    }

    // Show success and close
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const handleQuickAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  if (!isOpen) return null;

  const availableCategories = getCategoriesByType(formData.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto safe-area-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add {formData.isRecurring ? 'Recurring ' : ''}{formData.type === 'income' ? 'Income' : 'Expense'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg min-h-[44px] min-w-[44px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 touch-manipulation ${
                formData.type === 'expense'
                  ? 'bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span className="font-medium">Expense</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 touch-manipulation ${
                formData.type === 'income'
                  ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Income</span>
            </button>
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <RotateCcw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Repeat this transaction</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Automatically create future transactions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
              step="any"
              min="0"
              required
              inputMode="decimal"
            />
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-5 gap-2 mt-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickAmount(amount)}
                  className="px-2 py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 touch-manipulation min-h-[40px]"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={formData.type === 'income' ? 'e.g., Salary, Freelance work' : 'e.g., Groceries, Coffee, Uber'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {formData.isRecurring ? 'Start Date' : 'Date'}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
              required
            />
          </div>

          {/* Recurring Settings */}
          {formData.isRecurring && (
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <h3 className="text-sm font-medium text-purple-900 dark:text-purple-100 flex items-center space-x-2">
                <RotateCcw className="w-4 h-4" />
                <span>Recurring Settings</span>
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repeat Every
                </label>
                <select
                  value={formData.recurringInterval}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurringInterval: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.recurringEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurringEndDate: e.target.value }))}
                  min={formData.date}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty for indefinite recurring
                </p>
              </div>
            </div>
          )}
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
              required
            >
              <option value="">Select category</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account
            </label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px]"
              required
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.amount || !formData.description.trim() || !formData.category || !formData.accountId || !formData.date}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed touch-manipulation min-h-[52px]"
          >
            {showSuccess ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added Successfully!</span>
              </>
            ) : (
              <>
                {formData.isRecurring ? <RotateCcw className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                <span>
                  {formData.isRecurring ? 'Create Recurring Rule' : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;