import { useState, useContext, useEffect } from 'react';
import type { Transaction } from '../../types';
import { CategoryContext, TransactionContext, CategoryRulesContext } from '../../App';
import { normalizeDesc } from '../../hooks/useCategoryRules';

interface Props {
  transactions: Transaction[];
  onUpdateCategory: (id: string, category: string) => void;
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 20;

type SortField = 'date' | 'description' | 'category' | 'amount';
type SortDir = 'asc' | 'desc';

interface UpdatePrompt {
  description: string;
  newCategory: string;
  count: number;
}

function formatDate(d: string): string {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function truncate(s: string, max = 35): string {
  return s.length > max ? s.slice(0, max) + '…' : s;
}

export function TransactionTable({ transactions, onUpdateCategory, onDelete }: Props) {
  const { allCategories, getCategoryColor } = useContext(CategoryContext);
  const { updateCategoryByDescription } = useContext(TransactionContext);
  const { addRule } = useContext(CategoryRulesContext);

  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [search, setSearch] = useState('');
  const [updatePrompt, setUpdatePrompt] = useState<UpdatePrompt | null>(null);

  useEffect(() => {
    setPage(1);
  }, [transactions]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setPage(1);
  }

  function handleCategoryChange(t: Transaction, newCategory: string) {
    onUpdateCategory(t.id, newCategory);
    addRule(t.description, newCategory);

    const norm = normalizeDesc(t.description);
    const similarCount = transactions.filter(
      tx => tx.id !== t.id &&
            normalizeDesc(tx.description) === norm &&
            tx.category !== newCategory
    ).length;

    if (similarCount > 0) {
      setUpdatePrompt({ description: t.description, newCategory, count: similarCount });
    } else {
      setUpdatePrompt(null);
    }
  }

  function handleUpdateAll() {
    if (!updatePrompt) return;
    updateCategoryByDescription(updatePrompt.description, updatePrompt.newCategory);
    setUpdatePrompt(null);
  }

  const filtered = transactions.filter(t =>
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'date') cmp = a.date.localeCompare(b.date);
    else if (sortField === 'description') cmp = a.description.localeCompare(b.description);
    else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
    else if (sortField === 'amount') cmp = a.amount - b.amount;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-gray-400">↕</span>;
    return <span>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-500">{filtered.length} transactions</span>
      </div>

      {updatePrompt && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-amber-900">
            Found <strong>{updatePrompt.count}</strong> other{' '}
            <span className="font-mono bg-amber-100 px-1 rounded text-xs">
              "{truncate(updatePrompt.description)}"
            </span>{' '}
            transaction{updatePrompt.count !== 1 ? 's' : ''} in a different category.
            Update {updatePrompt.count !== 1 ? 'them' : 'it'} all to{' '}
            <strong>"{updatePrompt.newCategory}"</strong>?
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleUpdateAll}
              className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
            >
              Update All
            </button>
            <button
              onClick={() => setUpdatePrompt(null)}
              className="px-3 py-1.5 text-sm border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-100"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">💳</div>
          <p>No transactions found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {(['date', 'description', 'category', 'amount'] as SortField[]).map(f => (
                    <th
                      key={f}
                      onClick={() => handleSort(f)}
                      className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none capitalize"
                    >
                      {f} <SortIcon field={f} />
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageItems.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{t.description}</td>
                    <td className="px-4 py-3">
                      <select
                        value={t.category}
                        onChange={e => handleCategoryChange(t, e.target.value)}
                        className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        style={{ color: getCategoryColor(t.category) }}
                      >
                        {allCategories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">${t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onDelete(t.id)}
                        className="text-red-400 hover:text-red-600 text-xs"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
