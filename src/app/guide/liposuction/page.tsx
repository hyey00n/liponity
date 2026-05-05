import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Korea vs US Liposuction Price Comparison — VASER Lipo Seoul Costs',
  description:
    'Korea vs US liposuction price comparison. See how much VASER lipo costs at Seoul clinics by body area — abdomen, arms, thighs — and calculate your total trip cost.',
  alternates: { canonical: 'https://www.plainkost.com/guide/liposuction' },
  openGraph: {
    title: 'Korea vs US Liposuction Price Comparison',
    description: 'VASER liposuction prices at Seoul clinics vs US costs. Compare by body area and calculate your full Korea trip budget.',
    url: 'https://www.plainkost.com/guide/liposuction',
  },
}

const AREAS = [
  { area: 'Abdomen (upper + lower)', range: '$2,500 – $5,000' },
  { area: 'Flanks (love handles)', range: '$1,500 – $3,000' },
  { area: 'Arms', range: '$1,500 – $3,000' },
  { area: 'Inner / outer thighs', range: '$2,000 – $4,000' },
  { area: 'Back (bra rolls)', range: '$1,500 – $3,000' },
  { area: '360° (abdomen + flanks + back)', range: '$5,000 – $9,000' },
  { area: 'Full body package', range: '$8,000 – $15,000' },
]

const TYPES = [
  {
    name: 'VASER liposuction',
    desc: 'Ultrasound energy liquefies fat before removal, allowing more precise extraction with less trauma to surrounding tissue. Results in smoother contouring and faster recovery than traditional lipo. Standard in most reputable Korean clinics.',
  },
  {
    name: 'Traditional liposuction',
    desc: 'Mechanical suction without pre-treatment. Less expensive but can result in more uneven contours. Less commonly offered at premium Korean clinics as VASER has largely replaced it.',
  },
  {
    name: 'Hi-def / 4D liposuction',
    desc: 'Advanced VASER technique that sculpts muscle definition (abs, arms). Requires a highly experienced surgeon. Higher price and more demanding recovery.',
  },
]

const FAQS = [
  {
    q: 'How does VASER lipo cost in Korea compare to the US?',
    a: 'VASER liposuction in the US typically costs $4,000–$10,000 per area. Korean clinics charge $1,500–$5,000 for comparable work. A full 360° body contouring procedure that might cost $15,000+ in the US can often be done for $5,000–$9,000 in Seoul.',
  },
  {
    q: 'How many areas can be done in one session?',
    a: 'Most Korean surgeons are comfortable treating 3–5 areas in a single session, depending on total volume removed and patient health. More areas typically require longer anesthesia time — confirm safety limits with your specific surgeon.',
  },
  {
    q: 'How long is recovery for VASER lipo?',
    a: 'Most patients are mobile within 2–3 days. Compression garments are worn for 4–6 weeks. Significant swelling resolves in 4–6 weeks; final contouring results appear at 3–6 months. Most patients can fly home after 7–10 days.',
  },
  {
    q: 'Is fat transfer (fat graft) included?',
    a: 'Fat removed during liposuction can be processed and re-injected to other areas (BBL, breast augmentation, face). This is a separate procedure with additional cost. Many clinics offer combination pricing.',
  },
  {
    q: 'What results are realistic?',
    a: 'Liposuction removes localized fat deposits but is not a weight loss procedure. Best results are seen in patients near their goal weight who have specific areas of stubborn fat that don\'t respond to diet and exercise.',
  },
]

export default function LiposuctionGuidePage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/guide" className="text-xs text-gray-400 hover:text-gray-700">← Guide</Link>
      </div>

      <div className="mb-10 border-b border-gray-200 pb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Liposuction</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">VASER Liposuction in Korea</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Korean clinics have become a top destination for VASER liposuction, offering precision body contouring at 40–60% less than US prices. This page covers typical price ranges by body area, procedure types, and what to ask when comparing clinics.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">Price ranges by area</h2>
        <div className="space-y-0">
          {AREAS.map(a => (
            <div key={a.area} className="flex items-center justify-between border-b border-gray-100 py-4">
              <p className="text-sm text-gray-700">{a.area}</p>
              <span className="text-xs font-mono text-gray-500">{a.range}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">Ranges based on published clinic prices in Seoul. ₩1,350 = $1. VAT may apply.</p>
      </section>

      <section className="mb-14">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">Procedure types</h2>
        <div className="space-y-0">
          {TYPES.map(t => (
            <div key={t.name} className="border-b border-gray-100 py-5">
              <p className="text-sm font-medium text-gray-900 mb-2">{t.name}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
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
        <p className="text-sm text-gray-500">Compare VASER lipo prices across Seoul clinics</p>
        <Link href="/" className="text-xs bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 transition-colors">
          Open calculator →
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-8">Prices are estimates only. Not medical advice. Confirm all details with your clinic.</p>
    </div>
  )
}
