// src/api/products.js
import API from "./client";

// استخدام public endpoints للعرض العام
export function searchProducts({
  q,
  category,
  model,
  productCode,
  page,
  limit,
}) {
  return API.get("/public/products", {
    params: {
      q,
      category,
      model,
      productCode,
      page,
      limit,
    },
  });
}

export function getProductById(id) {
  return API.get(`/public/products/${id}`);
}

export default API;

