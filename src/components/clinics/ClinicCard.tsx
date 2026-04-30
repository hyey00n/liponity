import Link from 'next/link'

interface Clinic {
  id: string
  name: string
  specialties: string[]
  description: string
  district: string
  hours: string
  images: string[]
}

export default function ClinicCard({ clinic }: { clinic: Clinic }) {
  return (
    <Link
      href={`/clinics/${clinic.id}`}
      className="block border border-gray-100 p-5 hover:border-gray-300 transition-all"
    >
      <h3 className="text-sm font-medium text-gray-900 mb-1">{clinic.name}</h3>
      <p className="text-xs text-gray-400 mb-3">{clinic.district} · Seoul</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {clinic.specialties.slice(0, 3).map((s) => (
          <span key={s} className="text-xs border border-gray-200 px-2 py-0.5 text-gray-500">
            {s}
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-400">{clinic.hours}</p>
    </Link>
  )
}