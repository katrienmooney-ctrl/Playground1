import { useState, useCallback } from 'react';
import type { BudgetLimits, Category } from '../types';
import { loadBudgets, saveBudgets } from '../utils/storage';

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetLimits>(() => loadBudgets());

  const setBudget = useCallback((category: Category, amount: number) => {
    setBudgets(prev => {
      const next = { ...prev, [category]: amount };
      saveBudgets(next);
      return next;
    });
  }, []);

  return { budgets, setBudget };
}
