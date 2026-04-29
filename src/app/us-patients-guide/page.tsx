import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'US Patients Guide — Liposuction in Korea',
  description:
    'Everything US patients need to know before getting liposuction in Korea. Insurance, recovery, visas, and practical tips.',
}

const FAQ = [
  {
    q: 'Does US insurance cover liposuction in Korea?',
    a: 'Cosmetic procedures are generally not covered by US insurance, whether performed in the US or abroad. Some HSA/FSA funds may be applicable — check with your plan administrator.',
    id: 'insurance',
  },
  {
    q: 'How long do I need to stay in Korea?',
    a: 'Most patients plan for 10–14 days. This allows time for your pre-op consultation, the procedure, initial recovery, and a follow-up appointment before flying home.',
    id: 'recovery',
  },
  {
    q: 'Do I need a visa to visit Korea?',
    a: 'US citizens can visit South Korea visa-free for up to 90 days under the Korea Electronic Travel Authorization (K-ETA) program.',
    id: 'visa',
  },
  {
    q: 'Is it safe to fly home after liposuction?',
    a: 'Most surgeons recommend waiting at least 7–10 days before a long-haul flight. Your surgeon will advise based on your specific procedure and recovery progress.',
    id: 'flying',
  },
  {
    q: 'How do I choose a reputable clinic?',
    a: 'Look for board-certified plastic surgeons, clinics with international patient coordinators, transparent pricing, and verifiable before/after results. Our clinic directory features vetted options.',
    id: 'choosing',
  },
]

export default function USPatientsGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-sm text-blue-600 font-medium mb-3 uppercase tracking-wide">US Patients</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">US Patient Guide</h1>
      <p className="text-lg text-gray-500 mb-12">
        Practical information for American patients considering liposuction in Korea.
      </p>

      <div className="space-y-8">
        {FAQ.map((item) => (
          <div key={item.id} id={item.id} className="border-b border-gray-100 pb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{item.q}</h2>
            <p className="text-gray-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
