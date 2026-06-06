export function normalizeSerial(value) {
  return String(value ?? '').trim();
}

/** Browser local date as DDMMYYYY (matches serial prefix format). */
export function localSerialDatePrefix(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}${mm}${yyyy}`;
}

/** Browser local date as YYYY-MM-DD for filenames. */
export function localDateYMD(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export function hasDuplicateSerial(rows, serial, excludeId = null) {
  const key = normalizeSerial(serial).toLowerCase();
  if (!key) return false;
  return rows.some((row) => {
    if (excludeId && row.id === excludeId) return false;
    return normalizeSerial(row.serial_no).toLowerCase() === key;
  });
}

export async function formatReceiptApiError(err, fallback, t) {
  try {
    const body = await err?.response?.json();
    const detail = body?.detail;
    if (typeof detail === 'string') return detail;
    if (detail?.serial_no) {
      return t('receipt.serialDuplicate', { serial: detail.serial_no });
    }
    if (detail?.message) return detail.message;
  } catch {
    /* ignore parse errors */
  }
  return fallback;
}
