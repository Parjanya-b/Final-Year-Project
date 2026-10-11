import { addDoc, collection, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { GoalType, TxType } from './types';

export async function addTransaction(
  uid: string,
  data: { type: TxType; category: string; amount: number; date: Date; description: string }
) {
  await addDoc(collection(db, 'users', uid, 'transactions'), {
    ...data,
    date: Timestamp.fromDate(data.date),
    isDemo: false,
    createdAt: serverTimestamp(),
  });
}

export async function deleteTransaction(uid: string, id: string) {
  await deleteDoc(doc(db, 'users', uid, 'transactions', id));
}

export async function addGoal(
  uid: string,
  data: { name: string; goalType: GoalType; targetAmount: number; currentAmount: number; targetDate: Date }
) {
  await addDoc(collection(db, 'users', uid, 'goals'), {
    ...data,
    targetDate: Timestamp.fromDate(data.targetDate),
    createdAt: serverTimestamp(),
  });
}

export async function deleteGoal(uid: string, id: string) {
  await deleteDoc(doc(db, 'users', uid, 'goals', id));
}