import { apiFetch } from './api';

export async function getStaff(page, size, sortBy, search, department) {
  const params = new URLSearchParams();
  if (page !== undefined && page !== null) params.append('page', page);
  if (size !== undefined && size !== null) params.append('size', size);
  if (sortBy) params.append('sortBy', sortBy);
  if (search) params.append('search', search);
  if (department) params.append('department', department);

  return apiFetch(`/staff/?${params.toString()}`);
}

export async function getStaffById(id) {
  return apiFetch(`/staff/${id}`);
}

export async function createStaff(data) {
  return apiFetch('/staff/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateStaff(id, data) {
  const { id: _id, ...payload } = data || {};
  if (payload.identity) {
    payload.identity.nationality_id = payload.identity.nationality_id ?? '';
  }
  return apiFetch(`/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteStaff(id) {
  return apiFetch(`/staff/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadExcel(formData) {
  return apiFetch('/staff/upload_excel', {
    method: 'POST',
    body: formData,
  });
}
