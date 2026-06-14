import { useState, useEffect, useCallback } from 'react';
import type { CategoryRule } from '../types';

const STORAGE_KEY = 'spendr_category_rules';

export function normalizeDesc(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function useCategoryRules() {
  const [rules, setRules] = useState<CategoryRule[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  }, [rules]);

  const addRule = useCallback((descriptionRaw: string, category: string) => {
    const descriptionNorm = normalizeDesc(descriptionRaw);
    setRules(prev => {
      // Replace existing rule for this description if present
      const filtered = prev.filter(r => r.descriptionNorm !== descriptionNorm);
      return [...filtered, { descriptionNorm, descriptionRaw, category }];
    });
  }, []);

  const applyRule = useCallback(
    (description: string): string | null => {
      const norm = normalizeDesc(description);
      const match = rules.find(r => r.descriptionNorm === norm);
      return match?.category ?? null;
    },
    [rules],
  );

  const deleteRule = useCallback((descriptionNorm: string) => {
    setRules(prev => prev.filter(r => r.descriptionNorm !== descriptionNorm));
  }, []);

  return { rules, addRule, applyRule, deleteRule };
}
