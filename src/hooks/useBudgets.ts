import { useState, useEffect, useCallback } from 'react';
import type { BudgetLimits, Category } from '../types';
import { loadBudgets, saveBudgets } from '../utils/storage';

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetLimits>(() => loadBudgets());

  useEffect(() => {
    saveBudgets(budgets);
  }, [budgets]);

  const setBudget = useCallback((category: Category, amount: number) => {
    setBudgets(prev => ({ ...prev, [category]: amount }));
  }, []);

  return { budgets, setBudget };
}
