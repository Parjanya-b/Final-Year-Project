import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';

const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata = {
  title: 'FinIntel AI',
  description: 'AI-powered financial goal planning and decision support',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${grotesk.className} min-h-screen`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
