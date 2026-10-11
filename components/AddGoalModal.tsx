'use client';

import { useState, FormEvent } from 'react';
import Modal from './Modal';
import { useAuth } from '@/lib/AuthContext';
import { addGoal } from '@/lib/firestoreService';
import { friendlyError } from '@/lib/authErrors';
import { fromDateInput } from '@/lib/format';
import { GOAL_TYPES, GoalType } from '@/lib/types';

export default function AddGoalModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [goalType, setGoalType] = useState<GoalType>(GOAL_TYPES[0]);
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const targetAmount = Number(target);
    const currentAmount = Number(current);
    const when = fromDateInput(targetDate);

    if (!targetAmount || targetAmount <= 0) return setError('Target amount must be greater than 0.');
    if (currentAmount < 0) return setError('Saved amount cannot be negative.');
    if (when.getTime() <= Date.now()) return setError('Target date must be in the future.');

    setSaving(true);
    try {
      await addGoal(user.uid, { name: name.trim(), goalType, targetAmount, currentAmount, targetDate: when });
      onClose();
    } catch (err) {
      setError(friendlyError(err));
      setSaving(false);
    }
  };

  return (
    <Modal title="Add Goal" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-bold block mb-1">GOAL NAME</label>
          <input type="text" className="input-field" placeholder="e.g. Emergency Corpus" required
                 value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="text-xs font-bold block mb-1">GOAL TYPE</label>
          <select className="input-field" value={goalType} onChange={(e) => setGoalType(e.target.value as GoalType)}>
            {GOAL_TYPES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold block mb-1">TARGET (₹)</label>
            <input type="number" min="1" step="any" className="input-field" placeholder="100000" required
                   value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">SAVED SO FAR (₹)</label>
            <input type="number" min="0" step="any" className="input-field" required
                   value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold block mb-1">TARGET DATE</label>
          <input type="date" className="input-field" required
                 value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </div>

        {error && <p className="text-xs error-text">{error}</p>}

        <button type="submit" disabled={saving} className="w-full py-3 text-sm accent-btn disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Goal'}
        </button>
      </form>
    </Modal>
  );
}