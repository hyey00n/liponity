import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tummy Tuck in Korea — Cost & Guide',
  description:
    'Tummy tuck (abdominoplasty) in Korea costs $4,000–$8,000 — save up to 65% vs US prices. Find top surgeons in Seoul.',
}

export default function TummyTuckKoreaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-sm text-blue-600 font-medium mb-3 uppercase tracking-wide">Procedures</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Tummy Tuck in Korea</h1>
      <p className="text-lg text-gray-500 mb-10">
        A tummy tuck (abdominoplasty) removes excess skin and fat while tightening abdominal
        muscles. Korea offers this procedure at a fraction of US costs.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Korea Price', value: '$4,000–$8,000' },
          { label: 'US Average', value: '$10,000–$15,000' },
          { label: 'Recovery', value: '2–4 weeks' },
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
