'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '@/components/AuthShell';
import { useAuth } from '@/lib/AuthContext';
import { friendlyError } from '@/lib/authErrors';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-black/20 border border-white/20 text-sm outline-none placeholder:opacity-50 focus:border-white/50';

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && !submitting) router.replace('/dashboard');
  }, [user, loading, submitting, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setSubmitting(true);
    try {
      await register(name.trim(), email, password);
      router.replace('/dashboard');
    } catch (err) {
      setError(friendlyError(err));
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace('/dashboard');
    } catch (err) {
      setError(friendlyError(err));
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register to save your transactions, goals and forecasts securely."
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        <div>
          <label className="text-xs font-bold block mb-1">FULL NAME</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                 placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-bold block mb-1">EMAIL</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                 placeholder="you@example.com" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold block mb-1">PASSWORD</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                   placeholder="Min 6 characters" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">CONFIRM</label>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                   placeholder="Repeat password" className={inputClass} />
          </div>
        </div>

        {error && <p className="text-xs text-rose-300">{error}</p>}

        <button type="submit" disabled={submitting}
                className="w-full py-3 text-sm accent-btn disabled:opacity-60">
          {submitting ? 'Creating account...' : 'Create Account →'}
        </button>

        <button type="button" onClick={handleGoogle} disabled={submitting}
                className="w-full py-3 text-sm font-bold card hover:opacity-80 disabled:opacity-60">
          Sign up with Google
        </button>
      </form>

      <p className="text-xs opacity-80">
        Already have an account?{' '}
        <Link href="/login" className="font-bold underline">Log in</Link>
      </p>
    </AuthShell>
  );
}