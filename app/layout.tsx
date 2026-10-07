import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  title: 'FinIntel AI',
  description: 'AI-powered financial goal planning and decision support',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} min-h-screen`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}