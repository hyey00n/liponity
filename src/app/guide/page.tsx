import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Korea Liposuction Guide for US Patients',
  description:
    'Everything US patients need to know about getting liposuction in Korea. Insurance, safety, recovery, flights, and more.',
}

const FAQS = [
  {
    q: 'Is liposuction in Korea safe for Americans?',
    a: 'Yes. Korea has strict medical regulations and top clinics are accredited by the Ministry of Health and Welfare. Many surgeons trained in the US or Europe and perform significantly more procedures annually than their western counterparts.',
  },
  {
    q: 'Will my US insurance cover liposuction in Korea?',
    a: 'No. Cosmetic procedures are not covered by US insurance regardless of where they are performed. However, the total cost including flights and hotel is often still less than paying out-of-pocket in the US.',
  },
  {
    q: 'How long do I need to stay in Korea?',
    a: 'Most liposuction patients stay 10–14 days. This includes a pre-op consultation (1–2 days), surgery, and initial recovery. Some combined procedures may require up to 3 weeks.',
  },
  {
    q: 'When can I fly home after liposuction?',
    a: 'Most surgeons recommend waiting at least 7–10 days before flying. For larger procedures like 360 liposuction, 14 days is safer. Always confirm with your surgeon before booking return flights.',
  },
  {
    q: 'What if I have complications after returning to the US?',
    a: 'Most top clinics provide online follow-up consultations after you return home. For serious complications, visit your local emergency room and contact your Korean clinic immediately. Keep all surgical records and documentation.',
  },
  {
    q: 'Are Korean surgeons qualified?',
    a: 'Yes. Korean plastic surgeons must complete medical school, residency, and pass board certification exams regulated by the Ministry of Health and Welfare. Many have additional training in the US, Japan, or Europe.',
  },
  {
    q: 'Can I pay in USD?',
    a: 'Most clinics accept international credit cards (Visa, Mastercard) and wire transfers in USD. Some offer USD-quoted pricing. Cash in KRW often gets a slight discount.',
  },
  {
    q: 'Is it safe to go alone?',
    a: 'Yes, many international patients travel alone. Top clinics have English-speaking coordinators who assist with consultations, surgery day logistics, and recovery. We recommend staying near the clinic for the first few days.',
  },
  {
    q: 'How do I avoid ghost doctors or fake clinics?',
    a: 'Always verify the clinic is registered with the Korean Ministry of Health and Welfare. Ask to confirm your specific surgeon before surgery. Avoid unusually low prices. Request to see before/after photos from the same surgeon.',
  },
  {
    q: 'What should I bring to Korea for recovery?',
    a: 'Comfortable loose clothing, compression garments (some clinics provide these), any regular medications, travel insurance documents, and your surgical records. A travel pillow helps on the flight home.',
  },
]

const TIMELINE = [
  { day: 'D-Day',    label: 'Surgery',              desc: 'Procedure performed under anesthesia. Stay at clinic or nearby hotel.' },
  { day: 'D+1',      label: 'First check-up',       desc: 'Clinic visit for drainage and wound check. Rest is essential.' },
  { day: 'D+3',      label: 'Swelling peaks',       desc: 'Maximum swelling and bruising. Normal — keep compression garment on.' },
  { day: 'D+7',      label: 'Suture removal',       desc: 'Most stitches removed. Significant improvement in swelling.' },
  { day: 'D+10',     label: 'Possible to fly',      desc: 'Most patients can fly home. Confirm with your surgeon.' },
  { day: '1 month',  label: '70% results visible',  desc: 'Most swelling gone. Final results continue improving.' },
  { day: '3 months', label: 'Final results',         desc: 'Full results visible. Skin fully contracted.' },
]

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* 헤더 */}
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Korea Liposuction Guide
        </h1>
        <p className="text-sm text-gray-500">
          Everything US patients need to know before traveling to Korea for liposuction.
        </p>
      </div>

      {/* 회복 타임라인 */}
      <section className="mb-16">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-6">
          Recovery Timeline
        </h2>
        <div className="space-y-4">
          {TIMELINE.map((t) => (
            <div key={t.day} className="flex gap-6 border-b border-gray-100 pb-4">
              <div className="w-20 shrink-0">
                <span className="text-xs font-mono font-semibold text-gray-900">{t.day}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">{t.label}</p>
                <p className="text-sm text-gray-500">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="border-b border-gray-100 pb-6">
              <p className="text-sm font-medium text-gray-900 mb-2">{faq.q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}