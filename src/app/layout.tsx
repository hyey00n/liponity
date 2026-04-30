import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Liponity — Korea Plastic Surgery Guide for US Patients',
    template: '%s | Liponity',
  },
  description:
    'Compare clinic prices, calculate your total trip cost, and find the right clinic in Korea. Save 50–70% vs US prices.',
  metadataBase: new URL('https://www.liponity.com'),
  openGraph: { siteName: 'Liponity', type: 'website', locale: 'en_US' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}