import { useContext } from 'react';
import { TransactionContext, BudgetContext } from '../App';
import { buildSummaries } from '../utils/budgetCalc';
import { DashboardGrid } from '../components/dashboard/DashboardGrid';
import { SpendingBarChart } from '../components/dashboard/SpendingBarChart';
import type { Category } from '../types';

interface Props {
  selectedMonth: string;
}

export function DashboardPage({ selectedMonth }: Props) {
  const { transactions } = useContext(TransactionContext);
  const { budgets, setBudget } = useContext(BudgetContext);

  const summaries = buildSummaries(transactions, budgets, selectedMonth);
  const hasData = transactions.length > 0;

  const overCount = summaries.filter(s => s.status === 'over' && s.limit > 0).length;
  const warnCount = summaries.filter(s => s.status === 'warning' && s.limit > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {selectedMonth === 'all' ? 'All time' : selectedMonth} • {transactions.length} transactions
          {overCount > 0 && <span className="ml-2 text-red-600 font-medium">• {overCount} over budget</span>}
          {warnCount > 0 && <span className="ml-2 text-amber-600 font-medium">• {warnCount} near limit</span>}
        </p>
      </div>

      {!hasData ? (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="text-5xl mb-3">📊</div>
          <p className="font-medium text-gray-600">No transactions yet</p>
          <p className="text-sm mt-1">Go to Transactions to import a CSV or add entries manually</p>
        </div>
      ) : (
        <>
          <DashboardGrid
            summaries={summaries}
            onSetLimit={(cat, amt) => setBudget(cat as Category, amt)}
          />
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 mb-4">Spending vs Budget</h2>
            <SpendingBarChart summaries={summaries} />
          </div>
        </>
      )}
    </div>
  );
}
