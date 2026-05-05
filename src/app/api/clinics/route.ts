import { buildClinics } from '@/lib/clinicData'
import CLINICS_JSON from '@/data/clinics.json'

export const revalidate = 3600

export async function GET() {
  if (!process.env.GOOGLE_SHEET_ID) {
    return Response.json(CLINICS_JSON)
  }
  try {
    const clinics = await buildClinics()
    return Response.json(clinics)
  } catch (e) {
    console.error('[clinics API]', e)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
