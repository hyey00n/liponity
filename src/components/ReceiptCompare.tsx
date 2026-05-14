'use client'

import { useState, useMemo } from 'react'

type PriceItem = {
  category: string
  name: string
  krw: number
  maxKrw: number
  usd: number | null
  vat: string
  note: string
  isUserReport: boolean
  reportCount: number
  lastReported: string | null
}

type Clinic = {
  id: string
  name: string
  priceItems: PriceItem[]
}

function fmt(n: number) { return `$${n.toLocaleString()}` }
function fmtKrw(n: number) { return `₩${n.toLocaleString()}` }

export function ClinicReceipt({
  clinic,
  label,
  inline = false,
  initialChecked,
  onSelectionChange,
}: {
  clinic: Clinic
  label?: 'A' | 'B'
  inline?: boolean
  initialChecked?: Set<string>
  onSelectionChange: (totalUsd: number, checkedNames: Set<string>) => void
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [checkedItems, setCheckedItems] = useState<Set<string>>(initialChecked ?? new Set())
  const [reportingItem, setReportingItem] = useState<string | null>(null)
  const [priceInput, setPriceInput] = useState('')
  const [noteInput, setNoteInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())

  const [emptyProcedure, setEmptyProcedure] = useState('')
  const [emptyPrice, setEmptyPrice] = useState('')
  const [emptyNote, setEmptyNote] = useState('')
  const [emptySubmitting, setEmptySubmitting] = useState(false)
  const [emptyDone, setEmptyDone] = useState(false)

  function toggleCheck(item: PriceItem) {
    const next = new Set(checkedItems)
    if (next.has(item.name)) next.delete(item.name)
    else next.add(item.name)
    const total = clinic.priceItems
      .filter(i => next.has(i.name))
      .reduce((sum, i) => sum + (i.usd ?? (i.krw > 0 ? Math.round(i.krw / 1350) : 0)), 0)
    setCheckedItems(next)
    onSelectionChange(total, next)
  }

  async function handleEmptySubmit() {
    const krw = Number(emptyPrice.replace(/,/g, ''))
    if (!emptyProcedure.trim() || !krw) return
    setEmptySubmitting(true)
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: clinic.id,
          clinic_name: clinic.name,
          procedure_name: emptyProcedure.trim(),
          category: '',
          price_krw: krw,
          note: emptyNote,
        }),
      })
      if (res.ok) setEmptyDone(true)
    } finally {
      setEmptySubmitting(false)
    }
  }

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(clinic.priceItems.map(i => i.category))).sort()],
    [clinic.priceItems]
  )
  const baseItems = useMemo(
    () => activeCategory === 'all' ? clinic.priceItems : clinic.priceItems.filter(i => i.category === activeCategory),
    [activeCategory, clinic.priceItems]
  )
  const items = baseItems

  function openReport(itemName: string) {
    setReportingItem(itemName)
    setPriceInput('')
    setNoteInput('')
  }

  function cancelReport() {
    setReportingItem(null)
    setPriceInput('')
    setNoteInput('')
  }

  async function handleSubmit(item: PriceItem) {
    const krw = Number(priceInput.replace(/,/g, ''))
    if (!krw) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: clinic.id,
          clinic_name: clinic.name,
          procedure_name: item.name,
          category: item.category,
          price_krw: krw,
          note: noteInput,
        }),
      })
      if (res.ok) {
        setSubmitted(prev => new Set(prev).add(item.name))
        setReportingItem(null)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <article className={inline ? 'flex flex-col h-full' : 'flex-1 border border-gray-200 min-w-0 flex flex-col'}>
      {!inline && label && (
        <header className={`px-4 py-3 border-b border-gray-200 ${label === 'A' ? 'bg-gray-900 text-white' : 'bg-gray-500 text-white'}`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold border border-white px-1.5 py-0.5">{label}</span>
            <span className="text-sm font-medium truncate">{clinic.name}</span>
          </div>
        </header>
      )}

      {/* 카테고리 필터 */}
      <div role="group" aria-label="Filter by category" className="flex gap-1.5 p-3 border-b border-gray-100 overflow-x-auto flex-shrink-0">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 text-xs px-2.5 py-1 border transition-colors ${
              activeCategory === cat
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}>
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* 항목 리스트 */}
      <ul className="divide-y divide-gray-50 flex-1 overflow-y-auto">
        {items.length === 0 && (
          <li className="px-4 py-6">
            <p className="text-xs text-gray-400 mb-4">No price data available for this clinic.<br />Know the actual prices? Help others by reporting them.</p>
            {emptyDone ? (
              <p className="text-xs text-blue-600 font-medium">Reported ✓ Thank you!</p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleEmptySubmit() }} className="space-y-2">
                <input
                  type="text"
                  placeholder="Procedure name"
                  value={emptyProcedure}
                  onChange={e => setEmptyProcedure(e.target.value)}
                  className="text-xs border border-gray-200 px-2 py-1.5 w-full focus:outline-none focus:border-gray-400"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Price (₩)"
                  value={emptyPrice}
                  onChange={e => setEmptyPrice(e.target.value)}
                  className="text-xs border border-gray-200 px-2 py-1.5 w-full focus:outline-none focus:border-gray-400"
                />
                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={emptyNote}
                  onChange={e => setEmptyNote(e.target.value)}
                  className="text-xs border border-gray-200 px-2 py-1.5 w-full focus:outline-none focus:border-gray-400"
                />
                <button
                  type="submit"
                  disabled={emptySubmitting || !emptyProcedure.trim() || !emptyPrice}
                  className="w-full text-xs py-1.5 bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
                >
                  {emptySubmitting ? '...' : 'Submit'}
                </button>
              </form>
            )}
          </li>
        )}
        {items.map((item, i) => (
          <li key={i} className="px-4 py-3 hover:bg-gray-50 group">
            <div className="flex justify-between items-start gap-2">
              {/* 체크박스 */}
              <button
                onClick={() => toggleCheck(item)}
                aria-label={`${checkedItems.has(item.name) ? 'Unselect' : 'Select'} ${item.name}`}
                className={`flex-shrink-0 mt-0.5 w-4 h-4 border transition-colors ${
                  checkedItems.has(item.name)
                    ? 'bg-gray-900 border-gray-900'
                    : 'border-gray-300 hover:border-gray-600'
                }`}
              >
                {checkedItems.has(item.name) && (
                  <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-700 leading-snug">{item.name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {item.vat && <span className="text-xs text-gray-400">{item.vat}</span>}
                  {item.note && <span className="text-xs text-gray-400 truncate max-w-[120px]">{item.note}</span>}
                  {item.isUserReport && <span className="text-xs text-green-600 font-medium">User reported</span>}
                  {item.reportCount > 0 && <span className="text-xs text-gray-400">{item.reportCount} {item.reportCount === 1 ? 'report' : 'reports'}</span>}
                  {submitted.has(item.name) && <span className="text-xs text-blue-600 font-medium">Reported ✓</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {item.krw > 0 ? (
                  <>
                    <p className="text-xs font-medium text-gray-900">
                      {fmt(item.usd ?? Math.round(item.krw / 1350))}
                      {item.maxKrw > 0 && <span className="text-gray-400"> ~ {fmt(Math.round(item.maxKrw / 1350))}</span>}
                    </p>
                    <p className="text-xs text-gray-400">
                      {fmtKrw(item.krw)}
                      {item.maxKrw > 0 && ` ~ ${fmtKrw(item.maxKrw)}`}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-400">Unknown</p>
                )}
              </div>
            </div>

            {/* 제보 인라인 폼 */}
            {!submitted.has(item.name) && (
              <div className="mt-2 ml-6">
                {reportingItem === item.name ? (
                  <form onSubmit={e => { e.preventDefault(); handleSubmit(item) }} className="flex gap-1.5 items-center flex-wrap">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Actual price (₩)"
                      value={priceInput}
                      onChange={e => setPriceInput(e.target.value)}
                      className="text-xs border border-gray-300 px-2 py-1 w-28 focus:outline-none focus:border-gray-600"
                      autoFocus
                    />
                    <input
                      type="text"
                      placeholder="Note (optional)"
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      className="text-xs border border-gray-300 px-2 py-1 flex-1 min-w-0 focus:outline-none focus:border-gray-600"
                    />
                    <button
                      type="submit"
                      disabled={submitting || !priceInput}
                      className="text-xs px-2.5 py-1 bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
                    >
                      {submitting ? '...' : 'Submit'}
                    </button>
                    <button type="button" onClick={cancelReport} className="text-xs text-gray-400 hover:text-gray-700">✕</button>
                  </form>
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openReport(item.name)}
                      className="text-xs text-gray-400 hover:text-gray-700 underline"
                    >
                      Different price? Report it →
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-400 px-4 py-2 border-t border-gray-100 flex-shrink-0">
        Prices are estimates and may differ from actual charges.
      </p>
    </article>
  )
}

export default function ReceiptCompare({
  clinicA,
  clinicB,
  onClose,
  onSelectPrices,
  initialCheckedA,
  initialCheckedB,
}: {
  clinicA: Clinic | null
  clinicB: Clinic | null
  onClose: () => void
  onSelectPrices?: (a: number, b: number, checkedA: Set<string>, checkedB: Set<string>) => void
  initialCheckedA?: Set<string>
  initialCheckedB?: Set<string>
}) {
  const computeTotal = (clinic: Clinic | null, checked: Set<string>) => {
    if (!clinic || !checked.size) return 0
    return clinic.priceItems
      .filter(i => checked.has(i.name))
      .reduce((sum, i) => sum + (i.usd ?? (i.krw > 0 ? Math.round(i.krw / 1350) : 0)), 0)
  }

  const [selectedA, setSelectedA] = useState(() => computeTotal(clinicA, initialCheckedA ?? new Set()))
  const [selectedB, setSelectedB] = useState(() => computeTotal(clinicB, initialCheckedB ?? new Set()))
  const [checkedA, setCheckedA] = useState<Set<string>>(initialCheckedA ?? new Set())
  const [checkedB, setCheckedB] = useState<Set<string>>(initialCheckedB ?? new Set())

  if (!clinicA && !clinicB) return null

  const hasSelection = selectedA > 0 || selectedB > 0

  function handleApply() {
    onSelectPrices?.(selectedA, selectedB, checkedA, checkedB)
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="price-compare-title" className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="bg-white w-full md:max-w-4xl md:rounded-none max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
          <h2 id="price-compare-title" className="text-sm font-semibold text-gray-900">Price Comparison</h2>
          <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-900 px-2 py-1 border border-gray-200">
            Close ✕
          </button>
        </div>

        <div className="flex gap-0 overflow-y-auto flex-1 min-h-0">
          {clinicA && (
            <ClinicReceipt clinic={clinicA} label="A" initialChecked={checkedA}
              onSelectionChange={(total, names) => { setSelectedA(total); setCheckedA(names) }} />
          )}
          {clinicB && (
            <ClinicReceipt clinic={clinicB} label="B" initialChecked={checkedB}
              onSelectionChange={(total, names) => { setSelectedB(total); setCheckedB(names) }} />
          )}
        </div>

        {onSelectPrices && (
          <div className="flex-shrink-0 border-t border-gray-200 px-4 py-3 flex items-center justify-end gap-4">
            {hasSelection && (
              <span className="text-xs text-gray-500 flex gap-3">
                {clinicA && selectedA > 0 && <span>A: <strong className="text-gray-900">{fmt(selectedA)}</strong></span>}
                {clinicB && selectedB > 0 && <span>B: <strong className="text-gray-900">{fmt(selectedB)}</strong></span>}
              </span>
            )}
            <button
              onClick={handleApply}
              disabled={!hasSelection}
              className="text-xs bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Apply to Trip Calculator →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
