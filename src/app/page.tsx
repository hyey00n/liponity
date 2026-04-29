import Link from 'next/link'
import type { Metadata } from 'next'
import TripCostCalculator from '@/components/calculator/TripCostCalculator'

export const metadata: Metadata = {
  title: 'Liponity — Korea Liposuction Guide for US Patients',
  description:
    'Compare liposuction costs in Korea vs the US, find top clinics, and plan your medical trip. Save 50–70% with Liponity.',
}

const PROCEDURES = [
  { label: 'Liposuction',       href: '/procedures/liposuction-korea',       price: '$2,000–$5,000' },
  { label: 'VASER Liposuction', href: '/procedures/vaser-liposuction-korea', price: '$3,000–$7,000' },
  { label: '360 Liposuction',   href: '/procedures/360-liposuction-korea',   price: '$6,000–$12,000' },
  { label: 'Tummy Tuck',        href: '/procedures/tummy-tuck-korea',        price: '$4,000–$8,000' },
  { label: 'Body Contouring',   href: '/procedures/body-contouring-korea',   price: '$5,000–$15,000' },
  { label: 'Arm Liposuction',   href: '/procedures/liposuction-korea',       price: '$1,500–$4,000' },
]

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4">

      {/* Hero */}
      <section className="py-20 border-b border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Liposuction in Korea
        </h1>
        <p className="text-gray-500 max-w-lg mb-8">
          Save 50–70% vs US prices. Trusted information on clinics, costs,
          and procedures for US patients.
        </p>
        <div className="flex gap-3">
          <Link
            href="/procedures/liposuction-korea"
            className="text-sm border border-gray-900 px-4 py-2 hover:bg-gray-900 hover:text-white transition-colors"
          >
            Explore Procedures
          </Link>
          <Link
            href="/korea-liposuction-cost"
            className="text-sm text-gray-500 px-4 py-2 border border-gray-200 hover:border-gray-400 transition-colors"
          >
            Cost Guide
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-b border-gray-200 grid grid-cols-3 gap-6">
        {[
          { stat: '50–70%',     label: 'Cheaper than US' },
          { stat: '10–14 days', label: 'Typical stay' },
          { stat: '$2K–$12K',   label: 'Korea price range' },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xl font-semibold text-gray-900">{item.stat}</p>
            <p className="text-xs text-gray-400 mt-1">{item.label}</p>
          </div>
        ))}
      </section>

      {/* Procedures */}
      <section className="py-16 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-6">
          Procedures
        </h2>
        <div className="divide-y divide-gray-100">
          {PROCEDURES.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="flex justify-between items-center py-4 text-sm hover:text-gray-400 transition-colors group"
            >
              <span className="font-medium text-gray-900 group-hover:text-gray-500">{p.label}</span>
              <span className="text-gray-400">{p.price} in Korea →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-6">
          Trip Cost Calculator
        </h2>
        <TripCostCalculator />
      </section>

    </div>
  )
}
