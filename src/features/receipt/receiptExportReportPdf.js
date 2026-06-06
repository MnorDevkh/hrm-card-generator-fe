import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getReceiptCaptureScale, waitForReceiptReportFonts } from './receiptFonts';

const REPORT_WIDTH_PX = 794;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function display(value) {
  const text = String(value ?? '').trim();
  return escapeHtml(text || '—');
}

function buildDetailTable(rows, labels) {
  if (!rows.length) {
    return `<p class="export-report-empty">${display('—')}</p>`;
  }

  const head = labels.detailColumns
    .map((col) => `<th>${escapeHtml(col.title)}</th>`)
    .join('');

  const body = rows
    .map((row, index) => {
      const cells = labels.detailColumns
        .map((col) => `<td>${display(col.value(row, index))}</td>`)
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  return `
    <table class="export-report-table">
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;
}

function buildAuditSection(audit, index, labels, formatDate, formatExportType) {
  const rows = Array.isArray(audit.rows) ? audit.rows : [];
  return `
    <section class="export-report-section">
      <h2 class="export-report-section-title">${escapeHtml(labels.entry)} ${index + 1}</h2>
      <dl class="export-report-meta">
        <div><dt>${escapeHtml(labels.exportedAt)}</dt><dd>${display(formatDate(audit.exported_at))}</dd></div>
        <div><dt>${escapeHtml(labels.exportType)}</dt><dd>${display(formatExportType(audit.export_type))}</dd></div>
        <div><dt>${escapeHtml(labels.exportCount)}</dt><dd>${display(String(audit.receipt_count ?? rows.length))}</dd></div>
        <div><dt>${escapeHtml(labels.filename)}</dt><dd>${display(audit.batch_filename)}</dd></div>
        <div><dt>${escapeHtml(labels.exportedBy)}</dt><dd>${display(audit.exported_by_username)}</dd></div>
      </dl>
      ${buildDetailTable(rows, labels)}
    </section>
  `;
}

function buildReportHtml({
  audits,
  labels,
  formatDate,
  formatExportType,
  generatedAt,
  searchFilter,
}) {
  const sections = audits
    .map((audit, index) => buildAuditSection(audit, index, labels, formatDate, formatExportType))
    .join('');

  return `
    <div class="export-report-doc">
      <h1 class="export-report-title">${escapeHtml(labels.title)}</h1>
      <p class="export-report-summary">${escapeHtml(labels.generated)}: ${display(generatedAt)}</p>
      <p class="export-report-summary">${escapeHtml(labels.filter)}: ${display(searchFilter || labels.filterAll)}</p>
      <p class="export-report-summary">${escapeHtml(labels.total)}: ${audits.length}</p>
      ${sections}
    </div>
  `;
}

function injectReportStyles(container) {
  const style = document.createElement('style');
  style.textContent = `
    .export-report-root {
      font-family: 'Kantumruy Pro', 'Inter', sans-serif;
      color: #111827;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .export-report-doc {
      padding: 24px;
      box-sizing: border-box;
    }
    .export-report-title {
      margin: 0 0 12px;
      font-size: 22px;
      font-weight: 700;
      font-family: 'Kantumruy Pro', 'Inter', sans-serif;
      color: #111827;
    }
    .export-report-summary {
      margin: 0 0 6px;
      font-size: 12px;
      color: #374151;
    }
    .export-report-section {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }
    .export-report-section-title {
      margin: 0 0 10px;
      font-size: 14px;
      font-weight: 700;
      color: #1e40af;
    }
    .export-report-meta {
      margin: 0 0 12px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 16px;
      font-size: 11px;
    }
    .export-report-meta dt {
      margin: 0;
      font-weight: 700;
      color: #4b5563;
    }
    .export-report-meta dd {
      margin: 2px 0 0;
      color: #111827;
    }
    .export-report-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      table-layout: fixed;
    }
    .export-report-table th,
    .export-report-table td {
      border: 1px solid #d1d5db;
      padding: 6px 5px;
      text-align: left;
      vertical-align: top;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      font-family: 'Kantumruy Pro', 'Inter', sans-serif;
      color: #111827;
    }
    .export-report-table th {
      background: #f3f4f6;
      font-weight: 700;
      color: #374151;
    }
    .export-report-table td:nth-child(1) { width: 5%; }
    .export-report-table td:nth-child(2) { width: 12%; }
    .export-report-table td:nth-child(3) { width: 16%; }
    .export-report-table td:nth-child(4) { width: 16%; }
    .export-report-table td:nth-child(5) { width: 11%; }
    .export-report-table td:nth-child(6) { width: 12%; }
    .export-report-table td:nth-child(7) { width: 10%; }
    .export-report-table td:nth-child(8) { width: 18%; }
    .export-report-empty {
      margin: 0;
      font-size: 11px;
      color: #6b7280;
    }
  `;
  container.appendChild(style);
}

async function addElementToPdf(pdf, element) {
  const scale = Math.min(4, getReceiptCaptureScale());
  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const pageHeightPx = Math.floor((canvas.width * pdfHeight) / pdfWidth);
  let renderedHeight = 0;

  while (renderedHeight < canvas.height) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - renderedHeight);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const ctx = pageCanvas.getContext('2d');
    ctx.drawImage(
      canvas,
      0,
      renderedHeight,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );

    const sliceImgHeight = (sliceHeight * pdfWidth) / canvas.width;
    if (renderedHeight > 0) pdf.addPage();
    pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, sliceImgHeight);
    renderedHeight += sliceHeight;
  }
}

export function buildExportReportLabels(t) {
  return {
    title: t('receipt.exportReportTitle'),
    generated: t('receipt.exportReportGenerated'),
    filter: t('receipt.exportReportFilter'),
    filterAll: t('receipt.exportReportFilterAll'),
    total: t('receipt.exportReportTotal'),
    entry: t('receipt.exportReportEntry'),
    exportedAt: t('receipt.exportedAt'),
    exportType: t('receipt.exportType'),
    exportCount: t('receipt.exportCount'),
    filename: t('receipt.filename'),
    exportedBy: t('receipt.exportedBy'),
    detailColumns: [
      { title: t('receipt.no'), value: (_row, index) => String(index + 1) },
      { title: t('receipt.serial'), value: (row) => row.serial_no },
      { title: t('receipt.khmerName'), value: (row) => row.name_khmer },
      { title: t('receipt.latinName'), value: (row) => row.name_latin },
      { title: t('receipt.phone'), value: (row) => row.phone },
      { title: t('receipt.fields.faculty'), value: (row) => row.faculty },
      { title: t('receipt.amount'), value: (row) => row.amount },
      { title: t('receipt.purpose'), value: (row) => row.purpose },
    ],
  };
}

export async function buildExportReportPdf({
  audits,
  labels,
  formatDate,
  formatExportType,
  generatedAt,
  searchFilter,
}) {
  const container = document.createElement('div');
  container.className = 'export-report-root';
  container.style.cssText = `position:fixed;left:-${REPORT_WIDTH_PX + 40}px;top:0;width:${REPORT_WIDTH_PX}px;background:#ffffff;pointer-events:none;z-index:-1;`;
  injectReportStyles(container);
  container.innerHTML = buildReportHtml({
    audits,
    labels,
    formatDate,
    formatExportType,
    generatedAt,
    searchFilter,
  });
  document.body.appendChild(container);

  try {
    await waitForReceiptReportFonts();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: false });
    const docEl = container.querySelector('.export-report-doc');
    if (!docEl) throw new Error('Report document element missing');
    await addElementToPdf(pdf, docEl);
    return pdf;
  } finally {
    document.body.removeChild(container);
  }
}
