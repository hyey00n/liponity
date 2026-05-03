import { appendReport } from '@/lib/sheets'

const MAX = { id: 50, name: 100, procedure: 100, category: 50, note: 300 }

function sanitize(s: unknown, max: number): string {
  if (typeof s !== 'string') return ''
  return s.trim().slice(0, max)
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const clinic_id      = sanitize(body.clinic_id, MAX.id)
    const clinic_name    = sanitize(body.clinic_name, MAX.name)
    const procedure_name = sanitize(body.procedure_name, MAX.procedure)
    const category       = sanitize(body.category, MAX.category)
    const note           = sanitize(body.note, MAX.note)
    const price_krw      = Number(body.price_krw)

    if (!clinic_id || !procedure_name || !price_krw || isNaN(price_krw) || price_krw <= 0 || price_krw > 100_000_000) {
      return Response.json({ error: 'Invalid fields' }, { status: 400 })
    }

    await appendReport({ clinic_id, clinic_name, procedure_name, category, price_krw, note })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
