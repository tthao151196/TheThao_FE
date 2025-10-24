// src/config/env.js
const normalize = (u) => (u || "").replace(/\/+$/, "");

// URL gốc của BE (KHÔNG có /api và không có dấu / ở cuối)
export const API_ROOT =
  normalize(import.meta.env.VITE_API_URL || "https://thethao-be-9hcx.onrender.com");

// Mọi request API phải đi qua /api
export const API_BASE = `${API_ROOT}/api`;

// Nguồn ảnh/tệp tĩnh (nếu không set riêng thì dùng luôn API_ROOT)
export const ASSET_ORIGIN =
  normalize(import.meta.env.VITE_ASSET_ORIGIN || API_ROOT);

// Chuyển http -> https để tránh Mixed Content khi DB trả http
export const toHttps = (url) => (url ? url.replace(/^http:\/\//i, "https://") : url);
