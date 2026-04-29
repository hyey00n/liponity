'use client'
import { useState } from 'react'
import clinicsData from '@/data/clinics.json'
import {
  PROCEDURE_COST, CITIES, MONTHS, ACCOMMODATION, calculateTrip,
} from '@/data/calculator'

type Step = 'procedure' | 'clinic' | 'city' | 'stay' | 'result'

const STEPS: Step[] = ['procedure', 'clinic', 'city', 'stay', 'result']

const fmt = (n: number) => `$${n.toLocaleString()}`

export default function TripCostCalculator() {
  const [step, setStep] = useState<Step>('procedure')
  const [procedure, setProcedure] = useState('')
  const [clinicId, setClinicId] = useState<string | 'avg'>('avg')
  const [city, setCity] = useState('LAX')
  const [month, setMonth] = useState('Feb')
  const [weekIndex, setWeekIndex] = useState(1)
  const [nights, setNights] = useState(14)
  const [accommodation, setAccommodation] = useState<keyof typeof ACCOMMODATION>('mid')

  const go = (s: Step) => setStep(s)

  const eligibleClinics = clinicsData.filter(
    (c) => procedure in c.pricing
  )

  const selectedClinic = clinicId !== 'avg'
    ? clinicsData.find((c) => c.id === clinicId) ?? null
    : null

  const clinicPrice = selectedClinic
    ? (selectedClinic.pricing[procedure]?.price ?? null)
    : null

  const result = step === 'result'
    ? calculateTrip({ procedure, clinicPrice, city, month, weekIndex, nights, accommodation })
    : null

  const selectClass = 'w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400'
  const btnClass = (active: boolean) =>
    `text-left border px-3 py-2.5 text-sm transition-colors ${
      active
        ? 'border-gray-900 bg-gray-900 text-white'
        : 'border-gray-200 text-gray-600 hover:border-gray-400'
    }`

  const stepLabel = { procedure: '1', clinic: '2', city: '3', stay: '4', result: '✓' }

  return (
    <div className="max-w-xl border border-gray-200">
      {/* 진행 표시 */}
      <div className="flex border-b border-gray-200">
        {(['procedure', 'clinic', 'city', 'stay'] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`flex-1 py-2 text-center text-xs border-r last:border-r-0 border-gray-200 ${
              step === s
                ? 'bg-gray-900 text-white'
                : STEPS.indexOf(step) > i
                  ? 'text-gray-400 cursor-pointer hover:bg-gray-50'
                  : 'text-gray-300'
            }`}
            onClick={() => STEPS.indexOf(step) > i && go(s)}
          >
            {stepLabel[s]}
          </div>
        ))}
      </div>

      <div className="p-6">

        {/* Step 1: 시술 선택 */}
        {step === 'procedure' && (
          <div>
            <p className="text-xs text-gray-400 mb-4">Which procedure are you considering?</p>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(PROCEDURE_COST).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => { setProcedure(key); setClinicId('avg') }}
                  className={btnClass(procedure === key)}
                >
                  <span className="font-medium">{val.label}</span>
                  <span className={`ml-2 text-xs ${procedure === key ? 'text-gray-300' : 'text-gray-400'}`}>
                    ~{fmt(val.avg)} Korea avg
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => go('clinic')}
              disabled={!procedure}
              className="mt-6 w-full border border-gray-900 py-2.5 text-sm font-medium
                hover:bg-gray-900 hover:text-white transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2: 클리닉 선택 */}
        {step === 'clinic' && (
          <div>
            <p className="text-xs text-gray-400 mb-1">
              Select a clinic for <span className="text-gray-700">{PROCEDURE_COST[procedure]?.label}</span>
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Actual prices shown where available.
            </p>
            <div className="space-y-2">
              {eligibleClinics.map((clinic) => {
                const p = clinic.pricing[procedure]
                return (
                  <button
                    key={clinic.id}
                    onClick={() => setClinicId(clinic.id)}
                    className={`w-full ${btnClass(clinicId === clinic.id)}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{clinic.name}</span>
                      <span className={`text-xs ${clinicId === clinic.id ? 'text-gray-300' : 'text-gray-400'}`}>
                        {p.price != null
                          ? `${fmt(p.price)} ${p.isActual ? '(actual)' : '(est.)'}`
                          : `~${fmt(PROCEDURE_COST[procedure]?.avg)} avg`}
                      </span>
                    </div>
                    {p.note && (
                      <p className={`text-xs mt-0.5 ${clinicId === clinic.id ? 'text-gray-400' : 'text-gray-400'}`}>
                        {p.note}
                      </p>
                    )}
                  </button>
                )
              })}

              <button
                onClick={() => setClinicId('avg')}
                className={`w-full ${btnClass(clinicId === 'avg')}`}
              >
                <div className="flex justify-between items-center">
                  <span>Use average estimate</span>
                  <span className={`text-xs ${clinicId === 'avg' ? 'text-gray-300' : 'text-gray-400'}`}>
                    ~{fmt(PROCEDURE_COST[procedure]?.avg)}
                  </span>
                </div>
              </button>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => go('procedure')} className="flex-1 border border-gray-200 py-2.5 text-sm text-gray-500 hover:border-gray-400">
                ← Back
              </button>
              <button onClick={() => go('city')} className="flex-1 border border-gray-900 py-2.5 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 도시 + 월 */}
        {step === 'city' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Departure City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
                {CITIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Month</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass}>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Period</label>
                <select value={weekIndex} onChange={(e) => setWeekIndex(Number(e.target.value))} className={selectClass}>
                  <option value={0}>Early (1–10)</option>
                  <option value={1}>Mid (11–20)</option>
                  <option value={2}>Late (21–31)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => go('clinic')} className="flex-1 border border-gray-200 py-2.5 text-sm text-gray-500 hover:border-gray-400">
                ← Back
              </button>
              <button onClick={() => go('stay')} className="flex-1 border border-gray-900 py-2.5 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 체류기간 */}
        {step === 'stay' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Stay: {nights} nights
              </label>
              <input
                type="range" min={7} max={21} step={1}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>7 nights</span><span>21 nights</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Accommodation</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(ACCOMMODATION) as [keyof typeof ACCOMMODATION, { label: string; perNight: number }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setAccommodation(key)}
                    className={`text-left border px-3 py-2 text-xs transition-colors ${
                      accommodation === key
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    <div>{val.label}</div>
                    <div className={`mt-0.5 ${accommodation === key ? 'text-gray-400' : 'text-gray-400'}`}>
                      ${val.perNight}/night
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => go('city')} className="flex-1 border border-gray-200 py-2.5 text-sm text-gray-500 hover:border-gray-400">
                ← Back
              </button>
              <button
                onClick={() => go('result')}
                className="flex-1 border border-gray-900 py-2.5 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors"
              >
                Calculate
              </button>
            </div>
          </div>
        )}

        {/* 결과 */}
        {step === 'result' && result && (
          <div>
            <div className="text-xs text-gray-400 mb-5">
              {PROCEDURE_COST[procedure]?.label}
              {selectedClinic && <> · {selectedClinic.name}</>}
              {' · '}{result.season} season
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Procedure
                  <span className="ml-1.5 text-xs">
                    ({result.isActualPrice ? 'clinic price' : 'avg estimate'})
                  </span>
                </span>
                <span className="text-gray-900">{fmt(result.procedurePrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Flight ({city})</span>
                <span className="text-gray-900">{fmt(result.flight)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Hotel ({nights} nights)</span>
                <span className="text-gray-900">{fmt(result.accommodation)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Food & misc</span>
                <span className="text-gray-900">{fmt(result.other)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-3 border-t border-gray-200">
                <span>Total (Korea trip)</span>
                <span>{fmt(result.total)}</span>
              </div>
            </div>

            {result.usSavings > 0 && (
              <div className="border border-gray-200 p-4 text-center mb-5">
                <p className="text-xs text-gray-400 mb-1">vs. getting it done in the US</p>
                <p className="text-2xl font-semibold text-gray-900">
                  You save {fmt(result.usSavings)}
                </p>
                <p className="text-xs text-gray-400 mt-1">including flight & hotel</p>
              </div>
            )}

            {result.season === 'Peak' && (
              <p className="text-xs text-gray-400 mb-5">
                Feb is typically 15% cheaper for flights from the US.
              </p>
            )}

            <button
              onClick={() => { setStep('procedure'); setProcedure(''); setClinicId('avg') }}
              className="w-full border border-gray-200 py-2.5 text-sm text-gray-500 hover:border-gray-400 transition-colors"
            >
              Start over
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
