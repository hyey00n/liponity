import type { Metadata } from 'next'
import TripCostCalculator from '@/components/calculator/TripCostCalculator'

export const metadata: Metadata = {
  title: 'Korea Liposuction Cost Guide 2025',
  description:
    'Complete breakdown of liposuction costs in Korea for US patients. Procedure prices, flights, hotels, and total trip estimates.',
}

const PRICE_TABLE = [
  { procedure: 'Liposuction (1 area)',  korea: '$2,000–$5,000',   us: '$5,000–$9,000' },
  { procedure: 'Liposuction (2 areas)', korea: '$3,500–$8,000',   us: '$9,000–$15,000' },
  { procedure: 'VASER Liposuction',     korea: '$3,000–$7,000',   us: '$7,000–$12,000' },
  { procedure: '360 Liposuction',       korea: '$6,000–$12,000',  us: '$14,000–$22,000' },
  { procedure: 'Tummy Tuck',            korea: '$4,000–$8,000',   us: '$9,000–$15,000' },
  { procedure: 'Body Contouring',       korea: '$5,000–$15,000',  us: '$15,000–$25,000' },
  { procedure: 'Arm Liposuction',       korea: '$1,500–$4,000',   us: '$4,000–$7,000' },
  { procedure: 'Thigh Liposuction',     korea: '$2,000–$5,000',   us: '$5,000–$9,000' },
]

export default function KoreaLiposuctionCostPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-sm text-blue-600 font-medium mb-3 uppercase tracking-wide">Cost Guide</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Korea Liposuction Cost Guide</h1>
      <p className="text-lg text-gray-500 mb-12">
        Detailed price comparison for liposuction procedures in Korea vs. the United States.
      </p>

      {/* 가격 테이블 */}
      <div className="overflow-x-auto mb-16">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 pr-6 font-semibold text-gray-900">Procedure</th>
              <th className="text-right py-3 px-4 font-semibold text-blue-600">Korea</th>
              <th className="text-right py-3 pl-4 font-semibold text-gray-500">US</th>
            </tr>
          </thead>
          <tbody>
            {PRICE_TABLE.map((row) => (
              <tr key={row.procedure} className="border-b border-gray-100">
                <td className="py-3 pr-6 text-gray-700">{row.procedure}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-900">{row.korea}</td>
                <td className="py-3 pl-4 text-right text-gray-400">{row.us}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-3">
          Prices are estimates in USD. Actual costs vary by clinic, surgeon, and individual case.
        </p>
      </div>

      {/* 계산기 */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Calculate Your Total Trip Cost</h2>
        <p className="text-sm text-gray-500 mb-8">
          Including flights, hotel, and surgery — compared to US prices.
        </p>
      </div>
      <TripCostCalculator />
    </div>
  )
}
