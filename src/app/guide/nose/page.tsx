import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Rhinoplasty Trip to Korea: Total Cost Breakdown for US Patients',
  description:
    'How much does a rhinoplasty trip to Korea cost in total? Compare surgery prices, flights, and hotel for silicone vs rib cartilage nose jobs at Seoul clinics.',
  alternates: { canonical: 'https://www.plainkost.com/guide/nose' },
  openGraph: {
    title: 'Rhinoplasty Trip to Korea: Total Cost Breakdown',
    description: 'Total cost of a rhinoplasty trip to Korea — surgery, flights, hotel. Silicone vs rib cartilage prices at Seoul clinics for US patients.',
    url: 'https://www.plainkost.com/guide/nose',
  },
}

const TYPES = [
  {
    name: 'Silicone implant rhinoplasty',
    range: '$2,000 – $4,500',
    desc: 'A silicone prosthesis raises the bridge (dorsum). Most common and straightforward procedure. Lower cost but carries a small long-term risk of contracture or shifting. Results depend heavily on implant shape selection and surgical technique.',
  },
  {
    name: 'Autologous rib cartilage rhinoplasty',
    range: '$5,000 – $10,000',
    desc: 'Cartilage harvested from the patient\'s own rib provides the most natural and durable structural support. Preferred for complex cases, revision rhinoplasty, or patients who want to avoid synthetic materials. Longer surgery and recovery.',
  },
  {
    name: 'Donor rib cartilage rhinoplasty',
    range: '$3,500 – $7,000',
    desc: 'Processed cadaveric rib cartilage eliminates the need for harvesting from the patient. Lower donor-site morbidity than autologous but carries a very small risk of resorption over time.',
  },
  {
    name: 'Tip plasty',
    range: '$1,500 – $3,500',
    desc: 'Reshaping of the nasal tip only using cartilage grafts — no bridge work. Common for patients who want a more refined tip without altering the overall nose shape.',
  },
  {
    name: 'Revision rhinoplasty',
    range: '$4,000 – $12,000',
    desc: 'Correction of a previous nose surgery. Significantly more complex than primary rhinoplasty. Korean clinics have strong experience with revision cases, particularly from patients who had prior silicone implants.',
  },
]

const FAQS = [
  {
    q: 'Is rib cartilage or silicone better for rhinoplasty?',
    a: 'It depends on the case. Silicone implants are simpler and work well for straightforward bridge augmentation. Rib cartilage is preferred for structural reconstruction, tip work, or anyone wanting to avoid synthetic materials. Your surgeon should recommend based on your anatomy.',
  },
  {
    q: 'How does rhinoplasty cost in Korea compare to the US?',
    a: 'Rhinoplasty in the US typically costs $7,000–$15,000. Korean clinics range from $2,000–$10,000 depending on complexity. Even with flights and accommodation, total savings of $3,000–$8,000 are common.',
  },
  {
    q: 'How long is recovery for rhinoplasty?',
    a: 'Splint is typically removed at day 7–10. Significant swelling resolves in 3–4 weeks. Final results take 6–12 months to fully appear as the nose settles. Most patients can travel home after 10–14 days.',
  },
  {
    q: 'Can I combine rhinoplasty with other procedures?',
    a: 'Yes. Rhinoplasty is commonly combined with double eyelid surgery, facial contouring, or fat grafting. Package pricing is often available. Discuss combination procedures with your clinic to understand the safety considerations.',
  },
  {
    q: 'What makes a clinic good for rhinoplasty?',
    a: 'Look for a surgeon who specializes in rhinoplasty (not just general plastic surgery), who has published before/after photos from the same surgeon, and who offers clear pricing. Revision rate and consultation quality are key indicators.',
  },
]

export default function NoseGuidePage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/guide" className="text-xs text-gray-400 hover:text-gray-700">← Guide</Link>
      </div>

      <div className="mb-10 border-b border-gray-200 pb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Nose</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Rhinoplasty in Korea</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Korea has some of the highest rhinoplasty volumes in the world. Gangnam-area clinics offer a wide range — from simple silicone bridge augmentation to complex rib cartilage reconstruction. This page covers the main options and price ranges to help you compare clinics effectively.
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
        <p className="text-sm text-gray-500">Compare rhinoplasty prices across Seoul clinics</p>
        <Link href="/" className="text-xs bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 transition-colors">
          Open calculator →
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-8">Prices are estimates only. Not medical advice. Confirm all details with your clinic.</p>
    </div>
  )
}
