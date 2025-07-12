import React, { useState } from 'react';
import { RotateCcw, Play, Pause, Edit3, Trash2, Plus, X, Calendar } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';

const RecurringTransactions: React.FC = () => {
  const { 
    recurringRules, 
    updateRecurringRule, 
    deleteRecurringRule,
    getCategoryById,
    getAccountById 
  } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const intervalLabels = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
  };

  const getNextOccurrence = (rule: any) => {
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

  const handleToggleActive = (ruleId: string, isActive: boolean) => {
    updateRecurringRule(ruleId, { isActive: !isActive });
  };

  const handleDelete = (ruleId: string) => {
    deleteRecurringRule(ruleId);
    setShowDeleteConfirm(null);
  };

  const activeRules = recurringRules.filter(rule => rule.isActive);
  const inactiveRules = recurringRules.filter(rule => !rule.isActive);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recurring Transactions</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({recurringRules.length} rule{recurringRules.length !== 1 ? 's' : ''})
          </span>
        </div>

        {recurringRules.length === 0 ? (
          <div className="text-center py-8">
            <RotateCcw className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No recurring transactions set up</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Use the + button to add a recurring transaction
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Rules */}
            {activeRules.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                  <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Active Rules ({activeRules.length})</span>
                </h3>
                <div className="space-y-3">
                  {activeRules.map((rule) => {
                    const nextOccurrence = getNextOccurrence(rule);
                    const isOverdue = nextOccurrence < new Date();
                    const category = getCategoryById(rule.category);
                    const account = getAccountById(rule.accountId);
                    
                    return (
                      <div
                        key={rule.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              rule.type === 'income' ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'
                            }`}>
                              <RotateCcw className={`w-4 h-4 ${
                                rule.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`} />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{rule.description}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {category && (
                                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                                    {category.name}
                                  </span>
                                )}
                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                  {account?.name || 'Unknown Account'}
                                </span>
                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                  {intervalLabels[rule.interval]}
                                </span>
                                {isOverdue && (
                                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                    Overdue
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-sm font-semibold ${
                              rule.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {rule.type === 'income' ? '+' : '-'}{formatCurrency(rule.amount)}
                            </span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleToggleActive(rule.id, rule.isActive)}
                                className="p-1 text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                                title="Pause rule"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(rule.id)}
                                className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                                title="Delete rule"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <div className="flex justify-between">
                            <span>Started: {new Date(rule.startDate).toLocaleDateString()}</span>
                            {rule.endDate && (
                              <span>Ends: {new Date(rule.endDate).toLocaleDateString()}</span>
                            )}
                          </div>
                          <div>
                            Next occurrence: {nextOccurrence.toLocaleDateString()}
                            {rule.lastProcessed && (
                              <span className="ml-2">
                                (Last: {new Date(rule.lastProcessed).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inactive Rules */}
            {inactiveRules.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                  <Pause className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Paused Rules ({inactiveRules.length})</span>
                </h3>
                <div className="space-y-3">
                  {inactiveRules.map((rule) => {
                    const category = getCategoryById(rule.category);
                    const account = getAccountById(rule.accountId);
                    
                    return (
                      <div
                        key={rule.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 opacity-75"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600">
                              <RotateCcw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{rule.description}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {category && (
                                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                                    {category.name}
                                  </span>
                                )}
                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                                  {intervalLabels[rule.interval]}
                                </span>
                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                                  Paused
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                              {rule.type === 'income' ? '+' : '-'}{formatCurrency(rule.amount)}
                            </span>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleToggleActive(rule.id, rule.isActive)}
                                className="p-1 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                                title="Resume rule"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(rule.id)}
                                className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                                title="Delete rule"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 How Recurring Transactions Work</h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Recurring rules automatically generate future transactions based on your schedule</li>
            <li>• Active rules will create transactions on their scheduled dates</li>
            <li>• Paused rules won't generate new transactions but can be resumed anytime</li>
            <li>• You can see upcoming recurring transactions in the Calendar and Future Projections</li>
          </ul>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Recurring Rule</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this recurring rule? This will stop all future automatic transactions for this rule.
            </p>
            
            {(() => {
              const rule = recurringRules.find(r => r.id === showDeleteConfirm);
              if (!rule) return null;
              
              return (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{rule.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {intervalLabels[rule.interval]} • {rule.type}
                      </p>
                    </div>
                    <p className={`font-semibold ${
                      rule.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {rule.type === 'income' ? '+' : '-'}{formatCurrency(rule.amount)}
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
                Delete Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecurringTransactions;