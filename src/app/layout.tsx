import type { Metadata } from 'next';
import { TopIndex, Colophon } from '@/components/AtelierLayout';
import { Inter_Tight, Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { InkTransitionProvider } from '@/components/transitions/InkTransitionProvider';

const inter = Inter_Tight({ subsets: ['latin'], variable: '--font-sans' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-serif', axes: ['SOFT', 'WONK'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    template: '%s | Sync',
    default: 'Sync',
  },
  description: 'Sync - Zero-friction public journal and streak tracker.',
  openGraph: {
    title: 'Sync',
    description: 'Sync - Zero-friction public journal and streak tracker.',
    siteName: 'Sync',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sync',
    description: 'Sync - Zero-friction public journal and streak tracker.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} relative min-h-screen bg-[color:var(--color-paper)] text-[color:var(--color-ink)] antialiased`}
      >
        <InkTransitionProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <TopIndex />
            {children}
            <Colophon />
          </div>
        </InkTransitionProvider>
      </body>
    </html>
  );
}
