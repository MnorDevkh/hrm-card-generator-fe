import { apiFetch } from './api';

export async function getLecturers(page, size, sortBy, search) {
  const params = new URLSearchParams();
  if (page !== undefined && page !== null) params.append('page', page);
  if (size !== undefined && size !== null) params.append('size', size);
  if (sortBy) params.append('sortBy', sortBy);
  if (search) params.append('search', search);

  return apiFetch(`/lecturer/?${params.toString()}`);
}

export async function createLecturer(data) {
  return apiFetch('/lecturer/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLecturer(id, data) {
  return apiFetch(`/lecturer/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLecturer(id) {
  return apiFetch(`/lecturer/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadExcel(formData) {
  return apiFetch('/lecturer/upload-excel/', {
    method: 'POST',
    body: formData,
  });
}