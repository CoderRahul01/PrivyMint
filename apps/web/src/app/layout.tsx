import type { Metadata, Viewport } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PrivyMint — Own Premium Digital Assets Together, Privately',
    template: '%s | PrivyMint',
  },
  description:
    'PrivyMint is a privacy-first NFT fractionalization platform built on Midnight Network. Split high-value NFTs into fractional shares while preserving investor privacy with zero-knowledge proofs.',
  keywords: [
    'NFT', 'fractionalization', 'privacy', 'Midnight Network', 'zero-knowledge',
    'ZK proofs', 'digital assets', 'blockchain', 'Compact', 'fractional ownership',
  ],
  authors: [{ name: 'PrivyMint Team' }],
  creator: 'PrivyMint',
  publisher: 'PrivyMint',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://privymint.io',
    siteName: 'PrivyMint',
    title: 'PrivyMint — Own Premium Digital Assets Together, Privately',
    description:
      'Privacy-first NFT fractionalization on Midnight Network. Zero-knowledge proofs protect investor identity and portfolio composition.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PrivyMint' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrivyMint — Privacy-First NFT Fractionalization',
    description: 'Own premium digital assets together — privately. Built on Midnight Network.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetBrainsMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-midnight-950 text-white antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
