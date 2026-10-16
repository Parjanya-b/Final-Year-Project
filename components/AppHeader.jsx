'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const tabs = [
  { href: '/dashboard', label: '01. Command Dashboard' },
  { href: '/forecast', label: '02. Prophet AI Forecast' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <header className="nav-shell px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl accent-btn flex items-center justify-center text-lg font-extrabold">₹</div>
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-none">FIN-INTEL // AI</h1>
          <span className="text-xs opacity-70">Decision Support and Prophet Forecasting Engine</span>
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${
              pathname === t.href ? 'accent-btn' : 'card hover:opacity-80'
            }`}
          >
            {t.label}
          </Link>
        ))}
        <span className="text-xs opacity-80 px-2">{user?.displayName || user?.email}</span>
        <button onClick={handleLogout} className="px-4 py-2 rounded-xl text-xs font-bold ai-pill">
          Logout
        </button>
      </nav>
    </header>
  );
}
