export const ROLE_ADMIN = 'admin_hrm';
export const ROLE_MANAGE_STUDENT = 'manage_student_hrm';
export const ROLE_MANAGE_STAFF = 'manage_staff_hrm';
export const ROLE_MANAGE_LECTURER = 'manage_lecturer_hrm';
export const ROLE_RECEPT = '_RECEPT';

export const KNOWN_ROLES = [
  ROLE_ADMIN,
  ROLE_MANAGE_STUDENT,
  ROLE_MANAGE_STAFF,
  ROLE_MANAGE_LECTURER,
  ROLE_RECEPT,
];

export const INVALID_ROLE_CODE = 'INVALID_ROLE';

export function isKnownRole(role) {
  return typeof role === 'string' && KNOWN_ROLES.includes(role);
}

export function getCurrentRole() {
  return localStorage.getItem('role');
}
