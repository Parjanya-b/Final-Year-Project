import { collection, doc, getDocs, query, Timestamp, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { TxType } from './types';

const DEMO_DAYS = 180; // about 6 months of history

// Same random numbers every run, so the demo is repeatable
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generate(endDate = new Date()) {
  const rand = rng(42);
  const out: { type: TxType; category: string; amount: number; date: Date; description: string; isDemo: true }[] = [];

  for (let i = DEMO_DAYS - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    d.setHours(12, 0, 0, 0);
    const dom = d.getDate();
    const dow = d.getDay();
    const month = d.getMonth();

    const add = (type: TxType, category: string, amount: number, description: string) =>
      out.push({ type, category, amount: Math.round(amount), date: new Date(d), description, isDemo: true });

    if (dom === 1) add('income', 'Salary', 65000 + rand() * 1000, 'Monthly salary');
    if (dom === 2) add('expense', 'Rent', 15000, 'House rent');
    if (dom === 5) add('expense', 'EMI', 8500, 'Loan EMI');
    if (dom === 10) add('expense', 'Utilities', 2200 + rand() * 600, 'Electricity + internet');
    if (dow === 0) add('expense', 'Groceries', 1800 + rand() * 900, 'Weekly groceries');

    add('expense', 'Food', 150 + rand() * 250, 'Daily food');
    if (dow >= 1 && dow <= 5) add('expense', 'Transport', 100 + rand() * 120, 'Commute');
    if (dow === 0 || dow === 6) add('expense', 'Entertainment', 600 + rand() * 1400, 'Weekend outing');

    // Festive season (mid-Oct to mid-Nov): shopping spikes
    const festive = (month === 9 && dom >= 15) || (month === 10 && dom <= 15);
    if (festive && rand() < 0.25) add('expense', 'Shopping', 1500 + rand() * 5000, 'Festive shopping');
  }
  return out;
}

export async function seedDemoData(uid: string) {
  const col = collection(db, 'users', uid, 'transactions');
  const all = generate();
  for (let i = 0; i < all.length; i += 400) {            // Firestore batch limit is 500
    const batch = writeBatch(db);
    all.slice(i, i + 400).forEach((t) => batch.set(doc(col), { ...t, date: Timestamp.fromDate(t.date) }));
    await batch.commit();
  }
  return all.length;
}

export async function clearDemoData(uid: string) {
  const snap = await getDocs(query(collection(db, 'users', uid, 'transactions'), where('isDemo', '==', true)));
  for (let i = 0; i < snap.docs.length; i += 400) {
    const batch = writeBatch(db);
    snap.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  return snap.size;
}