'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useTransactions } from '@/lib/useTransactions';
import { useGoals } from '@/lib/useGoals';
import { formatINR } from '@/lib/format';
import { friendlyError } from '@/lib/authErrors';
import { clearDemoData, seedDemoData } from '@/lib/demoData';
import StatCard from '@/components/StatCard';
import CashflowChart from '@/components/CashflowChart';
import GoalVaults from '@/components/GoalVaults';
import RecentTransactions from '@/components/RecentTransactions';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddGoalModal from '@/components/AddGoalModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const { transactions, loading } = useTransactions();
  const { goals } = useGoals();
  const [showTx, setShowTx] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [busy, setBusy] = useState(false);

  const hasDemo = transactions.some((t) => t.isDemo);

  // All the numbers on the 4 cards are calculated here from real transactions
  const stats = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    let net = 0, inflow = 0, burn = 0, credits = 0;
    const byCategory = {};

    for (const t of transactions) {
      net += t.type === 'income' ? t.amount : -t.amount;
      if (t.date.getFullYear() === y && t.date.getMonth() === m) {
        if (t.type === 'income') {
          inflow += t.amount;
          credits++;
        } else {
          burn += t.amount;
          byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
        }
      }
    }

    const monthDelta = inflow - burn;
    const prevNet = net - monthDelta;
    const pctChange = prevNet !== 0 ? (monthDelta / Math.abs(prevNet)) * 100 : null;
    const daysLeft = new Date(y, m + 1, 0).getDate() - now.getDate() + 1;
    const safeDaily = monthDelta > 0 ? monthDelta / daysLeft : 0;
    const used = inflow > 0 ? Math.round((burn / inflow) * 100) : null;
    const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0] ?? null;
    const monthName = now.toLocaleString('en-IN', { month: 'long' });

    return { net, monthDelta, pctChange, inflow, credits, burn, used, safeDaily, top, monthName };
  }, [transactions]);

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      alert(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSeed = () => user && run(() => seedDemoData(user.uid));
  const handleClear = () => {
    if (user && confirm('Delete all demo transactions? Your own transactions stay.')) {
      run(() => clearDemoData(user.uid));
    }
  };

  const upper = stats.monthName.toUpperCase();

  return (
    <>
      {/* HERO AI TICKER */}
      <div className="card card-static p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs ai-pill">LIVE AI TELEMETRY</span>
          {stats.top ? (
            <p className="text-sm font-medium">
              Your top spend in {stats.monthName} is <span className="underline font-bold">{stats.top[0]}</span> at{' '}
              {formatINR(stats.top[1])}. Open the Prophet forecast to see where expenses are heading.
            </p>
          ) : (
            <p className="text-sm font-medium">Add your first transactions to unlock live insights and the Prophet forecast.</p>
          )}
        </div>
        <Link href="/forecast" className="px-4 py-2 rounded-xl text-xs accent-btn">Open Prophet Forecast →</Link>
      </div>

      {/* EMPTY STATE */}
      {!loading && transactions.length === 0 && (
        <div className="card card-static p-5 flex flex-wrap items-center justify-between gap-4 bg-[#FEF08A]">
          <p className="text-sm font-medium max-w-2xl">
            No transactions yet. Add your first one, or load 6 months of realistic demo data to preview the charts
            and the Prophet forecast. You can delete the demo data any time.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowTx(true)} className="px-4 py-2 rounded-xl text-xs card font-bold">+ Add Transaction</button>
            <button onClick={handleSeed} disabled={busy} className="px-4 py-2 rounded-xl text-xs accent-btn disabled:opacity-60">
              {busy ? 'Loading demo data...' : 'Load Demo Data'}
            </button>
          </div>
        </div>
      )}

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          tint={1}
          label="NET LIQUIDITY"
          tag={stats.pctChange === null ? '[NEW]' : `[${stats.pctChange >= 0 ? '+' : ''}${stats.pctChange.toFixed(1)}%]`}
          value={formatINR(stats.net)}
          note={`${stats.monthDelta >= 0 ? '▲' : '▼'} ${formatINR(Math.abs(stats.monthDelta))} this month`}
        />
        <StatCard
          tint={2}
          label={`${upper} INFLOW`}
          tag="[THIS MONTH]"
          value={formatINR(stats.inflow)}
          note={`${stats.credits} credit(s) received`}
        />
        <StatCard
          tint={3}
          label={`${upper} BURN RATE`}
          tag={stats.used === null ? '[NO INFLOW]' : `[${stats.used}% USED]`}
          value={formatINR(stats.burn)}
          note={
            stats.safeDaily > 0
              ? `Safe daily limit: ${formatINR(stats.safeDaily)}/day`
              : stats.inflow === 0
              ? 'Add income to see your daily limit'
              : 'Spending is above this month inflow'
          }
        />
        <StatCard
          tint={4}
          label="AI FINANCIAL HEALTH SCORE"
          tag="[SOON]"
          value="— / 900"
          note="Calculated by the AI engine in a later step"
        />
      </div>

      {/* CHART + GOALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="card card-static p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-lg font-bold">Cashflow Velocity and Burn Matrix</h3>
              <p className="text-xs opacity-70">Income vs expenses, last 6 months · synced from Firestore</p>
            </div>
            <button onClick={() => setShowTx(true)} className="px-3.5 py-1.5 rounded-lg text-xs accent-btn">
              + Add Transaction
            </button>
          </div>
          <CashflowChart transactions={transactions} />
        </div>

        <div className="card card-static p-6 lg:col-span-4">
          <GoalVaults goals={goals} onAdd={() => setShowGoal(true)} />
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="card card-static p-6">
        <RecentTransactions transactions={transactions} hasDemo={hasDemo} busy={busy} onClearDemo={handleClear} />
      </div>

      {showTx && <AddTransactionModal onClose={() => setShowTx(false)} />}
      {showGoal && <AddGoalModal onClose={() => setShowGoal(false)} />}
    </>
  );
}
