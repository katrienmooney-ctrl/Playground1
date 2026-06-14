import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '../types';
import { loadTransactions, saveTransactions } from '../utils/storage';
import { normalizeDesc } from './useCategoryRules';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const addTransactions = useCallback((incoming: Transaction[]) => {
    setTransactions(prev => [...incoming, ...prev]);
  }, []);

  const updateCategory = useCallback((id: string, category: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, category } : t))
    );
  }, []);

  const updateCategoryByDescription = useCallback((descriptionRaw: string, category: string) => {
    const norm = normalizeDesc(descriptionRaw);
    setTransactions(prev =>
      prev.map(t => normalizeDesc(t.description) === norm ? { ...t, category } : t)
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setTransactions([]);
  }, []);

  return { transactions, addTransactions, updateCategory, updateCategoryByDescription, deleteTransaction, clearAll };
}
