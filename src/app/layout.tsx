import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://news.autoflowa.in'),
  title: {
    default: 'Dinand News - India\'s Daily AI News Brief',
    template: '%s | Dinand News',
  },
  description: 'Trusted, transparent daily news from India and the world — built on official sources only.',
  applicationName: 'Dinand News',
  keywords: ['India news', 'tech news', 'startup news', 'AI news', 'business news', 'breaking news India'],
  authors: [{ name: 'Dinand News Editorial Team' }],
  creator: 'Dinand News',
  publisher: 'Autoflowa Media',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
