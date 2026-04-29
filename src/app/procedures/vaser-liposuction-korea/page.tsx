import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'VASER Liposuction in Korea — Cost & Guide',
  description:
    'VASER liposuction in Korea costs $3,000–$7,000 — up to 70% less than US prices. Learn about the procedure, recovery, and top clinics.',
}

export default function VaserLiposuctionKoreaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-sm text-blue-600 font-medium mb-3 uppercase tracking-wide">Procedures</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">VASER Liposuction in Korea</h1>
      <p className="text-lg text-gray-500 mb-10">
        VASER (Vibration Amplification of Sound Energy at Resonance) is an ultrasound-assisted
        technique that selectively targets fat while preserving surrounding tissue.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Korea Price', value: '$3,000–$7,000' },
          { label: 'US Average', value: '$8,000–$12,000' },
          { label: 'Recovery', value: '1–2 weeks' },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-gray max-w-none">
        <h2>Benefits of VASER Liposuction</h2>
        <ul>
          <li>More precise fat removal with less trauma</li>
          <li>Faster recovery compared to traditional liposuction</li>
          <li>Better skin retraction and contouring results</li>
          <li>Suitable for high-definition body sculpting</li>
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
