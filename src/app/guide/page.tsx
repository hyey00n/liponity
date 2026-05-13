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
    desc: 'Select your departure city, travel month, and length of stay. Plainkost uses these to estimate your flight and hotel costs.',
  },
  {
    title: 'Filter by procedure',
    desc: 'Use the sidebar to filter clinics by body part, technique, or material. Only clinics that offer the selected procedure are shown.',
  },
  {
    title: 'Compare up to 2 clinics',
    desc: 'Click any clinic card to add it to slot A or B. The Trip Summary updates with a side-by-side cost breakdown including surgery, flight, and hotel.',
  },
  {
    title: 'See itemized pricing',
    desc: 'Click "Price Comparison" in the Trip Summary to view the full procedure price list and build a custom quote.',
  },
  {
    title: 'Override with your actual flight cost',
    desc: 'Click the "Flight" button to enter a real price from Google Flights for a more accurate total.',
  },
]

const FAQS = [
  {
    q: 'Where does the price data come from?',
    a: 'Clinic websites, public disclosures required by Korean law, and user-submitted reports. Your actual quote may vary based on your case, surgeon, and package deals.',
  },
  {
    q: 'How is the USD price calculated?',
    a: 'At a fixed rate of ₩1,350 = $1. Actual exchange rates fluctuate — treat it as a rough guide.',
  },
  {
    q: 'Can I contact clinics through Plainkost?',
    a: 'No — contact each clinic directly through their official website.',
  },
  {
    q: 'Why does the same procedure have a wide price range?',
    a: 'Different techniques, materials, and surgeon experience all affect price. Use the technique filter to narrow the range.',
  },
  {
    q: "Don't see a clinic you're looking for?",
    a: "Use the form at the bottom of the page to request it — we'll look into adding it.",
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

    </div>
  )
}
