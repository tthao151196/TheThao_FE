// src/boot/urlRewrite.js
const API_ROOT = (import.meta.env.VITE_API_URL || "https://thethao-be-9hcx.onrender.com").replace(/\/+$/, "");
const LOCAL_HOSTS = ["http://127.0.0.1:8000", "http://localhost:8000"];

const upgrade = (u) => (u ? u.replace(/^http:\/\//i, "https://") : u);
const rewrite = (u) => {
  if (!u) return u;
  let url = typeof u === "string" ? u : String(u);
  for (const h of LOCAL_HOSTS) {
    if (url.startsWith(h)) url = API_ROOT + url.slice(h.length);
  }
  return upgrade(url);
};

// fetch
const _fetch = window.fetch;
window.fetch = (...args) => {
  if (args[0]) args[0] = rewrite(args[0]);
  return _fetch(...args);
};

// XHR
const _open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  return _open.call(this, method, rewrite(url), ...rest);
};

// Image.src
const d = Object.getOwnPropertyDescriptor(Image.prototype, "src");
Object.defineProperty(Image.prototype, "src", {
  set(v) { d.set.call(this, rewrite(v)); },
  get() { return d.get.call(this); }
});


