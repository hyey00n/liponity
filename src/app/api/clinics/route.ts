import { getClinics, getPrices, getHours, getUserReports } from '@/lib/sheets';
import PROCEDURES from '@/data/procedures.json';
import CLINICS_JSON from '@/data/clinics.json';

const AVG_PRICES = PROCEDURES as { key: string; label: string; koreaAvg: number; usAvg: number }[];
const KRW_TO_USD = 1350;

const VAT_LABEL: Record<string, string> = {
  Y: 'VAT incl.', '포함': 'VAT incl.',
  N: 'VAT excl.', '별도': 'VAT excl.',
  '미확인': '', '': '',
};

// Sheet category (English) → procedures.json key (Korean)
const CAT_TO_PROC_KEY: Record<string, string> = {
  Eyes:             '눈',
  Nose:             '코',
  Breast:           '가슴',
  Lifting:          '리프팅',
  'Facial Contour': '안면윤곽',
  Liposuction:      '지방흡입',
  'Fat Graft':      '지방이식',
  Package:          '복합',
};

// 1시간 캐시 — Sheets API 호출 횟수 대폭 감소
export const revalidate = 3600;

export async function GET() {
  if (!process.env.GOOGLE_SHEET_ID) {
    return Response.json(CLINICS_JSON);
  }

  try {
    const [clinicsRaw, pricesRaw, hoursRaw, userReports] = await Promise.all([
      getClinics(),
      getPrices(),
      getHours(),
      getUserReports(),
    ]);

    // O(n²) → O(n): clinic_id 기준으로 미리 그룹핑
    const pricesByClinic = new Map<string, typeof pricesRaw>();
    for (const p of pricesRaw) {
      const id = p.clinic_id;
      if (!pricesByClinic.has(id)) pricesByClinic.set(id, []);
      pricesByClinic.get(id)!.push(p);
    }

    const hoursByClinic = new Map<string, typeof hoursRaw>();
    for (const h of hoursRaw) {
      const id = h.clinic_id;
      if (!hoursByClinic.has(id)) hoursByClinic.set(id, []);
      hoursByClinic.get(id)!.push(h);
    }

    // user_report도 clinic_id + procedure_name 기준으로 그룹핑
    type ReportRow = typeof userReports[0];
    const reportsByKey = new Map<string, ReportRow[]>();
    for (const r of userReports) {
      const key = `${r.clinic_id}::${r.procedure_name}`;
      if (!reportsByKey.has(key)) reportsByKey.set(key, []);
      reportsByKey.get(key)!.push(r);
    }

    const dayMap: Record<string, string> = {
      '월': 'Mon', '화': 'Tue', '수': 'Wed',
      '목': 'Thu', '금': 'Fri', '토': 'Sat', '일': 'Sun',
    };

    const clinics = clinicsRaw.map((c: any) => {
      const fromProcedures = c.available_procedures
        ? c.available_procedures.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      const fromCategory = c.category ? [c.category.trim()] : [];
      const specialties = [...new Set([...fromProcedures, ...fromCategory])];

      const hours_detail: Record<string, { open: string | null; close: string | null; closed: boolean }> = {};
      for (const h of hoursByClinic.get(c.clinic_id) ?? []) {
        const eng = dayMap[h.day_of_week] ?? h.day_of_week;
        hours_detail[eng] = {
          open: h.open_time || null,
          close: h.close_time || null,
          closed: h.is_closed === 'Y',
        };
      }

      const clinicPriceRows = pricesByClinic.get(c.clinic_id) ?? [];

      const priceItems = clinicPriceRows.map((p: any) => {
        const key = `${c.clinic_id}::${p.procedure_name}`;
        const reports = (reportsByKey.get(key) ?? [])
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const report = reports[0];
        const reportCount = reports.length;

        const rawKrw = report
          ? Number(String(report.price_krw).replace(/,/g, ''))
          : Number(String(p.min_price).replace(/,/g, ''));
        const rawMaxKrw = report
          ? 0
          : Number(String(p.max_price ?? '').replace(/,/g, '')) || 0;

        const vatRaw = (p.vat_included ?? '').trim();
        const vatLabel = vatRaw in VAT_LABEL ? VAT_LABEL[vatRaw] : '';

        return {
          category: p.category,
          name: p.procedure_name,
          krw: rawKrw,
          maxKrw: rawMaxKrw > rawKrw ? rawMaxKrw : 0,
          usd: rawKrw > 0 ? Math.round(rawKrw / KRW_TO_USD) : null,
          vat: vatLabel,
          note: report?.note || p.note || '',
          isUserReport: !!report,
          reportCount,
          lastReported: report?.timestamp || null,
        };
      });

      const pricing: Record<string, { price: number; maxPrice: number; isActual: boolean }> = {};
      AVG_PRICES.forEach(proc => {
        const found = clinicPriceRows.filter((p: any) => CAT_TO_PROC_KEY[p.category] === proc.key);
        if (found.length > 0) {
          const mins = found
            .map((p: any) => Number(String(p.min_price).replace(/,/g, '')))
            .filter((n: number) => !isNaN(n) && n > 0);
          const maxes = found
            .map((p: any) => Number(String(p.max_price ?? '').replace(/,/g, '')))
            .filter((n: number) => !isNaN(n) && n > 0);
          if (mins.length > 0) {
            const minPrice = Math.min(...mins);
            const maxPrice = maxes.length > 0 ? Math.max(...maxes) : 0;
            pricing[proc.key] = {
              price:    Math.round(minPrice / KRW_TO_USD),
              maxPrice: maxPrice > minPrice ? Math.round(maxPrice / KRW_TO_USD) : 0,
              isActual: true,
            };
          }
        }
        // 데이터 없는 병원은 pricing 항목 자체를 만들지 않음 (프론트에서 — 표시)
      });

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
      };
    });

    return Response.json(clinics);
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
