import AppHeader from '@/components/AppHeader';
import BottomDock from '@/components/BottomDock';
import AuthGuard from '@/components/AuthGuard';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24">
        <AppHeader />
        <main className="max-w-7xl w-full mx-auto p-6 space-y-6 flex-1">{children}</main>
        <BottomDock />
      </div>
    </AuthGuard>
  );
}