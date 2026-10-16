'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'goals'), orderBy('targetDate', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setGoals(
          snap.docs.map((d) => {
            const x = d.data();
            return {
              id: d.id,
              name: x.name,
              goalType: x.goalType,
              targetAmount: x.targetAmount,
              currentAmount: x.currentAmount ?? 0,
              targetDate: x.targetDate.toDate(),
            };
          })
        );
      },
      (err) => console.error('Goals listener error:', err)
    );
    return unsubscribe;
  }, [user]);

  return { goals };
}
