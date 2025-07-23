import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { NProgressProvider } from '@/components/providers/nprogress-provider';
import { Toaster } from '@/components/ui/sonner';
import { ReduxProvider } from '@/providers/redux-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PlayableFactory Seller Panel',
  description:
    'Professional seller dashboard for managing products, campaigns, orders, and store operations with advanced analytics and marketing tools.',
  keywords: [
    'seller panel',
    'ecommerce management',
    'product management',
    'campaign management',
    'order management',
    'store analytics',
    'seller dashboard',
    'online store',
    'business management',
  ],
  authors: [{ name: 'PlayableFactory Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'PlayableFactory Seller Panel',
    description:
      'Professional seller dashboard for managing products, campaigns, orders, and store operations with advanced analytics and marketing tools.',
    type: 'website',
    siteName: 'PlayableFactory Seller Panel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlayableFactory Seller Panel',
    description:
      'Professional seller dashboard for managing products, campaigns, orders, and store operations with advanced analytics and marketing tools.',
  },
};

/**
 * Root Layout Component
 *
 * The main layout wrapper for the entire application.
 * Provides global providers, styling, and conditional layout rendering.
 *
 * Features:
 * - Global font configuration
 * - Redux state management
 * - Toast notifications
 * - Progress bar for page transitions
 * - Conditional header/footer rendering
 * - SEO metadata
 * - Dark mode support
 *
 * @param children - Page components to render
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <NProgressProvider>
            {children}
            <Toaster />
          </NProgressProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
