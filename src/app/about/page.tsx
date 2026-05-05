import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Plainkost',
  description: 'Plainkost is a free price comparison and trip cost calculator for Americans researching plastic surgery in Korea.',
  alternates: { canonical: 'https://www.plainkost.com/about' },
}

export default function AboutPage() {
  return (
    <div className="max-w-[700px] mx-auto px-4 py-12">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">About Plainkost</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Plainkost is a free research tool for Americans comparing the cost of plastic surgery in Korea.
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-500 leading-relaxed">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">What we do</h2>
          <p>
            We aggregate pricing data from Korean plastic surgery clinics and build a calculator that lets you estimate your total trip cost — surgery, flights, hotel, and daily expenses — side by side for two clinics. The goal is to make it easier to understand the real cost of getting a procedure in Korea before you reach out to any clinic.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">What we are not</h2>
          <p>
            Plainkost is not a booking platform, a clinic referral service, or a source of medical advice. We have no commercial relationship with any clinic listed on this site. All prices shown are independently collected estimates — actual quotes must be obtained directly from each clinic.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Data sources</h2>
          <p>
            Price data is sourced from clinic websites, public disclosures required under Korean medical law, and user-submitted reports. Data is reviewed before being added. If you have a price to report or a clinic to suggest, use the tools on the main page.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Contact</h2>
          <p>
            For questions, corrections, or partnership inquiries, reach us at{' '}
            <a href="mailto:hello@plainkost.com" className="text-gray-700 underline hover:text-gray-900">
              hello@plainkost.com
            </a>
          </p>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <Link href="/guide" className="hover:text-gray-700">Guide</Link>
        <Link href="/privacy-policy" className="hover:text-gray-700">Privacy Policy</Link>
      </div>
    </div>
  )
}
