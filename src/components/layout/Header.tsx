'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useTravelContext } from '@/context/travel'
import CALC_DATA from '@/data/calculator.json'

const calcData = CALC_DATA as typeof CALC_DATA
function fmt(n: number) { return `$${n.toLocaleString()}` }

const NAV = [{ label: 'Guide', href: '/guide' }]

export default function Header() {
  const [panelOpen, setPanelOpen]           = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const travel    = useTravelContext()

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setPanelOpen(false)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const cityData    = calcData.cities.find(c => c.code === travel.city)
  const cityLabel   = cityData?.label ?? travel.city
  const estFlight   = Math.round(
    (cityData?.flight ?? 0) *
    ((calcData.seasonMultiplier as Record<string, number[]>)[travel.month][1])
  )
  const accomLabel  = (calcData.accommodation[travel.accommodation] as { label: string; perNight: number })
    .label.split(' ')[0]
  const flightDisplay = travel.flightOverride
    ? `$${Number(travel.flightOverride.replace(/,/g, '')).toLocaleString()}`
    : `~${fmt(estFlight)}`

  const toggle = () => setPanelOpen(p => !p)

  return (
    <header ref={headerRef} className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="text-xl flex-shrink-0 font-bold"
          style={{ fontFamily: 'var(--font-libre-bodoni)' }}>
          Plainkost
        </Link>

        {/* Travel bar — desktop only */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex w-[610px] border border-gray-300 divide-x divide-gray-200 text-sm rounded-full shadow-sm">
            <button onClick={toggle}
              className={`w-[175px] py-2.5 flex items-center justify-center gap-1.5 transition-colors rounded-l-full ${panelOpen ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
              <span className="text-gray-400">From</span>
              <span className="font-medium text-gray-900">{cityLabel}</span>
            </button>
            <button onClick={toggle}
              className={`w-[130px] py-2.5 flex items-center justify-center gap-1.5 transition-colors ${panelOpen ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
              <span className="text-gray-400">Flight</span>
              <span className={`font-medium ${travel.flightOverride ? 'text-gray-900' : 'text-gray-400'}`}>
                {flightDisplay}
              </span>
              {travel.flightOverride && <span className="text-blue-500">✓</span>}
            </button>
            <button onClick={toggle}
              className={`w-[95px] py-2.5 flex items-center justify-center gap-1.5 transition-colors ${panelOpen ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
              <span className="text-gray-400">When</span>
              <span className="font-medium text-gray-900">{travel.month}</span>
            </button>
            <button onClick={toggle}
              className={`w-[160px] py-2.5 flex items-center justify-center gap-1.5 transition-colors ${panelOpen ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
              <span className="text-gray-400">Stay</span>
              <span className="font-medium text-gray-900">{travel.nights}n · {accomLabel}</span>
            </button>
            <button onClick={() => setPanelOpen(false)}
              className="flex-1 py-2.5 bg-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors rounded-r-full">
              →
            </button>
          </div>
        </div>

        {/* Nav — desktop only */}
        <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden ml-auto p-1 flex-shrink-0 text-gray-700"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* ── Desktop unified settings panel ─────────────────────── */}
      {panelOpen && (
        <div className="hidden md:block absolute left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-40">
          <div className="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-4 gap-8 divide-x divide-gray-100">

            {/* From */}
            <div className="pr-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Departure city</p>
              <div className="space-y-0.5">
                {calcData.cities.map(c => (
                  <button key={c.code} onClick={() => travel.setCity(c.code)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors rounded ${
                      travel.city === c.code ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flight */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Flight (round-trip)</p>
                {travel.flightOverride && (
                  <button onClick={() => travel.setFlightOverride('')}
                    className="text-xs text-gray-400 hover:text-gray-700 underline">Reset</button>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Estimated: <span className="text-gray-700 font-medium">{fmt(estFlight)}</span>
              </p>
              <input
                type="text" inputMode="numeric" placeholder="Enter your actual price ($)"
                value={travel.flightOverride}
                onChange={e => travel.setFlightOverride(e.target.value)}
                className={`text-sm border px-3 py-2 w-full focus:outline-none transition-colors mb-3 rounded ${
                  travel.flightOverride ? 'border-gray-600 text-gray-900' : 'border-gray-200 text-gray-400'
                }`}
              />
              <a href={`https://www.google.com/travel/flights/search?q=flights+from+${cityLabel}+to+Seoul+Incheon`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-gray-700 underline">
                Check Google Flights →
              </a>
            </div>

            {/* When */}
            <div className="px-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Travel month</p>
              <div className="grid grid-cols-3 gap-1">
                {calcData.months.map(m => (
                  <button key={m} onClick={() => travel.setMonth(m)}
                    className={`py-2 text-sm transition-colors rounded ${
                      travel.month === m ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-100'
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Stay */}
            <div className="pl-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Length of stay</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Nights</span>
                <span className="text-xl font-semibold text-gray-900">{travel.nights}</span>
              </div>
              <input type="range" min={7} max={21} value={travel.nights}
                onChange={e => travel.setNights(Number(e.target.value))}
                className="w-full mb-1 accent-gray-900" />
              <div className="flex justify-between text-xs text-gray-400 mb-4"><span>7n</span><span>21n</span></div>
              <p className="text-xs text-gray-400 mb-2">Accommodation</p>
              <div className="space-y-1">
                {(Object.entries(calcData.accommodation) as [string, { label: string; perNight: number }][]).map(([k, v]) => (
                  <button key={k} onClick={() => travel.setAccommodation(k as keyof typeof calcData.accommodation)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors rounded ${
                      travel.accommodation === k ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-100'
                    }`}>
                    {v.label} <span className="opacity-50">${v.perNight}/n</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 px-6 py-3 flex justify-end max-w-[1400px] mx-auto">
            <button onClick={() => setPanelOpen(false)}
              className="text-sm bg-gray-900 text-white px-6 py-2 hover:bg-gray-700 transition-colors rounded-full">
              Done →
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile menu ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <nav className="md:hidden absolute left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">

          {/* Departure city */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Departure city</p>
            <div className="grid grid-cols-2 gap-1">
              {calcData.cities.map(c => (
                <button key={c.code} onClick={() => travel.setCity(c.code)}
                  className={`text-left px-3 py-2.5 text-sm transition-colors rounded ${
                    travel.city === c.code ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-100'
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flight */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Flight (round-trip)</p>
              {travel.flightOverride && (
                <button onClick={() => travel.setFlightOverride('')}
                  className="text-xs text-gray-400 hover:text-gray-700 underline">Reset</button>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Estimated: <span className="text-gray-700 font-medium">{fmt(estFlight)}</span>
            </p>
            <input
              type="text" inputMode="numeric" placeholder="Enter your actual price ($)"
              value={travel.flightOverride}
              onChange={e => travel.setFlightOverride(e.target.value)}
              className={`text-sm border px-3 py-2.5 w-full focus:outline-none transition-colors mb-3 rounded ${
                travel.flightOverride ? 'border-gray-600 text-gray-900' : 'border-gray-200 text-gray-400'
              }`}
            />
            <a href={`https://www.google.com/travel/flights/search?q=flights+from+${cityLabel}+to+Seoul+Incheon`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-700 underline">
              Check Google Flights →
            </a>
          </div>

          {/* Travel month */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Travel month</p>
            <div className="grid grid-cols-4 gap-1">
              {calcData.months.map(m => (
                <button key={m} onClick={() => travel.setMonth(m)}
                  className={`py-2.5 text-sm transition-colors rounded ${
                    travel.month === m ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-100'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Length of stay */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Length of stay</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Nights</span>
              <span className="text-xl font-semibold text-gray-900">{travel.nights}</span>
            </div>
            <input type="range" min={7} max={21} value={travel.nights}
              onChange={e => travel.setNights(Number(e.target.value))}
              className="w-full mb-1 accent-gray-900" />
            <div className="flex justify-between text-xs text-gray-400 mb-4"><span>7n</span><span>21n</span></div>
            <p className="text-xs text-gray-400 mb-2">Accommodation</p>
            <div className="grid grid-cols-2 gap-1">
              {(Object.entries(calcData.accommodation) as [string, { label: string; perNight: number }][]).map(([k, v]) => (
                <button key={k} onClick={() => travel.setAccommodation(k as keyof typeof calcData.accommodation)}
                  className={`text-left px-3 py-2.5 text-xs transition-colors rounded ${
                    travel.accommodation === k ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-100'
                  }`}>
                  {v.label} <span className="opacity-50">${v.perNight}/n</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nav + Done */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex gap-5">
              {NAV.map(n => (
                <Link key={n.href} href={n.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {n.label}
                </Link>
              ))}
            </div>
            <button onClick={() => setMobileMenuOpen(false)}
              className="text-sm bg-gray-900 text-white px-5 py-2 hover:bg-gray-700 transition-colors rounded-full">
              Done →
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
