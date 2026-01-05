import { apiFetch } from './api';

export async function getStudents(skip, limit) {
  console.log(skip, limit);
  
  const params = new URLSearchParams({ skip, limit });
  return apiFetch(`/students?${params}`);
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
export async function getStudentInfo(studentId, identityId, cardId) {
  return apiFetch(`/students/${studentId}/${identityId}/${cardId}`);
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
