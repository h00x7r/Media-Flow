import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Corrected import from geist/font/sans
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/layout/app-shell';

const geistSans = GeistSans({
  variable: '--font-geist-sans',
  // subsets: ['latin'], // Removed subsets as it's not standard for geist/font/sans
});

// Removed Geist_Mono as it's not explicitly requested and GeistSans is primary

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
      <body className={`${geistSans.variable} antialiased`}>
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
