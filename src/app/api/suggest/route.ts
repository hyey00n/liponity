import { appendSuggestion } from '@/lib/sheets'

export async function POST(req: Request) {
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
  } catch (e) {
    console.error('[suggest API]', e)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
