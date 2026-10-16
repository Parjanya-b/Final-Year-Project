'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '@/lib/AuthContext';
import { addTransaction } from '@/lib/firestoreService';
import { friendlyError } from '@/lib/authErrors';
import { fromDateInput, toDateInputValue } from '@/lib/format';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/types';

export default function AddTransactionModal({ onClose }) {
  const { user } = useAuth();
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(toDateInputValue(new Date()));
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const switchType = (t) => {
    setType(t);
    setCategory(t === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const value = Number(amount);
    if (!value || value <= 0) return setError('Enter an amount greater than 0.');
    setSaving(true);
    try {
      await addTransaction(user.uid, {
        type,
        category,
        amount: value,
        date: fromDateInput(date),
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      setError(friendlyError(err));
      setSaving(false);
    }
  };

  return (
    <Modal title="Add Transaction" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => switchType('expense')}
                  className={`py-2 text-sm font-bold rounded-xl ${type === 'expense' ? 'accent-btn' : 'card'}`}>
            Expense
          </button>
          <button type="button" onClick={() => switchType('income')}
                  className={`py-2 text-sm font-bold rounded-xl ${type === 'income' ? 'accent-btn' : 'card'}`}>
            Income
          </button>
        </div>

        <div>
          <label className="text-xs font-bold block mb-1">CATEGORY</label>
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold block mb-1">AMOUNT (₹)</label>
            <input type="number" min="1" step="any" className="input-field" placeholder="1500"
                   value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">DATE</label>
            <input type="date" className="input-field" value={date}
                   onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold block mb-1">NOTE (optional)</label>
          <input type="text" className="input-field" placeholder="e.g. Dinner with friends"
                 value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {error && <p className="text-xs error-text">{error}</p>}

        <button type="submit" disabled={saving} className="w-full py-3 text-sm accent-btn disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Transaction'}
        </button>
      </form>
    </Modal>
  );
}
