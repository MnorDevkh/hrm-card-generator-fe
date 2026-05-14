import { apiFetch } from './api';

/**
 * Loads the current user from the backend and updates localStorage `role`
 * so it matches the database (not only the JWT or a stale client value).
 * @returns {Promise<{ id: string, username: string, email: string, role: string } | null>}
 */
export async function syncCurrentUserFromServer() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return null;
  }
  const me = await apiFetch('/auth/me', {
    method: 'GET',
  });
  if (me?.role) {
    localStorage.setItem('role', me.role);
  }
  return me;
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{access_token: string, token_type: string}>}
 */
export async function login(email, password) {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.access_token) {
    localStorage.setItem('auth_token', response.access_token);
    if (response.role) {
      localStorage.setItem('role', response.role);
    }
    try {
      await syncCurrentUserFromServer();
    } catch {
      // Role already set from login; /auth/me is best-effort sync
    }
  }
  return response;
}
