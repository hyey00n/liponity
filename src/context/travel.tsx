'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import CALC_DATA from '@/data/calculator.json'

const calcData = CALC_DATA as typeof CALC_DATA
type AccomKey = keyof typeof calcData.accommodation

type TravelCtx = {
  city: string;            setCity: (v: string) => void
  month: string;           setMonth: (v: string) => void
  nights: number;          setNights: (v: number) => void
  accommodation: AccomKey; setAccommodation: (v: AccomKey) => void
  flightOverride: string;  setFlightOverride: (v: string) => void
}

const Ctx = createContext<TravelCtx | null>(null)
export function useTravelContext() { return useContext(Ctx)! }

export function TravelProvider({ children }: { children: ReactNode }) {
  const [city, setCity]                         = useState(calcData.cities[0].code)
  const [month, setMonth]                       = useState('Feb')
  const [nights, setNights]                     = useState(14)
  const [accommodation, setAccommodation]       = useState<AccomKey>('mid')
  const [flightOverride, setFlightOverride]     = useState('')
  return (
    <Ctx.Provider value={{ city, setCity, month, setMonth, nights, setNights, accommodation, setAccommodation, flightOverride, setFlightOverride }}>
      {children}
    </Ctx.Provider>
  )
}
