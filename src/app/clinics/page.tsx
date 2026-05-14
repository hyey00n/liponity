'use client'
import { useEffect, useState, useMemo, useCallback, Fragment } from 'react'
import { useTravelContext } from '@/context/travel'
import PROCEDURES_DATA from '@/data/procedures.json'
import CALC_DATA from '@/data/calculator.json'
import CompareMap from '@/components/CompareMap'
import ReceiptCompare from '@/components/ReceiptCompare'

type PriceItem = {
  category: string; name: string; krw: number; maxKrw: number
  usd: number | null; vat: string; note: string
  isUserReport: boolean; reportCount: number; lastReported: string | null
}
type Clinic = {
  id: string; name: string; specialties: string[]
  hours: string; address: string; district: string
  lat: number | null; lng: number | null
  pricing: Record<string, { price: number; maxPrice: number; isActual: boolean }>
  priceItems: PriceItem[]
}
type Procedure = { key: string; label: string; koreaAvg: number; usAvg: number }
type CalcResult = {
  surgery: number; isActual: boolean
  procBreakdown: { key: string; label: string; price: number; isActual: boolean }[]
  flight: number; hotel: number; food: number; transport: number; total: number; usSaving: number
}

const procedures = PROCEDURES_DATA as Procedure[]
const calcData   = CALC_DATA as typeof CALC_DATA

const BODY_PARTS = [
  { label: 'Eyes',           value: 'Eyes' },
  { label: 'Nose',           value: 'Nose' },
  { label: 'Breast',         value: 'Breast' },
  { label: 'Lifting',        value: 'Lifting' },
  { label: 'Facial Contour', value: 'Facial Contour' },
  { label: 'Liposuction',    value: 'Liposuction' },
  { label: 'Fat Graft',      value: 'Fat Graft' },
  { label: 'Package',        value: 'Package' },
]

const METHOD_TAGS   = ['Incision', 'Non-incision', 'SMAS', 'Endoscopic', 'Buried suture', 'Epicanthoplasty', 'Ptosis correction']
const MATERIAL_TAGS = ['Autologous rib', 'Donor rib', 'Motiva', 'Mentor', 'Silicone', 'Fat graft', 'Bellygel']

const CATEGORY_TO_PROC: Record<string, string> = {
  Eyes: '눈', Nose: '코', Breast: '가슴', Lifting: '리프팅',
  'Facial Contour': '안면윤곽', Liposuction: '지방흡입',
  'Fat Graft': '지방이식', Package: '복합',
}
const PROC_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_PROC).map(([cat, key]) => [key, cat])
)

function getDisplayRange(clinic: Clinic, categories: Set<string>) {
  const items = categories.size === 0
    ? clinic.priceItems
    : clinic.priceItems.filter(i => categories.has(i.category))
  const mins = items.map(i => i.krw).filter(n => n > 0)
  if (mins.length === 0) return null
  const maxes = items.map(i => i.maxKrw > 0 ? i.maxKrw : i.krw).filter(n => n > 0)
  return { min: Math.min(...mins), max: Math.max(...maxes) }
}

function getPrice(clinic: Clinic, procedureKey: string) {
  const found = clinic.pricing?.[procedureKey]
  const proc  = procedures.find(p => p.key === procedureKey)
  if (!proc) return null
  if (found?.isActual && found.price) return { price: found.price, isActual: true }
  return { price: proc.koreaAvg, isActual: false }
}

function fmt(n: number) { return `$${n.toLocaleString()}` }

export default function ClinicsPage({ initialClinics = [] }: { initialClinics?: Clinic[] }) {
  const [clinics, setClinics]   = useState<Clinic[]>(initialClinics)
  const [loading, setLoading]   = useState(initialClinics.length === 0)
  const [error,   setError]     = useState<string | null>(null)

  useEffect(() => {
    if (initialClinics.length > 0) return
    const ctrl = new AbortController()
    fetch('/api/clinics', { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { if (Array.isArray(d)) setClinics(d); else setError(d.error || 'Error') })
      .catch(e => { if (e.name !== 'AbortError') setError('Failed to load') })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [initialClinics.length])

  // ── Travel state (shared via context with Header) ─────────
  const { city, month, nights, accommodation, flightOverride } = useTravelContext()

  // ── Left sidebar filter state ─────────────────────────────
  const [activeCategories,  setActiveCategories]  = useState<Set<string>>(new Set())
  const [activeMethodTags,  setActiveMethodTags]  = useState<Set<string>>(new Set())
  const [activeMaterialTags,setActiveMaterialTags]= useState<Set<string>>(new Set())
  const [priceOnly,         setPriceOnly]         = useState(false)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  function toggleCollapse(name: string) {
    setCollapsed(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n })
  }
  function toggleSet<T>(set: Set<T>, val: T, setter: (s: Set<T>) => void) {
    const n = new Set(set); n.has(val) ? n.delete(val) : n.add(val); setter(n)
  }

  // ── Clinic list state ─────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'actual-first'>('default')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // ── Compare state ─────────────────────────────────────────
  const [compareA, setCompareA] = useState<Clinic | null>(null)
  const [compareB, setCompareB] = useState<Clinic | null>(null)
  const [flashSlot, setFlashSlot] = useState<'A' | 'B' | null>(null)
  const [showReceipt, setShowReceipt]     = useState(false)
  const [showCalcDrawer, setShowCalcDrawer] = useState(false)

  const [surgeryOverrideA, setSurgeryOverrideA] = useState<number | null>(null)
  const [surgeryOverrideB, setSurgeryOverrideB] = useState<number | null>(null)
  const [customSelA, setCustomSelA] = useState<Set<string>>(new Set())
  const [customSelB, setCustomSelB] = useState<Set<string>>(new Set())
  const [expandedProcKey, setExpandedProcKey] = useState<string | null>(null)

  const [summaryTab, setSummaryTab] = useState<'cost' | 'map'>('cost')

  const [suggestName, setSuggestName] = useState('')
  const [suggestSubmitting, setSuggestSubmitting] = useState(false)
  const [suggestDone, setSuggestDone] = useState(false)

  async function handleSuggest(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!suggestName.trim()) return
    setSuggestSubmitting(true)
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinic_name: suggestName.trim() }),
      })
      if (res.ok) { setSuggestDone(true); setSuggestName('') }
    } finally { setSuggestSubmitting(false) }
  }

  const selectedProcKeys = useMemo(() =>
    [...activeCategories].map(cat => CATEGORY_TO_PROC[cat]).filter(Boolean)
  , [activeCategories])

  useEffect(() => { setSurgeryOverrideA(null); setCustomSelA(new Set()) }, [compareA?.id])
  useEffect(() => { setSurgeryOverrideB(null); setCustomSelB(new Set()) }, [compareB?.id])

  const calcOne = useCallback((clinic: Clinic, override: number | null, customSel: Set<string>): CalcResult | null => {
    const procBreakdown = selectedProcKeys.map(key => {
      const catEng = PROC_TO_CATEGORY[key] ?? ''
      const catCustom = clinic.priceItems.filter(i => i.category === catEng && customSel.has(i.name))
      if (catCustom.length > 0) {
        const customPrice = catCustom.reduce((s, i) => s + (i.usd ?? (i.krw > 0 ? Math.round(i.krw / 1350) : 0)), 0)
        const proc = procedures.find(p => p.key === key)!
        return { key, label: proc.label, price: customPrice, isActual: true }
      }
      const info = getPrice(clinic, key)
      const proc = procedures.find(p => p.key === key)!
      return { key, label: proc.label, price: info?.price ?? proc.koreaAvg, isActual: info?.isActual ?? false }
    })
    const autoSurgery = procBreakdown.reduce((s, p) => s + p.price, 0)
    const surgery = override ?? (autoSurgery > 0 ? autoSurgery : null)
    if (!surgery && selectedProcKeys.length === 0) return null

    const cityData = calcData.cities.find(c => c.code === city)!
    const multiplier = (calcData.seasonMultiplier as Record<string, number[]>)[month][1]
    const parsedFlight = Number(flightOverride.replace(/,/g, ''))
    const flight = parsedFlight > 0 ? parsedFlight : Math.round(cityData.flight * multiplier)
    const hotel     = calcData.accommodation[accommodation].perNight * nights
    const food      = Math.round(calcData.fixedCosts.foodPerDay * nights)
    const transport = calcData.fixedCosts.misc
    const total     = (surgery ?? 0) + flight + hotel + food + transport
    const usTotal   = selectedProcKeys.reduce((s, key) => s + (procedures.find(p => p.key === key)?.usAvg ?? 0), 0)
    const usSaving  = usTotal > 0 ? usTotal - (surgery ?? 0) : 0
    const isActual  = override !== null || procBreakdown.every(p => p.isActual)
    return { surgery: surgery ?? 0, isActual, procBreakdown, flight, hotel, food, transport, total, usSaving }
  }, [selectedProcKeys, city, month, nights, accommodation, flightOverride])

  const resultA = useMemo(() => compareA ? calcOne(compareA, surgeryOverrideA, customSelA) : null, [compareA, calcOne, surgeryOverrideA, customSelA])
  const resultB = useMemo(() => compareB ? calcOne(compareB, surgeryOverrideB, customSelB) : null, [compareB, calcOne, surgeryOverrideB, customSelB])

  const filtered = useMemo(() => {
    let list = clinics.filter(c => {
      const matchCat      = activeCategories.size === 0 || c.specialties.some(s => activeCategories.has(s))
      const matchSearch   = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchMethod   = activeMethodTags.size === 0 ||
        c.priceItems.some(item => [...activeMethodTags].some(t => item.name.toLowerCase().includes(t.toLowerCase())))
      const matchMaterial = activeMaterialTags.size === 0 ||
        c.priceItems.some(item => [...activeMaterialTags].some(t => item.name.toLowerCase().includes(t.toLowerCase())))
      const matchPrice    = !priceOnly || (c.priceItems?.length ?? 0) > 0
      return matchCat && matchSearch && matchMethod && matchMaterial && matchPrice
    })
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => {
        const ra = getDisplayRange(a, activeCategories), rb = getDisplayRange(b, activeCategories)
        if (!ra && !rb) return 0; if (!ra) return 1; if (!rb) return -1
        return ra.min - rb.min
      })
    } else if (sortBy === 'actual-first') {
      list = [...list].sort((a, b) =>
        (getDisplayRange(a, activeCategories) ? 0 : 1) - (getDisplayRange(b, activeCategories) ? 0 : 1)
      )
    }
    return list
  }, [clinics, activeCategories, activeMethodTags, activeMaterialTags, priceOnly, searchQuery, sortBy])

  function getSlot(id: string) {
    if (compareA?.id === id) return 'A'
    if (compareB?.id === id) return 'B'
    return null
  }
  function selectClinic(clinic: Clinic) {
    if (compareA?.id === clinic.id) { setCompareA(null); return }
    if (compareB?.id === clinic.id) { setCompareB(null); return }
    if (!compareA) { setCompareA(clinic); return }
    if (!compareB) { setCompareB(clinic); return }
    setCompareA(clinic); setFlashSlot('A')
    setTimeout(() => setFlashSlot(null), 1500)
  }
  function handleSelectPrices(a: number, b: number, checkedA: Set<string>, checkedB: Set<string>) {
    if (a > 0) { setSurgeryOverrideA(a); setCustomSelA(checkedA) }
    if (b > 0) { setSurgeryOverrideB(b); setCustomSelB(checkedB) }
    setShowReceipt(false)
  }

  const hasAny       = compareA || compareB
  const hasPriceData = (compareA?.priceItems?.length ?? 0) > 0 || (compareB?.priceItems?.length ?? 0) > 0
  const activeFilterCount = activeCategories.size + activeMethodTags.size + activeMaterialTags.size + (priceOnly ? 1 : 0)

  // ── Filter sidebar section helper ─────────────────────────
  function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    const isCollapsed = collapsed.has(id)
    return (
      <section className="border-b border-gray-100">
        <h3>
          <button
            onClick={() => toggleCollapse(id)}
            aria-expanded={!isCollapsed}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          >
            {title}
            <span className="text-gray-400 text-xs" aria-hidden="true">{isCollapsed ? '∨' : '∧'}</span>
          </button>
        </h3>
        {!isCollapsed && <div className="px-4 pb-4">{children}</div>}
      </section>
    )
  }

  function TagChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className={`text-xs px-2.5 py-1 border transition-colors ${
          active ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
        }`}
      >
        {label}
      </button>
    )
  }

  // ── Trip Summary content ──────────────────────────────────
  const tripSummaryContent = (
    <div className="p-4 space-y-4 text-xs">
      <section>
        <h3 className="text-gray-400 mb-2 uppercase tracking-wide">Clinics</h3>
        <ul>
          {([
            { slot: 'A', clinic: compareA, onClear: () => setCompareA(null) },
            { slot: 'B', clinic: compareB, onClear: () => setCompareB(null) },
          ] as const).map(({ slot, clinic, onClear }) => (
            <li key={slot} className={`flex items-center justify-between py-2 border-b border-gray-100 ${
              !clinic ? 'opacity-40' : flashSlot === slot ? 'bg-amber-50' : ''
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="bg-gray-900 text-white px-1.5 py-0.5 flex-shrink-0">{slot}</span>
                <span className="text-gray-700 truncate">{clinic ? clinic.name : 'Not selected'}</span>
                {flashSlot === slot && <span className="text-amber-600 flex-shrink-0">replaced</span>}
              </div>
              {clinic && <button onClick={onClear} className="text-gray-300 hover:text-gray-900 ml-1">✕</button>}
            </li>
          ))}
        </ul>
      </section>

      {hasAny && (selectedProcKeys.length > 0 || surgeryOverrideA != null || surgeryOverrideB != null) ? (
        <section>
          <h3 className="text-gray-400 mb-3 uppercase tracking-wide">Cost Breakdown</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left font-normal text-gray-400 pb-1"></th>
                {compareA && <th className="text-center font-medium text-gray-600 pb-1">A</th>}
                {compareB && <th className="text-center font-medium text-gray-600 pb-1">B</th>}
              </tr>
            </thead>
            <tbody>
              {selectedProcKeys.map(key => {
                const proc    = procedures.find(p => p.key === key)!
                const catEng  = PROC_TO_CATEGORY[key] ?? ''
                const pA      = resultA?.procBreakdown.find(p => p.key === key)
                const pB      = resultB?.procBreakdown.find(p => p.key === key)
                const isOpen  = expandedProcKey === key
                const itemsA  = compareA?.priceItems.filter(i => i.category === catEng) ?? []
                const itemsB  = compareB?.priceItems.filter(i => i.category === catEng) ?? []
                const hasItems = itemsA.length > 0 || itemsB.length > 0
                const cols    = 1 + (compareA ? 1 : 0) + (compareB ? 1 : 0)
                return (
                  <Fragment key={key}>
                    <tr className="border-b border-gray-50">
                      <td className="py-1 pl-1">
                        <button
                          onClick={() => setExpandedProcKey(isOpen ? null : key)}
                          disabled={!hasItems}
                          className={`flex items-center gap-1 text-xs ${hasItems ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 cursor-default'}`}
                        >
                          <span className="w-2.5 text-center opacity-60">{isOpen ? '▾' : hasItems ? '▸' : ''}</span>
                          {proc.label}
                        </button>
                      </td>
                      {compareA && <td className={`py-1 text-center text-xs ${pA?.isActual ? 'text-gray-700' : 'text-gray-400'}`}>{pA ? fmt(pA.price) : '—'}</td>}
                      {compareB && <td className={`py-1 text-center text-xs ${pB?.isActual ? 'text-gray-700' : 'text-gray-400'}`}>{pB ? fmt(pB.price) : '—'}</td>}
                    </tr>
                    {isOpen && hasItems && (
                      <tr>
                        <td colSpan={cols} className="pb-2 pt-0.5 px-1">
                          <div className="bg-gray-50 border border-gray-100 p-2 space-y-2">
                            {compareA && itemsA.length > 0 && (
                              <div>
                                {compareB && <p className="text-xs font-semibold text-gray-500 mb-1">A</p>}
                                <div className="space-y-0.5">
                                  {itemsA.map((item, idx) => (
                                    <label key={`a-${idx}-${item.name}`} className="flex items-center gap-1.5 cursor-pointer">
                                      <input type="checkbox"
                                        checked={customSelA.has(item.name)}
                                        onChange={() => setCustomSelA(prev => { const n = new Set(prev); n.has(item.name) ? n.delete(item.name) : n.add(item.name); return n })}
                                        className="w-3 h-3 flex-shrink-0 cursor-pointer accent-gray-900"
                                      />
                                      <span className="text-xs text-gray-600 flex-1 min-w-0 leading-tight truncate">{item.name}</span>
                                      <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{item.usd ? fmt(item.usd) : item.krw > 0 ? fmt(Math.round(item.krw / 1350)) : '—'}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                            {compareB && itemsB.length > 0 && (
                              <div className={compareA && itemsA.length > 0 ? 'border-t border-gray-200 pt-2' : ''}>
                                {compareA && <p className="text-xs font-semibold text-gray-500 mb-1">B</p>}
                                <div className="space-y-0.5">
                                  {itemsB.map((item, idx) => (
                                    <label key={`b-${idx}-${item.name}`} className="flex items-center gap-1.5 cursor-pointer">
                                      <input type="checkbox"
                                        checked={customSelB.has(item.name)}
                                        onChange={() => setCustomSelB(prev => { const n = new Set(prev); n.has(item.name) ? n.delete(item.name) : n.add(item.name); return n })}
                                        className="w-3 h-3 flex-shrink-0 cursor-pointer accent-gray-900"
                                      />
                                      <span className="text-xs text-gray-600 flex-1 min-w-0 leading-tight truncate">{item.name}</span>
                                      <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{item.usd ? fmt(item.usd) : item.krw > 0 ? fmt(Math.round(item.krw / 1350)) : '—'}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              <tr className="border-b border-gray-100">
                <td className="py-1.5 text-gray-500 font-medium">
                  Surgery{(surgeryOverrideA || surgeryOverrideB) && <span className="ml-1 text-amber-600">★</span>}
                </td>
                {compareA && <td className={`py-1.5 text-center font-medium ${surgeryOverrideA ? 'text-amber-700' : 'text-gray-700'}`}>{resultA ? fmt(resultA.surgery) : '—'}</td>}
                {compareB && <td className={`py-1.5 text-center font-medium ${surgeryOverrideB ? 'text-amber-700' : 'text-gray-700'}`}>{resultB ? fmt(resultB.surgery) : '—'}</td>}
              </tr>
              {[
                { label: 'Flight',    a: resultA?.flight,    b: resultB?.flight    },
                { label: 'Hotel',     a: resultA?.hotel,     b: resultB?.hotel     },
                { label: 'Food',      a: resultA?.food,      b: resultB?.food      },
                { label: 'Transport', a: resultA?.transport, b: resultB?.transport },
              ].map(row => (
                <tr key={row.label} className="border-b border-gray-100">
                  <td className="py-1.5 text-gray-400">{row.label}</td>
                  {compareA && <td className="py-1.5 text-center text-gray-700">{row.a ? fmt(row.a) : '—'}</td>}
                  {compareB && <td className="py-1.5 text-center text-gray-700">{row.b ? fmt(row.b) : '—'}</td>}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-2 font-semibold text-gray-900">Total</td>
                {compareA && <td className="py-2 text-center font-semibold">{resultA ? fmt(resultA.total) : '—'}</td>}
                {compareB && <td className="py-2 text-center font-semibold">{resultB ? fmt(resultB.total) : '—'}</td>}
              </tr>
            </tfoot>
          </table>
          {(surgeryOverrideA || surgeryOverrideB) && (
            <div className="flex items-center justify-between mt-1">
              <p className="text-amber-700">★ From price comparison</p>
              <button onClick={() => { setSurgeryOverrideA(null); setSurgeryOverrideB(null) }} className="text-gray-400 hover:text-gray-700 underline">Reset</button>
            </div>
          )}
          {(resultA?.usSaving || resultB?.usSaving) && (
            <div className="bg-gray-900 text-white p-3 mt-2">
              <p className="text-gray-400 mb-1">vs US total</p>
              <dl className="grid grid-cols-2 gap-2">
                {resultA && compareA && <div><dt className="text-gray-400">{compareA.name.split(' ')[0]}</dt><dd className="text-sm font-semibold">Save {fmt(resultA.usSaving)}</dd></div>}
                {resultB && compareB && <div><dt className="text-gray-400">{compareB.name.split(' ')[0]}</dt><dd className="text-sm font-semibold">Save {fmt(resultB.usSaving)}</dd></div>}
              </dl>
            </div>
          )}
          <p className="text-gray-400 mt-2">~ Estimates only. Costs may vary.</p>
        </section>
      ) : hasAny ? (
        <p className="text-gray-400 text-center py-4">Select procedures in the filter to see estimate</p>
      ) : (
        <p className="text-gray-400 text-center py-4">Select a clinic to see cost estimate</p>
      )}
    </div>
  )

  if (loading) return <div role="status" className="flex items-center justify-center h-screen"><p className="text-sm text-gray-400">Loading clinics...</p></div>
  if (error)   return <div role="alert" className="flex items-center justify-center h-screen"><p className="text-sm text-red-400">{error}</p></div>

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">

      {/* ── Start Here 안내 바 ─────────────────────────────── */}
      <div className="hidden lg:flex flex-shrink-0 justify-center items-center gap-2 px-6 py-2 border-b border-gray-100 bg-gray-50 text-xs text-gray-400">
        <span className="font-medium text-gray-600">Start here</span>
        <span>①  Set departure city &amp; dates in the header above</span>
        <span className="text-gray-300">·</span>
        <span>②  Filter by procedure</span>
        <span className="text-gray-300">·</span>
        <span>③  Click two clinics to compare costs</span>
      </div>

      <div className="flex-1 min-h-0 w-full max-w-[1400px] mx-auto px-4 py-4">
      {/* ── Main 3-column layout ──────────────────────────── */}
      <div className="flex gap-4 h-full">

        {/* Col 1: Filter sidebar */}
        <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 border border-gray-200 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Filter</span>
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setActiveCategories(new Set())
                  setActiveMethodTags(new Set())
                  setActiveMaterialTags(new Set())
                  setPriceOnly(false)
                }}
                className="text-xs text-gray-400 hover:text-gray-700 underline"
              >
                Reset all
              </button>
            )}
          </div>

          {/* 부위 */}
          <Section id="body" title="Body Part">
            <div className="flex flex-wrap gap-1.5">
              {BODY_PARTS.map(cat => (
                <TagChip
                  key={cat.value}
                  label={cat.label}
                  active={activeCategories.has(cat.value)}
                  onClick={() => toggleSet(activeCategories, cat.value, setActiveCategories)}
                />
              ))}
            </div>
          </Section>

          {/* 방법 */}
          <Section id="method" title="Technique">
            <div className="flex flex-wrap gap-1.5">
              {METHOD_TAGS.map(tag => (
                <TagChip
                  key={tag}
                  label={tag}
                  active={activeMethodTags.has(tag)}
                  onClick={() => toggleSet(activeMethodTags, tag, setActiveMethodTags)}
                />
              ))}
            </div>
          </Section>

          {/* 재료 */}
          <Section id="material" title="Material">
            <div className="flex flex-wrap gap-1.5">
              {MATERIAL_TAGS.map(tag => (
                <TagChip
                  key={tag}
                  label={tag}
                  active={activeMaterialTags.has(tag)}
                  onClick={() => toggleSet(activeMaterialTags, tag, setActiveMaterialTags)}
                />
              ))}
            </div>
          </Section>

          {/* 가격 */}
          <Section id="price" title="Price">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setPriceOnly(p => !p)}
                className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${priceOnly ? 'bg-gray-900' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${priceOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-xs text-gray-700">With pricing only</span>
            </label>
          </Section>
        </aside>

        {/* Col 2: Clinic list */}
        <section className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">{filtered.length} clinics</p>
            <div className="flex gap-2">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs border border-gray-200 px-2 py-1.5 focus:outline-none text-gray-500">
                <option value="default">Sort: Default</option>
                <option value="actual-first">Confirmed prices first</option>
                <option value="price-asc">Price: Low to high</option>
              </select>
              <input type="search" placeholder="Search..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="text-xs border border-gray-200 px-3 py-1.5 w-36 focus:outline-none focus:border-gray-400" />
            </div>
          </div>

          {/* Active filter chips row */}
          {activeFilterCount > 0 && (
            <ul className="flex flex-wrap gap-1.5 mb-3" aria-label="Active filters">
              {[...activeCategories].map(cat => (
                <li key={cat}>
                  <button onClick={() => toggleSet(activeCategories, cat, setActiveCategories)}
                    className="text-xs bg-gray-900 text-white px-2.5 py-1 flex items-center gap-1.5 hover:bg-gray-700">
                    {cat} <span aria-hidden="true" className="opacity-60">×</span>
                  </button>
                </li>
              ))}
              {[...activeMethodTags].map(tag => (
                <li key={tag}>
                  <button onClick={() => toggleSet(activeMethodTags, tag, setActiveMethodTags)}
                    className="text-xs bg-gray-700 text-white px-2.5 py-1 flex items-center gap-1.5 hover:bg-gray-600">
                    {tag} <span aria-hidden="true" className="opacity-60">×</span>
                  </button>
                </li>
              ))}
              {[...activeMaterialTags].map(tag => (
                <li key={tag}>
                  <button onClick={() => toggleSet(activeMaterialTags, tag, setActiveMaterialTags)}
                    className="text-xs bg-gray-500 text-white px-2.5 py-1 flex items-center gap-1.5 hover:bg-gray-400">
                    {tag} <span aria-hidden="true" className="opacity-60">×</span>
                  </button>
                </li>
              ))}
              {priceOnly && (
                <li>
                  <button onClick={() => setPriceOnly(false)}
                    className="text-xs border border-gray-400 text-gray-600 px-2.5 py-1 flex items-center gap-1.5 hover:border-gray-700">
                    With pricing only <span aria-hidden="true" className="opacity-60">×</span>
                  </button>
                </li>
              )}
            </ul>
          )}

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-12">No clinics found</p>
            )}
            <ul className="space-y-2">
              {filtered.map((clinic, i) => {
                const slot = getSlot(clinic.id)
                const priceRange = getDisplayRange(clinic, activeCategories)
                return (
                  <li key={clinic.id || String(i)}>
                  <article
                    className={`border transition-all ${
                      slot ? 'border-gray-900'
                      : hoveredId === clinic.id ? 'border-gray-300'
                      : 'border-gray-100'
                    }`}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-pressed={!!slot}
                      className={`p-3 cursor-pointer transition-colors ${slot ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                      onClick={() => selectClinic(clinic)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectClinic(clinic) } }}
                      onMouseEnter={() => setHoveredId(clinic.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-medium text-gray-900 truncate">{clinic.name}</h3>
                              {slot && <span className="text-xs bg-gray-900 text-white px-1.5 py-0.5 flex-shrink-0">{slot}</span>}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{clinic.district}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {priceRange ? (
                            <p className="text-sm font-semibold text-gray-900">
                              ${Math.round(priceRange.min / 1350).toLocaleString()}
                              {priceRange.max > priceRange.min && (
                                <span className="text-gray-400 font-normal text-xs"> ~ ${Math.round(priceRange.max / 1350).toLocaleString()}</span>
                              )}
                            </p>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>
                      </div>
                      {clinic.specialties.length > 0 && (
                        <ul className="flex flex-wrap gap-1 mt-2">
                          {clinic.specialties
                            .filter(s => activeCategories.size === 0 || activeCategories.has(s))
                            .slice(0, 5)
                            .map(s => (
                              <li key={s} className={`text-xs px-1.5 py-0.5 border ${
                                activeCategories.has(s) ? 'border-gray-400 text-gray-600' : 'border-gray-100 text-gray-400'
                              }`}>{s}</li>
                            ))}
                        </ul>
                      )}
                    </div>

                  </article>
                  </li>
                )
              })}
            </ul>

            {/* Suggest form */}
            <div className="border-t border-gray-100 py-3 mt-2 px-1">
              {suggestDone ? (
                <p className="text-xs text-gray-500">Thank you for your suggestion ✓</p>
              ) : (
                <form onSubmit={handleSuggest} className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-400 flex-shrink-0">Can't find the clinic you're looking for?</span>
                  <input type="text" placeholder="Clinic name" value={suggestName}
                    onChange={e => setSuggestName(e.target.value)}
                    className="text-xs border border-gray-200 px-2 py-1.5 w-48 focus:outline-none focus:border-gray-400" />
                  <button type="submit" disabled={suggestSubmitting || !suggestName.trim()}
                    className="text-xs px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-40 transition-colors">
                    {suggestSubmitting ? '...' : 'Suggest →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Col 3: Trip Summary */}
        <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 border border-gray-200 overflow-hidden">
          <header className="bg-gray-900 text-white px-4 py-3 flex-shrink-0 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide">Trip Summary</h2>
            <div className="flex gap-0.5">
              <button
                onClick={() => setSummaryTab('cost')}
                className={`text-xs px-2.5 py-1 transition-colors ${summaryTab === 'cost' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}
              >Cost</button>
              <button
                onClick={() => setSummaryTab('map')}
                className={`text-xs px-2.5 py-1 transition-colors ${summaryTab === 'map' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}
              >Map</button>
            </div>
          </header>
          {summaryTab === 'cost' ? (
            <div className="overflow-y-auto flex-1">{tripSummaryContent}</div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <CompareMap
                hospitalA={compareA?.lat ? { name: compareA.name, lat: compareA.lat, lng: compareA.lng! } : null}
                hospitalB={compareB?.lat ? { name: compareB.name, lat: compareB.lat, lng: compareB.lng! } : null}
                className="w-full h-full"
              />
            </div>
          )}
          {hasAny && hasPriceData && (
            <div className="flex-shrink-0 border-t border-gray-200 p-3">
              <button
                onClick={() => setShowReceipt(true)}
                className="w-full text-xs bg-gray-900 text-white py-2.5 font-semibold hover:bg-gray-700 transition-colors"
              >
                Price Comparison ({[compareA, compareB].filter(Boolean).length}) →
              </button>
            </div>
          )}
        </aside>
      </div>
      </div>

      {/* Floating — mobile */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {hasAny && hasPriceData && (
          <button onClick={() => setShowReceipt(true)}
            className="bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 shadow-lg hover:bg-gray-700 border border-gray-700">
            Prices →
          </button>
        )}
        <button onClick={() => setShowCalcDrawer(true)}
          className="bg-white text-gray-900 text-xs font-semibold px-4 py-2.5 shadow-lg hover:bg-gray-50 border border-gray-300">
          Trip Summary ↑
        </button>
      </div>

      {showReceipt && (
        <ReceiptCompare clinicA={compareA} clinicB={compareB}
          onClose={() => setShowReceipt(false)} onSelectPrices={handleSelectPrices}
          initialCheckedA={customSelA} initialCheckedB={customSelB} />
      )}

      {showCalcDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCalcDrawer(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white max-h-[85vh] overflow-y-auto">
            <header className="flex items-center justify-between px-5 py-3 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-sm font-semibold">Trip Summary</h2>
              <button onClick={() => setShowCalcDrawer(false)} className="text-xs text-gray-400 hover:text-gray-900 px-2 py-1 border border-gray-200">Close ✕</button>
            </header>
            {tripSummaryContent}
          </div>
        </div>
      )}
    </div>
  )
}
