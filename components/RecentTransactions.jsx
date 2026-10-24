'use client';

import { useAuth } from '@/lib/AuthContext';
import { deleteTransaction } from '@/lib/firestoreService';
import { formatDate, formatINR } from '@/lib/format';

export default function RecentTransactions({ transactions, hasDemo, busy, onClearDemo }) {
  const { user } = useAuth();
  const recent = transactions.slice(0, 8);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <p className="text-xs opacity-70">Live from Firestore · latest 8</p>
        </div>
        {hasDemo && (
          <button onClick={onClearDemo} disabled={busy}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold card disabled:opacity-60">
            {busy ? 'Working...' : 'Clear Demo Data'}
          </button>
        )}
      </div>

      {recent.length === 0 && <p className="text-sm opacity-70">Nothing here yet.</p>}

      {recent.map((t) => (
        <div key={t.id} className="flex items-center justify-between gap-3 py-2 border-b-2 border-dashed border-[#111827]/30">
          <div className="min-w-0">
            <div className="text-sm font-bold flex items-center gap-2">
              {t.category}
              {t.isDemo && <span className="px-2 py-0.5 text-[10px] ai-pill rounded-full">DEMO</span>}
            </div>
            <div className="text-xs opacity-70 truncate">
              {formatDate(t.date)}{t.description ? ` · ${t.description}` : ''}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-700' : 'text-red-700'}`}>
              {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
            </span>
            <button
              onClick={() => user && deleteTransaction(user.uid, t.id)}
              className="text-xs opacity-60 hover:opacity-100"
              aria-label="Delete transaction"
            >
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
