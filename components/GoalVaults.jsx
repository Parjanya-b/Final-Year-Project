'use client';

import { useAuth } from '@/lib/AuthContext';
import { deleteGoal } from '@/lib/firestoreService';
import { formatDate, formatINR } from '@/lib/format';
import { GOAL_EMOJI } from '@/lib/types';

export default function GoalVaults({ goals, onAdd }) {
  const { user } = useAuth();

  const handleDelete = async (g) => {
    if (!user || !confirm(`Delete goal "${g.name}"?`)) return;
    await deleteGoal(user.uid, g.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold">Active Goal Vaults</h3>
          <p className="text-xs opacity-70">AI-predicted completion comes in a later step</p>
        </div>
        <button onClick={onAdd} className="px-3 py-1.5 rounded-lg text-xs accent-btn">+ Goal</button>
      </div>

      {goals.length === 0 && (
        <p className="text-sm opacity-70">No goals yet. Click &quot;+ Goal&quot; to create your first vault.</p>
      )}

      {goals.map((g) => {
        const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
        const daysLeft = Math.ceil((g.targetDate.getTime() - Date.now()) / 86400000);
        const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
        const need = Math.max(0, (g.targetAmount - g.currentAmount) / monthsLeft);

        return (
          <div key={g.id} className="p-3.5 rounded-xl border-2 border-[#111827] bg-[#FFFDF7] space-y-2">
            <div className="flex justify-between gap-2 text-xs font-bold">
              <span>{GOAL_EMOJI[g.goalType] ?? '🎯'} {g.name}</span>
              <span className="flex items-center gap-2">
                {pct}%
                <button onClick={() => handleDelete(g)} className="opacity-60 hover:opacity-100">🗑</button>
              </span>
            </div>
            <div className="w-full h-3 bg-white border-2 border-[#111827] rounded-full overflow-hidden">
              <div className="h-full bg-[#FF5722]" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[11px] font-medium opacity-80">
              {formatINR(g.currentAmount)} of {formatINR(g.targetAmount)}
            </p>
            <p className="text-[11px] font-medium opacity-80">
              {daysLeft > 0
                ? `🎯 Target ${formatDate(g.targetDate)} · needs ${formatINR(need)}/month`
                : `⚠️ Deadline passed (${formatDate(g.targetDate)})`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
