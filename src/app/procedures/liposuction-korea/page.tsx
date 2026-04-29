import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Liposuction in Korea — Cost, Clinics & Guide',
  description:
    'Everything you need to know about liposuction in Korea. Compare costs ($2,000–$5,000), find top Gangnam clinics, and plan your trip.',
}

export default function LiposuctionKoreaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-sm text-blue-600 font-medium mb-3 uppercase tracking-wide">Procedures</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Liposuction in Korea</h1>
      <p className="text-lg text-gray-500 mb-10">
        Korea is one of the world's top destinations for liposuction — with prices 50–70% lower
        than the US and internationally trained surgeons.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Korea Price', value: '$2,000–$5,000' },
          { label: 'US Average', value: '$6,000–$9,000' },
          { label: 'Typical Stay', value: '10–14 days' },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-gray max-w-none">
        <h2>What is Liposuction?</h2>
        <p>
          Liposuction is a surgical procedure that removes fat deposits from specific areas of the
          body, including the abdomen, thighs, arms, and back. Korea's plastic surgery industry is
          globally renowned for precision techniques and competitive pricing.
        </p>

        <h2>Why Choose Korea?</h2>
        <ul>
          <li>Surgeons with 10–20+ years of specialization</li>
          <li>Advanced techniques including VASER and water-jet assisted liposuction</li>
          <li>Prices 50–70% lower than comparable US procedures</li>
          <li>Medical tourism infrastructure designed for international patients</li>
        </ul>
      </div>

      <div className="mt-12">
        <Link
          href="/clinics"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Browse Clinics
        </Link>
      </div>
    </div>
  )
}
