import { getClinics, getPrices, getHours } from '@/lib/sheets';
import PROCEDURES from '@/data/procedures.json';

const AVG_PRICES = PROCEDURES as { key: string; label: string; koreaAvg: number; usAvg: number }[];

export async function GET() {
  try {
    const [clinicsRaw, pricesRaw, hoursRaw] = await Promise.all([
      getClinics(),
      getPrices(),
      getHours(),
    ]);

    const clinics = clinicsRaw.map((c: any) => {
      // available_procedures → specialties 배열로 변환
      const specialties = c.available_procedures
        ? c.available_procedures.split(',').map((s: string) => s.trim())
        : [];

      // 운영시간 가공
      const dayMap: Record<string, string> = {
        '월': 'Mon', '화': 'Tue', '수': 'Wed',
        '목': 'Thu', '금': 'Fri', '토': 'Sat', '일': 'Sun',
      };
      const hours_detail: Record<string, { open: string | null; close: string | null; closed: boolean }> = {};
      hoursRaw
        .filter((h: any) => h.clinic_id === c.clinic_id)
        .forEach((h: any) => {
          const eng = dayMap[h.day_of_week] ?? h.day_of_week;
          hours_detail[eng] = {
            open: h.open_time || null,
            close: h.close_time || null,
            closed: h.is_closed === 'Y',
          };
        });

      // 병원별 가격 가공
      const clinicPrices = pricesRaw.filter((p: any) => p.clinic_id === c.clinic_id);
      const pricing: Record<string, { price: number; isActual: boolean }> = {};

      AVG_PRICES.forEach(proc => {
        const found = clinicPrices.filter((p: any) => p.category === proc.key);
        if (found.length > 0) {
          const prices = found
            .map((p: any) => Number(String(p.min_price).replace(/,/g, '')))
            .filter((n: number) => !isNaN(n) && n > 0);
          if (prices.length > 0) {
            const avg = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
            // KRW → USD 변환 (1USD = 1350KRW)
            pricing[proc.key] = { price: Math.round(avg / 1350), isActual: true };
          }
        } else {
          pricing[proc.key] = { price: proc.koreaAvg, isActual: false };
        }
      });

      return {
        id: c.clinic_id?.toLowerCase(),
        clinic_id: c.clinic_id,
        name: c.clinic_name,
        specialties,
        address: c.address || '',
        district: c.address?.split(',')[1]?.trim() || 'Seoul',
        cctv: c.cctv === 'Y',
        admission: c.admission === 'Y',
        aftercare: c.aftercare === 'Y',
        female_doctor: c.female_doctor === 'Y',
        anesthesiologist: c.anesthesiologist === 'Y',
        hours_detail,
        pricing,
      };
    });

    return Response.json(clinics);
  } catch (e: any) {
  console.error('SHEETS ERROR:', e.message)
  return Response.json({ error: e.message }, { status: 500 })
}
}