import { useContext } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import type { CategorySummary } from '../../types';
import { CategoryContext } from '../../App';

interface Props {
  summaries: CategorySummary[];
}

export function SpendingBarChart({ summaries }: Props) {
  const { getCategoryColor } = useContext(CategoryContext);

  const data = summaries.map(s => ({
    name: s.category.length > 7 ? s.category.slice(0, 6) + '…' : s.category,
    fullName: s.category,
    Spent: parseFloat(s.spent.toFixed(2)),
    Limit: s.limit > 0 ? parseFloat(s.limit.toFixed(2)) : undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
        <Tooltip
          formatter={(value, name) => [`$${Number(value).toFixed(2)}`, String(name)]}
          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName ?? label}
        />
        <Legend />
        <Bar dataKey="Spent" radius={[4, 4, 0, 0]}>
          {summaries.map(s => (
            <Cell key={s.category} fill={getCategoryColor(s.category)} />
          ))}
        </Bar>
        <Bar dataKey="Limit" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
