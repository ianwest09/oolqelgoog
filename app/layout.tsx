import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#1B4332',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Kinship: Moments of Connection',
  description: 'A familiar interest. A meaningful moment. A little closer together. An AI-assisted cultural connection tool for families and caregivers.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kinship',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Kinship: Moments of Connection',
    description: 'A familiar interest. A meaningful moment. A little closer together. An AI-assisted cultural connection tool for families and caregivers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kinship: Moments of Connection',
    description: 'A familiar interest. A meaningful moment. A little closer together.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
