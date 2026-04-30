'use client'
import Link from 'next/link'
import ClinicsPage from '@/app/clinics/page'

export default function HomePage() {
  return (
    <>
      <ClinicsPage />

      {/* Why Korea */}
      <section className="max-w-5xl mx-auto px-4 py-16 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-8">
          Why Korea?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: 'World-class surgeons',
              desc: 'Korean surgeons perform more procedures per year than most western surgeons do in a decade.',
            },
            {
              title: '50–70% cheaper',
              desc: 'High competition among 600+ clinics in Seoul keeps prices accessible without compromising quality.',
            },
            {
              title: 'Advanced techniques',
              desc: 'VASER, Hi-Def, and 360 liposuction — Korean clinics specialize in minimal-scar, precise body contouring.',
            },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-sm font-medium text-gray-900 mb-2">{item.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/guide"
            className="text-sm border border-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-colors"
          >
            Read the US Patient Guide →
          </Link>
        </div>
      </section>
    </>
  )
}