'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'transactions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setTransactions(
          snap.docs.map((d) => {
            const x = d.data();
            return {
              id: d.id,
              type: x.type,
              category: x.category,
              amount: x.amount,
              date: x.date.toDate(),
              description: x.description ?? '',
              isDemo: x.isDemo ?? false,
            };
          })
        );
        setLoading(false);
      },
      (err) => {
        console.error('Transactions listener error:', err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  return { transactions, loading };
}
