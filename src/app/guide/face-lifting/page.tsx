import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Face Lifting in Korea: SMAS Lift Cost & What to Know',
  description:
    'Compare face lifting prices at Korean clinics. SMAS lift, mini lift, thread lift — costs and what US patients need to know before traveling to Seoul.',
  alternates: { canonical: 'https://www.plainkost.com/guide/face-lifting' },
  openGraph: {
    title: 'Face Lifting in Korea: Cost & Types',
    description: 'SMAS lift, mini lift, and thread lift prices at Korean clinics. How much Americans save vs US pricing.',
    url: 'https://www.plainkost.com/guide/face-lifting',
  },
}

const TYPES = [
  {
    name: 'SMAS face lift (full)',
    range: '$6,000 – $14,000',
    desc: 'The gold standard. Addresses the SMAS layer (muscle and fascia) beneath the skin for long-lasting, natural results. Corrects jowls, neck laxity, and mid-face sagging. Recovery 2–3 weeks for visible bruising. Results last 7–10 years.',
  },
  {
    name: 'Mini lift (short-scar)',
    range: '$3,500 – $7,000',
    desc: 'Smaller incisions targeting the lower face and jowls. Less downtime (10–14 days) and lower cost, but more limited correction than a full SMAS lift. Best for patients in their 40s with early to moderate laxity.',
  },
  {
    name: 'Endoscopic mid-face lift',
    range: '$4,000 – $8,000',
    desc: 'Camera-guided technique with minimal incisions to lift the cheek and mid-face. Preserves the hairline and leaves minimal scarring. Often combined with fat grafting to restore volume.',
  },
  {
    name: 'Thread lift',
    range: '$1,500 – $4,000',
    desc: 'Dissolvable threads inserted under the skin to lift and tighten without surgery. Minimal downtime (2–3 days), but results typically last 1–2 years. Best for mild laxity or as a maintenance procedure between surgical lifts.',
  },
  {
    name: 'Neck lift',
    range: '$3,000 – $7,000',
    desc: 'Addresses neck bands, excess fat, and skin laxity under the chin and neck. Frequently performed alongside a face lift or as a standalone for patients whose primary concern is the neck and jawline.',
  },
]

const FAQS = [
  {
    q: 'How does face lifting cost in Korea compare to the US?',
    a: 'A full SMAS face lift in the US typically costs $12,000–$25,000. Korean clinics charge $6,000–$14,000 for comparable procedures. Even including flights and accommodation, most patients save $5,000–$12,000.',
  },
  {
    q: 'Am I a candidate for a face lift vs a thread lift?',
    a: 'Thread lifts are suitable for mild sagging and patients who want minimal downtime. Face lifts are indicated when there is moderate to significant skin laxity, jowling, or neck banding. A qualified surgeon should assess your anatomy — clinics in Seoul offer video consultations before you travel.',
  },
  {
    q: 'How long do face lift results last?',
    a: 'A full SMAS lift typically lasts 7–10 years. A mini lift lasts 4–6 years. Thread lifts last 1–2 years. Aging continues after any procedure, so results depend on lifestyle, skin care, and sun exposure.',
  },
  {
    q: 'Is face lifting commonly combined with other procedures?',
    a: 'Yes. Fat grafting to restore volume lost to aging is very commonly combined with face lifting. Blepharoplasty (eyelid surgery) is another common combination. Package pricing is often available.',
  },
  {
    q: 'What is recovery like for a face lift in Korea?',
    a: 'Most surgeons recommend staying in Korea for at least 10–14 days. Drains (if used) are removed at day 1–2. Sutures come out at day 7–10. Bruising and swelling are significant in weeks 1–2, manageable in week 3. Long-haul flights are generally safe after 10–14 days.',
  },
]

export default function FaceLiftingGuidePage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/guide" className="text-xs text-gray-400 hover:text-gray-700">← Guide</Link>
      </div>

      <div className="mb-10 border-b border-gray-200 pb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Face Lifting</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Face Lifting in Korea</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Korea has established itself as a leading destination for face lifting, particularly SMAS-layer procedures that deliver natural, long-lasting results. Prices are 40–60% lower than comparable US clinics. This page covers the main types, price ranges, and what to look for.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">Procedure types & price ranges</h2>
        <div className="space-y-0">
          {TYPES.map(t => (
            <div key={t.name} className="border-b border-gray-100 py-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="text-sm font-medium text-gray-900">{t.name}</p>
                <span className="text-xs font-mono text-gray-500 flex-shrink-0">{t.range}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">Ranges based on published clinic prices in Seoul. ₩1,350 = $1. VAT may apply.</p>
      </section>

      <section className="mb-14">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">FAQ</h2>
        <div className="space-y-0">
          {FAQS.map(f => (
            <div key={f.q} className="border-b border-gray-100 py-5">
              <p className="text-sm font-medium text-gray-900 mb-2">{f.q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-gray-100 p-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">Compare face lifting prices across Seoul clinics</p>
        <Link href="/" className="text-xs bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 transition-colors">
          Open calculator →
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-8">Prices are estimates only. Not medical advice. Confirm all details with your clinic.</p>
    </div>
  )
}
