import { appendSuggestion } from '@/lib/sheets'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!rateLimit(ip, 5, 60_000)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const clinic_name = typeof body.clinic_name === 'string'
      ? body.clinic_name.trim().slice(0, 100)
      : ''

    if (!clinic_name) {
      return Response.json({ error: 'Invalid fields' }, { status: 400 })
    }

    await appendSuggestion(clinic_name)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
