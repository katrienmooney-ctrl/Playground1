import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import type { CategorySummary } from '../../types';
import { CATEGORY_COLORS } from '../../constants/categories';

interface Props {
  summaries: CategorySummary[];
}

const SHORT_LABELS: Record<string, string> = {
  Groceries: 'Groc',
  Dining: 'Dining',
  Transport: 'Trans',
  Entertainment: 'Entmt',
  Shopping: 'Shop',
  Utilities: 'Utils',
  Healthcare: 'Health',
  Travel: 'Travel',
  'Personal Care': 'P.Care',
  Subscriptions: 'Subs',
  Other: 'Other',
};

export function SpendingBarChart({ summaries }: Props) {
  const data = summaries.map(s => ({
    name: SHORT_LABELS[s.category] ?? s.category,
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
            <Cell key={s.category} fill={CATEGORY_COLORS[s.category]} />
          ))}
        </Bar>
        <Bar dataKey="Limit" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
