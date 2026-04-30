import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function getClinics() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'info!A:K',
  });
  const [header, ...rows] = res.data.values || [];
  return rows.map(row =>
    Object.fromEntries(header.map((key: string, i: number) => [key, row[i] ?? '']))
  );
}

export async function getPrices() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'price!A:H',
  });
  const [header, ...rows] = res.data.values || [];
  return rows.map(row =>
    Object.fromEntries(header.map((key: string, i: number) => [key, row[i] ?? '']))
  );
}

export async function getHours() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'days!A:D',
  });
  const [header, ...rows] = res.data.values || [];
  return rows.map(row =>
    Object.fromEntries(header.map((key: string, i: number) => [key, row[i] ?? '']))
  );
}