import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/layout/app-shell';

// GeistSans from 'geist/font/sans' is an object, not a function.
// Its .variable property (e.g., '--font-geist-sans') can be used directly.

export const metadata: Metadata = {
  title: 'MediaFlow',
  description: 'Streamline your media projects with MediaFlow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} antialiased`}>
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
