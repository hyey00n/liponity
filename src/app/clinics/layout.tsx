import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Korea Clinics — Face Lifting & VASER Lipo Prices',
  description:
    'Browse and compare Seoul clinics for face lifting and VASER lipo. See real prices, operating hours, and calculate your total trip cost from any US city.',
  alternates: { canonical: 'https://www.liponity.com/clinics' },
  openGraph: {
    title: 'Compare Korea Clinics — Face Lifting & VASER Lipo Prices',
    description: 'Real clinic prices in Seoul for face lifting and VASER lipo. Compare and calculate your total US-to-Korea trip cost.',
    url: 'https://www.liponity.com/clinics',
  },
}

export default function ClinicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
