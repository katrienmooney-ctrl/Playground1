import type { CategorySummary, Category } from '../../types';
import { CategoryCard } from './CategoryCard';

interface Props {
  summaries: CategorySummary[];
  onSetLimit: (category: Category, amount: number) => void;
}

export function DashboardGrid({ summaries, onSetLimit }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {summaries.map(s => (
        <CategoryCard
          key={s.category}
          summary={s}
          onSetLimit={(cat, amt) => onSetLimit(cat as Category, amt)}
        />
      ))}
    </div>
  );
}
