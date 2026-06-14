import type { Page } from '../../types';

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { page: Page; label: string; icon: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: '📊' },
  { page: 'transactions', label: 'Transactions', icon: '💳' },
  { page: 'breakdown', label: 'Monthly Breakdown', icon: '📅' },
  { page: 'totals', label: 'Overall Totals', icon: '🧾' },
  { page: 'tips', label: 'Saving Tips', icon: '💡' },
  { page: 'calculator', label: 'Investment Calculator', icon: '📈' },
];

export function Sidebar({ activePage, onNavigate }: Props) {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0 min-h-screen">
      <div className="px-6 py-5 border-b border-gray-700">
        <span className="text-xl font-bold text-white">SpendTrack</span>
        <p className="text-xs text-gray-400 mt-0.5">Budget & Investment Tracker</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map(({ page, label, icon }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm text-left transition-colors ${
              activePage === page
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
