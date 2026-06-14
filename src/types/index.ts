export type Category =
  | 'Groceries'
  | 'Dining'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Utilities'
  | 'Healthcare'
  | 'Travel'
  | 'Personal Care'
  | 'Subscriptions'
  | 'Other';

export const ALL_CATEGORIES: Category[] = [
  'Groceries',
  'Dining',
  'Transport',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Travel',
  'Personal Care',
  'Subscriptions',
  'Other',
];

export interface Transaction {
  id: string;
  date: string; // "YYYY-MM-DD"
  description: string;
  amount: number; // positive (absolute value of expense)
  category: Category;
  source: 'csv' | 'manual';
}

export interface BudgetLimits {
  [key: string]: number;
}

export interface CategorySummary {
  category: Category;
  spent: number;
  limit: number;
  percentage: number;
  status: 'safe' | 'warning' | 'over';
}

export interface YearlyProjection {
  year: number;
  futureValue: number;
  totalContributed: number;
  totalInterest: number;
}

export interface Tip {
  category: Category | 'General';
  severity: 'info' | 'warning' | 'over';
  message: string;
}

export type Page =
  | 'dashboard'
  | 'transactions'
  | 'breakdown'
  | 'totals'
  | 'tips'
  | 'calculator';
