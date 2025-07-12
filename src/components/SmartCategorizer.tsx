import React, { useState } from 'react';
import { Brain, Plus, Trash2, X } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';

const SmartCategorizer: React.FC = () => {
  const { 
    smartKeywords, 
    addSmartKeyword, 
    deleteSmartKeyword, 
    getCategoriesByType,
    categories 
  } = useTransactions();
  
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    categoryId: '',
    confidence: '0.8',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.keyword.trim() || !newKeyword.categoryId) return;

    addSmartKeyword({
      keyword: newKeyword.keyword.trim().toLowerCase(),
      categoryId: newKeyword.categoryId,
      confidence: parseFloat(newKeyword.confidence),
    });

    setNewKeyword({ keyword: '', categoryId: '', confidence: '0.8' });
    setIsAddingKeyword(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this keyword mapping?')) {
      deleteSmartKeyword(id);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.7) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const customKeywords = smartKeywords.filter(k => 
    !k.id.startsWith('kw-') // Filter out default keywords
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Smart Categorizer</h2>
          <span className="text-sm text-gray-500">Keyword-to-category mapping</span>
        </div>
        <button
          onClick={() => setIsAddingKeyword(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Keyword</span>
        </button>
      </div>

      {/* Default Keywords Preview */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Built-in Keywords (Sample)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {smartKeywords.filter(k => k.id.startsWith('kw-')).slice(0, 8).map((keyword) => (
            <div key={keyword.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">{keyword.keyword}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(keyword.confidence)}`}>
                {(keyword.confidence * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {smartKeywords.filter(k => k.id.startsWith('kw-')).length} built-in keywords available
        </p>
      </div>

      {/* Custom Keywords */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Keywords</h3>
        {customKeywords.length > 0 ? (
          <div className="space-y-2">
            {customKeywords.map((keyword) => (
              <div
                key={keyword.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {keyword.keyword}
                  </span>
                  <span className="text-sm text-gray-600">
                    → {getCategoryName(keyword.categoryId)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(keyword.confidence)}`}>
                    {(keyword.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(keyword.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  title="Delete keyword"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-gray-200 rounded-lg bg-gray-50">
            <Brain className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No custom keywords yet</p>
            <p className="text-xs text-gray-400">Add keywords to improve auto-categorization</p>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-900 mb-2">🧠 How Smart Categorization Works</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• When you type a transaction description, keywords are automatically detected</li>
          <li>• Categories are suggested based on keyword matches and confidence levels</li>
          <li>• High-confidence matches (&gt;80%) are auto-filled for convenience</li>
          <li>• You can always override suggestions or add custom keywords</li>
        </ul>
      </div>

      {/* Add Keyword Modal */}
      {isAddingKeyword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Smart Keyword</h3>
              <button
                onClick={() => setIsAddingKeyword(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keyword
                </label>
                <input
                  type="text"
                  value={newKeyword.keyword}
                  onChange={(e) => setNewKeyword(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="e.g., starbucks, uber, netflix"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a word that commonly appears in transaction descriptions
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newKeyword.categoryId}
                  onChange={(e) => setNewKeyword(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <optgroup label="Income Categories">
                    {getCategoriesByType('income').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Expense Categories">
                    {getCategoriesByType('expense').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Level
                </label>
                <select
                  value={newKeyword.confidence}
                  onChange={(e) => setNewKeyword(prev => ({ ...prev, confidence: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0.95">95% - Very High (auto-fill)</option>
                  <option value="0.85">85% - High (auto-fill)</option>
                  <option value="0.75">75% - Medium (suggest only)</option>
                  <option value="0.60">60% - Low (suggest only)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Higher confidence levels will auto-fill the category
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingKeyword(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCategorizer;