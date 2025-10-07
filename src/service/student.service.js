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
export async function getStudentInfo(studentId, identityId) {
  return apiFetch(`/students/${studentId}/${identityId}`);
}
