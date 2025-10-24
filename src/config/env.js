const normalize = (u) => (u || "").replace(/\/+$/, "");

export const API_ROOT =
  normalize(import.meta.env.VITE_API_URL || "https://thethao-be-9hcx.onrender.com");

export const API_BASE = `${API_ROOT}/api`;

export const ASSET_ORIGIN =
  normalize(import.meta.env.VITE_ASSET_ORIGIN || API_ROOT);

export const toHttps = (url) => (url ? url.replace(/^http:\/\//i, "https://") : url);
