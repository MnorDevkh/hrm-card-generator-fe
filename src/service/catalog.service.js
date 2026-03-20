import { apiFetch } from './api.js';

/**
 * @param {string[]|undefined} categories - e.g. ['faculty','department']. Omit for all.
 */
export async function getCatalogOptions(categories) {
  const params = new URLSearchParams();
  if (categories?.length) {
    params.set('categories', categories.join(','));
  }
  const q = params.toString();
  return apiFetch(`/catalog/options${q ? `?${q}` : ''}`);
}

export async function listCatalogItems(category) {
  return apiFetch(`/catalog/items?category=${encodeURIComponent(category)}`);
}

export async function createCatalogItem(body) {
  return apiFetch('/catalog/items', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateCatalogItem(id, body) {
  return apiFetch(`/catalog/items/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteCatalogItem(id) {
  return apiFetch(`/catalog/items/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function seedCatalogDefaults() {
  return apiFetch('/catalog/seed', { method: 'POST' });
}
