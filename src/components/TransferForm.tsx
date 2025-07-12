import React, { useState } from 'react';
import { ArrowRightLeft, Check } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const TransferForm: React.FC = () => {
  const { accounts, addTransfer } = useTransactions();
  const { formatCurrency } = useCurrency();
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromAccountId) {
      newErrors.fromAccountId = 'Source account is required';
    }

    if (!formData.toAccountId) {
      newErrors.toAccountId = 'Destination account is required';
    }

    if (formData.fromAccountId === formData.toAccountId) {
      newErrors.toAccountId = 'Source and destination accounts must be different';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Fix rounding precision before adding transfer
    const amount = Math.round(parseFloat(formData.amount) * 100) / 100;
    addTransfer({
      fromAccountId: formData.fromAccountId,
      toAccountId: formData.toAccountId,
      amount: amount,
      description: formData.description.trim(),
    });

    // Reset form
    setFormData({
      fromAccountId: '',
      toAccountId: '',
      amount: '',
      description: '',
    });
    setErrors({});

    // Show success feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const swapAccounts = () => {
    setFormData(prev => ({
      ...prev,
      fromAccountId: prev.toAccountId,
      toAccountId: prev.fromAccountId,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Transfer Between Accounts</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter transfer description"
            className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="fromAccountId" className="block text-sm font-medium text-gray-700 mb-2">
              From Account
            </label>
            <select
              id="fromAccountId"
              name="fromAccountId"
              value={formData.fromAccountId}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fromAccountId 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Select source account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.fromAccountId && (
              <p className="text-red-500 text-sm mt-1">{errors.fromAccountId}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={swapAccounts}
              className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Swap accounts"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="toAccountId" className="block text-sm font-medium text-gray-700 mb-2">
              To Account
            </label>
            <select
              id="toAccountId"
              name="toAccountId"
              value={formData.toAccountId}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.toAccountId 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Select destination account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.toAccountId && (
              <p className="text-red-500 text-sm mt-1">{errors.toAccountId}</p>
            )}
          </div>
        </div>

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
            className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.amount 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
        >
          {showSuccess ? (
            <>
              <Check className="w-5 h-5" />
              <span>Transfer Completed!</span>
            </>
          ) : (
            <>
              <ArrowRightLeft className="w-5 h-5" />
              <span>Transfer Funds</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;