import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Power BI Carousel',
  description: 'Display Power BI reports on rotation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
} 