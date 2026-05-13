import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

function toRows(values: string[][] | null | undefined) {
  const [header, ...rows] = values || [];
  if (!header) return [];
  const seen = new Set<string>()
  const cols: { key: string; idx: number }[] = []
  header.forEach((k: string, i: number) => {
    const key = String(k ?? '').trim()
    if (key && !seen.has(key)) { seen.add(key); cols.push({ key, idx: i }) }
  })
  return rows.map((row: string[]) =>
    Object.fromEntries(cols.map(({ key, idx }) => [key, row[idx] ?? '']))
  );
}

export async function getClinics() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'info!A:K',
  });
  return toRows(res.data.values as string[][]);
}

export async function getPrices() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'price!A:Z',
    valueRenderOption: 'UNFORMATTED_VALUE',
  });
  return toRows(res.data.values as string[][]);
}

export async function getHours() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'days!A:D',
  });
  return toRows(res.data.values as string[][]);
}

export async function getUserReports() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'user_report!A:H',
    });
    return toRows(res.data.values as string[][]);
  } catch {
    return [];
  }
}

export async function appendSuggestion(clinicName: string) {
  if (!SHEET_ID) throw new Error('Sheet not configured');
  const timestamp = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'suggestions!A:B',
    valueInputOption: 'RAW', // RAW prevents formula injection
    requestBody: { values: [[timestamp, clinicName]] },
  });
}

export async function appendReport(data: {
  clinic_id: string
  clinic_name: string
  procedure_name: string
  category: string
  price_krw: number
  note?: string
}) {
  if (!SHEET_ID) throw new Error('Sheet not configured');
  const timestamp = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'user_report!A:G',
    valueInputOption: 'RAW', // RAW prevents formula injection
    requestBody: {
      values: [[
        timestamp,
        data.clinic_id,
        data.clinic_name,
        data.category,
        data.procedure_name,
        data.price_krw,
        data.note || '',
      ]],
    },
  });
}
