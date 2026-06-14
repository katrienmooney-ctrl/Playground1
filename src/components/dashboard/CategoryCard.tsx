import { useContext } from 'react';
import type { CategorySummary } from '../../types';
import { CategoryContext } from '../../App';

interface Props {
  summary: CategorySummary;
  onSetLimit: (category: string, amount: number) => void;
}

const STATUS_COLORS = {
  safe: 'bg-green-500',
  warning: 'bg-amber-400',
  over: 'bg-red-500',
};

const STATUS_LABELS = {
  safe: 'On Track',
  warning: 'Near Limit',
  over: 'Over Budget',
};

const STATUS_BADGE = {
  safe: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  over: 'bg-red-100 text-red-700',
};

export function CategoryCard({ summary, onSetLimit }: Props) {
  const { getCategoryColor } = useContext(CategoryContext);
  const { category, spent, limit, percentage, status } = summary;
  const displayPct = Math.min(percentage, 100);
  const color = getCategoryColor(category);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-medium text-gray-800 text-sm">{category}</span>
        </div>
        {limit > 0 && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[status]}`}>
            {STATUS_LABELS[status]}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent</span>
          <span className="font-medium text-gray-800">${spent.toFixed(2)}</span>
        </div>
        {limit > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Limit</span>
            <span className="text-gray-500">${limit.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        {limit > 0 ? (
          <div
            className={`h-full rounded-full transition-all ${STATUS_COLORS[status]}`}
            style={{ width: `${displayPct}%` }}
          />
        ) : (
          <div className="h-full bg-gray-200 rounded-full" style={{ width: '0%' }} />
        )}
      </div>

      <div className="flex items-center gap-2">
        {limit > 0 ? (
          <span className="text-xs text-gray-400">
            {percentage.toFixed(0)}% of budget used
          </span>
        ) : (
          <span className="text-xs text-gray-400">No limit set</span>
        )}
        <input
          type="number"
          placeholder="Set limit"
          defaultValue={limit > 0 ? limit : ''}
          min={0}
          step={10}
          onBlur={e => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val >= 0) onSetLimit(category, val);
          }}
          className="ml-auto border border-gray-200 rounded px-2 py-0.5 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
