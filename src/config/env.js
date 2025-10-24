// src/config/env.js

// --- helpers ---
const trim = (s = "") => String(s).trim();
const normalize = (u = "") => trim(u).replace(/\/+$/, "");          // bỏ dấu / ở cuối
export const toHttps = (url) => (url ? url.replace(/^http:\/\//i, "https://") : url);

// ghép a + b đảm bảo chỉ có 1 dấu /
const join = (a, b = "") => `${normalize(a)}/${String(b).replace(/^\/+/, "")}`;

// --- đọc biến môi trường (Vite) ---
const rawApiRoot =
  trim(import.meta.env.VITE_API_URL) ||
  "https://thethao-be-9hcx.onrender.com";

const rawAssetOrigin =
  trim(import.meta.env.VITE_ASSET_ORIGIN) || rawApiRoot;

// Ép https + chuẩn hoá
export const API_ROOT = normalize(toHttps(rawApiRoot));
export const ASSET_ORIGIN = normalize(toHttps(rawAssetOrigin));

// Đảm bảo chỉ có đúng 1 lần /api ở cuối
const ensureApiBase = (root) => (/\/api$/i.test(root) ? root : join(root, "api"));
export const API_BASE = ensureApiBase(API_ROOT);

// Optional tiện dụng: ghép path asset
export const asset = (path = "") => join(ASSET_ORIGIN, path);
