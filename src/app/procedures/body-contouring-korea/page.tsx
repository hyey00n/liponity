import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Body Contouring in Korea — Cost & Guide',
  description:
    'Body contouring in Korea costs $5,000–$15,000. Comprehensive reshaping procedures at world-class clinics in Seoul.',
}

export default function BodyContouringKoreaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-sm text-blue-600 font-medium mb-3 uppercase tracking-wide">Procedures</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Body Contouring in Korea</h1>
      <p className="text-lg text-gray-500 mb-10">
        Body contouring combines multiple procedures to reshape and define your figure.
        Korea's clinics offer comprehensive packages at highly competitive prices.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Korea Price', value: '$5,000–$15,000' },
          { label: 'US Average', value: '$15,000–$25,000' },
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
