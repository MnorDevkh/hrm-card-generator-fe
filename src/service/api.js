import { environment } from '../environments/environment';

const apiUrl = environment.apiBaseUrl.replace(/\/+$/, ''); // Normalize base URL

export async function apiFetch(path, options = {}) {
  // Get token from localStorage
  const token = localStorage.getItem('auth_token');

  const defaultHeaders = {
    'accept': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData, let the browser do it
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${apiUrl}${path}`, mergedOptions);

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.statusText} (${response.status})`);
    error.response = response;

    // If the token is invalid, clear it and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('role');
      // Use location.href to force a page reload, clearing any in-memory state
      window.location.href = '/login';
    } else if (response.status === 403) {
      // Logged in but not allowed for this resource — send home without dropping the session
      window.location.href = '/';
    }
    throw error;
  }

  return response.json();
}