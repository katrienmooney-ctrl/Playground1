import { useState, useMemo } from 'react';
import { calculateProjections } from '../../utils/investmentCalc';

export function InvestmentCalculator() {
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const projections = useMemo(
    () => calculateProjections(monthly, rate, years),
    [monthly, rate, years]
  );

  const final = projections[projections.length - 1];

  function fmt(n: number) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Investment Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Savings</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={monthly}
                onChange={e => setMonthly(Math.max(1, Number(e.target.value)))}
                min={1}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate (%)</label>
            <div className="relative">
              <input
                type="number"
                value={rate}
                onChange={e => setRate(Math.max(0, Math.min(50, Number(e.target.value))))}
                min={0}
                max={50}
                step={0.1}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Investment Period (years)</label>
            <input
              type="number"
              value={years}
              onChange={e => setYears(Math.max(1, Math.min(50, Math.floor(Number(e.target.value)))))}
              min={1}
              max={50}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {final && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ResultCard label="Future Value" value={fmt(final.futureValue)} highlight icon="💰" />
          <ResultCard label="Total Contributed" value={fmt(final.totalContributed)} icon="💵" />
          <ResultCard label="Interest Earned" value={fmt(final.totalInterest)} icon="📈" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Year-by-Year Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Year</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Future Value</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Total Contributed</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Interest Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projections.map(p => (
                <tr key={p.year} className={p.year === years ? 'bg-blue-50 font-medium' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-2.5 text-gray-700">Year {p.year}</td>
                  <td className="px-4 py-2.5 text-right text-gray-800">{fmt(p.futureValue)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{fmt(p.totalContributed)}</td>
                  <td className="px-4 py-2.5 text-right text-green-600">{fmt(p.totalInterest)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>Formula used:</strong> FV = PMT × [(1 + r/12)^(12t) − 1] / (r/12), where PMT is your monthly contribution, r is the annual rate, and t is years. Interest is compounded monthly.
      </div>
    </div>
  );
}

function ResultCard({ label, value, icon, highlight }: { label: string; value: string; icon: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <p className={`text-xs font-medium ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{label}</p>
      </div>
      <p className={`text-xl font-bold ${highlight ? 'text-white' : 'text-gray-800'}`}>{value}</p>
    </div>
  );
}
