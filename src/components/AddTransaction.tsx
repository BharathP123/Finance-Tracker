import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';

const AddTransaction: React.FC = () => {
  const { 
    addTransaction, 
    addTransactionWithDate,
    addPlannedTransaction, 
    addRecurringRule, 
    getCategoriesByType, 
    accounts,
    suggestCategory,
    parseNaturalLanguage 
  } = useTransactions();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    isRecurring: false,
    isPlanned: false,
    plannedDate: '',
    recurringInterval: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    recurringStartDate: '',
    recurringEndDate: '',
    tags: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSmartInput, setShowSmartInput] = useState(false);
  const [smartInput, setSmartInput] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState<{ categoryId: string; confidence: number } | null>(null);

  // Get categories based on selected type
  const availableCategories = getCategoriesByType(formData.type);

  // Set default category when type changes
  React.useEffect(() => {
    if (availableCategories.length > 0 && !formData.category) {
      const defaultCategory = formData.type === 'income' ? 'other-income' : 'other-expense';
      setFormData(prev => ({ ...prev, category: defaultCategory }));
    }
  }, [formData.type, availableCategories]);

  // Set default account
  React.useEffect(() => {
    if (accounts.length > 0 && !formData.accountId) {
      setFormData(prev => ({ ...prev, accountId: accounts.find(a => a.id !== 'checking')?.id || accounts[0].id }));
    }
  }, [accounts]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.accountId) {
      newErrors.accountId = 'Account is required';
    }

    if (formData.isPlanned && !formData.plannedDate) {
      newErrors.plannedDate = 'Planned date is required';
    }

    if (formData.isRecurring && !formData.recurringStartDate) {
      newErrors.recurringStartDate = 'Start date is required for recurring transactions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Fix rounding precision before adding transaction
    const amount = Math.round(parseFloat(formData.amount) * 100) / 100;

    if (formData.isRecurring) {
      // Add recurring rule
      addRecurringRule({
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        accountId: formData.accountId,
        interval: formData.recurringInterval,
        startDate: formData.recurringStartDate,
        endDate: formData.recurringEndDate || undefined,
        isActive: true,
      });
    } else if (formData.isPlanned) {
      // Add planned transaction
      addPlannedTransaction({
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        accountId: formData.accountId,
        plannedDate: formData.plannedDate,
      });
    } else {
      // Add regular transaction
      addTransactionWithDate({
        description: formData.description.trim(),
        amount: amount,
        type: formData.type,
        category: formData.category,
        accountId: formData.accountId,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined,
        notes: formData.notes.trim() || undefined,
      }, formData.date);
    }

    // Reset form
    const defaultCategory = formData.type === 'income' ? 'other-income' : 'other-expense';
    const defaultAccount = accounts.length > 0 ? accounts[0].id : '';
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: defaultCategory,
      accountId: defaultAccount,
      date: new Date().toISOString().split('T')[0], // Reset to today's date
      isRecurring: false,
      isPlanned: false,
      plannedDate: '',
      recurringInterval: 'monthly',
      recurringStartDate: '',
      recurringEndDate: '',
      tags: '',
      notes: '',
    });
    setErrors({});

    // Show success feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'income' | 'expense';
    const defaultCategory = newType === 'income' ? 'other-income' : 'other-expense';
    setFormData(prev => ({ 
      ...prev, 
      type: newType,
      category: defaultCategory
    }));
  };

  const handleTransactionModeChange = (mode: 'regular' | 'planned' | 'recurring') => {
    setFormData(prev => ({
      ...prev,
      isRecurring: mode === 'recurring',
      isPlanned: mode === 'planned',
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">
        Add {formData.isRecurring ? 'Recurring' : formData.isPlanned ? 'Planned' : ''} Transaction
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Mode Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type
          </label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="transactionMode"
                checked={!formData.isRecurring && !formData.isPlanned}
                onChange={() => handleTransactionModeChange('regular')}
                className="mr-2 h-4 w-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Regular</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="transactionMode"
                checked={formData.isPlanned}
                onChange={() => handleTransactionModeChange('planned')}
                className="mr-2 h-4 w-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">⏳ Planned</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="transactionMode"
                checked={formData.isRecurring}
                onChange={() => handleTransactionModeChange('recurring')}
                className="mr-2 h-4 w-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">🔁 Recurring</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter transaction description"
            className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.description 
                ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          />
          {errors.description && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Date Field for Regular Transactions */}
        {!formData.isRecurring && !formData.isPlanned && (
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        )}

        {/* Tags and Notes */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., #trip, #medical, #foodie"
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-base"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <input
              type="text"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about this transaction"
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-base"
            />
          </div>
        </div>

        {/* Planned Transaction Date */}
        {formData.isPlanned && (
          <div>
            <label htmlFor="plannedDate" className="block text-sm font-medium text-gray-700 mb-2">
              Planned Date
            </label>
            <input
              type="date"
              id="plannedDate"
              name="plannedDate"
              value={formData.plannedDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                errors.plannedDate 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.plannedDate && (
              <p className="text-red-500 text-sm mt-1">{errors.plannedDate}</p>
            )}
          </div>
        )}

        {/* Recurring Transaction Settings */}
        {formData.isRecurring && (
          <div className="space-y-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900">Recurring Settings</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="recurringInterval" className="block text-sm font-medium text-gray-700 mb-2">
                  Repeat Every
                </label>
                <select
                  id="recurringInterval"
                  name="recurringInterval"
                  value={formData.recurringInterval}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label htmlFor="recurringStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="recurringStartDate"
                  name="recurringStartDate"
                  value={formData.recurringStartDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${
                    errors.recurringStartDate 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                />
                {errors.recurringStartDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.recurringStartDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="recurringEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  id="recurringEndDate"
                  name="recurringEndDate"
                  value={formData.recurringEndDate}
                  onChange={handleChange}
                  min={formData.recurringStartDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                errors.amount 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleTypeChange}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-base"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                suggestedCategory && formData.category === suggestedCategory.categoryId ? 'bg-yellow-50 border-yellow-300' : ''
              } ${
                errors.category 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Select category</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                  {suggestedCategory && category.id === suggestedCategory.categoryId && ' 🧠'}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-2">
              Account
            </label>
            <select
              id="accountId"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                errors.accountId 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.accountId && (
              <p className="text-red-500 text-sm mt-1">{errors.accountId}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2 min-h-[44px]"
        >
          {showSuccess ? (
            <>
              <Check className="w-5 h-5" />
              <span>Transaction Added!</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>
                Add {formData.isRecurring ? 'Recurring Rule' : 
                     formData.isPlanned ? 'Planned Transaction' : 
                     'Transaction'}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;