import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Transaction } from '../../types';
import { computeOverallTotals } from '../../utils/budgetCalc';
import { CATEGORY_COLORS } from '../../constants/categories';

interface Props {
  transactions: Transaction[];
}

function formatMonth(m: string): string {
  const [y, mo] = m.split('-');
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function OverallTotals({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3">🧾</div>
        <p>No transactions to display</p>
        <p className="text-sm mt-1">Import a CSV or add transactions manually</p>
      </div>
    );
  }

  const { total, byCategory, monthlyTotals, sortedMonths, averageMonthly, biggestCategory } = computeOverallTotals(transactions);

  const pieData = Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .map(([cat, value]) => ({ name: cat, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);

  const lineData = sortedMonths.map(m => ({
    month: formatMonth(m),
    Spending: parseFloat(monthlyTotals[m].toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Spent" value={`$${total.toFixed(2)}`} icon="💰" />
        <StatCard label="Transactions" value={String(transactions.length)} icon="📋" />
        <StatCard label="Top Category" value={biggestCategory} icon="🏆" />
        <StatCard label="Avg Monthly" value={`$${averageMonthly.toFixed(2)}`} icon="📅" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map(entry => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip formatter={v => `$${Number(v).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 mb-4">Monthly Spending Trend</h3>
          {lineData.length < 2 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Need at least 2 months of data for a trend chart
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={v => `$${Number(v).toFixed(2)}`} />
                <Line type="monotone" dataKey="Spending" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800 text-sm">{value}</p>
      </div>
    </div>
  );
}
