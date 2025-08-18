import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  isDefault: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit-card' | 'loan' | 'investment' | 'other';
  balance: number;
  color: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  accountId: string;
  toAccountId?: string; // For transfers
  timestamp: number;
  isPlanned?: boolean; // For future-dated transactions
  recurringRuleId?: string; // Link to recurring rule
  tags?: string[]; // Transaction tags
  notes?: string; // Additional notes
}

export interface RecurringRule {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  accountId: string;
  toAccountId?: string; // For transfers
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // YYYY-MM-DD format
  endDate?: string; // Optional end date
  isActive: boolean;
  lastProcessed?: string; // Last date this rule was processed
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
  timestamp: number;
}

export interface SmartKeyword {
  id: string;
  keyword: string;
  categoryId: string;
  confidence: number;
}
interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  recurringRules: RecurringRule[];
  savingsGoals: SavingsGoal[];
  goalContributions: GoalContribution[];
  smartKeywords: SmartKeyword[];
}

export interface FilterOptions {
  type: 'all' | 'income' | 'expense' | 'transfer';
  category: string;
  account: string;
  search: string;
  dateFrom: string;
  dateTo: string;
  showPlanned: boolean;
  tags: string;
}

interface TransactionContextType extends TransactionState {
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  addTransactionWithDate: (transaction: Omit<Transaction, 'id' | 'timestamp'>, customDate?: string) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'timestamp'>>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'isDefault'>) => void;
  deleteCategory: (id: string) => void;
  addAccount: (account: Omit<Account, 'id' | 'isDefault'>) => void;
  updateAccount: (id: string, updates: Partial<Omit<Account, 'id' | 'isDefault'>>) => void;
  deleteAccount: (id: string) => void;
  addTransfer: (transfer: { fromAccountId: string; toAccountId: string; amount: number; description: string }) => void;
  addRecurringRule: (rule: Omit<RecurringRule, 'id' | 'lastProcessed'>) => void;
  updateRecurringRule: (id: string, updates: Partial<Omit<RecurringRule, 'id'>>) => void;
  deleteRecurringRule: (id: string) => void;
  processRecurringTransactions: () => void;
  addPlannedTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'> & { plannedDate: string }) => void;
  activatePlannedTransactions: () => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'isCompleted' | 'createdAt'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<Omit<SavingsGoal, 'id'>>) => void;
  deleteSavingsGoal: (id: string) => void;
  addGoalContribution: (contribution: Omit<GoalContribution, 'id' | 'timestamp'>) => void;
  getGoalContributions: (goalId: string) => GoalContribution[];
  addSmartKeyword: (keyword: Omit<SmartKeyword, 'id'>) => void;
  deleteSmartKeyword: (id: string) => void;
  suggestCategory: (description: string) => { categoryId: string; confidence: number } | null;
  parseNaturalLanguage: (input: string) => Partial<Omit<Transaction, 'id' | 'timestamp'>> | null;
  getBudgetPredictions: (month: string) => Array<{ categoryId: string; willExceed: boolean; projectedAmount: number; daysLeft: number }>;
  getSavingsProgress: () => Array<SavingsGoal & { progressPercentage: number; estimatedCompletionDate: string | null }>;
  getBalance: () => number;
  getAccountBalance: (accountId: string) => number;
  getTotalAccountsBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getRecentTransactions: (limit?: number) => Transaction[];
  getAccountTransactions: (accountId: string, limit?: number) => Transaction[];
  getFilteredTransactions: (filters: FilterOptions) => Transaction[];
  getGroupedTransactions: (filters: FilterOptions) => { [date: string]: Transaction[] };
  getCategoriesByType: (type: 'income' | 'expense' | 'both') => Category[];
  getCategoryById: (id: string) => Category | undefined;
  getAccountById: (id: string) => Account | undefined;
  getUpcomingTransactions: (days?: number) => Transaction[];
  getActiveRecurringRules: () => RecurringRule[];
}

type TransactionAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; updates: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; updates: Partial<Account> } }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: { id: string; updates: Partial<Budget> } }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_RECURRING_RULE'; payload: RecurringRule }
  | { type: 'UPDATE_RECURRING_RULE'; payload: { id: string; updates: Partial<RecurringRule> } }
  | { type: 'DELETE_RECURRING_RULE'; payload: string }
  | { type: 'ADD_SAVINGS_GOAL'; payload: SavingsGoal }
  | { type: 'UPDATE_SAVINGS_GOAL'; payload: { id: string; updates: Partial<SavingsGoal> } }
  | { type: 'DELETE_SAVINGS_GOAL'; payload: string }
 | { type: 'ADD_GOAL_CONTRIBUTION'; payload: GoalContribution }
  | { type: 'ADD_SMART_KEYWORD'; payload: SmartKeyword }
  | { type: 'DELETE_SMART_KEYWORD'; payload: string }
  | { type: 'LOAD_DATA'; payload: { transactions: Transaction[]; categories: Category[]; accounts: Account[]; budgets: Budget[]; recurringRules: RecurringRule[] } }

const defaultCategories: Category[] = [
  // Income categories
  { id: 'salary', name: 'Salary', type: 'income', color: 'bg-green-100 text-green-800', isDefault: true },
  { id: 'freelance', name: 'Freelance', type: 'income', color: 'bg-emerald-100 text-emerald-800', isDefault: true },
  { id: 'investment', name: 'Investment', type: 'income', color: 'bg-teal-100 text-teal-800', isDefault: true },
  { id: 'other-income', name: 'Other Income', type: 'income', color: 'bg-cyan-100 text-cyan-800', isDefault: true },
  
  // Expense categories
  { id: 'food', name: 'Food & Dining', type: 'expense', color: 'bg-orange-100 text-orange-800', isDefault: true },
  { id: 'transport', name: 'Transportation', type: 'expense', color: 'bg-blue-100 text-blue-800', isDefault: true },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: 'bg-purple-100 text-purple-800', isDefault: true },
  { id: 'utilities', name: 'Utilities', type: 'expense', color: 'bg-yellow-100 text-yellow-800', isDefault: true },
  { id: 'healthcare', name: 'Healthcare', type: 'expense', color: 'bg-red-100 text-red-800', isDefault: true },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', color: 'bg-pink-100 text-pink-800', isDefault: true },
  { id: 'other-expense', name: 'Other Expense', type: 'expense', color: 'bg-gray-100 text-gray-800', isDefault: true },
  { id: 'startup', name: 'Startup', type: 'expense', color: 'bg-green-100 text-green-800', isDefault: true },
];

const defaultAccounts: Account[] = [
  { id: 'cash', name: 'Cash', type: 'cash', balance: 0, color: 'bg-green-100 text-green-800', isDefault: true },
  { id: 'savings', name: 'Savings Account', type: 'bank', balance: 0, color: 'bg-purple-100 text-purple-800', isDefault: true },
   { id: 'UPI', name: 'UPI', type: 'wallet', balance: 0, color: 'bg-purple-100 text-purple-800', isDefault: true },
];

const defaultSmartKeywords: SmartKeyword[] = [
  // Food & Dining
  { id: 'kw-1', keyword: 'swiggy', categoryId: 'food', confidence: 0.95 },
  { id: 'kw-2', keyword: 'zomato', categoryId: 'food', confidence: 0.95 },
  { id: 'kw-3', keyword: 'restaurant', categoryId: 'food', confidence: 0.85 },
  { id: 'kw-4', keyword: 'grocery', categoryId: 'food', confidence: 0.90 },
  { id: 'kw-5', keyword: 'food', categoryId: 'food', confidence: 0.80 },
  { id: 'kw-6', keyword: 'lunch', categoryId: 'food', confidence: 0.85 },
  { id: 'kw-7', keyword: 'dinner', categoryId: 'food', confidence: 0.85 },
  { id: 'kw-8', keyword: 'breakfast', categoryId: 'food', confidence: 0.85 },
  { id: 'kw-9', keyword: 'cafe', categoryId: 'food', confidence: 0.80 },
  { id: 'kw-10', keyword: 'pizza', categoryId: 'food', confidence: 0.90 },
  
  // Transportation
  { id: 'kw-11', keyword: 'uber', categoryId: 'transport', confidence: 0.95 },
  { id: 'kw-12', keyword: 'ola', categoryId: 'transport', confidence: 0.95 },
  { id: 'kw-13', keyword: 'petrol', categoryId: 'transport', confidence: 0.95 },
  { id: 'kw-14', keyword: 'fuel', categoryId: 'transport', confidence: 0.95 },
  { id: 'kw-15', keyword: 'metro', categoryId: 'transport', confidence: 0.90 },
  { id: 'kw-16', keyword: 'bus', categoryId: 'transport', confidence: 0.85 },
  { id: 'kw-17', keyword: 'taxi', categoryId: 'transport', confidence: 0.90 },
  { id: 'kw-18', keyword: 'parking', categoryId: 'transport', confidence: 0.85 },
  { id: 'kw-19', keyword: 'toll', categoryId: 'transport', confidence: 0.90 },
  
  // Shopping
  { id: 'kw-20', keyword: 'amazon', categoryId: 'shopping', confidence: 0.85 },
  { id: 'kw-21', keyword: 'flipkart', categoryId: 'shopping', confidence: 0.85 },
  { id: 'kw-22', keyword: 'shopping', categoryId: 'shopping', confidence: 0.80 },
  { id: 'kw-23', keyword: 'clothes', categoryId: 'shopping', confidence: 0.85 },
  { id: 'kw-24', keyword: 'mall', categoryId: 'shopping', confidence: 0.75 },
  { id: 'kw-25', keyword: 'store', categoryId: 'shopping', confidence: 0.70 },
  
  // Utilities
  { id: 'kw-26', keyword: 'electricity', categoryId: 'utilities', confidence: 0.95 },
  { id: 'kw-27', keyword: 'water', categoryId: 'utilities', confidence: 0.85 },
  { id: 'kw-28', keyword: 'internet', categoryId: 'utilities', confidence: 0.90 },
  { id: 'kw-29', keyword: 'wifi', categoryId: 'utilities', confidence: 0.85 },
  { id: 'kw-30', keyword: 'phone', categoryId: 'utilities', confidence: 0.75 },
  { id: 'kw-31', keyword: 'mobile', categoryId: 'utilities', confidence: 0.75 },
  { id: 'kw-32', keyword: 'gas', categoryId: 'utilities', confidence: 0.85 },
  
  // Healthcare
  { id: 'kw-33', keyword: 'doctor', categoryId: 'healthcare', confidence: 0.90 },
  { id: 'kw-34', keyword: 'hospital', categoryId: 'healthcare', confidence: 0.95 },
  { id: 'kw-35', keyword: 'medicine', categoryId: 'healthcare', confidence: 0.90 },
  { id: 'kw-36', keyword: 'pharmacy', categoryId: 'healthcare', confidence: 0.85 },
  { id: 'kw-37', keyword: 'medical', categoryId: 'healthcare', confidence: 0.85 },
  
  // Entertainment
  { id: 'kw-38', keyword: 'movie', categoryId: 'entertainment', confidence: 0.90 },
  { id: 'kw-39', keyword: 'netflix', categoryId: 'entertainment', confidence: 0.95 },
  { id: 'kw-40', keyword: 'spotify', categoryId: 'entertainment', confidence: 0.95 },
  { id: 'kw-41', keyword: 'game', categoryId: 'entertainment', confidence: 0.75 },
  { id: 'kw-42', keyword: 'concert', categoryId: 'entertainment', confidence: 0.85 },
  
  // Income
  { id: 'kw-43', keyword: 'salary', categoryId: 'salary', confidence: 0.95 },
  { id: 'kw-44', keyword: 'freelance', categoryId: 'freelance', confidence: 0.90 },
  { id: 'kw-45', keyword: 'bonus', categoryId: 'salary', confidence: 0.85 },
  { id: 'kw-46', keyword: 'dividend', categoryId: 'investment', confidence: 0.90 },
];
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const transactionReducer = (state: TransactionState, action: TransactionAction): TransactionState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id 
            ? { ...t, ...action.payload.updates }
            : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
        transactions: state.transactions.map(t => 
          t.category === action.payload 
            ? { ...t, category: t.type === 'income' ? 'other-income' : 'other-expense' }
            : t
        ),
        budgets: state.budgets.filter(b => b.categoryId !== action.payload),
      };
    case 'ADD_ACCOUNT':
      return {
        ...state,
        accounts: [...state.accounts, action.payload],
      };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(a => 
          a.id === action.payload.id 
            ? { ...a, ...action.payload.updates }
            : a
        ),
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(a => a.id !== action.payload),
        transactions: state.transactions.filter(t => 
          t.accountId !== action.payload && t.toAccountId !== action.payload
        ),
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b => 
          b.id === action.payload.id 
            ? { ...b, ...action.payload.updates }
            : b
        ),
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload),
      };
    case 'ADD_RECURRING_RULE':
      return {
        ...state,
        recurringRules: [...state.recurringRules, action.payload],
      };
    case 'UPDATE_RECURRING_RULE':
      return {
        ...state,
        recurringRules: state.recurringRules.map(r => 
          r.id === action.payload.id 
            ? { ...r, ...action.payload.updates }
            : r
        ),
      };
    case 'DELETE_RECURRING_RULE':
      return {
        ...state,
        recurringRules: state.recurringRules.filter(r => r.id !== action.payload),
        transactions: state.transactions.filter(t => t.recurringRuleId !== action.payload),
      };
    case 'ADD_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: [...state.savingsGoals, action.payload],
      };
    case 'UPDATE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map(g => 
          g.id === action.payload.id 
            ? { ...g, ...action.payload.updates }
            : g
        ),
      };
    case 'DELETE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.filter(g => g.id !== action.payload),
        goalContributions: state.goalContributions.filter(c => c.goalId !== action.payload),
      };
    case 'ADD_GOAL_CONTRIBUTION':
      const contribution = action.payload;
      const goal = state.savingsGoals.find(g => g.id === contribution.goalId);
      if (!goal) return state;
      
      const updatedGoal = {
        ...goal,
        currentAmount: Math.round((goal.currentAmount + contribution.amount) * 100) / 100,
        isCompleted: Math.round((goal.currentAmount + contribution.amount) * 100) / 100 >= goal.targetAmount
      };
      
      return {
        ...state,
        goalContributions: [...state.goalContributions, contribution],
        savingsGoals: state.savingsGoals.map(g => 
          g.id === contribution.goalId ? updatedGoal : g
        ),
      };
    case 'ADD_SMART_KEYWORD':
      return {
        ...state,
        smartKeywords: [...state.smartKeywords, action.payload],
      };
    case 'DELETE_SMART_KEYWORD':
      return {
        ...state,
        smartKeywords: state.smartKeywords.filter(k => k.id !== action.payload),
      };
    case 'LOAD_DATA':
      return {
        transactions: action.payload.transactions || [],
        categories: action.payload.categories || defaultCategories,
        accounts: action.payload.accounts || defaultAccounts,
        budgets: action.payload.budgets || [],
        recurringRules: action.payload.recurringRules || [],
        savingsGoals: action.payload.savingsGoals || [],
        goalContributions: action.payload.goalContributions || [],
        smartKeywords: action.payload.smartKeywords || defaultSmartKeywords,
      };
    default:
      return state;
  }
};

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, { 
    transactions: [], 
    categories: defaultCategories,
    accounts: defaultAccounts,
    budgets: [],
    recurringRules: [],
    savingsGoals: [],
    goalContributions: [],
    goalContributions: [],
    smartKeywords: defaultSmartKeywords
  });

  // Migration function to handle checking account removal
  const migrateCheckingAccountData = (transactions: Transaction[], accounts: Account[]) => {
    // Find an alternative bank account or create one
    let targetAccountId = accounts.find(a => a.type === 'bank' && a.id !== 'checking')?.id;
    
    if (!targetAccountId) {
      // If no other bank account exists, use savings account
      targetAccountId = 'savings';
    }
    
    // Migrate all transactions from checking account to target account
    return transactions.map(transaction => ({
      ...transaction,
      accountId: transaction.accountId === 'checking' ? targetAccountId : transaction.accountId,
      toAccountId: transaction.toAccountId === 'checking' ? targetAccountId : transaction.toAccountId
    }));
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTransactions = localStorage.getItem('finance-pouch-transactions');
    const storedCategories = localStorage.getItem('finance-pouch-categories');
    const storedAccounts = localStorage.getItem('finance-pouch-accounts');
    const storedBudgets = localStorage.getItem('finance-pouch-budgets');
    const storedRecurringRules = localStorage.getItem('finance-pouch-recurring-rules');
    const storedSavingsGoals = localStorage.getItem('finance-pouch-savings-goals');
    const storedGoalContributions = localStorage.getItem('finance-pouch-goal-contributions');
    const storedSmartKeywords = localStorage.getItem('finance-pouch-smart-keywords');
    
    let transactions: Transaction[] = [];
    let categories: Category[] = defaultCategories;
    let accounts: Account[] = defaultAccounts;
    let budgets: Budget[] = [];
    let recurringRules: RecurringRule[] = [];
    let savingsGoals: SavingsGoal[] = [];
    let goalContributions: GoalContribution[] = [];
    let smartKeywords: SmartKeyword[] = defaultSmartKeywords;

    if (storedTransactions) {
      try {
        transactions = JSON.parse(storedTransactions);
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
      }
    }

    // Migrate checking account transactions before loading
    if (transactions.length > 0) {
      transactions = migrateCheckingAccountData(transactions, accounts);
    }

    if (storedCategories) {
      try {
        const parsed = JSON.parse(storedCategories);
        // Merge with default categories, keeping custom ones
        const customCategories = parsed.filter((c: Category) => !c.isDefault);
        categories = [...defaultCategories, ...customCategories];
      } catch (error) {
        console.error('Error loading categories from localStorage:', error);
      }
    }

    if (storedAccounts) {
      try {
        const parsed = JSON.parse(storedAccounts);
        // Filter out checking account from stored accounts and merge with new defaults
        const customAccounts = parsed.filter((a: Account) => !a.isDefault);
        const storedDefaults = parsed.filter((a: Account) => a.isDefault && a.id !== 'checking');
        
        // Combine new defaults with existing custom accounts, excluding checking
        accounts = [...defaultAccounts, ...customAccounts];
      } catch (error) {
        console.error('Error loading accounts from localStorage:', error);
      }
    }

    if (storedBudgets) {
      try {
        budgets = JSON.parse(storedBudgets);
      } catch (error) {
        console.error('Error loading budgets from localStorage:', error);
      }
    }

    if (storedRecurringRules) {
      try {
        recurringRules = JSON.parse(storedRecurringRules);
      } catch (error) {
        console.error('Error loading recurring rules from localStorage:', error);
      }
    }

    if (storedSavingsGoals) {
      try {
        savingsGoals = JSON.parse(storedSavingsGoals);
      } catch (error) {
        console.error('Error loading savings goals from localStorage:', error);
      }
    }

    if (storedGoalContributions) {
      try {
        goalContributions = JSON.parse(storedGoalContributions);
      } catch (error) {
        console.error('Error loading goal contributions from localStorage:', error);
      }
    }

    if (storedSmartKeywords) {
      try {
        const parsed = JSON.parse(storedSmartKeywords);
        // Merge with default keywords, keeping custom ones
        const customKeywords = parsed.filter((k: SmartKeyword) => !defaultSmartKeywords.find(dk => dk.id === k.id));
        smartKeywords = [...defaultSmartKeywords, ...customKeywords];
      } catch (error) {
        console.error('Error loading smart keywords from localStorage:', error);
      }
    }

    dispatch({ type: 'LOAD_DATA', payload: { transactions, categories, accounts, budgets, recurringRules, savingsGoals, goalContributions, smartKeywords } });
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('finance-pouch-transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('finance-pouch-categories', JSON.stringify(state.categories));
  }, [state.categories]);

  useEffect(() => {
    localStorage.setItem('finance-pouch-accounts', JSON.stringify(state.accounts));
  }, [state.accounts]);

  useEffect(() => {
    localStorage.setItem('finance-pouch-budgets', JSON.stringify(state.budgets));
  }, [state.budgets]);

  useEffect(() => {
    localStorage.setItem('finance-pouch-recurring-rules', JSON.stringify(state.recurringRules));
  }, [state.recurringRules]);

  useEffect(() => {
    localStorage.setItem('finance-pouch-savings-goals', JSON.stringify(state.savingsGoals));
  }, [state.savingsGoals]);

  useEffect(() => {
    localStorage.setItem('finance-pouch-goal-contributions', JSON.stringify(state.goalContributions));
  }, [state.goalContributions]);

  useEffect(() => {
    localStorage.setItem('finance-pouch-smart-keywords', JSON.stringify(state.smartKeywords));
  }, [state.smartKeywords]);

  // Process recurring and planned transactions on app load
  useEffect(() => {
    const timer = setTimeout(() => {
      processRecurringTransactions();
      activatePlannedTransactions();
    }, 1000); // Delay to ensure data is loaded

    return () => clearTimeout(timer);
  }, [state.recurringRules]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    // Ensure precise amount handling - round to 2 decimal places to prevent floating point errors
    const preciseAmount = Math.round(transaction.amount * 100) / 100;
    
    const newTransaction: Transaction = {
      ...transaction,
      amount: preciseAmount,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amount: Math.round(transaction.amount * 100) / 100, // Fix rounding precision
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const addTransactionWithDate = (transaction: Omit<Transaction, 'id' | 'timestamp'>, customDate?: string) => {
    let timestamp = Date.now();
    
    if (customDate) {
      const selectedDate = new Date(customDate);
      // Set time to current time but with selected date
      const now = new Date();
      selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
      timestamp = selectedDate.getTime();
    }
    
    // Ensure precise amount handling - round to 2 decimal places to prevent floating point errors
    const preciseAmount = Math.round(transaction.amount * 100) / 100;
    
    const newTransaction: Transaction = {
      ...transaction,
      amount: preciseAmount,
      id: crypto.randomUUID(),
      timestamp: timestamp,
      amount: Math.round(transaction.amount * 100) / 100, // Fix rounding precision
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const updateTransaction = (id: string, updates: Partial<Omit<Transaction, 'id' | 'timestamp'>>) => {
    // Allow timestamp updates for planned transactions
    const allowedUpdates = updates as Partial<Transaction>;
    // Fix rounding precision for amount updates
    if (allowedUpdates.amount !== undefined) {
      allowedUpdates.amount = Math.round(allowedUpdates.amount * 100) / 100;
    }
    dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, updates: allowedUpdates } });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addCategory = (category: Omit<Category, 'id' | 'isDefault'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
      isDefault: false,
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const deleteCategory = (id: string) => {
    const category = state.categories.find(c => c.id === id);
    if (category && !category.isDefault) {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }
  };

  const addAccount = (account: Omit<Account, 'id' | 'isDefault'>) => {
    // Ensure precise balance handling - round to 2 decimal places to prevent floating point errors
    const preciseBalance = Math.round(account.balance * 100) / 100;
    
    const newAccount: Account = {
      ...account,
      balance: preciseBalance,
      id: crypto.randomUUID(),
      isDefault: false,
      balance: Math.round(account.balance * 100) / 100, // Fix rounding precision
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
  };

  const updateAccount = (id: string, updates: Partial<Omit<Account, 'id' | 'isDefault'>>) => {
    // Fix rounding precision for balance updates
    const fixedUpdates = { ...updates };
    if (fixedUpdates.balance !== undefined) {
      fixedUpdates.balance = Math.round(fixedUpdates.balance * 100) / 100;
    }
    dispatch({ type: 'UPDATE_ACCOUNT', payload: { id, updates } });
  };

  const deleteAccount = (id: string) => {
    const account = state.accounts.find(a => a.id === id);
    if (account && !account.isDefault) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    }
  };

  const addTransfer = (transfer: { fromAccountId: string; toAccountId: string; amount: number; description: string }) => {
    // Ensure precise amount handling - round to 2 decimal places to prevent floating point errors
    const preciseAmount = Math.round(transfer.amount * 100) / 100;
    
    const transferTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: transfer.description,
      amount: preciseAmount,
      type: 'transfer',
      category: 'transfer',
      accountId: transfer.fromAccountId,
      toAccountId: transfer.toAccountId,
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: transferTransaction });
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    // Ensure precise amount handling - round to 2 decimal places to prevent floating point errors
    const preciseAmount = Math.round(budget.amount * 100) / 100;
    
    const newBudget: Budget = {
      ...budget,
      amount: preciseAmount,
      id: crypto.randomUUID(),
      amount: Math.round(budget.amount * 100) / 100, // Fix rounding precision
    };
    dispatch({ type: 'ADD_BUDGET', payload: newBudget });
  };

  const updateBudget = (id: string, updates: Partial<Omit<Budget, 'id'>>) => {
    // Fix rounding precision for budget amount updates
    const fixedUpdates = { ...updates };
    if (fixedUpdates.amount !== undefined) {
      fixedUpdates.amount = Math.round(fixedUpdates.amount * 100) / 100;
    }
    dispatch({ type: 'UPDATE_BUDGET', payload: { id, updates } });
  };

  const deleteBudget = (id: string) => {
    dispatch({ type: 'DELETE_BUDGET', payload: id });
  };

  const addRecurringRule = (rule: Omit<RecurringRule, 'id' | 'lastProcessed'>) => {
    // Ensure precise amount handling - round to 2 decimal places to prevent floating point errors
    const preciseAmount = Math.round(rule.amount * 100) / 100;
    
    const newRule: RecurringRule = {
      ...rule,
      amount: preciseAmount,
      id: crypto.randomUUID(),
      lastProcessed: undefined,
      amount: Math.round(rule.amount * 100) / 100, // Fix rounding precision
    };
    dispatch({ type: 'ADD_RECURRING_RULE', payload: newRule });
  };

  const updateRecurringRule = (id: string, updates: Partial<Omit<RecurringRule, 'id'>>) => {
    // Fix rounding precision for recurring rule amount updates
    const fixedUpdates = { ...updates };
    if (fixedUpdates.amount !== undefined) {
      fixedUpdates.amount = Math.round(fixedUpdates.amount * 100) / 100;
    }
    dispatch({ type: 'UPDATE_RECURRING_RULE', payload: { id, updates } });
  };

  const deleteRecurringRule = (id: string) => {
    dispatch({ type: 'DELETE_RECURRING_RULE', payload: id });
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'isCompleted' | 'createdAt'>) => {
    // Ensure precise amount handling - round to 2 decimal places to prevent floating point errors
    const preciseTargetAmount = Math.round(goal.targetAmount * 100) / 100;
    
    const newGoal: SavingsGoal = {
      ...goal,
      targetAmount: preciseTargetAmount,
      id: crypto.randomUUID(),
      currentAmount: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      targetAmount: Math.round(goal.targetAmount * 100) / 100, // Fix rounding precision
    };
    dispatch({ type: 'ADD_SAVINGS_GOAL', payload: newGoal });
  };

  const updateSavingsGoal = (id: string, updates: Partial<Omit<SavingsGoal, 'id'>>) => {
    // Fix rounding precision for savings goal updates
    const fixedUpdates = { ...updates };
    if (fixedUpdates.targetAmount !== undefined) {
      fixedUpdates.targetAmount = Math.round(fixedUpdates.targetAmount * 100) / 100;
    }
    if (fixedUpdates.currentAmount !== undefined) {
      fixedUpdates.currentAmount = Math.round(fixedUpdates.currentAmount * 100) / 100;
    }
    dispatch({ type: 'UPDATE_SAVINGS_GOAL', payload: { id, updates } });
  };

  const deleteSavingsGoal = (id: string) => {
    dispatch({ type: 'DELETE_SAVINGS_GOAL', payload: id });
  };

  const addGoalContribution = (contribution: Omit<GoalContribution, 'id' | 'timestamp'>) => {
    // Ensure precise amount handling - round to 2 decimal places to prevent floating point errors
    const preciseAmount = Math.round(contribution.amount * 100) / 100;
    
    const newContribution: GoalContribution = {
      ...contribution,
      amount: preciseAmount,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amount: Math.round(contribution.amount * 100) / 100, // Fix rounding precision
    };
    dispatch({ type: 'ADD_GOAL_CONTRIBUTION', payload: newContribution });
  };

  const getGoalContributions = (goalId: string) => {
    return state.goalContributions
      .filter(c => c.goalId === goalId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const addSmartKeyword = (keyword: Omit<SmartKeyword, 'id'>) => {
    const newKeyword: SmartKeyword = {
      ...keyword,
      id: crypto.randomUUID(),
    };
    dispatch({ type: 'ADD_SMART_KEYWORD', payload: newKeyword });
  };

  const deleteSmartKeyword = (id: string) => {
    dispatch({ type: 'DELETE_SMART_KEYWORD', payload: id });
  };

  const suggestCategory = (description: string): { categoryId: string; confidence: number } | null => {
    const lowerDescription = description.toLowerCase();
    let bestMatch: { categoryId: string; confidence: number } | null = null;
    
    for (const keyword of state.smartKeywords) {
      if (lowerDescription.includes(keyword.keyword.toLowerCase())) {
        if (!bestMatch || keyword.confidence > bestMatch.confidence) {
          bestMatch = {
            categoryId: keyword.categoryId,
            confidence: keyword.confidence,
          };
        }
      }
    }
    
    return bestMatch;
  };

  const parseNaturalLanguage = (input: string): Partial<Omit<Transaction, 'id' | 'timestamp'>> | null => {
    const lowerInput = input.toLowerCase().trim();
    
    // Extract amount using regex
    const amountMatch = lowerInput.match(/(\d+(?:\.\d{2})?)/);
    if (!amountMatch) return null;
    
    const amount = Math.round(parseFloat(amountMatch[1]) * 100) / 100; // Fix rounding precision
    
    // Determine transaction type
    const isIncome = /\b(earned|received|got|salary|income|paid|bonus)\b/.test(lowerInput);
    const type: 'income' | 'expense' = isIncome ? 'income' : 'expense';
    
    // Extract description (remove amount and common words)
    let description = input
      .replace(/\b(i|spent|paid|bought|earned|received|got|on|for|today|yesterday|₹|\$|rs\.?)\b/gi, '')
      .replace(/\d+(?:\.\d{2})?/, '')
      .trim()
      .replace(/\s+/g, ' ');
    
    // Capitalize first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);
    
    // Suggest category based on description
    const suggestion = suggestCategory(description);
    const category = suggestion?.categoryId || (type === 'income' ? 'other-income' : 'other-expense');
    
    // Default to first account
    const accountId = state.accounts.length > 0 ? state.accounts[0].id : '';
    
    return {
      description,
      amount,
      type,
      category,
      accountId,
    };
  };

  const getBudgetPredictions = (month: string) => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    
    if (month !== currentMonth) return [];
    
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const daysLeft = daysInMonth - daysPassed;
    
    if (daysLeft <= 0) return [];
    
    return state.budgets
      .filter(budget => budget.month === month)
      .map(budget => {
        const spent = getCategorySpending(budget.categoryId, month);
        const dailySpend = spent / daysPassed;
        const projectedAmount = spent + (dailySpend * daysLeft);
        const willExceed = projectedAmount > budget.amount;
        
        return {
          categoryId: budget.categoryId,
          willExceed,
          projectedAmount,
          daysLeft,
        };
      })
      .filter(prediction => prediction.willExceed);
  };

  const getSavingsProgress = () => {
    const currentBalance = getBalance();
    
    return state.savingsGoals.map(goal => {
      // Calculate current amount based on balance or manual updates
      const progressPercentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      
      // Estimate completion date based on current saving rate
      let estimatedCompletionDate: string | null = null;
      if (goal.currentAmount < goal.targetAmount) {
        const remaining = goal.targetAmount - goal.currentAmount;
        const createdDate = new Date(goal.createdAt);
        const daysSinceCreated = Math.max(1, Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));
        const dailySavingRate = goal.currentAmount / daysSinceCreated;
        
        if (dailySavingRate > 0) {
          const daysToComplete = remaining / dailySavingRate;
          const completionDate = new Date();
          completionDate.setDate(completionDate.getDate() + daysToComplete);
          estimatedCompletionDate = completionDate.toISOString().split('T')[0];
        }
      }
      
      return {
        ...goal,
        progressPercentage: Math.min(progressPercentage, 100),
        estimatedCompletionDate,
      };
    });
  };
  const addPlannedTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'> & { plannedDate: string }) => {
    const { plannedDate, ...transactionData } = transaction;
    const plannedTimestamp = new Date(plannedDate).getTime();
    
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      timestamp: plannedTimestamp,
      isPlanned: true,
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const processRecurringTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    
    state.recurringRules.forEach(rule => {
      if (!rule.isActive) return;
      
      const startDate = new Date(rule.startDate);
      const todayDate = new Date(today);
      
      if (startDate > todayDate) return; // Rule hasn't started yet
      if (rule.endDate && new Date(rule.endDate) < todayDate) return; // Rule has ended
      
      const lastProcessed = rule.lastProcessed ? new Date(rule.lastProcessed) : new Date(rule.startDate);
      const shouldProcess = shouldProcessRecurringRule(rule, lastProcessed, todayDate);
      
      if (shouldProcess) {
        const newTransaction: Transaction = {
          id: crypto.randomUUID(),
          description: rule.description,
          amount: rule.amount,
          type: rule.type,
          category: rule.category,
          accountId: rule.accountId,
          toAccountId: rule.toAccountId,
          timestamp: todayDate.getTime(),
          recurringRuleId: rule.id,
        };
        
        dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
        dispatch({ type: 'UPDATE_RECURRING_RULE', payload: { id: rule.id, updates: { lastProcessed: today } } });
      }
    });
  };

  const shouldProcessRecurringRule = (rule: RecurringRule, lastProcessed: Date, today: Date): boolean => {
    const daysDiff = Math.floor((today.getTime() - lastProcessed.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (rule.interval) {
      case 'daily':
        return daysDiff >= 1;
      case 'weekly':
        return daysDiff >= 7;
      case 'monthly':
        const monthsDiff = (today.getFullYear() - lastProcessed.getFullYear()) * 12 + 
                          (today.getMonth() - lastProcessed.getMonth());
        return monthsDiff >= 1;
      case 'yearly':
        return today.getFullYear() > lastProcessed.getFullYear();
      default:
        return false;
    }
  };

  const activatePlannedTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTimestamp = new Date(today).getTime();
    
    const transactionsToActivate = state.transactions.filter(t => 
      t.isPlanned && t.timestamp <= todayTimestamp
    );
    
    transactionsToActivate.forEach(transaction => {
      dispatch({ 
        type: 'UPDATE_TRANSACTION', 
        payload: { 
          id: transaction.id, 
          updates: { isPlanned: false, timestamp: Date.now() } 
        } 
      });
    });
  };

  const getBalance = () => {
    // Only return balance if accounts exist, otherwise return 0
    return state.accounts.length > 0 ? getTotalAccountsBalance() : 0;
  };

  const getAccountBalance = (accountId: string) => {
    const account = state.accounts.find(a => a.id === accountId);
    if (!account) return 0;

    const accountTransactions = state.transactions.filter(t => 
      (t.accountId === accountId || t.toAccountId === accountId) && !t.isPlanned
    );

    const transactionBalance = accountTransactions.reduce((balance, transaction) => {
      if (transaction.type === 'transfer') {
        if (transaction.accountId === accountId) {
          return balance - transaction.amount; // Money going out
        } else if (transaction.toAccountId === accountId) {
          return balance + transaction.amount; // Money coming in
        }
      } else if (transaction.accountId === accountId) {
        return transaction.type === 'income' 
          ? balance + transaction.amount 
          : balance - transaction.amount;
      }
      return balance;
    }, 0);

    // Return account's initial balance plus transaction effects, rounded to 2 decimal places
    return Math.round((account.balance + transactionBalance) * 100) / 100;
  };

  const getTotalAccountsBalance = () => {
    const total = state.accounts.reduce((total, account) => {
      return total + account.balance; // Use only the initial account balances
    }, 0);
    
    // Round to 2 decimal places to prevent floating point errors
    return Math.round(total * 100) / 100;
  };

  const getTotalIncome = () => {
    const total = state.transactions
      .filter(t => t.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
    
    // Round to 2 decimal places
    return Math.round(total * 100) / 100;
  };

  const getTotalExpenses = () => {
    const total = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
    
    // Round to 2 decimal places
    return Math.round(total * 100) / 100;
  };

  const getMonthlyBalance = (month: string) => {
    const monthlyTransactions = state.transactions.filter(t => {
      const transactionMonth = new Date(t.timestamp).toISOString().slice(0, 7);
      return transactionMonth === month;
    });
    
    return monthlyTransactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  const getMonthlyIncome = (month: string) => {
    return state.transactions
      .filter(t => {
        const transactionMonth = new Date(t.timestamp).toISOString().slice(0, 7);
        return transactionMonth === month && t.type === 'income';
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getMonthlyExpenses = (month: string) => {
    return state.transactions
      .filter(t => {
        const transactionMonth = new Date(t.timestamp).toISOString().slice(0, 7);
        return transactionMonth === month && t.type === 'expense';
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getCategorySpending = (categoryId: string, month: string) => {
    return state.transactions
      .filter(t => {
        const transactionMonth = new Date(t.timestamp).toISOString().slice(0, 7);
        return transactionMonth === month && t.category === categoryId && t.type === 'expense';
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getBudgetProgress = (month: string) => {
    const expenseCategories = getCategoriesByType('expense');
    
    return expenseCategories.map(category => {
      const budget = state.budgets.find(b => b.categoryId === category.id && b.month === month);
      const spent = getCategorySpending(category.id, month);
      const budgetAmount = budget?.amount || 0;
      const remaining = budgetAmount - spent;
      const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
      
      return {
        category,
        budget,
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        isOverBudget: spent > budgetAmount && budgetAmount > 0,
      };
    });
  };

  const getExpensesByCategory = (month: string) => {
    const expenseCategories = getCategoriesByType('expense');
    
    return expenseCategories
      .map(category => ({
        category: category.name,
        amount: getCategorySpending(category.id, month),
        color: category.color.includes('bg-') ? 
          category.color.split(' ')[0].replace('bg-', '#') : '#6B7280',
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  };

  const getMonthlyTrends = () => {
    const months = new Set<string>();
    
    state.transactions.forEach(t => {
      const month = new Date(t.timestamp).toISOString().slice(0, 7);
      months.add(month);
    });
    
    return Array.from(months)
      .sort()
      .slice(-12) // Last 12 months
      .map(month => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }),
        income: getMonthlyIncome(month),
        expenses: getMonthlyExpenses(month),
        balance: getMonthlyBalance(month),
      }));
  };

  const getRecentTransactions = (limit = 5) => {
    // Include all transactions (both regular and planned) but sort by timestamp
    return state.transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  };

  const getAccountTransactions = (accountId: string, limit?: number) => {
    const accountTransactions = state.transactions
      .filter(t => t.accountId === accountId || t.toAccountId === accountId)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return limit ? accountTransactions.slice(0, limit) : accountTransactions;
  };

  const getFilteredTransactions = (filters: FilterOptions) => {
    let filteredTransactions = state.transactions;
    
    // Filter out planned transactions if not requested
    if (!filters.showPlanned) {
      filteredTransactions = filteredTransactions.filter(t => !t.isPlanned);
    }
    
    return filteredTransactions.filter(transaction => {
      // Type filter
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      // Account filter
      if (filters.account && transaction.accountId !== filters.account && transaction.toAccountId !== filters.account) {
        return false;
      }

      // Search filter
      if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Tags filter
      if (filters.tags && transaction.tags) {
        const filterTags = filters.tags.toLowerCase().split(',').map(tag => tag.trim()).filter(tag => tag);
        const hasMatchingTag = filterTags.some(filterTag => 
          transaction.tags!.some(transactionTag => 
            transactionTag.toLowerCase().includes(filterTag)
          )
        );
        if (!hasMatchingTag) {
          return false;
        }
      } else if (filters.tags && !transaction.tags) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const transactionDate = new Date(transaction.timestamp);
        const transactionDateStr = transactionDate.toISOString().split('T')[0];

        if (filters.dateFrom && transactionDateStr < filters.dateFrom) {
          return false;
        }

        if (filters.dateTo && transactionDateStr > filters.dateTo) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => b.timestamp - a.timestamp);
  };

  const getGroupedTransactions = (filters: FilterOptions) => {
    const filtered = getFilteredTransactions(filters);
    const grouped: { [date: string]: Transaction[] } = {};

    filtered.forEach(transaction => {
      const date = new Date(transaction.timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });

    return grouped;
  };

  const getCategoriesByType = (type: 'income' | 'expense' | 'both') => {
    return state.categories.filter(category => 
      category.type === type || category.type === 'both'
    );
  };

  const getCategoryById = (id: string) => {
    return state.categories.find(category => category.id === id);
  };

  const getAccountById = (id: string) => {
    return state.accounts.find(account => account.id === id);
  };

  const getUpcomingTransactions = (days = 30) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return state.transactions
      .filter(t => t.isPlanned && t.timestamp >= today.getTime() && t.timestamp <= futureDate.getTime())
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const getActiveRecurringRules = () => {
    return state.recurringRules.filter(rule => rule.isActive);
  };

  const value: TransactionContextType = {
    transactions: state.transactions,
    categories: state.categories,
    accounts: state.accounts,
    budgets: state.budgets,
    recurringRules: state.recurringRules,
    savingsGoals: state.savingsGoals,
    goalContributions: state.goalContributions,
    smartKeywords: state.smartKeywords,
    addTransaction,
    addTransactionWithDate,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransfer,
    addBudget,
    updateBudget,
    deleteBudget,
    addRecurringRule,
    updateRecurringRule,
    deleteRecurringRule,
    processRecurringTransactions,
    addPlannedTransaction,
    activatePlannedTransactions,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addGoalContribution,
    getGoalContributions,
    addSmartKeyword,
    deleteSmartKeyword,
    suggestCategory,
    parseNaturalLanguage,
    getBudgetPredictions,
    getSavingsProgress,
    getBalance,
    getAccountBalance,
    getTotalAccountsBalance,
    getTotalIncome,
    getTotalExpenses,
    getMonthlyBalance,
    getMonthlyIncome,
    getMonthlyExpenses,
    getCategorySpending,
    getBudgetProgress,
    getExpensesByCategory,
    getMonthlyTrends,
    getRecentTransactions,
    getAccountTransactions,
    getFilteredTransactions,
    getGroupedTransactions,
    getCategoriesByType,
    getCategoryById,
    getAccountById,
    getUpcomingTransactions,
    getActiveRecurringRules,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};