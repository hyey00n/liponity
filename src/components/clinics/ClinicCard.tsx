import Link from 'next/link'
import { Clinic } from '@/types'

export default function ClinicCard({ clinic }: { clinic: Clinic }) {
  return (
    <Link
      href={`/clinics/${clinic.slug}`}
      className="block border border-gray-200 p-4 hover:border-gray-400 transition-colors"
    >
      <p className="text-sm font-medium text-gray-900">{clinic.name}</p>
      <p className="text-xs text-gray-400 mt-0.5 mb-3">{clinic.district}</p>

      <div className="flex flex-wrap gap-1.5">
        {clinic.specialties.map((s) => (
          <span key={s} className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5">
            {s}
          </span>
        ))}
      </div>

      {clinic.prices && (
        <p className="text-xs text-gray-400 mt-3">Prices available</p>
      )}
    </Link>
  )
}
