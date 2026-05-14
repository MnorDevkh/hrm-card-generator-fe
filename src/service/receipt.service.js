import { apiFetch } from './api';

export async function parseReceiptExcel(file) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch('/receipts/parse-excel', { method: 'POST', body: form });
}

export async function uploadReceiptExcel(file) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch('/receipts/upload-excel', { method: 'POST', body: form });
}

export async function listReceiptBatches({ search = '', skip = 0, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('skip', String(skip));
  params.set('limit', String(limit));
  return apiFetch(`/receipts/batches?${params.toString()}`, { method: 'GET' });
}

export async function getReceiptBatch(batchId) {
  return apiFetch(`/receipts/batches/${encodeURIComponent(batchId)}`, { method: 'GET' });
}

