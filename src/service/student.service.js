import { apiFetch } from './api';

export async function getStudents(
  skip,
  limit,
  search,
  batch,
  faculty,
  study_shift,
  ischeck,
  current_degree,
  study_year,
) {
  const params = new URLSearchParams({ skip, limit });
  if (batch) params.append('batch', batch);
  if (search) params.append('search', search);
  if (faculty) params.append('faculty', faculty);
  if (study_shift) params.append('study_shift', study_shift);
  if (ischeck === true || ischeck === false) params.append('ischeck', String(ischeck));
  if (current_degree) params.append('current_degree', current_degree);
  if (study_year != null && study_year !== '') params.append('study_year', String(study_year));
  return apiFetch(`/students/?${params}`);
}

export async function uploadExcel(formData) {
  return apiFetch('/students/upload_excel', {
    method: 'POST',
    body: formData,
  });
}

/**
 * @param {string[]} studentIds
 * @returns {Promise<Student[]>}
 */
export async function getStudentsByIds(studentIds) {
  return apiFetch('/students/by-ids', {
    method: 'POST',
    body: JSON.stringify({ student_ids: studentIds }),
  });
}

/**
 * @param {string} studentId
 * @param {string} identityId
 * @returns {Promise<Student>}
 */
export async function getStudentInfo(studentId, id) {
  return apiFetch(`/students/${studentId}/${id}`);
}

export async function deleteStudent(studentId) {
  return apiFetch(`/students/${studentId}`, {
    method: 'DELETE',
  });
}

export async function updateStudent(studentId, data) {
  return apiFetch(`/students/${studentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function createStudent(data) {
  return apiFetch('/students', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
