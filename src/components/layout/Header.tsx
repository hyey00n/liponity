'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useTravelContext } from '@/context/travel'
import CALC_DATA from '@/data/calculator.json'

const calcData = CALC_DATA as typeof CALC_DATA
function fmt(n: number) { return `$${n.toLocaleString()}` }

const NAV = [
  { label: 'Guide', href: '/guide' },
]

export default function Header() {
  const [open, setOpen]               = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const travel    = useTravelContext()

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node))
        setActiveDropdown(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const cityData   = calcData.cities.find(c => c.code === travel.city)
  const cityLabel  = cityData?.label ?? travel.city
  const estFlight  = Math.round(
    (cityData?.flight ?? 0) *
    ((calcData.seasonMultiplier as Record<string, number[]>)[travel.month][1])
  )
  const accomLabel = (calcData.accommodation[travel.accommodation] as { label: string; perNight: number })
    .label.split(' ')[0]

  const flightDisplay = travel.flightOverride
    ? `$${Number(travel.flightOverride.replace(/,/g, '')).toLocaleString()}`
    : `~${fmt(estFlight)}`

  return (
    <header ref={headerRef} className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="text-sm font-semibold tracking-tight flex-shrink-0">
          Plainkost
        </Link>

        {/* Center: compact travel bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex border border-gray-200 divide-x divide-gray-200 text-xs">

            {/* From */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(d => d === 'city' ? null : 'city')}
                className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${activeDropdown === 'city' ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              >
                <span className="text-gray-400">From</span>
                <span className="font-medium text-gray-900">{cityLabel}</span>
              </button>
              {activeDropdown === 'city' && (
                <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-lg p-4 mt-1 w-64">
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Departure city</p>
                  <div className="space-y-1">
                    {calcData.cities.map(c => (
                      <button key={c.code} onClick={() => { travel.setCity(c.code); setActiveDropdown(null) }}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${travel.city === c.code ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Flight */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(d => d === 'flight' ? null : 'flight')}
                className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${activeDropdown === 'flight' ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              >
                <span className="text-gray-400">Flight</span>
                <span className={`font-medium ${travel.flightOverride ? 'text-gray-900' : 'text-gray-400'}`}>
                  {flightDisplay}
                </span>
                {travel.flightOverride && (
                  <span className="text-xs text-blue-500 font-medium">✓</span>
                )}
              </button>
              {activeDropdown === 'flight' && (
                <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-lg p-4 mt-1 w-72">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Flight (round-trip)</p>
                    {travel.flightOverride && (
                      <button onClick={() => travel.setFlightOverride('')} className="text-xs text-gray-400 hover:text-gray-700">
                        Reset to estimate
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Estimated: <span className="text-gray-600">{fmt(estFlight)}</span>
                  </p>
                  <input
                    type="text" inputMode="numeric" placeholder="Enter your actual flight price ($)"
                    value={travel.flightOverride} onChange={e => travel.setFlightOverride(e.target.value)}
                    className={`text-xs border px-2 py-2 w-full focus:outline-none transition-colors mb-2 ${
                      travel.flightOverride ? 'border-gray-600 text-gray-900' : 'border-gray-200 text-gray-400'
                    }`}
                  />
                  <a
                    href={`https://www.google.com/travel/flights/search?q=flights+from+${cityLabel}+to+Seoul+Incheon`}
                    target="_blank" rel="noopener noreferrer"
                    className="block text-xs text-gray-400 hover:text-gray-700 underline mb-3"
                  >
                    Check Google Flights →
                  </a>
                  <button onClick={() => setActiveDropdown(null)} className="w-full text-xs bg-gray-900 text-white py-1.5 hover:bg-gray-700">
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* When */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(d => d === 'month' ? null : 'month')}
                className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${activeDropdown === 'month' ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              >
                <span className="text-gray-400">When</span>
                <span className="font-medium text-gray-900">{travel.month}</span>
              </button>
              {activeDropdown === 'month' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-lg p-4 mt-1 w-48">
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Travel month</p>
                  <div className="grid grid-cols-3 gap-1">
                    {calcData.months.map(m => (
                      <button key={m} onClick={() => { travel.setMonth(m); setActiveDropdown(null) }}
                        className={`py-1.5 text-sm transition-colors ${travel.month === m ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-100'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stay */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(d => d === 'duration' ? null : 'duration')}
                className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${activeDropdown === 'duration' ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              >
                <span className="text-gray-400">Stay</span>
                <span className="font-medium text-gray-900">{travel.nights}n · {accomLabel}</span>
              </button>
              {activeDropdown === 'duration' && (
                <div className="absolute top-full right-0 z-50 bg-white border border-gray-200 shadow-lg p-4 mt-1 w-64">
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Length of stay</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Nights</span>
                    <span className="text-lg font-semibold text-gray-900">{travel.nights}</span>
                  </div>
                  <input type="range" min={7} max={21} value={travel.nights}
                    onChange={e => travel.setNights(Number(e.target.value))} className="w-full mb-1" />
                  <div className="flex justify-between text-xs text-gray-400 mb-4"><span>7</span><span>21</span></div>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400 mb-2">Accommodation</p>
                    <div className="space-y-1">
                      {(Object.entries(calcData.accommodation) as [string, { label: string; perNight: number }][]).map(([k, v]) => (
                        <button key={k} onClick={() => travel.setAccommodation(k as keyof typeof calcData.accommodation)}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                            travel.accommodation === k ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-100'
                          }`}>
                          {v.label} <span className="opacity-60">${v.perNight}/n</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setActiveDropdown(null)} className="mt-3 w-full text-xs bg-gray-900 text-white py-1.5 hover:bg-gray-700">Done</button>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveDropdown(null)}
              className="px-4 bg-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <button className="md:hidden text-sm text-gray-500 flex-shrink-0" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 px-4 py-4 space-y-3">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="block text-sm text-gray-700" onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
