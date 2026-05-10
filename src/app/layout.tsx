import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://news.autoflowa.in'),
  title: {
    default: "Dinand News - India's Daily AI News Brief",
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'Dinand News',
    title: "Dinand News - India's Daily AI News Brief",
    description: 'Trusted, transparent daily news from India and the world — built on official sources only.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dinand News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dinand News - India's Daily AI News Brief",
    description: 'Trusted, transparent daily news from India and the world.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'hcKCZVNfKh3e8YxKt2GwJcZP42kfCHw0z_l9WaKdt-A',
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
