import type { Metadata } from 'next'
import ClinicsPage from '@/app/clinics/page'

export const metadata: Metadata = {
  title: 'Korea Face Lifting & VASER Lipo Cost Calculator — Compare Clinic Prices',
  description:
    'Free calculator for Americans considering face lifting or VASER lipo in Korea. Compare real clinic prices, estimate flights and hotels, and see how much you save vs the US.',
  alternates: { canonical: 'https://www.liponity.com' },
  openGraph: {
    title: 'Korea Face Lifting & VASER Lipo Cost Calculator',
    description:
      'Compare real clinic prices in Seoul for face lifting and VASER lipo. Calculate your full trip cost and savings vs US prices.',
    url: 'https://www.liponity.com',
  },
}

export default function HomePage() {
  return <ClinicsPage />
}
