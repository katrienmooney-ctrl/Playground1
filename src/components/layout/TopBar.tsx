interface Props {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
}

function formatMonth(m: string): string {
  const [year, month] = m.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function TopBar({ selectedMonth, onMonthChange, availableMonths }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600 font-medium">Period:</label>
        <select
          value={selectedMonth}
          onChange={e => onMonthChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          {availableMonths.map(m => (
            <option key={m} value={m}>{formatMonth(m)}</option>
          ))}
        </select>
      </div>
    </header>
  );
}
