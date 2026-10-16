'use client';
import Link from 'next/link';

export default function BottomDock() {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
      <div className="card px-5 py-2.5 flex items-center gap-4">
        <Link href="/dashboard" className="text-xs font-bold hover:opacity-75">📊 Dashboard</Link>
        <span className="opacity-30">|</span>
        <Link href="/forecast" className="text-xs font-bold hover:opacity-75">🔮 Prophet ML</Link>
        {/* the chatbot button is added on Oct 12 */}
      </div>
    </div>
  );
}
