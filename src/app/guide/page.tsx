import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Use Liponity — Korea Plastic Surgery Cost Guide',
  description:
    'Learn how to use Liponity to compare Korean plastic surgery clinic prices, calculate your total trip cost, and understand what the estimates mean.',
  alternates: { canonical: 'https://www.liponity.com/guide' },
  openGraph: {
    title: 'How to Use Liponity — Korea Plastic Surgery Cost Guide',
    description: 'Compare clinic prices, estimate trip costs, and understand Korean plastic surgery pricing — all in one tool.',
    url: 'https://www.liponity.com/guide',
  },
}

const HOW_TO = [
  {
    step: '1',
    title: 'Set your trip details',
    desc: 'Use the bar at the top of the page to select your departure city, travel month, and length of stay. The calculator uses these to estimate your flight and hotel costs.',
  },
  {
    step: '2',
    title: 'Filter by procedure',
    desc: 'Use the left sidebar to filter clinics by body part (Eyes, Nose, Breast, etc.), technique (Incision, SMAS, Endoscopic...), or material (Silicone, Motiva, Autologous rib...). Only clinics that offer the selected procedure are shown.',
  },
  {
    step: '3',
    title: 'Select up to 2 clinics to compare',
    desc: 'Click any clinic card to assign it to slot A or B. The Trip Summary panel on the right updates automatically with a side-by-side cost breakdown including surgery, flight, hotel, and daily expenses.',
  },
  {
    step: '4',
    title: 'Open Price Comparison for itemized pricing',
    desc: 'Click "Price Comparison" in the Trip Summary to see the full procedure price list for each clinic. Check individual procedures to build a custom quote and apply it to the trip calculator.',
  },
  {
    step: '5',
    title: 'Override with your actual flight cost',
    desc: 'Click the "From" button in the header to enter a real flight price you found on Google Flights. This replaces the estimate and gives you a more accurate total trip cost.',
  },
]

const FAQS = [
  {
    q: 'Where does the price data come from?',
    a: 'Prices are sourced from clinic websites, public price disclosures required by Korean law, and user-submitted reports. Actual quotes from the clinic may differ based on your specific case, surgeon, and any package deals.',
  },
  {
    q: 'What does "estimated" vs confirmed price mean?',
    a: 'Confirmed prices (shown in darker text) come directly from a clinic\'s published price list or a verified user report. Estimated prices (shown in lighter text) are category averages from public data. Always get a formal quote from the clinic.',
  },
  {
    q: 'How is the USD price calculated?',
    a: 'Liponity converts KRW to USD at a fixed rate of ₩1,350 = $1. Actual exchange rates fluctuate — treat this as a rough guide, not a guaranteed price.',
  },
  {
    q: 'Can I contact clinics through Liponity?',
    a: 'No. Liponity is a research tool only — no clinic partnerships, no bookings, no consultations. Contact each clinic directly through their official website.',
  },
  {
    q: 'What procedures does Liponity cover?',
    a: 'Eyes, Nose, Breast, Face Lifting, Facial Contouring, Liposuction, Fat Graft, and combination packages. Coverage varies by clinic — some have full price lists, others have partial data.',
  },
  {
    q: 'Why does the same procedure have a wide price range?',
    a: 'Price ranges reflect different techniques, materials, and surgeon experience. Non-incision double eyelid surgery is significantly cheaper than incision-based, for example. Use the technique filter in the sidebar to narrow the range.',
  },
  {
    q: 'Are Korean clinic prices negotiable?',
    a: 'Sometimes — especially for combination procedures. Clinics with published price lists typically don\'t negotiate on individual items. Ask during your consultation.',
  },
  {
    q: 'Do clinics charge a consultation fee?',
    a: 'Most Korean clinics offer free consultations, including video calls for international patients. Some charge a fee that\'s applied toward the surgery cost if you proceed. Confirm with each clinic.',
  },
  {
    q: 'How do I report a price or suggest a clinic?',
    a: 'Hover over any procedure in the Price Comparison modal to see "Different price? Report it." To suggest a clinic, use the form at the bottom of the main page.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default function GuidePage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          How to Use Liponity
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
          Liponity is a free research tool for Americans comparing the cost of plastic surgery in Korea.
          It is not a booking platform and does not provide medical advice — it helps you understand
          what procedures cost and estimate your total trip budget before reaching out to clinics directly.
        </p>
      </div>

      {/* How to use */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">
          How to use
        </h2>
        <div className="space-y-0">
          {HOW_TO.map((item) => (
            <div key={item.step} className="flex gap-5 border-b border-gray-100 py-5">
              <div className="w-6 h-6 bg-gray-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-0">
          {FAQS.map((faq) => (
            <div key={faq.q} className="border-b border-gray-100 py-5">
              <p className="text-sm font-medium text-gray-900 mb-2">{faq.q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 mt-12 pt-6 border-t border-gray-100">
        Liponity provides estimates only. All prices should be confirmed directly with the clinic. This is not medical advice.
      </p>
    </div>
  )
}
