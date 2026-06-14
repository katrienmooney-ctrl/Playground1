import type { Transaction, BudgetLimits } from '../types';
import { ALL_CATEGORIES } from '../types';

const TX_KEY = 'spendr_transactions';
const BUDGET_KEY = 'spendr_budgets';

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(TX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Transaction[];
  } catch {
    return [];
  }
}

export function saveTransactions(txns: Transaction[]): void {
  localStorage.setItem(TX_KEY, JSON.stringify(txns));
}

export function loadBudgets(): BudgetLimits {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    if (!raw) return buildDefaultBudgets();
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return buildDefaultBudgets();
    return parsed as BudgetLimits;
  } catch {
    return buildDefaultBudgets();
  }
}

export function saveBudgets(b: BudgetLimits): void {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(b));
}

function buildDefaultBudgets(): BudgetLimits {
  const b: BudgetLimits = {};
  for (const cat of ALL_CATEGORIES) b[cat] = 0;
  return b;
}
