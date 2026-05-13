export const ROLE_ADMIN = 'admin_hrm';
export const ROLE_MANAGE_STUDENT = 'manage_student_hrm';
export const ROLE_MANAGE_STAFF = 'manage_staff_hrm';
export const ROLE_MANAGE_LECTURER = 'manage_lecturer_hrm';
export const ROLE_RECEPT = '_RECEPT';

export function getCurrentRole() {
  return localStorage.getItem('role');
}

