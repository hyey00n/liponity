import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import clinics from '@/data/clinics.json'

export function generateStaticParams() {
  return clinics.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const clinic = clinics.find((c) => c.slug === slug)
  if (!clinic) return {}
  return {
    title: `${clinic.name} — Seoul Plastic Surgery`,
    description: clinic.description,
  }
}

export default async function ClinicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const clinic = clinics.find((c) => c.slug === slug)
  if (!clinic) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* 헤더 */}
      <p className="text-xs text-gray-400 mb-1">{clinic.district} · Seoul</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-3">{clinic.name}</h1>
      <p className="text-sm text-gray-500 mb-6">{clinic.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-8">
        {clinic.specialties.map((s) => (
          <span key={s} className="text-xs border border-gray-200 px-2.5 py-1 text-gray-500">
            {s}
          </span>
        ))}
      </div>

      {/* 영업시간 */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Hours</p>
        <div className="space-y-1">
          {Object.entries(clinic.hours).map(([day, time]) => (
            <div key={day} className="flex justify-between text-sm">
              <span className="text-gray-400">{day}</span>
              <span className={time === 'Closed' ? 'text-gray-300' : 'text-gray-900'}>{time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 가격표 */}
      {clinic.prices && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Price Reference
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Prices are estimates collected from public sources. Verify directly with the clinic.
          </p>

          {Object.entries(clinic.prices).map(([category, items]) => (
            <div key={category} className="mb-8">
              <p className="text-xs font-medium text-gray-500 mb-3 border-b border-gray-100 pb-2">
                {category}
              </p>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start text-sm gap-4">
                    <div>
                      <p className="text-gray-900">{item.item}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                    </div>
                    <p className="text-gray-900 shrink-0 font-medium">
                      {item.price_usd != null
                        ? `$${item.price_usd.toLocaleString()}`
                        : '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!clinic.prices && (
        <p className="text-sm text-gray-400">
          Price information not yet available. Contact the clinic directly for a quote.
        </p>
      )}
    </div>
  )
}
