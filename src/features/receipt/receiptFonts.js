/** Font specs at the sizes used in ReceiptDocument (preview + PDF must match). */
export const RECEIPT_FONT_SPECS = [
  '48px Tacteing',
  "1.25rem 'Khmer OS Muol Light'",
  '1.25rem Moul',
  "700 0.95rem 'Kantumruy Pro'",
  "400 0.95rem 'Kantumruy Pro'",
  "700 0.875rem 'Kantumruy Pro'",
  '400 0.875rem Inter',
];

/** html2canvas scale — high enough for Tacteing ornament and Khmer text at print size. */
export function getReceiptCaptureScale() {
  if (typeof window === 'undefined') return 4;
  const dpr = window.devicePixelRatio || 1;
  return Math.min(6, Math.max(4, dpr * 3));
}

export async function waitForReceiptFonts() {
  if (typeof document === 'undefined' || !document.fonts?.load) return;

  try {
    await Promise.all(RECEIPT_FONT_SPECS.map((spec) => document.fonts.load(spec).catch(() => {})));
    await document.fonts.ready;
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  } catch {
    /* ignore */
  }
}

const REPORT_FONT_SPECS = [
  "700 22px 'Kantumruy Pro'",
  "400 12px 'Kantumruy Pro'",
  "700 14px 'Kantumruy Pro'",
  "700 11px 'Kantumruy Pro'",
  "400 11px 'Kantumruy Pro'",
  "400 10px 'Kantumruy Pro'",
  "700 10px 'Kantumruy Pro'",
];

export async function waitForReceiptReportFonts() {
  await waitForReceiptFonts();
  if (typeof document === 'undefined' || !document.fonts?.load) return;

  try {
    await Promise.all(REPORT_FONT_SPECS.map((spec) => document.fonts.load(spec).catch(() => {})));
    await document.fonts.ready;
  } catch {
    /* ignore */
  }
}
