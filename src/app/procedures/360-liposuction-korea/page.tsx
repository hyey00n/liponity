import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '360 Liposuction in Korea — Cost & Guide',
  description:
    '360 liposuction in Korea costs $6,000–$12,000. Full circumferential body contouring at a fraction of US prices.',
}

export default function Lipo360KoreaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-sm text-blue-600 font-medium mb-3 uppercase tracking-wide">Procedures</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">360 Liposuction in Korea</h1>
      <p className="text-lg text-gray-500 mb-10">
        360 liposuction treats the entire midsection — abdomen, flanks, and back — in a single
        procedure for comprehensive body contouring.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Korea Price', value: '$6,000–$12,000' },
          { label: 'US Average', value: '$15,000–$22,000' },
          { label: 'Recovery', value: '2–3 weeks' },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
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
