import type { Metadata } from 'next'
import ClinicsPage from '@/app/clinics/page'
import { buildClinics } from '@/lib/clinicData'
import CLINICS_JSON from '@/data/clinics.json'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Korea Plastic Surgery Trip Cost Calculator — Compare Seoul Clinic Prices',
  description:
    'Calculate the total cost of plastic surgery in Korea — surgery, flights, hotel, and daily expenses. Compare Seoul clinic prices for rhinoplasty, liposuction, face lifting, and more. See your real savings vs US prices.',
  alternates: { canonical: 'https://www.plainkost.com' },
  openGraph: {
    title: 'Korea Plastic Surgery Trip Cost Calculator',
    description:
      'Compare rhinoplasty, liposuction, and face lifting prices at Seoul clinics. Calculate your full trip budget and see how much you save vs US prices.',
    url: 'https://www.plainkost.com',
  },
}

export default async function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let initialClinics: any[] = CLINICS_JSON
  if (process.env.GOOGLE_SHEET_ID) {
    try {
      initialClinics = await buildClinics()
    } catch {
      // fallback to static data
    }
  }
  return <ClinicsPage initialClinics={initialClinics} />
}
