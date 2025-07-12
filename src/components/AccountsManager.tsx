import React, { useState } from 'react';
import { Wallet, CreditCard, Building2, PiggyBank, TrendingUp, Plus, Edit3, Trash2, X } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import type { Account } from '../contexts/TransactionContext';

const AccountsManager: React.FC = () => {
  const { 
    accounts, 
    addAccount, 
    updateAccount, 
    deleteAccount, 
    getAccountBalance,
    getAccountTransactions 
  } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'bank' as Account['type'],
    balance: '',
    color: 'bg-blue-100 text-blue-800',
  });

  const accountTypes = [
    { value: 'cash', label: 'Cash', icon: Wallet },
    { value: 'bank', label: 'Bank Account', icon: Building2 },
    { value: 'credit-card', label: 'Credit Card', icon: CreditCard },
    { value: 'loan', label: 'Loan', icon: TrendingUp },
    { value: 'investment', label: 'Investment', icon: PiggyBank },
    { value: 'other', label: 'Other', icon: Wallet },
  ];

  const colorOptions = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-yellow-100 text-yellow-800',
    'bg-indigo-100 text-indigo-800',
    'bg-red-100 text-red-800',
    'bg-orange-100 text-orange-800',
  ];

  const getAccountIcon = (type: Account['type']) => {
    const accountType = accountTypes.find(t => t.value === type);
    return accountType ? accountType.icon : Wallet;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name.trim() || !newAccount.balance) return;

    // Fix rounding precision before adding account
    const balance = Math.round(parseFloat(newAccount.balance) * 100) / 100;

    addAccount({
      name: newAccount.name.trim(),
      type: newAccount.type,
      balance: balance,
      color: newAccount.color,
    });

    setNewAccount({
      name: '',
      type: 'bank',
      balance: '',
      color: 'bg-blue-100 text-blue-800',
    });
    setIsAddingAccount(false);
  };

  const handleEdit = (account: Account) => {
    setEditingAccountId(account.id);
  };

  const handleSaveEdit = (accountId: string, name: string) => {
    if (!name.trim()) return;
    updateAccount(accountId, { name: name.trim() });
    setEditingAccountId(null);
  };

  const handleDelete = (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (account && !account.isDefault) {
      if (window.confirm('Are you sure you want to delete this account? All associated transactions will be removed.')) {
        deleteAccount(id);
      }
    }
  };

  const customAccounts = accounts.filter(a => !a.isDefault);
  const defaultAccounts = accounts.filter(a => a.isDefault);

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Account Overview</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(accounts.reduce((total, account) => total + getAccountBalance(account.id), 0))}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const Icon = getAccountIcon(account.type);
            const balance = getAccountBalance(account.id);
            const recentTransactions = getAccountTransactions(account.id, 3);

            return (
              <div key={account.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${account.color.replace('text-', 'text-').replace('bg-', 'bg-').split(' ')[0]} bg-opacity-20`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      {editingAccountId === account.id ? (
                        <input
                          type="text"
                          defaultValue={account.name}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit(account.id, (e.target as HTMLInputElement).value);
                            } else if (e.key === 'Escape') {
                              setEditingAccountId(null);
                            }
                          }}
                          className="text-sm font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-sm font-medium text-gray-900">{account.name}</h3>
                      )}
                      <p className="text-xs text-gray-500 capitalize">{account.type.replace('-', ' ')}</p>
                    </div>
                  </div>
                  {!account.isDefault && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(account)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Edit account"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <p className={`text-lg font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(balance)}
                  </p>
                </div>

                {recentTransactions.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 mb-2">Recent Activity</p>
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex justify-between text-xs">
                        <span className="text-gray-600 truncate">{transaction.description}</span>
                        <span className={`font-medium ${
                          transaction.type === 'income' || (transaction.type === 'transfer' && transaction.toAccountId === account.id)
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' || (transaction.type === 'transfer' && transaction.toAccountId === account.id) ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Manage Accounts</h3>
          <button
            onClick={() => setIsAddingAccount(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </div>

        {customAccounts.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Accounts</h4>
            <div className="space-y-2">
              {customAccounts.map((account) => {
                const Icon = getAccountIcon(account.type);
                return (
                  <div key={account.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{account.name}</span>
                        <p className="text-xs text-gray-500 capitalize">{account.type.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(getAccountBalance(account.id))}
                      </span>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Default Accounts</h4>
          <div className="space-y-2">
            {defaultAccounts.map((account) => {
              const Icon = getAccountIcon(account.type);
              return (
                <div key={account.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{account.name}</span>
                      <p className="text-xs text-gray-500 capitalize">{account.type.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(getAccountBalance(account.id))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Account Modal */}
      {isAddingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Account</h3>
              <button
                onClick={() => setIsAddingAccount(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter account name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, type: e.target.value as Account['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {accountTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Balance
                </label>
                <input
                  type="number"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, balance: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="any"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewAccount(prev => ({ ...prev, color }))}
                      className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                        newAccount.color === color ? 'border-blue-500' : 'border-gray-200'
                      } ${color}`}
                    >
                      <span className="text-xs font-medium">Sample</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingAccount(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsManager;