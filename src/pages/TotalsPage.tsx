import { useContext } from 'react';
import { TransactionContext } from '../App';
import { OverallTotals } from '../components/totals/OverallTotals';

export function TotalsPage() {
  const { transactions } = useContext(TransactionContext);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overall Totals</h1>
        <p className="text-gray-500 text-sm mt-1">Lifetime spending summary across all imported data</p>
      </div>
      <OverallTotals transactions={transactions} />
    </div>
  );
}
