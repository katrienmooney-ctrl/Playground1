import { useContext } from 'react';
import type { Tip } from '../../types';
import { CategoryContext } from '../../App';

interface Props {
  tips: Tip[];
}

const SEVERITY_STYLES = {
  info: { border: 'border-blue-200', bg: 'bg-blue-50', icon: '💡', badge: 'bg-blue-100 text-blue-700', label: 'Tip' },
  warning: { border: 'border-amber-200', bg: 'bg-amber-50', icon: '⚠️', badge: 'bg-amber-100 text-amber-700', label: 'Near Limit' },
  over: { border: 'border-red-200', bg: 'bg-red-50', icon: '🚨', badge: 'bg-red-100 text-red-700', label: 'Over Budget' },
};

export function SavingsTips({ tips }: Props) {
  const { getCategoryColor } = useContext(CategoryContext);

  if (tips.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3">💡</div>
        <p>Set budget limits to get personalized saving tips</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tips.map((tip, i) => {
        const s = SEVERITY_STYLES[tip.severity];
        const catColor = tip.category !== 'General' ? getCategoryColor(tip.category) : '#3b82f6';

        return (
          <div key={i} className={`rounded-xl border ${s.border} ${s.bg} p-4 flex gap-4`}>
            <div className="text-2xl shrink-0">{s.icon}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {tip.category !== 'General' && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />
                    <span className="text-sm font-medium text-gray-700">{tip.category}</span>
                  </div>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.badge}`}>
                  {s.label}
                </span>
              </div>
              <p className="text-sm text-gray-700">{tip.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
