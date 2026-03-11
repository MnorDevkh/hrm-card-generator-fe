import { apiFetch } from './api';

export async function fetchDashboardData() {
  return apiFetch('/dashboard');
}
