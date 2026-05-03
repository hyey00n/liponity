import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { TravelProvider } from '@/context/travel'

export const metadata: Metadata = {
  title: {
    default: 'Liponity — Korea Face Lifting & VASER Lipo Cost Calculator',
    template: '%s | Liponity',
  },
  description:
    'Calculate the real cost of face lifting and VASER lipo in Korea. Compare clinics, see actual prices, and estimate your total trip cost vs the US. Built for American patients.',
  metadataBase: new URL('https://www.liponity.com'),
  keywords: [
    'face lifting Korea',
    'VASER lipo Korea',
    'Korea plastic surgery cost calculator',
    'face lift Seoul price',
    'vaser liposuction Korea cost',
    'Korea plastic surgery for Americans',
    'face lifting Korea vs USA',
    'how much does face lifting cost in Korea',
    'vaser lipo Korea price',
    'Korea cosmetic surgery calculator',
  ],
  openGraph: {
    siteName: 'Liponity',
    type: 'website',
    locale: 'en_US',
    title: 'Korea Face Lifting & VASER Lipo Cost Calculator',
    description:
      'See real clinic prices and calculate your total trip cost for face lifting or VASER lipo in Korea. Save 50–70% vs US prices.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korea Face Lifting & VASER Lipo Cost Calculator',
    description: 'Compare Korea clinic prices for face lifting and VASER lipo. Calculate total trip cost vs the US.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.liponity.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <TravelProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </TravelProvider>
      </body>
    </html>
  )
}
