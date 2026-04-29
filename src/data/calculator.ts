export const BASE_FLIGHT_COST: Record<string, number> = {
  LAX: 950,
  SFO: 980,
  SEA: 880,
  ORD: 1100,
  JFK: 1200,
  DFW: 1050,
  MIA: 1150,
  IAD: 1100,
}

export const CITIES = [
  { code: 'LAX', label: 'Los Angeles (LAX)' },
  { code: 'SFO', label: 'San Francisco (SFO)' },
  { code: 'SEA', label: 'Seattle (SEA)' },
  { code: 'ORD', label: 'Chicago (ORD)' },
  { code: 'JFK', label: 'New York (JFK)' },
  { code: 'DFW', label: 'Dallas (DFW)' },
  { code: 'MIA', label: 'Miami (MIA)' },
  { code: 'IAD', label: 'Washington D.C. (IAD)' },
]

export const SEASON_MULTIPLIER: Record<string, [number, number, number]> = {
  Jan: [0.90, 0.85, 0.85],
  Feb: [0.85, 0.85, 0.90],
  Mar: [1.00, 1.05, 1.10],
  Apr: [1.15, 1.20, 1.15],
  May: [1.10, 1.10, 1.05],
  Jun: [1.10, 1.20, 1.30],
  Jul: [1.35, 1.40, 1.40],
  Aug: [1.40, 1.35, 1.25],
  Sep: [1.10, 0.95, 0.90],
  Oct: [0.95, 0.95, 1.00],
  Nov: [0.90, 0.90, 0.92],
  Dec: [0.95, 1.10, 1.35],
}

export const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
]

export const ACCOMMODATION = {
  budget:  { label: 'Guesthouse',   perNight: 55 },
  mid:     { label: '3-star Hotel', perNight: 95 },
  comfort: { label: '4-star Hotel', perNight: 160 },
  luxury:  { label: '5-star Hotel', perNight: 280 },
}

export const PROCEDURE_COST: Record<string, {
  label: string; avg: number; usAvg: number
}> = {
  liposuction1:   { label: 'Liposuction (1 area)',  avg: 3200,  usAvg: 7000  },
  liposuction2:   { label: 'Liposuction (2 areas)', avg: 5500,  usAvg: 12000 },
  vaser:          { label: 'VASER Liposuction',     avg: 4800,  usAvg: 10000 },
  lipo360:        { label: '360 Liposuction',       avg: 8500,  usAvg: 18000 },
  tummyTuck:      { label: 'Tummy Tuck',            avg: 5500,  usAvg: 12000 },
  bodyContouring: { label: 'Body Contouring',       avg: 9000,  usAvg: 20000 },
  armLipo:        { label: 'Arm Liposuction',       avg: 2500,  usAvg: 5000  },
  thighLipo:      { label: 'Thigh Liposuction',     avg: 3200,  usAvg: 7000  },
  chinLipo:       { label: 'Chin Liposuction',      avg: 3200,  usAvg: 5500  },
}

export const FIXED_COSTS = {
  foodPerDay: 45,
  localTransport: 80,
  misc: 200,
  airportTransfer: 60,
}

export function calculateTrip({
  procedure,
  clinicPrice,
  city,
  month,
  weekIndex,
  nights,
  accommodation,
}: {
  procedure: string
  clinicPrice: number | null
  city: string
  month: string
  weekIndex: number
  nights: number
  accommodation: keyof typeof ACCOMMODATION
}) {
  const baseFlight = BASE_FLIGHT_COST[city] ?? 1000
  const multiplier = SEASON_MULTIPLIER[month][weekIndex]
  const flight = Math.round(baseFlight * multiplier)

  const accomCost = ACCOMMODATION[accommodation].perNight * nights

  const procData = PROCEDURE_COST[procedure]
  const procedurePrice = clinicPrice ?? procData?.avg ?? 0
  const isActualPrice = clinicPrice != null

  const other = Math.round(
    FIXED_COSTS.foodPerDay * nights +
    FIXED_COSTS.localTransport +
    FIXED_COSTS.misc +
    FIXED_COSTS.airportTransfer
  )

  const total = flight + accomCost + procedurePrice + other
  const usSavings = (procData?.usAvg ?? 0) - total

  const season: 'Peak' | 'Shoulder' | 'Off-peak' =
    multiplier >= 1.2 ? 'Peak' : multiplier <= 0.9 ? 'Off-peak' : 'Shoulder'

  return {
    procedurePrice,
    isActualPrice,
    flight,
    accommodation: accomCost,
    other,
    total: Math.round(total),
    usSavings: Math.round(usSavings),
    season,
  }
}
