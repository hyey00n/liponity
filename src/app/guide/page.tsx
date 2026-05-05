import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Use Plainkost — Korea Plastic Surgery Cost Guide',
  description:
    'Learn how to use Plainkost to compare Korean plastic surgery clinic prices, calculate your total trip cost, and understand what the estimates mean.',
  alternates: { canonical: 'https://www.plainkost.com/guide' },
  openGraph: {
    title: 'How to Use Plainkost — Korea Plastic Surgery Cost Guide',
    description: 'Compare clinic prices, estimate trip costs, and understand Korean plastic surgery pricing — all in one tool.',
    url: 'https://www.plainkost.com/guide',
  },
}

const HOW_TO = [
  {
    title: 'Set your trip details',
    desc: 'Use the bar at the top of the page to select your departure city, travel month, and length of stay. The calculator uses these to estimate your flight and hotel costs.',
  },
  {
    title: 'Filter by procedure',
    desc: 'Use the left sidebar to filter clinics by body part (Eyes, Nose, Breast, etc.), technique (Incision, SMAS, Endoscopic...), or material (Silicone, Motiva, Autologous rib...). Only clinics that offer the selected procedure are shown.',
  },
  {
    title: 'Select up to 2 clinics to compare',
    desc: 'Click any clinic card to add it to slot A or B. The Trip Summary panel on the right updates automatically with a side-by-side cost breakdown including surgery, flight, hotel, and daily expenses.',
  },
  {
    title: 'Open Price Comparison for itemized pricing',
    desc: 'Click "Price Comparison" in the Trip Summary to see the full procedure price list for each clinic. Check individual procedures to build a custom quote and apply it to the trip calculator.',
  },
  {
    title: 'Override with your actual flight cost',
    desc: 'Click the "Flight" button in the header to enter the actual flight price you found on Google Flights. This replaces the estimate and gives you a more accurate total trip cost.',
  },
]

const FAQS = [
  {
    q: 'Where does the price data come from?',
    a: 'Prices are sourced from clinic websites, public disclosures required by Korean law, and user-submitted reports. Your actual quote may vary based on your case, surgeon, and any package deals.',
  },
  {
    q: 'How is the USD price calculated?',
    a: 'Plainkost converts KRW to USD at a fixed rate of ₩1,350 = $1. Actual exchange rates fluctuate — treat this as a rough guide, not a guaranteed price.',
  },
  {
    q: 'Can I contact clinics through Plainkost?',
    a: 'No. Plainkost is a research tool only — no clinic partnerships, no bookings, no consultations. Contact each clinic directly through their official website.',
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
    q: 'How do I report a price, or request a clinic to be added?',
    a: 'Hover over any procedure in the Price Comparison modal to see "Different price? Report it." Don\'t see a clinic you\'re looking for? Use the form at the bottom of the page to request it — we\'ll look into adding it.',
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
    <div className="max-w-[680px] mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">How to Use Plainkost</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          A free research tool for Americans comparing the cost of plastic surgery in Korea.
          Not a booking platform or medical advisor — it helps you understand procedure costs
          and estimate your total trip budget before reaching out to clinics directly.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-5">How to use</h2>
        <div className="space-y-0">
          {HOW_TO.map((item, i) => (
            <div key={i} className="border-b border-gray-100 py-4">
              <p className="text-sm font-medium text-gray-900 mb-1">{item.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-5">FAQ</h2>
        <div className="space-y-0">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 py-4">
              <p className="text-sm font-medium text-gray-900 mb-1">{faq.q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 mt-10 pt-6 border-t border-gray-100">
        Prices are estimates only. Confirm all quotes directly with the clinic. This is not medical advice.
      </p>
    </div>
  )
}
