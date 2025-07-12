import React, { useState } from 'react';
import { Target, Plus, Edit3, Trash2, TrendingUp, Calendar, X, DollarSign, PiggyBank } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import type { SavingsGoal } from '../contexts/TransactionContext';

const SavingsGoals: React.FC = () => {
  const { 
    getSavingsProgress, 
    addSavingsGoal, 
    updateSavingsGoal, 
    deleteSavingsGoal,
    addGoalContribution,
    getGoalContributions,
    getCategoriesByType 
  } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [contributingGoalId, setContributingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: '',
  });
  const [contributionForm, setContributionForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const savingsProgress = getSavingsProgress();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name.trim() || !newGoal.targetAmount || !newGoal.targetDate) return;

    // Fix rounding precision before adding goal
    const targetAmount = Math.round(parseFloat(newGoal.targetAmount) * 100) / 100;
    addSavingsGoal({
      name: newGoal.name.trim(),
      targetAmount: targetAmount,
      targetDate: newGoal.targetDate,
      category: newGoal.category || undefined,
    });

    setNewGoal({ name: '', targetAmount: '', targetDate: '', category: '' });
    setIsAddingGoal(false);
  };

  const handleContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributionForm.amount || parseFloat(contributionForm.amount) <= 0 || !contributingGoalId) return;

    // Fix rounding precision before adding contribution
    const amount = Math.round(parseFloat(contributionForm.amount) * 100) / 100;
    addGoalContribution({
      goalId: contributingGoalId,
      amount: amount,
      date: contributionForm.date,
      note: contributionForm.note.trim() || undefined,
    });

    setContributionForm({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
    });
    setContributingGoalId(null);
  };

  const handleUpdateProgress = (goalId: string, amount: number) => {
    // Fix rounding precision before updating progress
    const fixedAmount = Math.round(amount * 100) / 100;
    updateSavingsGoal(goalId, { currentAmount: fixedAmount });
  };

  const handleDelete = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      deleteSavingsGoal(goalId);
    }
  };

  const getProgressBarColor = (percentage: number, isCompleted: boolean) => {
    if (isCompleted) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Savings Goals</h2>
        </div>
        <button
          onClick={() => setIsAddingGoal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {savingsProgress.length > 0 ? (
        <div className="space-y-4">
          {savingsProgress.map((goal) => {
            const daysUntilTarget = getDaysUntilTarget(goal.targetDate);
            const isOverdue = daysUntilTarget < 0;
            const isCompleted = goal.isCompleted || goal.progressPercentage >= 100;
            const contributions = getGoalContributions(goal.id);

            return (
              <div
                key={goal.id}
                className={`border rounded-lg p-4 transition-all duration-300 ${
                  isCompleted ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20' : 
                  isOverdue ? 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted ? 'bg-green-100 dark:bg-green-800' : 
                      isOverdue ? 'bg-red-100 dark:bg-red-800' : 'bg-blue-100 dark:bg-blue-800'
                    }`}>
                      <Target className={`w-4 h-4 ${
                        isCompleted ? 'text-green-600 dark:text-green-400' : 
                        isOverdue ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{goal.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Target: {formatDate(goal.targetDate)}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            ✅ Completed
                          </span>
                        )}
                        {isOverdue && !isCompleted && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                            ⚠️ Overdue
                          </span>
                        )}
                        {daysUntilTarget > 0 && !isCompleted && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {daysUntilTarget} days left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {goal.progressPercentage.toFixed(1)}% complete
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!isCompleted && (
                        <button
                          onClick={() => setContributingGoalId(goal.id)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg"
                          title="Add contribution"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingGoalId(goal.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        title="Edit goal"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                        title="Delete goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressBarColor(goal.progressPercentage, isCompleted)}`}
                      style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Goal Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="block font-medium">Remaining</span>
                    <span className={`${goal.targetAmount - goal.currentAmount <= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}
                    </span>
                  </div>
                  <div>
                    <span className="block font-medium">Contributions</span>
                    <span className="text-gray-700 dark:text-gray-300">{contributions.length}</span>
                  </div>
                  {goal.estimatedCompletionDate && !isCompleted && (
                    <div>
                      <span className="block font-medium">Est. completion</span>
                      <span className="text-gray-700 dark:text-gray-300">{formatDate(goal.estimatedCompletionDate)}</span>
                    </div>
                  )}
                  {contributions.length > 0 && (
                    <div>
                      <span className="block font-medium">Last contribution</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatDate(contributions[contributions.length - 1].date)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Recent Contributions */}
                {contributions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Contributions</h4>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {contributions.slice(-3).reverse().map((contribution) => (
                        <div key={contribution.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <PiggyBank className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatDate(contribution.date)}
                              {contribution.note && (
                                <span className="ml-1 italic">- {contribution.note}</span>
                              )}
                            </span>
                          </div>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            +{formatCurrency(contribution.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Update for Manual Editing */}
                {editingGoalId === goal.id ? (
                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <input
                      type="number"
                      defaultValue={goal.currentAmount}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateProgress(goal.id, parseFloat((e.target as HTMLInputElement).value));
                          setEditingGoalId(null);
                        } else if (e.key === 'Escape') {
                          setEditingGoalId(null);
                        }
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Current amount saved"
                      step="0.01"
                      min="0"
                      max={goal.targetAmount}
                      autoFocus
                    />
                    <button
                      onClick={() => setEditingGoalId(null)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Target className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No savings goals yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first savings goal to start tracking progress</p>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Savings Goal</h3>
              <button
                onClick={() => setIsAddingGoal(false)}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., New Laptop, Vacation Fund"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  placeholder="Enter target amount"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category (Optional)
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">No specific category</option>
                  {getCategoriesByType('expense').map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingGoal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribution Modal */}
      {contributingGoalId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Contribution</h3>
              </div>
              <button
                onClick={() => setContributingGoalId(null)}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Goal Info */}
            {(() => {
              const goal = savingsProgress.find(g => g.id === contributingGoalId);
              return goal ? (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-gray-900 dark:text-white">{goal.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              ) : null;
            })()}

            <form onSubmit={handleContribution} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contribution Amount
                </label>
                <input
                  type="number"
                  value={contributionForm.amount}
                  onChange={(e) => setContributionForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount to contribute"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  step="any"
                  min="0"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={contributionForm.date}
                  onChange={(e) => setContributionForm(prev => ({ ...prev, date: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={contributionForm.note}
                  onChange={(e) => setContributionForm(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="e.g., Salary bonus, Saved from groceries"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setContributingGoalId(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Add Contribution</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;