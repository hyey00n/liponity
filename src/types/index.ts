export interface ClinicPricing {
  price: number | null
  isActual: boolean
  note?: string
}

export interface Clinic {
  id: string
  name: string
  specialties: string[]
  description: string
  district: string
  hours: string
  images: string[]
  pricing: Record<string, ClinicPricing>
}

export interface CalculatorResult {
  procedurePrice: number
  isActualPrice: boolean
  clinicName: string | null
  flight: number
  accommodation: number
  other: number
  total: number
  usSavings: number
  season: 'Peak' | 'Shoulder' | 'Off-peak'
}
