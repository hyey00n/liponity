import type { Metadata } from 'next'
import Link from 'next/link'
import clinics from '@/data/clinics.json'

export const metadata: Metadata = {
  title: 'Korea Plastic Surgery Clinics — Seoul & Gangnam',
  description: 'Browse verified plastic surgery clinics in Seoul, Korea with pricing information.',
}

const ALL_SPECIALTIES = ['눈', '코', '리프팅', '가슴', '양악', '윤곽', '지방흡입']

export default function ClinicsPage({
  searchParams,
}: {
  searchParams?: { specialty?: string }
}) {
  const active = searchParams?.specialty ?? ''
  const filtered = active
    ? clinics.filter((c) => c.specialties.includes(active))
    : clinics

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Clinics</h1>
      <p className="text-sm text-gray-400 mb-8">{clinics.length} clinics in Seoul</p>

      {/* 필터 */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/clinics"
          className={`text-xs px-3 py-1.5 border transition-colors ${
            !active ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-400'
          }`}
        >
          All
        </Link>
        {ALL_SPECIALTIES.map((s) => (
          <Link
            key={s}
            href={`/clinics?specialty=${s}`}
            className={`text-xs px-3 py-1.5 border transition-colors ${
              active === s ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* 리스트 */}
      <div className="divide-y divide-gray-100">
        {filtered.map((clinic) => (
          <Link
            key={clinic.slug}
            href={`/clinics/${clinic.slug}`}
            className="flex justify-between items-start py-5 group"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 group-hover:text-gray-400 transition-colors">
                {clinic.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{clinic.district}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {clinic.specialties.map((s) => (
                  <span key={s} className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-300 mt-1 shrink-0 ml-4">
              {clinic.prices ? 'Prices available →' : '→'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
