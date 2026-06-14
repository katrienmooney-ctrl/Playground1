import { useContext } from 'react';
import { TransactionContext, BudgetContext, CategoryContext } from '../App';
import { buildSummaries } from '../utils/budgetCalc';
import { MonthlyBreakdown } from '../components/breakdown/MonthlyBreakdown';

interface Props {
  selectedMonth: string;
}

export function BreakdownPage({ selectedMonth }: Props) {
  const { transactions } = useContext(TransactionContext);
  const { budgets } = useContext(BudgetContext);
  const { allCategories } = useContext(CategoryContext);
  const summaries = buildSummaries(transactions, budgets, selectedMonth, allCategories);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Monthly Breakdown</h1>
        <p className="text-gray-500 text-sm mt-1">
          {selectedMonth === 'all' ? 'All time' : selectedMonth} — click a category to see individual transactions
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
