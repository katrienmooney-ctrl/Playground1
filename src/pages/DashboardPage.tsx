import { useContext } from 'react';
import { TransactionContext, BudgetContext, CategoryContext } from '../App';
import { buildSummaries, getAvailableMonths, filterByMonth } from '../utils/budgetCalc';
import { DashboardGrid } from '../components/dashboard/DashboardGrid';
import { SpendingBarChart } from '../components/dashboard/SpendingBarChart';

interface Props {
  selectedMonth: string;
}

export function DashboardPage({ selectedMonth }: Props) {
  const { transactions } = useContext(TransactionContext);
  const { budgets, setBudget } = useContext(BudgetContext);
  const { allCategories } = useContext(CategoryContext);

  const availableMonths = getAvailableMonths(transactions);
  // When viewing all time, scale budget limits by the number of months loaded
  const scaleFactor = selectedMonth === 'all' ? Math.max(1, availableMonths.length) : 1;
  const summaries = buildSummaries(transactions, budgets, selectedMonth, allCategories, scaleFactor);

  const periodTransactions = filterByMonth(transactions, selectedMonth);
  const hasData = transactions.length > 0;
  const overCount = summaries.filter(s => s.status === 'over' && s.limit > 0).length;
  const warnCount = summaries.filter(s => s.status === 'warning' && s.limit > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {selectedMonth === 'all'
            ? <>All time · {transactions.length} transactions · budgets scaled ×{scaleFactor} months</>
            : <>{selectedMonth} · {periodTransactions.length} transactions</>
          }
          {overCount > 0 && <span className="ml-2 text-red-600 font-medium">· {overCount} over budget</span>}
          {warnCount > 0 && <span className="ml-2 text-amber-600 font-medium">· {warnCount} near limit</span>}
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
          {selectedMonth === 'all' && availableMonths.length > 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-700">
              Showing all {availableMonths.length} months. Budget limits are multiplied by {availableMonths.length} for a fair comparison.
            </div>
          )}
          <DashboardGrid summaries={summaries} onSetLimit={setBudget} />
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 mb-4">Spending vs Budget</h2>
            <SpendingBarChart summaries={summaries} />
          </div>
        </>
      )}
    </div>
  );
}
