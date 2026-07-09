import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.APP_URL || 'https://travelable.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Travelable — The AI travel platform that finds the best deals',
    template: '%s · Travelable',
  },
  description:
    'Plan smarter, travel better. Travelable combines AI-powered search, transparent pricing, and real-time deals across hotels, flights, and experiences.',
  keywords: [
    'travel',
    'AI travel',
    'hotel booking',
    'flight booking',
    'vacation deals',
    'travel planner',
    'best price guarantee',
    'Travelable',
  ],
  authors: [{ name: 'Travelable' }],
  creator: 'Travelable',
  openGraph: {
    title: 'Travelable — Travel Smarter. Live Better.',
    description: 'AI-powered travel platform with intelligent price prediction and real-time comparison.',
    type: 'website',
    siteName: 'Travelable',
    images: [`${siteUrl}/og.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travelable — Travel Smarter. Live Better.',
    description: 'AI-powered travel platform with intelligent price prediction and real-time comparison.',
    images: [`${siteUrl}/og.png`],
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1320' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}