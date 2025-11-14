// src/api/admin.js
import API from "./client";

// ===== إدارة المستخدمين =====
export function fetchUsers(options = {}) {
  return API.get("/admin/users", {
    signal: options.signal,
    timeout: 10000,
  });
}

export function createUser(data) {
  return API.post("/admin/users", data);
}

export function deleteUser(id) {
  return API.delete(`/admin/users/${id}`);
}

// ===== إحصائيات =====
export function fetchStats(options = {}) {
  return API.get("/admin/stats", {
    signal: options.signal,
    timeout: 10000,
  });
}

// ===== الصور =====
export function fetchImages({
  page = 1,
  limit = 8,
  search = "",
  assigned,
  ids,
} = {}) {
  const params = { page, limit };
  if (search) params.search = search;
  if (assigned !== undefined) params.assigned = assigned;
  if (ids) params.ids = ids;
  return API.get("/admin/images", {
    params,
  });
}

export function toggleWatermark(id) {
  return API.patch(`/images/${id}/watermark-toggle`);
}

export function fetchJobStatus(jobId) {
  return API.get(`/job-status/${jobId}`);
}

export function deleteImage(id) {
  return API.delete(`/admin/images/${id}`);
}

export function uploadImage(formData) {
  return API.post("/images/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// ===== الفئات =====
// استخدام public endpoint للعرض العام
export function fetchCategories({ page = 1, limit = 10 } = {}) {
  return API.get("/categories", {
    params: { page, limit },
  });
}

export function createCategory(data) {
  return API.post("/admin/categories", data);
}

export function updateCategory(id, data) {
  return API.put(`/admin/categories/${id}`, data);
}

export function deleteCategory(id) {
  return API.delete(`/admin/categories/${id}`);
}

// ===== المنتجات =====
export function fetchProducts({ page = 1, limit = 12, q = "", category = "", model = "", productCode = "" } = {}) {
  const params = { page, limit };
  if (q) params.q = q;
  if (category) params.category = category;
  if (model) params.model = model;
  if (productCode) params.productCode = productCode;

  return API.get("/products", { params });
}

export function fetchProduct(id) {
  return API.get(`/products/${id}`);
}

export function createProduct(data) {
  return API.post("/products", data);
}

export function updateProduct(id, data) {
  return API.put(`/products/${id}`, data);
}

export function deleteProduct(id) {
  return API.delete(`/products/${id}`);
}

export default API;
