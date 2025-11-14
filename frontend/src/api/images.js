// src/api/images.js
import API from "./client";

// استخدام public endpoints للعرض العام
export function searchImages({
  q,
  category,
  brand,
  model,
  sizeMin,
  sizeMax,
  page,
  limit,
}) {
  return API.get("/public/images", {
    params: {
      q,
      category,
      brand,
      model,
      sizeMin,
      sizeMax,
      page,
      limit,
    },
  });
}

export function getImageById(id) {
  return API.get(`/public/images/${id}`);
}

export function getRelatedImages(id) {
  return API.get(`/public/images/${id}/related`);
}

export default API;
