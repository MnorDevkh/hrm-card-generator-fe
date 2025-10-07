import { apiFetch } from "./api";

/**
 * @param {number | string} id
 * @returns {Promise<any>}
 */
export async function getBackground(id) {
  return apiFetch(`/upload_image/byId/${id}`);
}

/**
 * @param {string} type
 * @returns {Promise<any>}
 */
export async function getImagesByType(type) {
  return apiFetch(`/upload_image/type/${type}`);
}

export async function uploadImage(formData) {
  return apiFetch("/upload_image", {
    method: "POST",
    body: formData,
  });
}

export async function deleteImage(id) {
  return apiFetch(`/upload_image/${id}`, {
    method: "DELETE",
  });
}

export async function getfileByid(id) {
    return apiFetch(`/upload_image/${id}`);
    
}
