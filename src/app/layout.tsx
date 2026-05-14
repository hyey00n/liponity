import type { Metadata } from 'next'
import { Libre_Bodoni } from 'next/font/google'

const libreBodoni = Libre_Bodoni({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-libre-bodoni',
})

import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { TravelProvider } from '@/context/travel'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: {
    default: 'Korea Plastic Surgery Trip Cost Calculator | Plainkost',
    template: '%s | Plainkost',
  },
  description:
    'Free trip cost calculator for Americans considering plastic surgery in Korea. Compare Seoul clinic prices for rhinoplasty, liposuction, face lifting, and more — surgery, flights, hotel, and daily costs in one place.',
  metadataBase: new URL('https://www.plainkost.com'),
  keywords: [
    'korea plastic surgery trip cost calculator',
    'seoul plastic surgery budget calculator',
    'korea vs us plastic surgery price comparison',
    'how much does rhinoplasty trip to korea cost',
    'korea liposuction price comparison',
    'rhinoplasty korea total cost',
    'face lifting korea price',
    'vaser lipo korea cost calculator',
    'korea plastic surgery for americans',
    'seoul clinic prices comparison',
    'korea cosmetic surgery cost vs usa',
    'plastic surgery trip budget korea',
  ],
  openGraph: {
    siteName: 'Plainkost',
    type: 'website',
    locale: 'en_US',
    title: 'Korea Plastic Surgery Trip Cost Calculator',
    description:
      'Calculate the total cost of plastic surgery in Korea — surgery, flights, hotel, and daily expenses. Compare Seoul clinic prices and see real savings vs US prices.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korea Plastic Surgery Trip Cost Calculator',
    description: 'Compare Seoul clinic prices for rhinoplasty, liposuction, and face lifting. Calculate your full trip budget vs US costs.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.plainkost.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={libreBodoni.variable}>
      <body className="antialiased bg-white text-gray-900">
        <TravelProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </TravelProvider>
        <Analytics />
      </body>
    </html>
  )
}
