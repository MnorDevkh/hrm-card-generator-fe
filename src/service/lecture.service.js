import { apiFetch } from './api';

export async function getLecturers(page, size, sortBy, search, faculty) {
  const params = new URLSearchParams();
  const _page = page ?? 1;
  const _size = size ?? 10;
  // Backend expects `skip`/`limit` (see `GET /lecturer/` -> `lecturer_service.get_all_lecturers(skip, limit, ...)`).
  const skip = Math.max(0, (_page - 1) * _size);
  params.append('skip', skip);
  params.append('limit', _size);
  if (sortBy) params.append('sortBy', sortBy);
  if (search) params.append('search', search);
  if (faculty) params.append('faculty', faculty);

  return apiFetch(`/lecturer/?${params.toString()}`);
}

export async function getNextCardId() {
  return apiFetch('/lecturer/next-card-id');
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

export async function activateLecturerCards(lecturerIds, qrExpiredAt) {
  return apiFetch('/lecturer/activate-cards', {
    method: 'POST',
    body: JSON.stringify({
      lecturer_ids: lecturerIds,
      qr_expired_at: qrExpiredAt,
    }),
  });
}