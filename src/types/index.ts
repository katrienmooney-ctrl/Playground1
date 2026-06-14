export type Category = string;

export const ALL_CATEGORIES: string[] = [
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
  date: string;
  description: string;
  amount: number;
  category: string;
  source: 'csv' | 'manual';
}

export interface BudgetLimits {
  [key: string]: number;
}

export interface CategorySummary {
  category: string;
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
  category: string;
  severity: 'info' | 'warning' | 'over';
  message: string;
}

export interface CustomCategory {
  name: string;
  color: string;
}

export interface CategoryRule {
  descriptionNorm: string; // normalized for matching
  descriptionRaw: string;  // original for display
  category: string;
}

export type Page =
  | 'dashboard'
  | 'transactions'
  | 'breakdown'
  | 'totals'
  | 'tips'
  | 'calculator'
  | 'categories';
