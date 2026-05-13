import { getClinics, getPrices, getHours, getUserReports } from '@/lib/sheets'
import PROCEDURES from '@/data/procedures.json'

const AVG_PRICES = PROCEDURES as { key: string; label: string; koreaAvg: number; usAvg: number }[]
const KRW_TO_USD = 1350

const VAT_LABEL: Record<string, string> = {
  Y: 'VAT incl.', '포함': 'VAT incl.',
  N: 'VAT excl.', '별도': 'VAT excl.',
  '미확인': '', '': '',
}

const CAT_TO_PROC_KEY: Record<string, string> = {
  Eyes: '눈', Nose: '코', Breast: '가슴', Lifting: '리프팅',
  'Facial Contour': '안면윤곽', Liposuction: '지방흡입',
  'Fat Graft': '지방이식', Package: '복합',
}

const DAY_MAP: Record<string, string> = {
  '월': 'Mon', '화': 'Tue', '수': 'Wed',
  '목': 'Thu', '금': 'Fri', '토': 'Sat', '일': 'Sun',
}

const cleanNum = (v: unknown) => Number(String(v ?? '').replace(/[₩,\s]/g, '')) || 0

export async function buildClinics() {
  const [clinicsRaw, pricesRaw, hoursRaw, userReports] = await Promise.all([
    getClinics(), getPrices(), getHours(), getUserReports(),
  ])

  const pricesByClinic = new Map<string, typeof pricesRaw>()
  for (const p of pricesRaw) {
    const pid = String(p.clinic_id ?? '').trim()
    if (!pid) continue
    if (!pricesByClinic.has(pid)) pricesByClinic.set(pid, [])
    pricesByClinic.get(pid)!.push(p)
  }

  const hoursByClinic = new Map<string, typeof hoursRaw>()
  for (const h of hoursRaw) {
    const hid = String(h.clinic_id ?? '').trim()
    if (!hid) continue
    if (!hoursByClinic.has(hid)) hoursByClinic.set(hid, [])
    hoursByClinic.get(hid)!.push(h)
  }

  type ReportRow = typeof userReports[0]
  const reportsByKey = new Map<string, ReportRow[]>()
  for (const r of userReports) {
    const key = `${String(r.clinic_id ?? '').trim()}::${String(r.procedure_name ?? '').trim()}`
    if (!reportsByKey.has(key)) reportsByKey.set(key, [])
    reportsByKey.get(key)!.push(r)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return clinicsRaw.filter((c: any) => c.clinic_id && c.clinic_name).map((c: any) => {
    const fromProcedures = c.available_procedures
      ? c.available_procedures.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []
    const specialties = [...new Set([...fromProcedures, ...(c.category ? [c.category.trim()] : [])])]

    const hours_detail: Record<string, { open: string | null; close: string | null; closed: boolean }> = {}
    for (const h of hoursByClinic.get(String(c.clinic_id ?? '').trim()) ?? []) {
      const eng = DAY_MAP[h.day_of_week] ?? h.day_of_week
      hours_detail[eng] = { open: h.open_time || null, close: h.close_time || null, closed: h.is_closed === 'Y' }
    }

    const clinicPriceRows = pricesByClinic.get(String(c.clinic_id ?? '').trim()) ?? []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const priceItems = clinicPriceRows.map((p: any) => {
      const key = `${String(c.clinic_id ?? '').trim()}::${String(p.procedure_name ?? '').trim()}`

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reports = (reportsByKey.get(key) ?? []).sort((a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      const report = reports[0]
      const rawKrw = report ? cleanNum(report.price_krw) : cleanNum(p.min_price)
      const rawMaxKrw = report ? 0 : cleanNum(p.max_price)
      const vatRaw = (p.vat_included ?? '').trim()
      return {
        category: p.category,
        name: p.procedure_name,
        krw: rawKrw,
        maxKrw: rawMaxKrw > rawKrw ? rawMaxKrw : 0,
        usd: rawKrw > 0 ? Math.round(rawKrw / KRW_TO_USD) : null,
        vat: vatRaw in VAT_LABEL ? VAT_LABEL[vatRaw] : '',
        note: report?.note || p.note || '',
        isUserReport: !!report,
        reportCount: reports.length,
        lastReported: report?.timestamp || null,
      }
    }).filter((item: any) => item.krw > 0 || item.reportCount > 0)

    const pricing: Record<string, { price: number; maxPrice: number; isActual: boolean }> = {}
    AVG_PRICES.forEach(proc => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const found = clinicPriceRows.filter((p: any) => CAT_TO_PROC_KEY[p.category] === proc.key)
      if (found.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mins = found.map((p: any) => cleanNum(p.min_price)).filter((n: number) => n > 0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maxes = found.map((p: any) => cleanNum(p.max_price)).filter((n: number) => n > 0)
        if (mins.length > 0) {
          const minPrice = Math.min(...mins)
          const maxPrice = maxes.length > 0 ? Math.max(...maxes) : 0
          pricing[proc.key] = {
            price: Math.round(minPrice / KRW_TO_USD),
            maxPrice: maxPrice > minPrice ? Math.round(maxPrice / KRW_TO_USD) : 0,
            isActual: true,
          }
        }
      }
    })

    return {
      id: c.clinic_id?.toLowerCase(),
      clinic_id: c.clinic_id,
      name: c.clinic_name,
      specialties,
      address: c.address || '',
      district: c.address?.split(',')[1]?.trim() || 'Seoul',
      lat: c.lat ? parseFloat(c.lat) : null,
      lng: c.lng ? parseFloat(c.lng) : null,
      cctv: c.cctv === 'Y',
      admission: c.admission === 'Y',
      aftercare: c.aftercare === 'Y',
      female_doctor: c.female_doctor === 'Y',
      anesthesiologist: c.anesthesiologist === 'Y',
      hours_detail,
      priceItems,
      pricing,
    }
  })
}
