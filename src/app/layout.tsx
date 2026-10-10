import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'TrailMate AI — Get Outside',
  description: 'An AI outdoor companion that generates real-world missions and gets you off your screen.',
  keywords: ['outdoor', 'AI', 'nature', 'missions', 'open source'],
  authors: [{ name: 'TrailMate AI' }],
  openGraph: {
    title: 'TrailMate AI',
    description: 'An AI that wants you to put your phone down. 🌿',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased`}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
