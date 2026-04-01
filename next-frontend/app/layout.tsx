import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'LeadBot - Premium B2B CRM',
  description: 'Clean & minimal prospection dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-slate-200 selection:text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
