import Papa from 'papaparse';
import type { Transaction } from '../types';
import { categorize } from './categorize';

const DATE_ALIASES = ['date', 'transaction date', 'posted date', 'trans. date', 'trans date'];
const DESC_ALIASES = ['description', 'merchant', 'payee', 'narrative', 'details', 'memo'];
const AMOUNT_ALIASES = ['amount', 'debit', 'charge', 'transaction amount', 'credit'];

function findColumn(headers: string[], aliases: string[]): string | null {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const alias of aliases) {
    const idx = lower.indexOf(alias);
    if (idx !== -1) return headers[idx];
  }
  return null;
}

function parseDate(raw: string): string | null {
  raw = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parts = raw.split(/[\/\-\.]/);
  if (parts.length === 3) {
    const [a, b, c] = parts.map(Number);
    if (c > 1900) {
      // Prefer MM/DD/YYYY (US format): a=month, b=day
      if (a >= 1 && a <= 12 && b >= 1 && b <= 31) {
        return `${c}-${String(a).padStart(2, '0')}-${String(b).padStart(2, '0')}`;
      }
      // DD/MM/YYYY fallback: only when day > 12 (unambiguous)
      if (a > 12 && a <= 31 && b >= 1 && b <= 12) {
        return `${c}-${String(b).padStart(2, '0')}-${String(a).padStart(2, '0')}`;
      }
    }
    if (a > 1900) {
      // YYYY/MM/DD
      return `${a}-${String(b).padStart(2, '0')}-${String(c).padStart(2, '0')}`;
    }
  }
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

function parseAmount(raw: string): number | null {
  const cleaned = String(raw).replace(/[$,\s]/g, '');
  const val = parseFloat(cleaned);
  if (isNaN(val)) return null;
  return val;
}

export interface ParseResult {
  transactions: Transaction[];
  skipped: number;
  ruleApplied: number; // how many were categorized by saved rules
  error?: string;
}

export function parseCSV(
  file: File,
  existingTransactions: Transaction[],
  applyRule?: (description: string) => string | null,
): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        if (headers.length === 0) {
          resolve({ transactions: [], skipped: 0, ruleApplied: 0, error: 'No columns found in CSV.' });
          return;
        }

        const dateCol = findColumn(headers, DATE_ALIASES);
        const descCol = findColumn(headers, DESC_ALIASES);
        const amountCol = findColumn(headers, AMOUNT_ALIASES);

        if (!dateCol || !descCol || !amountCol) {
          resolve({
            transactions: [],
            skipped: 0,
            ruleApplied: 0,
            error: `Could not find required columns. Need: date (${DATE_ALIASES.join('/')}), description (${DESC_ALIASES.join('/')}), amount (${AMOUNT_ALIASES.join('/')}).`,
          });
          return;
        }

        const existing = new Set(
          existingTransactions.map(t => `${t.date}|${t.description}|${t.amount}`)
        );

        const transactions: Transaction[] = [];
        let skipped = 0;
        let ruleApplied = 0;

        for (const row of results.data as Record<string, string>[]) {
          const rawDate = row[dateCol] ?? '';
          const rawDesc = row[descCol] ?? '';
          const rawAmount = row[amountCol] ?? '';

          const date = parseDate(rawDate);
          const description = rawDesc.trim();
          const rawAmt = parseAmount(rawAmount);

          if (!date || !description || rawAmt === null) { skipped++; continue; }
          if (rawAmt === 0) { skipped++; continue; }
          if (rawAmt > 0) { skipped++; continue; }

          const amount = Math.abs(rawAmt);
          const key = `${date}|${description}|${amount}`;
          if (existing.has(key)) { skipped++; continue; }
          existing.add(key);

          const ruleCategory = applyRule?.(description) ?? null;
          if (ruleCategory) ruleApplied++;

          transactions.push({
            id: crypto.randomUUID(),
            date,
            description,
            amount,
            category: ruleCategory ?? categorize(description),
            source: 'csv',
          });
        }

        resolve({ transactions, skipped, ruleApplied });
      },
      error: (err) => {
        resolve({ transactions: [], skipped: 0, ruleApplied: 0, error: err.message });
      },
    });
  });
}
