'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatINR } from '@/lib/format';

export default function CashflowChart({ transactions }) {
  // Group income/expense into the last 6 months
  const data = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.toLocaleString('en-IN', { month: 'short' }),
        income: 0,
        expense: 0,
      };
    });
    const map = new Map(buckets.map((b) => [b.key, b]));
    for (const t of transactions) {
      const b = map.get(`${t.date.getFullYear()}-${t.date.getMonth()}`);
      if (b) b[t.type] += t.amount;
    }
    return buckets;
  }, [transactions]);

  const axis = { fill: '#111827', fontWeight: 700, fontSize: 12 };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
        <XAxis dataKey="month" tick={axis} tickLine={false} axisLine={{ stroke: '#111827', strokeWidth: 2 }} />
        <YAxis tick={axis} tickLine={false} axisLine={{ stroke: '#111827', strokeWidth: 2 }}
               tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
        <Tooltip
          formatter={(v) => formatINR(Number(v))}
          contentStyle={{ border: '3px solid #111827', borderRadius: 12, boxShadow: '4px 4px 0 #111827', fontWeight: 700 }}
        />
        <Legend wrapperStyle={{ fontWeight: 700 }} />
        <Bar dataKey="income" name="Income" fill="#A7F3D0" stroke="#111827" strokeWidth={2} />
        <Bar dataKey="expense" name="Expenses" fill="#FF5722" stroke="#111827" strokeWidth={2} />
      </BarChart>
    </ResponsiveContainer>
  );
}
