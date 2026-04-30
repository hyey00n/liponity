'use client'
import { useEffect, useState } from 'react'
import PROCEDURES_DATA from '@/data/procedures.json'
import CALC_DATA from '@/data/calculator.json'
import CompareMap from '@/components/CompareMap';

type Clinic = {
  id: string
  name: string
  specialties: string[]
  hours: string
  address: string
  district: string
  pricing: Record<string, { price: number | null; isActual: boolean }>
}
type Procedure = { key: string; label: string; koreaAvg: number; usAvg: number }
type CalcResult = {
  surgery: number; isActual: boolean
  flight: number; hotel: number; other: number; total: number; usSaving: number
}

const procedures = PROCEDURES_DATA as Procedure[]
const calcData = CALC_DATA as typeof CALC_DATA

const CATEGORIES = [
  { label: 'All',          value: 'all' },
  { label: 'Eye',          value: '눈' },
  { label: 'Nose',         value: '코' },
  { label: 'Breast',       value: '가슴' },
  { label: 'Lifting',      value: '리프팅' },
  { label: 'Contouring',   value: '안면윤곽' },
  { label: 'Liposuction',  value: '지방흡입' },
  { label: 'Fat Grafting', value: '지방이식' },
  { label: 'Package',      value: '복합' },
]

function getPrice(clinic: Clinic, procedureKey: string) {
  const found = clinic.pricing?.[procedureKey]
  const proc = procedures.find(p => p.key === procedureKey)
  if (!proc) return null
  if (found?.isActual && found.price) return { price: found.price, isActual: true }
  return { price: proc.koreaAvg, isActual: false }
}

function fmt(n: number) { return `$${n.toLocaleString()}` }






export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

useEffect(() => {
  fetch('/api/clinics')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setClinics(data)
      } else {
        console.error('API response:', data)
        setError(data.error || 'Invalid response format')
      }
      setLoading(false)
    })
    .catch(err => {
      console.error(err)
      setError('Failed to load clinics')
      setLoading(false)
    })
}, [])

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const [compareA, setCompareA] = useState<Clinic | null>(null)
  const [compareB, setCompareB] = useState<Clinic | null>(null)

  const [procedure, setProcedure] = useState(procedures[0]?.key ?? '')
  const [city, setCity] = useState(calcData.cities[0].code)
  const [month, setMonth] = useState('Feb')
  const [weekIndex, setWeekIndex] = useState(1)
  const [nights, setNights] = useState(14)
  const [accommodation, setAccommodation] =
    useState<keyof typeof calcData.accommodation>('mid')

  const [resultA, setResultA] = useState<CalcResult | null>(null)
  const [resultB, setResultB] = useState<CalcResult | null>(null)

  const filtered = clinics.filter(c => {
    const matchCat = activeCategory === 'all' || c.specialties.includes(activeCategory)
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const selectedProc = procedures.find(p => p.key === procedure)

  function getSlot(id: string) {
    if (compareA?.id === id) return 'A'
    if (compareB?.id === id) return 'B'
    return null
  }

  function selectClinic(clinic: Clinic) {
    if (compareA?.id === clinic.id) { setCompareA(null); setResultA(null); return }
    if (compareB?.id === clinic.id) { setCompareB(null); setResultB(null); return }
    if (!compareA) { setCompareA(clinic); setResultA(null); return }
    if (!compareB) { setCompareB(clinic); setResultB(null); return }
    setCompareA(clinic); setResultA(null)
  }

  function calcOne(clinic: Clinic): CalcResult | null {
    const priceInfo = getPrice(clinic, procedure)
    if (!priceInfo) return null
    const cityData = calcData.cities.find(c => c.code === city)!
    const multiplier = (calcData.seasonMultiplier as Record<string, number[]>)[month][weekIndex]
    const flight = Math.round(cityData.flight * multiplier)
    const hotel = calcData.accommodation[accommodation].perNight * nights
    const other = Math.round(calcData.fixedCosts.foodPerDay * nights + calcData.fixedCosts.misc)
    const total = priceInfo.price + flight + hotel + other
    const usSaving = (selectedProc?.usAvg ?? 0) - priceInfo.price
    return { surgery: priceInfo.price, isActual: priceInfo.isActual, flight, hotel, other, total, usSaving }
  }

  function handleCalculate() {
    if (compareA) setResultA(calcOne(compareA))
    if (compareB) setResultB(calcOne(compareB))
  }

  const hasAny = compareA || compareB

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-sm text-gray-400">Loading clinics...</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-sm text-red-400">{error}</p>
    </div>
  )

  return (
    <div className="max-w-[80rem] mx-auto px-4 py-8">

      {/* 부위 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
            className={`flex-shrink-0 text-xs px-5 py-2 border transition-colors ${
              activeCategory === cat.value
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}>
            {cat.label}
          </button>
        ))}
        <input
          type="text" placeholder="Search..."
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="ml-auto text-xs border border-gray-200 px-3 py-1.5 w-36 focus:outline-none focus:border-gray-400"
        />
      </div>

      {/* 3열 레이아웃 */}
      <div className="flex gap-4">

        {/* 1열 — 맵 sticky */}
        <div className="hidden md:block w-[500px] flex-shrink-0 sticky top-20 self-start">
          <div className="w-full h-[600px] bg-gray-50 border border-gray-200 relative overflow-hidden">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
            {filtered.slice(0, 24).map((clinic, i) => (
              <button key={clinic.id} onClick={() => selectClinic(clinic)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${12 + (i % 4) * 22}%`,
                  top: `${10 + Math.floor(i / 4) * 16}%`,
                }}>
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold transition-all ${
                  getSlot(clinic.id) ? 'bg-gray-900 scale-125'
                  : hoveredId === clinic.id ? 'bg-gray-600'
                  : 'bg-gray-400 hover:bg-gray-600'
                }`}>
                  {getSlot(clinic.id) ?? i + 1}
                </div>
              </button>
            ))}
            <p className="absolute bottom-2 left-2 text-xs text-gray-400">
              Google Maps API needed
            </p>
          </div>
        </div>

        {/* 2열 — 리스트 */}
        <div className="flex-1 space-y-2 overflow-y-auto max-h-[600px]">
          {filtered.map((clinic, i) => {
            const slot = getSlot(clinic.id)
            const priceInfo = getPrice(clinic, procedure)
            return (
              <div key={clinic.id}
                className={`border p-3 transition-all ${
                  slot ? 'border-gray-900 bg-gray-50'
                  : hoveredId === clinic.id ? 'border-gray-300'
                  : 'border-gray-100'
                }`}
                onMouseEnter={() => setHoveredId(clinic.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-gray-300 font-mono flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">{clinic.name}</span>
                    {slot && (
                      <span className="text-xs bg-gray-900 text-white px-1.5 py-0.5 flex-shrink-0">{slot}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {priceInfo && (
                      <span className="text-xs text-gray-500">
                        {fmt(priceInfo.price)}
                        <span className="text-gray-300 ml-0.5">{priceInfo.isActual ? '✓' : '~'}</span>
                      </span>
                    )}
                    <button onClick={() => selectClinic(clinic)}
                      className={`text-xs px-2 py-1 border transition-colors flex-shrink-0 ${
                        slot
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900'
                      }`}>
                      {slot ? `✓ ${slot}` : 'Select'}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {clinic.specialties.map(s => (
                    <span key={s} className="text-xs border border-gray-100 px-1.5 py-0.5 text-gray-400">{s}</span>
                  ))}
                  <span className="text-xs text-gray-300 ml-auto">{clinic.district}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 3열 — 선택내역 + 계산기 sticky */}
        <div className="hidden lg:block w-[260px] flex-shrink-0 sticky top-20 self-start">
          <div className="border border-gray-200 overflow-hidden">

            {/* 헤더 */}
            <div className="bg-gray-900 text-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide">Trip Summary</p>
            </div>

            <div className="p-4 space-y-4">

              {/* 선택된 병원 */}
              <div>
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Clinics</p>
                {[
                  { slot: 'A', clinic: compareA, onClear: () => { setCompareA(null); setResultA(null) } },
                  { slot: 'B', clinic: compareB, onClear: () => { setCompareB(null); setResultB(null) } },
                ].map(({ slot, clinic, onClear }) => (
                  <div key={slot} className={`flex items-center justify-between py-2 border-b border-gray-100 ${!clinic ? 'opacity-40' : ''}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs bg-gray-900 text-white px-1.5 py-0.5 flex-shrink-0">{slot}</span>
                      <span className="text-xs text-gray-700 truncate">
                        {clinic ? clinic.name : 'Not selected'}
                      </span>
                    </div>
                    {clinic && (
                      <button onClick={onClear} className="text-xs text-gray-300 hover:text-gray-900 ml-1">✕</button>
                    )}
                  </div>
                ))}
              </div>

              {/* 시술 선택 */}
              <div>
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Procedure</p>
                <select value={procedure}
                  onChange={e => { setProcedure(e.target.value); setResultA(null); setResultB(null) }}
                  className="text-xs border border-gray-200 px-2 py-1.5 w-full focus:outline-none focus:border-gray-400">
                  {procedures.map(p => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* 여행 조건 */}
              <div>
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Trip Details</p>
                <div className="space-y-2">
                  <select value={city} onChange={e => { setCity(e.target.value); setResultA(null); setResultB(null) }}
                    className="text-xs border border-gray-200 px-2 py-1.5 w-full focus:outline-none">
                    {calcData.cities.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <select value={month} onChange={e => { setMonth(e.target.value); setResultA(null); setResultB(null) }}
                    className="text-xs border border-gray-200 px-2 py-1.5 w-full focus:outline-none">
                    {calcData.months.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select value={accommodation}
                    onChange={e => { setAccommodation(e.target.value as keyof typeof calcData.accommodation); setResultA(null); setResultB(null) }}
                    className="text-xs border border-gray-200 px-2 py-1.5 w-full focus:outline-none">
                    {(Object.entries(calcData.accommodation) as [string, { label: string; perNight: number }][]).map(([key, val]) => (
                      <option key={key} value={key}>{val.label} (${val.perNight}/n)</option>
                    ))}
                  </select>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Stay</span>
                      <span className="font-medium text-gray-900">{nights} nights</span>
                    </div>
                    <input type="range" min={7} max={21} value={nights}
                      onChange={e => { setNights(Number(e.target.value)); setResultA(null); setResultB(null) }}
                      className="w-full" />
                  </div>
                </div>
              </div>

              {/* 계산 버튼 */}
              <button onClick={handleCalculate} disabled={!hasAny}
                className={`w-full py-2.5 text-xs font-semibold transition-colors ${
                  hasAny ? 'bg-gray-900 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}>
                Calculate →
              </button>

              {/* 결과 내역 */}
              {(resultA || resultB) && (
                <div>
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Cost Breakdown</p>

                  {/* 헤더 */}
                  <div className="grid grid-cols-3 gap-1 text-xs text-gray-400 mb-1">
                    <span></span>
                    {compareA && <span className="text-center font-medium text-gray-600">A</span>}
                    {compareB && <span className="text-center font-medium text-gray-600">B</span>}
                  </div>

                  {/* 항목별 */}
                  {[
                    { label: 'Surgery', a: resultA?.surgery, b: resultB?.surgery },
                    { label: 'Flight',  a: resultA?.flight,  b: resultB?.flight  },
                    { label: 'Hotel',   a: resultA?.hotel,   b: resultB?.hotel   },
                    { label: 'Misc',    a: resultA?.other,   b: resultB?.other   },
                  ].map(row => (
                    <div key={row.label} className="grid grid-cols-3 gap-1 py-1.5 border-b border-gray-100 text-xs">
                      <span className="text-gray-400">{row.label}</span>
                      {compareA && <span className="text-center text-gray-700">{row.a ? fmt(row.a) : '—'}</span>}
                      {compareB && <span className="text-center text-gray-700">{row.b ? fmt(row.b) : '—'}</span>}
                    </div>
                  ))}

                  {/* 총합 */}
                  <div className="grid grid-cols-3 gap-1 py-2 text-xs font-semibold">
                    <span className="text-gray-900">Total</span>
                    {compareA && <span className="text-center text-gray-900">{resultA ? fmt(resultA.total) : '—'}</span>}
                    {compareB && <span className="text-center text-gray-900">{resultB ? fmt(resultB.total) : '—'}</span>}
                  </div>

                  {/* Save */}
                  {(resultA?.usSaving || resultB?.usSaving) && (
                    <div className="bg-gray-900 text-white p-3 mt-2">
                      <p className="text-xs text-gray-400 mb-1">vs US average</p>
                      <div className="grid grid-cols-2 gap-2">
                        {resultA && compareA && (
                          <div>
                            <p className="text-xs text-gray-400">{compareA.name.split(' ')[0]}</p>
                            <p className="text-sm font-semibold">Save {fmt(resultA.usSaving)}</p>
                          </div>
                        )}
                        {resultB && compareB && (
                          <div>
                            <p className="text-xs text-gray-400">{compareB.name.split(' ')[0]}</p>
                            <p className="text-sm font-semibold">Save {fmt(resultB.usSaving)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    ~ Estimates only. Costs may vary.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}