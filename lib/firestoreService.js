import { addDoc, collection, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function addTransaction(uid, data) {
  await addDoc(collection(db, 'users', uid, 'transactions'), {
    ...data,
    date: Timestamp.fromDate(data.date),
    isDemo: false,
    createdAt: serverTimestamp(),
  });
}

export async function deleteTransaction(uid, id) {
  await deleteDoc(doc(db, 'users', uid, 'transactions', id));
}

export async function addGoal(uid, data) {
  await addDoc(collection(db, 'users', uid, 'goals'), {
    ...data,
    targetDate: Timestamp.fromDate(data.targetDate),
    createdAt: serverTimestamp(),
  });
}

export async function deleteGoal(uid, id) {
  await deleteDoc(doc(db, 'users', uid, 'goals', id));
}
