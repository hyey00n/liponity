import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Seoul Plastic Surgery Clinics — Korea vs US Price Calculator',
  description:
    'Side-by-side comparison of Seoul plastic surgery clinics. See real prices for rhinoplasty, liposuction, face lifting, and more — then calculate your total trip cost from any US city.',
  alternates: { canonical: 'https://www.plainkost.com/clinics' },
  openGraph: {
    title: 'Compare Seoul Plastic Surgery Clinics — Korea vs US Price Calculator',
    description: 'Real rhinoplasty, liposuction, and face lifting prices at Seoul clinics. Compare two clinics side by side and calculate your full US-to-Korea trip budget.',
    url: 'https://www.plainkost.com/clinics',
  },
}

export default function ClinicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
