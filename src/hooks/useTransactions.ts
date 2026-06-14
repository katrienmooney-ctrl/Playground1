import { useState, useEffect, useCallback } from 'react';
import type { Transaction, Category } from '../types';
import { loadTransactions, saveTransactions } from '../utils/storage';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const addTransactions = useCallback((incoming: Transaction[]) => {
    setTransactions(prev => [...incoming, ...prev]);
  }, []);

  const updateCategory = useCallback((id: string, category: Category) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, category } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setTransactions([]);
  }, []);

  return { transactions, addTransactions, updateCategory, deleteTransaction, clearAll };
}
