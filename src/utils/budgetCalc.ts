import type { Transaction, BudgetLimits, CategorySummary, Tip } from '../types';
import { ALL_CATEGORIES } from '../types';
import { TIP_TEMPLATES } from '../constants/tips';

export function filterByMonth(transactions: Transaction[], month: string): Transaction[] {
  if (month === 'all') return transactions;
  return transactions.filter(t => t.date.startsWith(month));
}

export function sumByCategory(
  transactions: Transaction[],
  categories: string[] = ALL_CATEGORIES,
): Record<string, number> {
  const sums: Record<string, number> = {};
  for (const cat of categories) sums[cat] = 0;
  for (const t of transactions) {
    sums[t.category] = (sums[t.category] ?? 0) + t.amount;
  }
  return sums;
}

function getStatus(spent: number, limit: number): 'safe' | 'warning' | 'over' {
  if (limit <= 0) return 'safe';
  const pct = spent / limit;
  if (pct >= 1.0) return 'over';
  if (pct >= 0.75) return 'warning';
  return 'safe';
}

export function buildSummaries(
  transactions: Transaction[],
  budgets: BudgetLimits,
  month: string,
  categories: string[] = ALL_CATEGORIES,
  scaleFactor: number = 1,
): CategorySummary[] {
  const filtered = filterByMonth(transactions, month);
  const sums = sumByCategory(filtered, categories);
  return categories.map(cat => {
    const spent = sums[cat] ?? 0;
    const limit = (budgets[cat] ?? 0) * scaleFactor;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    return { category: cat, spent, limit, percentage, status: getStatus(spent, limit) };
  });
}

export function getAvailableMonths(transactions: Transaction[]): string[] {
  const months = new Set<string>();
  for (const t of transactions) months.add(t.date.slice(0, 7));
  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

export function computeOverallTotals(
  transactions: Transaction[],
  categories: string[] = ALL_CATEGORIES,
) {
  const total = transactions.reduce((s, t) => s + t.amount, 0);
  const byCategory = sumByCategory(transactions, categories);

  const monthlyTotals: Record<string, number> = {};
  for (const t of transactions) {
    const m = t.date.slice(0, 7);
    monthlyTotals[m] = (monthlyTotals[m] ?? 0) + t.amount;
  }

  const sortedMonths = Object.keys(monthlyTotals).sort();
  const averageMonthly =
    sortedMonths.length > 0
      ? Object.values(monthlyTotals).reduce((s, v) => s + v, 0) / sortedMonths.length
      : 0;

  let biggestCategory = 'Other';
  let maxSpend = 0;
  for (const cat of categories) {
    if ((byCategory[cat] ?? 0) > maxSpend) {
      maxSpend = byCategory[cat];
      biggestCategory = cat;
    }
  }

  return { total, byCategory, monthlyTotals, sortedMonths, averageMonthly, biggestCategory };
}

export function generateTips(summaries: CategorySummary[]): Tip[] {
  const tips: Tip[] = [];

  const overItems = summaries.filter(s => s.status === 'over' && s.limit > 0);
  const warnItems = summaries.filter(s => s.status === 'warning' && s.limit > 0);

  overItems
    .sort((a, b) => b.percentage - a.percentage)
    .forEach(s => {
      const template = TIP_TEMPLATES[s.category as keyof typeof TIP_TEMPLATES];
      tips.push({
        category: s.category,
        severity: 'over',
        message: template?.over ?? `You've exceeded your ${s.category} budget. Review your spending in this category and identify areas to cut back.`,
      });
    });

  warnItems
    .sort((a, b) => b.percentage - a.percentage)
    .forEach(s => {
      const template = TIP_TEMPLATES[s.category as keyof typeof TIP_TEMPLATES];
      tips.push({
        category: s.category,
        severity: 'warning',
        message: template?.warning ?? `Your ${s.category} spending is nearing the limit. Consider slowing down purchases in this category for the rest of the month.`,
      });
    });

  if (tips.length === 0) {
    tips.push({
      category: 'General',
      severity: 'info',
      message: 'Great job! All categories are within budget this month. Keep up the good work!',
    });
    tips.push({
      category: 'General',
      severity: 'info',
      message: 'Since you\'re under budget, consider putting the surplus into your investment account to build long-term wealth.',
    });
  }

  return tips.slice(0, 8);
}
