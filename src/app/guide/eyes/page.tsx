import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Eye Surgery in Korea: Cost, Types & What to Know',
  description:
    'Compare double eyelid surgery, ptosis correction, and epicanthoplasty prices at Korean clinics. Incision vs non-incision explained for US patients.',
  alternates: { canonical: 'https://www.plainkost.com/guide/eyes' },
  openGraph: {
    title: 'Eye Surgery in Korea: Cost, Types & What to Know',
    description: 'Double eyelid, ptosis correction, epicanthoplasty — prices and options at Korean clinics for American patients.',
    url: 'https://www.plainkost.com/guide/eyes',
  },
}

const TYPES = [
  {
    name: 'Non-incision double eyelid (Buried suture)',
    range: '$800 – $1,800',
    desc: 'Sutures create the crease without cutting. Faster recovery (5–7 days swelling), but results can loosen over time, especially for heavier eyelids. Best for younger patients with thin eyelid skin.',
  },
  {
    name: 'Incision double eyelid',
    range: '$1,200 – $3,000',
    desc: 'A small incision creates a permanent crease and allows removal of excess fat or skin. Longer recovery (2–3 weeks for visible bruising), but more durable and better for mature or thicker eyelids.',
  },
  {
    name: 'Ptosis correction (안검하수)',
    range: '$1,500 – $3,500',
    desc: 'Tightens the levator muscle when the eyelid droops and partially covers the pupil. Often combined with double eyelid surgery. Functional as well as cosmetic.',
  },
  {
    name: 'Epicanthoplasty (눈매교정)',
    range: '$600 – $1,500',
    desc: 'Removes or reduces the epicanthal fold at the inner corner of the eye, making eyes appear wider. Frequently combined with double eyelid surgery at a package price.',
  },
  {
    name: 'Lower blepharoplasty',
    range: '$1,200 – $2,800',
    desc: 'Removes under-eye bags or excess skin on the lower lid. Can be done internally (no visible scar) or externally depending on the amount of excess skin.',
  },
]

const FAQS = [
  {
    q: 'What is the most popular eye surgery in Korea?',
    a: 'Double eyelid surgery (쌍꺼풀) is by far the most common. Clinics in Seoul perform thousands each year. Non-incision is preferred by younger patients; incision is recommended when there is excess fat or skin.',
  },
  {
    q: 'How long do results last?',
    a: 'Incision-based results are permanent. Non-incision sutures can loosen after 5–10 years, sometimes requiring a revision. Ptosis correction is also permanent once healed.',
  },
  {
    q: 'Can I combine multiple eye procedures?',
    a: 'Yes — double eyelid + epicanthoplasty is one of the most common combinations. Many clinics offer package pricing. Adding ptosis correction is also common when it is clinically indicated.',
  },
  {
    q: 'How do Korean eye surgery prices compare to the US?',
    a: 'Double eyelid surgery in the US typically costs $3,000–$6,000. The same procedure at a reputable Seoul clinic runs $1,000–$2,500, saving $1,500–$4,000 even after accounting for flights and accommodation.',
  },
  {
    q: 'What should I ask during the consultation?',
    a: 'Ask which technique the surgeon recommends for your eyelid type and why. Ask to see before/after photos from the same surgeon (not general clinic photos). Confirm whether the quoted price includes anesthesia and follow-up visits.',
  },
]

export default function EyesGuidePage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/guide" className="text-xs text-gray-400 hover:text-gray-700">← Guide</Link>
      </div>

      <div className="mb-10 border-b border-gray-200 pb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Eyes</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Eye Surgery in Korea</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Korea is one of the world's leading destinations for eyelid surgery. Clinics in Gangnam perform high volumes of double eyelid, ptosis, and epicanthoplasty procedures — often at 40–60% less than US prices. This page explains the main procedure types and what to look for when comparing clinics.
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
        <p className="text-xs text-gray-400 mt-4">Ranges based on published clinic prices in Seoul. ₩1,350 = $1 conversion. VAT may apply.</p>
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
        <p className="text-sm text-gray-500">Compare eye surgery prices across Seoul clinics</p>
        <Link href="/" className="text-xs bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 transition-colors">
          Open calculator →
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-8">Prices are estimates only. Not medical advice. Confirm all details with your clinic.</p>
    </div>
  )
}
