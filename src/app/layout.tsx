import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Liponity — Korea Liposuction Guide',
    template: '%s | Liponity',
  },
  description:
    'The complete guide to liposuction in Korea. Compare costs, find top clinics, and plan your trip from the US. Save 50–70% vs American prices.',
  metadataBase: new URL('https://www.liponity.com'),
  openGraph: { siteName: 'Liponity', type: 'website', locale: 'en_US' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
