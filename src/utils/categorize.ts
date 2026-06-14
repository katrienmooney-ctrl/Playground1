import type { Category } from '../types';
import { ALL_CATEGORIES } from '../types';
import { CATEGORY_KEYWORDS } from '../constants/categories';

export function categorize(description: string): Category {
  const lower = description.toLowerCase();
  for (const cat of ALL_CATEGORIES) {
    if (cat === 'Other') continue;
    const keywords = CATEGORY_KEYWORDS[cat];
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return cat;
      }
    }
  }
  return 'Other';
}
