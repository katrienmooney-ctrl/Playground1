import { useContext } from 'react';
import { TransactionContext, BudgetContext, CategoryContext } from '../App';
import { buildSummaries, generateTips, getAvailableMonths } from '../utils/budgetCalc';
import { SavingsTips } from '../components/tips/SavingsTips';

interface Props {
  selectedMonth: string;
}

export function TipsPage({ selectedMonth }: Props) {
  const { transactions } = useContext(TransactionContext);
  const { budgets } = useContext(BudgetContext);
  const { allCategories } = useContext(CategoryContext);

  const availableMonths = getAvailableMonths(transactions);
  const scaleFactor = selectedMonth === 'all' ? Math.max(1, availableMonths.length) : 1;
  const summaries = buildSummaries(transactions, budgets, selectedMonth, allCategories, scaleFactor);
  const tips = generateTips(summaries);

  const hasLimits = Object.values(budgets).some(v => v > 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saving Tips</h1>
        <p className="text-gray-500 text-sm mt-1">
          Personalized advice based on your{' '}
          {selectedMonth === 'all' ? 'all-time' : selectedMonth} spending vs your budget limits
        </p>
      </div>
      {!hasLimits && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          <strong>Tip:</strong> Set budget limits on the Dashboard to get personalized spending advice here.
        </div>
      )}
      <SavingsTips tips={tips} />
    </div>
  );
}
