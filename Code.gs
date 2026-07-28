/**** Rekod Suhu — Master Web App (Peti Sejuk, Bilik, Substor) ****/
/* UNIT FARMASI KLINIK KESIHATAN SIK */

/* === Spreadsheet IDs === */
const SPREADSHEET_ID_PETI_SEJUK = '1qn7wCpyWBG2Sp4qQtHwzcj3g1dlf9UyZ2AiS6ftUz6M';
const SPREADSHEET_ID_SUBSTOR    = '1dY4fVynAZDgEWnOEo7aX9MkQzPRcFSP5LadrhudnHKY';
const SPREADSHEET_ID_BILIK      = '1f_qu9lC4WdzjtX6bN-q1GXLFYyOhbYe_18qYRk571II';

/* === Sheet names === */
const SHEET_TAB_REKOD   = 'REKOD SUHU';
const SHEET_TAB_CATATAN = 'CATATAN SUHU LUAR JULAT';

/* === Dataset bounds === */
const BASE_YEAR = 2025;
const LAST_YEAR = 2036;
const START_ROW = 2;

/** Serve the web app or handle GET API request */
function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'getConfig') {
    return createJsonResponse(getConfig());
  }

  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Rekod Suhu Input — Unit Farmasi KK Sik')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Handle HTTP POST requests (from Standalone / GitHub Pages Frontend) */
function doPost(e) {
  try {
    let payload;
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }

    const result = handleSubmit(payload);
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ ok: false, error: err.message || String(err) });
  }
}

/** Return JSON response with CORS headers */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Return config to frontend */
function getConfig() {
  return {
    unit: 'UNIT FARMASI KLINIK KESIHATAN SIK',
    lokasiList: [
      { value: 'PETI_SEJUK', label: 'Peti Sejuk' },
      { value: 'BILIK',      label: 'Bilik' },
      { value: 'SUBSTOR',    label: 'Substor' }
    ],
    ranges: {
      PETI_SEJUK: { min: -4, max: 17, targetMin: 2, targetMax: 8 },
      BILIK:      { min: 12, max: 34, targetMin: 20, targetMax: 25 },
      SUBSTOR:    { min: 12, max: 34, targetMin: 20, targetMax: 25 }
    },
    perkara: {
      PETI_SEJUK: [
        { value:'A', label:'A - TIADA PRODUK/BAHAN RANGKAIAN SEJUK DISIMPAN' },
        { value:'B', label:'B - TIDAK CUKUP BEKALAN ELEKTRIK' },
        { value:'C', label:'C - PETI SEJUK TIDAK BERFUNGSI DENGAN BETUL' },
        { value:'D', label:'D - PEMBANTU TEKNIK DIPANGGIL UNTUK PENAMBAHBAIKAN' },
        { value:'E', label:'E - PETI SEJUK DALAM PEMBAIKAN' }
      ],
      BILIK: [
        { value:'A', label:'A - TIADA BEKALAN ELEKTRIK' },
        { value:'B', label:'B - PENGHAWA DINGIN TIDAK BERFUNGSI DENGAN BETUL' },
        { value:'C', label:'C - PENGHAWA DINGIN DALAM PEMBAIKAN' }
      ],
      SUBSTOR: [
        { value:'A', label:'A - TIADA BEKALAN ELEKTRIK' },
        { value:'B', label:'B - PENGHAWA DINGIN TIDAK BERFUNGSI DENGAN BETUL' },
        { value:'C', label:'C - PENGHAWA DINGIN DALAM PEMBAIKAN' }
      ]
    },
    dateMin: '2025-01-01',
    dateMax: '2036-12-31'
  };
}

/** Handle submission */
function handleSubmit(payload) {
  if (!payload || !payload.lokasi) throw new Error('Sila pilih lokasi.');

  const rng = rangeForLokasi_(payload.lokasi);
  ['min','semasa','max'].forEach(k => {
    const v = payload[k];
    if (v !== '' && v != null) {
      const num = Number(v);
      if (isNaN(num)) throw new Error(`Nilai ${k} tidak sah.`);
      if (num < rng.min || num > rng.max)
        throw new Error(`${k.toUpperCase()} mesti dalam julat ${rng.min} hingga ${rng.max} °C untuk ${payload.lokasi.replace('_',' ')}`);
    }
  });

  const ss = SpreadsheetApp.openById(idForLokasi_(payload.lokasi));
  const rekod = ss.getSheetByName(SHEET_TAB_REKOD);
  if (!rekod) throw new Error(`Tab "${SHEET_TAB_REKOD}" tidak ditemui.`);

  const targetRow = rowFor_(payload.date, payload.slot);

  const existing = rekod.getRange(targetRow, 3, 1, 5).getValues()[0]; // C..G
  const hasData = existing.some(v => v !== '' && v != null);

  if (hasData && !payload.overwrite) {
    return { ok: false, already: true, row: targetRow };
  }

  const values = [[
    new Date(payload.date),
    String(payload.slot).toUpperCase(),
    payload.min === '' ? '' : Number(payload.min),
    payload.semasa === '' ? '' : Number(payload.semasa),
    payload.max === '' ? '' : Number(payload.max),
    fullPerkaraFromLetter_(payload.lokasi, payload.perkara || ''),
    payload.nama ? String(payload.nama).trim() : ''
  ]];
  rekod.getRange(targetRow, 1, 1, 7).setValues(values);

  let incidentSaved = false;
  if (payload.incident && payload.incident.enabled) {
    incidentSaved = appendCatatan_(ss, {
      date: payload.incident.date || payload.date,
      time: payload.incident.time || '',
      note: payload.incident.note || '',
      officer: payload.incident.officer || payload.nama || ''
    });
  }

  return { ok: true, row: targetRow, incidentSaved };
}

/** Get spreadsheet ID based on lokasi */
function idForLokasi_(lokasi) {
  switch (String(lokasi || '').toUpperCase()) {
    case 'PETI_SEJUK': return SPREADSHEET_ID_PETI_SEJUK;
    case 'BILIK':      return SPREADSHEET_ID_BILIK;
    case 'SUBSTOR':    return SPREADSHEET_ID_SUBSTOR;
    default: throw new Error('Lokasi tidak sah.');
  }
}

/** Get temp range */
function rangeForLokasi_(lokasi) {
  const L = String(lokasi).toUpperCase();
  if (L === 'PETI_SEJUK') return { min: -4, max: 17 };
  if (L === 'BILIK' || L === 'SUBSTOR') return { min: 12, max: 34 };
  throw new Error('Lokasi tidak sah.');
}

/** Get row in REKOD SUHU for given date + AM/PM */
function rowFor_(isoDate, slot) {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) throw new Error('Tarikh tidak sah.');
  const y = d.getFullYear();
  if (y < BASE_YEAR || y > LAST_YEAR) throw new Error(`Tarikh mesti antara ${BASE_YEAR} hingga ${LAST_YEAR}.`);
  d.setHours(0,0,0,0);
  const base = new Date(BASE_YEAR, 0, 1);
  const days = Math.floor((d - base) / (1000 * 60 * 60 * 24));
  const offset = (String(slot).toUpperCase() === 'PM') ? 1 : 0;
  return START_ROW + (days * 2) + offset;
}

/** Convert PERKARA letter → full label */
function fullPerkaraFromLetter_(lokasi, letter) {
  const L = String(lokasi).toUpperCase();
  const val = String(letter || '').toUpperCase();

  if (L === 'PETI_SEJUK') {
    const map = {
      A: 'A - TIADA PRODUK/BAHAN RANGKAIAN SEJUK DISIMPAN',
      B: 'B - TIDAK CUKUP BEKALAN ELEKTRIK',
      C: 'C - PETI SEJUK TIDAK BERFUNGSI DENGAN BETUL',
      D: 'D - PEMBANTU TEKNIK DIPANGGIL UNTUK PENAMBAHBAIKAN',
      E: 'E - PETI SEJUK DALAM PEMBAIKAN'
    };
    return map[val] || '';
  }

  if (L === 'BILIK' || L === 'SUBSTOR') {
    const map = {
      A: 'A - TIADA BEKALAN ELEKTRIK',
      B: 'B - PENGHAWA DINGIN TIDAK BERFUNGSI DENGAN BETUL',
      C: 'C - PENGHAWA DINGIN DALAM PEMBAIKAN'
    };
    return map[val] || '';
  }

  return '';
}

/** Append row to CATATAN sheet */
function appendCatatan_(ss, payload) {
  let sheet = ss.getSheetByName(SHEET_TAB_CATATAN);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TAB_CATATAN);
    sheet.getRange(1, 1, 1, 4).setValues([['Tarikh','Masa','Perkara/Penjelasan','Nama Pegawai']]);
  }
  sheet.appendRow([
    new Date(payload.date),
    payload.time || '',
    (payload.note || '').trim(),
    (payload.officer || '').trim()
  ]);
  return true;
}
