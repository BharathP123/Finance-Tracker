import React, { useState } from 'react';
import { RotateCcw, Play, Pause, Edit3, Trash2, Plus, X } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import type { RecurringRule } from '../contexts/TransactionContext';

const RecurringManager: React.FC = () => {
  const { 
    recurringRules, 
    addRecurringRule, 
    updateRecurringRule, 
    deleteRecurringRule,
    getCategoriesByType,
    accounts 
  } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    accountId: '',
    interval: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: '',
    endDate: '',
  });

  const intervalLabels = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
  };

  const getNextOccurrence = (rule: RecurringRule) => {
    const lastProcessed = rule.lastProcessed ? new Date(rule.lastProcessed) : new Date(rule.startDate);
    const next = new Date(lastProcessed);
    
    switch (rule.interval) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.description.trim() || !newRule.amount || !newRule.category || !newRule.accountId || !newRule.startDate) return;

    // Fix rounding precision before adding recurring rule
    const amount = Math.round(parseFloat(newRule.amount) * 100) / 100;
    addRecurringRule({
      description: newRule.description.trim(),
      amount: amount,
      type: newRule.type,
      category: newRule.category,
      accountId: newRule.accountId,
      interval: newRule.interval,
      startDate: newRule.startDate,
      endDate: newRule.endDate || undefined,
      isActive: true,
    });

    setNewRule({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      accountId: '',
      interval: 'monthly',
      startDate: '',
      endDate: '',
    });
    setIsAddingRule(false);
  };

  const handleToggleActive = (ruleId: string, isActive: boolean) => {
    updateRecurringRule(ruleId, { isActive: !isActive });
  };

  const handleDelete = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this recurring rule? All associated transactions will be removed.')) {
      deleteRecurringRule(ruleId);
    }
  };

  const getCategoryDisplay = (categoryId: string) => {
    const categories = [...getCategoriesByType('income'), ...getCategoriesByType('expense')];
    const category = categories.find(c => c.id === categoryId);
    return category ? (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
        {category.name}
      </span>
    ) : null;
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || 'Unknown Account';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Recurring Transactions</h2>
        </div>
        <button
          onClick={() => setIsAddingRule(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recurring Rule</span>
        </button>
      </div>

      {recurringRules.length > 0 ? (
        <div className="space-y-4">
          {recurringRules.map((rule) => {
            const nextOccurrence = getNextOccurrence(rule);
            const isOverdue = nextOccurrence < new Date() && rule.isActive;
            
            return (
              <div
                key={rule.id}
                className={`border rounded-lg p-4 ${
                  rule.isActive ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      rule.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <RotateCcw className={`w-4 h-4 ${
                        rule.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{rule.description}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getCategoryDisplay(rule.category)}
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getAccountName(rule.accountId)}
                        </span>
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {intervalLabels[rule.interval]}
                        </span>
                        {!rule.isActive && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Paused
                          </span>
                        )}
                        {isOverdue && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-semibold ${
                      rule.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {rule.type === 'income' ? '+' : '-'}{formatCurrency(rule.amount)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleActive(rule.id, rule.isActive)}
                        className={`p-1 transition-colors duration-200 ${
                          rule.isActive 
                            ? 'text-gray-400 hover:text-orange-600' 
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                        title={rule.isActive ? 'Pause rule' : 'Resume rule'}
                      >
                        {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Started: {new Date(rule.startDate).toLocaleDateString()}</span>
                    {rule.endDate && (
                      <span>Ends: {new Date(rule.endDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  {rule.isActive && (
                    <div>
                      Next occurrence: {nextOccurrence.toLocaleDateString()}
                      {rule.lastProcessed && (
                        <span className="ml-2">
                          (Last: {new Date(rule.lastProcessed).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <RotateCcw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No recurring rules set up</p>
          <p className="text-sm text-gray-400 mt-1">Create your first recurring transaction</p>
        </div>
      )}

      {/* Add Recurring Rule Modal */}
      {isAddingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Recurring Rule</h3>
              <button
                onClick={() => setIsAddingRule(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newRule.description}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={newRule.amount}
                    onChange={(e) => setNewRule(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    {getCategoriesByType(newRule.type).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account
                  </label>
                  <select
                    value={newRule.accountId}
                    onChange={(e) => setNewRule(prev => ({ ...prev, accountId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repeat Every
                  </label>
                  <select
                    value={newRule.interval}
                    onChange={(e) => setNewRule(prev => ({ ...prev, interval: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newRule.startDate}
                    onChange={(e) => setNewRule(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newRule.endDate}
                    onChange={(e) => setNewRule(prev => ({ ...prev, endDate: e.target.value }))}
                    min={newRule.startDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Recurring Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringManager;