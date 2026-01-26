import { apiFetch } from './api';

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
  }
  return response;
}