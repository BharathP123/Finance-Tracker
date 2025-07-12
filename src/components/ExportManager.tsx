import React, { useState } from 'react';
import { Download, Upload, FileText, Database, Calendar } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import { useCurrency } from '../contexts/CurrencyContext';
import type { FilterOptions } from '../contexts/TransactionContext';

const ExportManager: React.FC = () => {
  const { 
    getFilteredTransactions, 
    getCategoryById, 
    getAccountById,
    transactions,
    categories,
    accounts,
    budgets,
    recurringRules,
    savingsGoals
  } = useTransactions();
  const { formatCurrency } = useCurrency();
  
  const [exportFilters, setExportFilters] = useState<FilterOptions>({
    type: 'all',
    category: '',
    account: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    showPlanned: false,
  });

  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const generateCSV = (data: any[], headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header.toLowerCase().replace(' ', '_')] || '';
          // Escape commas and quotes in CSV
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportTransactions = () => {
    const filteredTransactions = getFilteredTransactions(exportFilters);
    
    if (exportFormat === 'csv') {
      const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account', 'Tags', 'Notes'];
      const csvData = filteredTransactions.map(transaction => ({
        date: new Date(transaction.timestamp).toLocaleDateString(),
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: getCategoryById(transaction.category)?.name || 'Unknown',
        account: getAccountById(transaction.accountId)?.name || 'Unknown',
        tags: transaction.tags?.join('; ') || '',
        notes: transaction.notes || '',
      }));
      
      const csvContent = generateCSV(csvData, headers);
      downloadFile(csvContent, `transactions_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    } else {
      const jsonContent = JSON.stringify(filteredTransactions, null, 2);
      downloadFile(jsonContent, `transactions_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    }
  };

  const exportFullBackup = () => {
    const backupData = {
      transactions,
      categories,
      accounts,
      budgets,
      recurringRules,
      savingsGoals,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const jsonContent = JSON.stringify(backupData, null, 2);
    downloadFile(jsonContent, `finance_pouch_backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        // Validate backup data structure
        if (backupData.transactions && Array.isArray(backupData.transactions)) {
          // Store in localStorage (this would typically trigger a reload or state update)
          localStorage.setItem('finance-pouch-transactions', JSON.stringify(backupData.transactions));
          localStorage.setItem('finance-pouch-categories', JSON.stringify(backupData.categories || []));
          localStorage.setItem('finance-pouch-accounts', JSON.stringify(backupData.accounts || []));
          localStorage.setItem('finance-pouch-budgets', JSON.stringify(backupData.budgets || []));
          localStorage.setItem('finance-pouch-recurring-rules', JSON.stringify(backupData.recurringRules || []));
          localStorage.setItem('finance-pouch-savings-goals', JSON.stringify(backupData.savingsGoals || []));
          
          alert('Backup imported successfully! Please refresh the page to see the changes.');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (error) {
        alert('Error reading backup file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const filteredTransactions = getFilteredTransactions(exportFilters);

  return (
    <div className="space-y-6">
      {/* Export Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Download className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Export Transactions</h2>
        </div>

        {/* Export Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={exportFilters.type}
              onChange={(e) => setExportFilters(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date From
            </label>
            <input
              type="date"
              value={exportFilters.dateFrom}
              onChange={(e) => setExportFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date To
            </label>
            <input
              type="date"
              value={exportFilters.dateTo}
              onChange={(e) => setExportFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="csv">CSV (Excel Compatible)</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {filteredTransactions.length} transactions selected for export
            </p>
            <p className="text-xs text-gray-500">
              {exportFormat === 'csv' ? 'Excel-compatible CSV format' : 'JSON format for data backup'}
            </p>
          </div>
          <button
            onClick={exportTransactions}
            disabled={filteredTransactions.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export Transactions</span>
          </button>
        </div>

        {/* Preview */}
        {filteredTransactions.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Preview (First 5 transactions)</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(transaction.amount)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 capitalize">{transaction.type}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {getCategoryById(transaction.category)?.name || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Backup & Restore */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Database className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Backup & Restore</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Backup */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Download className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Create Backup</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Download a complete backup of all your financial data including transactions, categories, accounts, budgets, and goals.
            </p>
            <button
              onClick={exportFullBackup}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Backup</span>
            </button>
          </div>

          {/* Restore */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Upload className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Restore Backup</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Import a previously created backup file to restore your financial data. This will replace all current data.
            </p>
            <label className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Important Notes</h4>
              <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                <li>• Backup files contain all your financial data in JSON format</li>
                <li>• Importing a backup will replace all current data</li>
                <li>• Create regular backups to prevent data loss</li>
                <li>• CSV exports are for analysis in Excel/Google Sheets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportManager;