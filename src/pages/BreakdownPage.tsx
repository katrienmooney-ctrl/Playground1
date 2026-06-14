import { useContext } from 'react';
import { TransactionContext, BudgetContext, CategoryContext } from '../App';
import { buildSummaries, getAvailableMonths } from '../utils/budgetCalc';
import { MonthlyBreakdown } from '../components/breakdown/MonthlyBreakdown';

interface Props {
  selectedMonth: string;
}

export function BreakdownPage({ selectedMonth }: Props) {
  const { transactions } = useContext(TransactionContext);
  const { budgets } = useContext(BudgetContext);
  const { allCategories } = useContext(CategoryContext);

  const availableMonths = getAvailableMonths(transactions);
  const scaleFactor = selectedMonth === 'all' ? Math.max(1, availableMonths.length) : 1;
  const summaries = buildSummaries(transactions, budgets, selectedMonth, allCategories, scaleFactor);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Monthly Breakdown</h1>
        <p className="text-gray-500 text-sm mt-1">
          {selectedMonth === 'all'
            ? `All time (${availableMonths.length} month${availableMonths.length !== 1 ? 's' : ''}) — click a category to see its transactions`
            : `${selectedMonth} — click a category to see its transactions`
          }
        </p>
      </div>
      <MonthlyBreakdown
        summaries={summaries}
        transactions={transactions}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
