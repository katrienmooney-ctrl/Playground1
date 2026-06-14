import { useState, useContext } from 'react';
import type { Transaction, CategorySummary } from '../../types';
import { CategoryContext } from '../../App';
import { filterByMonth } from '../../utils/budgetCalc';

interface Props {
  summaries: CategorySummary[];
  transactions: Transaction[];
  selectedMonth: string;
}

const STATUS_BADGE: Record<string, string> = {
  safe: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  over: 'bg-red-100 text-red-700',
};

const STATUS_LABEL: Record<string, string> = {
  safe: 'On Track',
  warning: 'Near Limit',
  over: 'Over Budget',
};

export function MonthlyBreakdown({ summaries, transactions, selectedMonth }: Props) {
  const { getCategoryColor } = useContext(CategoryContext);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const filtered = filterByMonth(transactions, selectedMonth);

  const withActivity = summaries.filter(s => s.spent > 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Transactions</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Total Spent</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Budget</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Difference</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {withActivity.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                No transactions for this period
              </td>
            </tr>
          ) : (
            withActivity.map(s => {
              const catTxns = filtered.filter(t => t.category === s.category);
              const diff = s.limit > 0 ? s.limit - s.spent : null;
              const isExpanded = expandedCat === s.category;

              return (
                <>
                  <tr
                    key={s.category}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedCat(isExpanded ? null : s.category)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(s.category) }} />
                        <span className="font-medium text-gray-800">{s.category}</span>
                        <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{catTxns.length}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">${s.spent.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {s.limit > 0 ? `$${s.limit.toFixed(2)}` : '—'}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      diff === null ? 'text-gray-400' : diff >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {diff === null ? '—' : diff >= 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3">
                      {s.limit > 0 ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[s.status]}`}>
                          {STATUS_LABEL[s.status]}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No limit</span>
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${s.category}-detail`}>
                      <td colSpan={6} className="bg-gray-50 px-6 py-3">
                        <div className="space-y-1">
                          {catTxns.sort((a, b) => b.date.localeCompare(a.date)).map(t => (
                            <div key={t.id} className="flex justify-between text-xs text-gray-600 py-1 border-b border-gray-100 last:border-0">
                              <span>{t.date}</span>
                              <span className="flex-1 mx-4 truncate">{t.description}</span>
                              <span className="font-medium">${t.amount.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-xs font-semibold text-gray-800 pt-1">
                            <span>Total</span>
                            <span>${s.spent.toFixed(2)}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
