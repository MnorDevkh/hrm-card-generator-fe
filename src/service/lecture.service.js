import { apiFetch } from './api';

export async function getLecturers(page, size, sortBy, search) {
  const params = new URLSearchParams();
  if (page !== undefined && page !== null) params.append('page', page);
  if (size !== undefined && size !== null) params.append('size', size);
  if (sortBy) params.append('sortBy', sortBy);
  if (search) params.append('search', search);

  return apiFetch(`/lecture/?${params.toString()}`);
}

export async function createLecturer(data) {
  return apiFetch('/lecture/', {
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