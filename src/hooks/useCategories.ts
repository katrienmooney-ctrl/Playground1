import { useState, useEffect, useCallback } from 'react';
import type { CustomCategory } from '../types';

const STORAGE_KEY = 'spendr_custom_categories';

export function useCategories() {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customCategories));
  }, [customCategories]);

  const addCategory = useCallback((name: string, color: string) => {
    setCustomCategories(prev => {
      if (prev.some(c => c.name.toLowerCase() === name.toLowerCase())) return prev;
      return [...prev, { name, color }];
    });
  }, []);

  const deleteCategory = useCallback((name: string) => {
    setCustomCategories(prev => prev.filter(c => c.name !== name));
  }, []);

  return { customCategories, addCategory, deleteCategory };
}
