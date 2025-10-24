
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx"; // ✅ dùng để đọc Excel

// const API_ROOT = "http://127.0.0.1:8000";       // không có /api
// const API_BASE = `${API_ROOT}/api`;             // có /api
// const PLACEHOLDER = "https://placehold.co/120x90?text=No+Img";

// // 👉 URL tổng hợp tồn kho theo IDs (ưu tiên DB)
// const STOCK_SUMMARY_URL = (ids) =>
//   `${API_BASE}/admin/stock/summary?product_ids=${ids.join(",")}`;

// // 👉 URL tổng hợp thương hiệu & danh mục theo IDs (từ bảng ptdt_product - nếu BE hỗ trợ)
// const BRAND_CATEGORY_SUMMARY_URL = (ids) =>
//   `${API_BASE}/admin/ptdt_product/brand-category?product_ids=${ids.join(",")}`;

// // 👉 NEW: URL tổng tồn kho & tổng đã bán (đổi lại nếu BE của bạn khác đường dẫn)
// const STOCK_TOTAL_URL = `${API_BASE}/admin/stock/total`;
// const SOLD_TOTAL_URL  = `${API_BASE}/admin/orders/total-sold-products`;

// /** Helper: trích đúng object paginator dù BE trả trực tiếp hay bọc trong {data: {...}} */
// function pickPaginator(payload) {
//   if (payload && Array.isArray(payload.data) && typeof payload.current_page !== "undefined") {
//     return payload;
//   }
//   if (payload && payload.data && Array.isArray(payload.data.data) && typeof payload.data.current_page !== "undefined") {
//     return payload.data;
//   }
//   if (Array.isArray(payload)) {
//     return { data: payload, current_page: 1, last_page: 1, total: payload.length, per_page: payload.length || 10 };
//   }
//   return { data: [], current_page: 1, last_page: 1, total: 0, per_page: 10 };
// }

// // ==== Helpers cho Import Preview ====
// function toSlug(str = "") {
//   return String(str)
//     .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// }

// // Map header linh hoạt -> key chuẩn của BE
// const HEADER_MAP = {
//   "name": "name", "tên": "name", "ten": "name",
//   "slug": "slug",
//   "brand_id": "brand_id", "brand": "brand_id", "thương hiệu": "brand_id", "thuonghieu": "brand_id",
//   "category_id": "category_id", "category": "category_id", "danh mục": "category_id", "danhmuc": "category_id",
//   "price_root": "price_root", "giá gốc": "price_root", "giagoc": "price_root",
//   "price_sale": "price_sale", "giá sale": "price_sale", "giasale": "price_sale",
//   "qty": "qty", "số lượng": "qty", "soluong": "qty",
//   "description": "description", "mô tả": "description", "mota": "description",
//   "detail": "detail", "chi tiết": "detail", "chitiet": "detail",
//   "status": "status", "trạng thái": "status", "trangthai": "status",
//   "thumbnail": "thumbnail", "thumbnail_url": "thumbnail", "ảnh": "thumbnail", "anh": "thumbnail",
// };

// function normalizeHeaders(rawObj) {
//   const out = {};
//   Object.keys(rawObj || {}).forEach((k) => {
//     const key = String(k || "").trim().toLowerCase();
//     const mapped = HEADER_MAP[key];
//     if (mapped) out[mapped] = rawObj[k];
//   });
//   return out;
// }

// // 👉 Helper đọc số từ payload {data:number} | {total:number} | {count:number}
// function pickNumber(obj, keys = ["data", "total", "count", "value"]) {
//   if (!obj || typeof obj !== "object") return 0;
//   for (const k of keys) {
//     const v = obj[k];
//     if (typeof v === "number" && isFinite(v)) return v;
//   }
//   return 0;
// }

// /* =========================
//    DonutChart (SVG thuần)
//    ========================= */
// function DonutChart({ sold = 0, inStock = 0, size = 150, thickness = 22 }) {
//   const total = Math.max(0, Number(sold)) + Math.max(0, Number(inStock));
//   const r = size / 2 - thickness / 2;
//   const c = 2 * Math.PI * r;

//   // phần trăm đã bán
//   const soldRatio = total > 0 ? Math.min(1, Math.max(0, sold / total)) : 0;
//   const soldLength = c * soldRatio;

//   // màu theo mockup (hồng/đỏ cho đã bán, xanh cho tồn kho)
//   const SOLD_COLOR = "#ef4444";
//   const STOCK_COLOR = "#3b82f6";

//   return (
//     <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//         <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
//           {/* nền: tồn kho */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={r}
//             fill="none"
//             stroke={STOCK_COLOR}
//             strokeWidth={thickness}
//             strokeLinecap="round"
//             opacity={0.9}
//           />
//           {/* phần đã bán nằm trên */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={r}
//             fill="none"
//             stroke={SOLD_COLOR}
//             strokeWidth={thickness}
//             strokeDasharray={`${soldLength} ${Math.max(0, c - soldLength)}`}
//             strokeLinecap="round"
//           />
//         </g>
//         {/* lỗ donut */}
//         <circle cx={size / 2} cy={size / 2} r={r - thickness / 2} fill="#fff" />
//       </svg>

//       {/* Legend */}
//       <div style={{ display: "grid", gap: 8 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <span style={{ width: 14, height: 8, background: SOLD_COLOR, borderRadius: 2 }}></span>
//           <span style={{ fontSize: 14 }}>Đã bán:5 <b>{Number(sold || 0).toLocaleString("vi-VN")}</b></span>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <span style={{ width: 14, height: 8, background: STOCK_COLOR, borderRadius: 2 }}></span>
//           <span style={{ fontSize: 14 }}>Tồn kho: <b>{Number(inStock || 0).toLocaleString("vi-VN")}</b></span>
//         </div>
//         <div style={{ color: "#6b7280", fontSize: 13 }}>
//           Tổng: <b>{Number(total).toLocaleString("vi-VN")}</b>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Products() {
//   const [items, setItems] = useState([]);
//   const [stocks, setStocks] = useState({});
//   const [q, setQ] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [stockLoading, setStockLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [deletingId, setDeletingId] = useState(null);
//   const [deletingMany, setDeletingMany] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const [viewItem, setViewItem] = useState(null);

//   // 🔢 Phân trang
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   const [meta, setMeta] = useState({
//     current_page: 1,
//     last_page: 1,
//     total: 0,
//     per_page: 10,
//   });

//   // 🔁 Reload sau import
//   const [reload, setReload] = useState(0);

//   // ⬆️ Import Excel states
//   const [importing, setImporting] = useState(false);
//   const fileInputRef = useRef(null);

//   // ==== Import Preview states ====
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewRows, setPreviewRows] = useState([]);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [showOnlyErrors, setShowOnlyErrors] = useState(false);

//   // ✅ map thương hiệu & danh mục
//   const [brandCats, setBrandCats] = useState({});
//   const [brandCatLoading, setBrandCatLoading] = useState(false);

//   // ✅ Tổng số sp hiện có (tồn kho) & đã bán
//   const [totalInStock, setTotalInStock] = useState(null);
//   const [totalSold, setTotalSold] = useState(null);
//   const [topCardLoading, setTopCardLoading] = useState(false);

//   const navigate = useNavigate();

//   /* ===== Load danh sách theo trang ===== */
//   useEffect(() => {
//     const ac = new AbortController();
//     const token = localStorage.getItem("admin_token");

//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");

//         const url = `${API_BASE}/admin/products?page=${page}&per_page=${perPage}`;
//         const res = await fetch(url, {
//           signal: ac.signal,
//           headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const raw = await res.json();

//         const pg = pickPaginator(raw);
//         const list = pg.data ?? [];
//         setItems(Array.isArray(list) ? list : []);

//         setMeta({
//           current_page: Number(pg.current_page ?? page),
//           last_page: Number(pg.last_page ?? 1),
//           total: Number(pg.total ?? (Array.isArray(list) ? list.length : 0)),
//           per_page: Number(pg.per_page ?? perPage),
//         });

//         setSelected([]);

//         const ids = (Array.isArray(list) ? list : []).map((x) => x.id).filter(Boolean);
//         if (ids.length) {
//           try {
//             setStockLoading(true);
//             const res2 = await fetch(STOCK_SUMMARY_URL(ids), {
//               signal: ac.signal,
//               headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//             });
//             if (res2.ok) {
//               const sum = await res2.json();
//               const map = sum?.data ?? {};
//               setStocks(map);
//             }
//           } catch {} finally { setStockLoading(false); }

//           try {
//             setBrandCatLoading(true);
//             const res3 = await fetch(BRAND_CATEGORY_SUMMARY_URL(ids), {
//               signal: ac.signal,
//               headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//             });
//             if (res3.ok) {
//               const bc = await res3.json();
//               const mapBC = bc?.data ?? {};
//               setBrandCats(mapBC);
//             } else setBrandCats({});
//           } catch { setBrandCats({}); }
//           finally { setBrandCatLoading(false); }
//         } else {
//           setStocks({});
//           setBrandCats({});
//         }
//       } catch (e) {
//         if (e.name !== "AbortError") setErr("Không tải được danh sách sản phẩm.");
//         setItems([]);
//         setMeta({ current_page: 1, last_page: 1, total: 0, per_page: perPage });
//         setStocks({});
//         setBrandCats({});
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => ac.abort();
//   }, [page, perPage, reload]);

//   /* ===== NEW: load số liệu tổng (2 thẻ / donut) ===== */
//   useEffect(() => {
//     const ac = new AbortController();
//     const token = localStorage.getItem("admin_token");

//     (async () => {
//       try {
//         setTopCardLoading(true);

//         const [r1, r2] = await Promise.allSettled([
//           fetch(STOCK_TOTAL_URL, { signal: ac.signal, headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
//           fetch(SOLD_TOTAL_URL,  { signal: ac.signal, headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
//         ]);

//         if (r1.status === "fulfilled" && r1.value.ok) {
//           const j = await r1.value.json().catch(() => ({}));
//           setTotalInStock(pickNumber(j));
//         } else {
//           setTotalInStock((prev) => {
//             const est = Object.values(stocks).reduce((s, v) => s + Number(v || 0), 0);
//             return Number.isFinite(est) ? est : (prev ?? 0);
//           });
//         }

//         if (r2.status === "fulfilled" && r2.value.ok) {
//           const j = await r2.value.json().catch(() => ({}));
//           setTotalSold(pickNumber(j));
//         } else {
//           setTotalSold((v) => v ?? 0);
//         }
//       } catch {} finally { setTopCardLoading(false); }
//     })();

//     return () => ac.abort();
//   }, [reload, stocks]);

//   // ===== Helper tồn kho / brand / category =====
//   const getQty = (p) => {
//     const id = p?.id;
//     if (id != null && Object.prototype.hasOwnProperty.call(stocks, id))
//       return Number(stocks[id] ?? 0);
//     return Number(p?.qty ?? 0);
//   };

//   const getBrandName = (p) => {
//     const id = p?.id;
//     const fromMap = id != null ? brandCats[id] : null;
//     return (
//       fromMap?.brand_name ??
//       p?.brand_name ??
//       p?.brand?.name ??
//       (p?.brand_id != null ? `#${p.brand_id}` : "")
//     );
//   };
//   const getCategoryName = (p) => {
//     const id = p?.id;
//     const fromMap = id != null ? brandCats[id] : null;
//     return (
//       fromMap?.category_name ??
//       p?.category_name ??
//       p?.category?.name ??
//       (p?.category_id != null ? `#${p.category_id}` : "")
//     );
//   };

//   // ===== Xoá sản phẩm & xoá nhiều =====
//   async function handleDelete(id, { silent = false } = {}) {
//     const token = localStorage.getItem("admin_token");
//     if (!silent) {
//       if (!window.confirm("Bạn chắc chắn muốn xoá sản phẩm này?")) return false;
//     }
//     try {
//       setDeletingId(id);
//       const res = await fetch(`${API_BASE}/admin/products/${id}`, {
//         method: "DELETE",
//         headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data.message || "Xoá thất bại");

//       setItems((prev) => prev.filter((x) => x.id !== id));
//       setStocks((prev) => { const n = { ...prev }; delete n[id]; return n; });
//       setBrandCats((prev) => { const n = { ...prev }; delete n[id]; return n; });

//       if (!silent) alert("✅ Đã chuyển sản phẩm vào thùng rác");
//       return true;
//     } catch (err) {
//       if (!silent) alert(`❌ Lỗi xoá: ${err.message}`);
//       return false;
//     } finally {
//       setDeletingId(null);
//     }
//   }

//   async function handleBulkDelete() {
//     if (!selected.length) return alert("Chưa chọn sản phẩm nào");
//     if (!window.confirm(`Xoá ${selected.length} sản phẩm?`)) return;

//     setDeletingMany(true);
//     let ok = 0; const fail = [];
//     for (const id of selected) {
//       const okOne = await handleDelete(id, { silent: true });
//       if (okOne) ok++; else fail.push(id);
//     }
//     setDeletingMany(false); setSelected([]);

//     if (ok && fail.length === 0) alert(`✅ Đã xoá ${ok} sản phẩm.`);
//     else if (ok && fail.length > 0) alert(`⚠️ Thành công ${ok}, thất bại ${fail.length}: ${fail.join(", ")}`);
//     else alert("❌ Không xoá được sản phẩm nào.");
//   }

//   // ===== Import cũ / Preview mới (giữ nguyên) =====
//   async function handleImport(file) {
//     const token = localStorage.getItem("admin_token");
//     try {
//       setImporting(true);
//       const form = new FormData();
//       form.append("file", file);
//       form.append("mode", "upsert");
//       const res = await fetch(`${API_BASE}/admin/products/import`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: form,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Import thất bại");
//       alert(`✔ Import xong:
// - Thêm: ${data.inserted}
// - Cập nhật: ${data.updated}
// - Bỏ qua: ${data.skipped}
// ${data.errors?.length ? `- Lỗi: ${data.errors.length} dòng` : ""}`);
//       setReload((x) => x + 1); setPage(1);
//     } catch (e) { alert(`❌ Lỗi import: ${e.message}`); }
//     finally { setImporting(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
//   }

//   function validateRow(d, idx, allRows) {
//     const errors = [];
//     const price_root = Number(d.price_root ?? 0);
//     const price_sale = Number(d.price_sale ?? 0);
//     const qty = Number.isFinite(Number(d.qty)) ? Number(d.qty) : d.qty;

//     if (!d.name || String(d.name).trim() === "") errors.push("Thiếu tên (name)");
//     if (!d.slug || String(d.slug).trim() === "") errors.push("Thiếu slug (đã auto-gợi ý)");
//     if (d.brand_id === undefined || d.brand_id === "") errors.push("Thiếu brand_id");
//     if (d.category_id === undefined || d.category_id === "") errors.push("Thiếu category_id");

//     if (isNaN(price_root) || price_root < 0) errors.push("price_root phải là số ≥ 0");
//     if (isNaN(price_sale) || price_sale < 0) errors.push("price_sale phải là số ≥ 0");
//     if (!Number.isInteger(Number(qty)) || Number(qty) < 0) errors.push("qty phải là số nguyên ≥ 0");
//     if (!isNaN(price_root) && !isNaN(price_sale) && price_sale > price_root) {
//       errors.push("price_sale không được lớn hơn price_root");
//     }

//     const curSlug = (d.slug || "").toString().trim().toLowerCase();
//     if (curSlug) {
//       const dupIndex = allRows.findIndex((r, i2) =>
//         i2 !== idx && (r.data.slug || "").toString().trim().toLowerCase() === curSlug
//       );
//       if (dupIndex !== -1) errors.push(`Slug trùng ở dòng ${dupIndex + 2}`);
//     }
//     return errors;
//   }

//   async function handleFileSelected(file) {
//     try {
//       const ab = await file.arrayBuffer();
//       const wb = XLSX.read(ab, { type: "array" });
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

//       let rows = json.map((raw, i) => {
//         const d = normalizeHeaders(raw);
//         if (!d.thumbnail && d.thumbnail_url) d.thumbnail = d.thumbnail_url;
//         if (!d.slug && d.name) d.slug = toSlug(d.name);
//         if (d.price_root !== undefined) d.price_root = Number(d.price_root || 0);
//         if (d.price_sale !== undefined) d.price_sale = Number(d.price_sale || 0);
//         if (d.qty !== undefined) d.qty = Number.isFinite(Number(d.qty)) ? Number(d.qty) : 0;
//         if (typeof d.status === "string") {
//           const s = d.status.trim().toLowerCase();
//           d.status = ["1","true","active","đang bán","dang ban"].includes(s) ? 1 : 0;
//         }
//         return { rowIndex: i, data: d, errors: [] };
//       });

//       rows = rows.map((r, idx) => ({ ...r, errors: validateRow(r.data, idx, rows) }));
//       rows.sort((a, b) => (b.errors.length > 0) - (a.errors.length > 0));

//       setPreviewRows(rows);
//       setOriginalFile(file);
//       setPreviewOpen(true);
//     } catch (e) {
//       alert("Không đọc được file Excel: " + e.message);
//     } finally {
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   }

//   function updateCell(idx, key, value) {
//     setPreviewRows((prev) => {
//       const copy = prev.map((r) => ({ ...r, data: { ...r.data }, errors: [...r.errors] }));
//       copy[idx].data[key] = value;
//       if (key === "name" && (!copy[idx].data.slug || copy[idx].data.slug.trim() === "")) {
//         copy[idx].data.slug = toSlug(value);
//       }
//       copy[idx].errors = validateRow(copy[idx].data, idx, copy);
//       copy.sort((a, b) => (b.errors.length > 0) - (a.errors.length > 0));
//       return copy;
//     });
//   }

//   function deleteRow(idx) {
//     setPreviewRows((prev) => {
//       const copy = prev.slice();
//       copy.splice(idx, 1);
//       return copy
//         .map((r, i) => ({ ...r, errors: validateRow(r.data, i, copy) }))
//         .sort((a, b) => (b.errors.length > 0) - (a.errors.length > 0));
//     });
//   }

//   function hasAnyError(rows = previewRows) {
//     return rows.some((r) => r.errors?.length);
//   }

//   function toCSV(rows) {
//     const headers = [
//       "name","slug","brand_id","category_id",
//       "price_root","price_sale","qty",
//       "description","detail","status","thumbnail"
//     ];
//     const esc = (v) => {
//       const s = v == null ? "" : String(v);
//       if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
//       return s;
//     };
//     const lines = [];
//     lines.push(headers.join(","));
//     rows.forEach(({ data }) => {
//       const row = headers.map((h) => esc(data[h] ?? ""));
//       lines.push(row.join(","));
//     });
//     return "\uFEFF" + lines.join("\n");
//   }

//   async function confirmImportValidRows() {
//     const validRows = previewRows.filter((r) => !r.errors?.length);
//     if (!validRows.length) return alert("Không có dòng hợp lệ để import.");

//     const token = localStorage.getItem("admin_token");
//     try {
//       setImporting(true);
//       const csv = toCSV(validRows);
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
//       const file = new File([blob], (originalFile?.name?.replace(/\.[^.]+$/,"") || "import") + "_clean.csv", { type: blob.type });

//       const form = new FormData();
//       form.append("file", file);
//       form.append("mode", "upsert");

//       const res = await fetch(`${API_BASE}/admin/products/import`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: form,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Import thất bại");

//       alert(`✔ Import xong:
// - Thêm: ${data.inserted}
// - Cập nhật: ${data.updated}
// - Bỏ qua: ${data.skipped}
// ${data.errors?.length ? `- Lỗi: ${data.errors.length} dòng` : ""}`);

//       setPreviewOpen(false);
//       setPreviewRows([]);
//       setOriginalFile(null);
//       setReload((x) => x + 1);
//       setPage(1);
//     } catch (e) {
//       alert(`❌ Lỗi import: ${e.message}`);
//     } finally {
//       setImporting(false);
//     }
//   }

//   // ===== Lọc cục bộ theo tên/slug (trên TRANG hiện tại) =====
//   const filtered = useMemo(() => {
//     const s = q.trim().toLowerCase();
//     if (!s) return items;
//     return items.filter(
//       (x) =>
//         x.name?.toLowerCase().includes(s) ||
//         x.slug?.toLowerCase().includes(s)
//     );
//   }, [q, items]);

//   const toggleSelect = (id) =>
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );

//   const allChecked = filtered.length > 0 && selected.length === filtered.length;

//   const toggleAll = () => setSelected(allChecked ? [] : filtered.map((x) => x.id));

//   // ===== Pagination helpers =====
//   const canPrev = meta.current_page > 1;
//   const canNext = meta.current_page < meta.last_page;

//   const gotoPage = (p) => {
//     if (p < 1 || p > meta.last_page || p === meta.current_page) return;
//     setPage(p);
//   };

//   const buildPageNumbers = () => {
//     const total = meta.last_page;
//     const cur = meta.current_page;
//     const delta = 1;
//     const pages = new Set([1, total]);

//     for (let i = cur - delta; i <= cur + delta; i++) {
//       if (i >= 1 && i <= total) pages.add(i);
//     }
//     if (total >= 2) {
//       pages.add(2);
//       pages.add(total - 1);
//     }
//     return Array.from(pages).sort((a, b) => a - b);
//   };

//   const pages = buildPageNumbers();

//   // ===== Styles helper cho thẻ thống kê =====
//   const statCard = () => ({
//     background: "#fff",
//     border: "1px solid #e5e7eb",
//     borderRadius: 12,
//     padding: 16,
//     minWidth: 260,
//     boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//     display: "flex",
//     flexDirection: "column",
//     gap: 8,
//   });

//   // ===== Render =====
//   return (
//     <section style={{ padding: 20 }}>
//       {/* ====== HÀNG THẺ THỐNG KÊ ====== */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//           gap: 12,
//           marginBottom: 12,
//         }}
//       >
//         {/* Card 1: Tổng số sản phẩm hiện có */}
//         <div style={statCard()}>
//           <div style={{ fontSize: 14, color: "#374151", fontWeight: 700 }}>
//             Tổng số sản phẩm hiện có
//           </div>
//           <div style={{ fontSize: 32, fontWeight: 800 }}>
//             {topCardLoading && totalInStock === null ? "…" : (Number(totalInStock ?? 0)).toLocaleString("vi-VN")}
//           </div>
//           <div style={{ color: "#10b981", fontSize: 13 }}>
//             ↑ Tổng số sản phẩm còn trong kho
//           </div>
//         </div>

//         {/* Card 2: Donut thống kê sản phẩm */}
//         <div style={statCard()}>
//           <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
//             Thống kê sản phẩm
//           </div>
//           <DonutChart
//             sold={Number(totalSold ?? 0)}
//             inStock={Number(totalInStock ?? 0)}
//             size={160}
//             thickness={24}
//           />
//         </div>
//       </div>

//       {/* Thanh tiêu đề */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 10,
//           flexWrap: "wrap",
//         }}
//       >
//         <h1 style={{ fontSize: 24, fontWeight: 700 }}>
//           Quản lý sản phẩm
//           {stockLoading ? " · đang tải tồn kho…" : ""}
//           {brandCatLoading ? " · đang tải thương hiệu/danh mục…" : ""}
//         </h1>

//         <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Tìm tên/slug… (trang hiện tại)"
//             style={{
//               height: 36,
//               padding: "0 10px",
//               border: "1px solid #ddd",
//               borderRadius: 8,
//             }}
//           />

//           <select
//             value={perPage}
//             onChange={(e) => {
//               setPerPage(Number(e.target.value));
//               setPage(1);
//             }}
//             style={{ height: 36, borderRadius: 8, border: "1px solid #ddd" }}
//             title="Số dòng mỗi trang"
//           >
//             {[5, 10, 20, 30, 50, 100].map((n) => (
//               <option key={n} value={n}>
//                 {n}/trang
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={() => navigate("/admin/products/add")}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 8,
//               border: "1px solid #0f62fe",
//               background: "#0f62fe",
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             + Thêm
//           </button>

//           <button
//             onClick={() => fileInputRef.current?.click()}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 10,
//               border: "none",
//               background: "#2563eb",
//               color: "#fff",
//               cursor: "pointer",
//               fontWeight: 700,
//             }}
//           >
//             ⬆ Import Excel
//           </button>

//           <button
//             onClick={async () => {
//               const token = localStorage.getItem("authToken") || localStorage.getItem("token") || "";
//               try {
//                 const res = await fetch("http://127.0.0.1:8000/api/admin/products/export", {
//                   method: "GET",
//                   headers: {
//                     Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                   },
//                 });
//                 if (!res.ok) throw new Error("Export thất bại");
//                 const blob = await res.blob();
//                 const url = window.URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = url;
//                 a.download = "products_export.xlsx";
//                 a.click();
//                 window.URL.revokeObjectURL(url);
//               } catch (err) {
//                 alert("❌ " + err.message);
//               }
//             }}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 10,
//               border: "none",
//               background: "#10b981",
//               color: "#fff",
//               cursor: "pointer",
//               fontWeight: 700,
//             }}
//           >
//             ⬇ Export Excel
//           </button>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".xlsx,.xls,.csv"
//             className="hidden"
//             onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
//             style={{ display: "none" }}
//           />

//           <button
//             onClick={handleBulkDelete}
//             disabled={deletingMany || !selected.length}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 8,
//               border: "1px solid #e11d48",
//               background: selected.length && !deletingMany ? "#e11d48" : "#fca5a5",
//               color: "#fff",
//               cursor: selected.length && !deletingMany ? "pointer" : "not-allowed",
//             }}
//           >
//             {deletingMany ? "Đang xoá…" : `🗑 Xoá chọn (${selected.length})`}
//           </button>
//           <button
//             onClick={() => navigate("/admin/products/trash")}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 8,
//               border: "1px solid #6b7280",
//               background: "#6b7280",
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             🗂 Thùng rác
//           </button>
//         </div>
//       </div>

//       {/* Bảng sản phẩm */}
//       {loading && <p>Đang tải dữ liệu…</p>}
//       {err && <p style={{ color: "red" }}>{err}</p>}

//       {!loading && (
//         <>
//           <div style={{ overflowX: "auto", marginTop: 12 }}>
//             <table
//               width="100%"
//               cellPadding={8}
//               style={{ borderCollapse: "collapse", background: "#fff", borderRadius: 8 }}
//             >
//               <thead>
//                 <tr style={{ background: "#fafafa" }}>
//                   <th><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
//                   <th align="left">ID</th>
//                   <th align="left">Tên</th>
//                   <th align="left">Slug</th>
//                   <th align="left">Thương hiệu</th>
//                   <th align="left">Danh mục</th>
//                   <th align="right">Giá gốc</th>
//                   <th align="right">Giá sale</th>
//                   <th align="right">Tồn kho (DB)</th>
//                   <th align="center">Ảnh</th>
//                   <th align="center">Hành động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((p) => (
//                   <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={selected.includes(p.id)}
//                         onChange={() => toggleSelect(p.id)}
//                       />
//                     </td>
//                     <td>{p.id}</td>
//                     <td>{p.name}</td>
//                     <td>{p.slug}</td>
//                     <td>{getBrandName(p)}</td>
//                     <td>{getCategoryName(p)}</td>
//                     <td align="right">₫{(p.price_root || 0).toLocaleString("vi-VN")}</td>
//                     <td align="right">₫{(p.price_sale || 0).toLocaleString("vi-VN")}</td>
//                     <td align="right">{getQty(p).toLocaleString("vi-VN")}</td>
//                     <td align="center">
//                       <img
//                         src={p.thumbnail_url || PLACEHOLDER}
//                         alt={p.name}
//                         style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
//                         onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//                       />
//                     </td>
//                     <td align="center">
//                       <button
//                         onClick={() => setViewItem(p)}
//                         style={{ padding: "4px 10px", marginRight: 4, background: "#2563eb", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}
//                       >
//                         👁 Xem
//                       </button>
//                       <button
//                         onClick={() => navigate(`/admin/products/edit/${p.id}`)}
//                         style={{ padding: "4px 10px", marginRight: 4, background: "#2e7d32", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}
//                       >
//                         ✏️ Sửa
//                       </button>
//                       <button
//                         onClick={() => handleDelete(p.id)}
//                         disabled={deletingId === p.id || deletingMany}
//                         style={{ padding: "4px 10px", background: deletingId === p.id || deletingMany ? "#ef9a9a" : "#c62828", color: "#fff", border: 0, borderRadius: 6, cursor: deletingId === p.id || deletingMany ? "not-allowed" : "pointer" }}
//                       >
//                         {deletingId === p.id ? "Đang xoá..." : "🗑 Xóa"}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {!filtered.length && (
//                   <tr>
//                     <td colSpan={11} align="center" style={{ padding: 18, color: "#777" }}>
//                       Không có dữ liệu
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Thanh phân trang */}
//           <div
//             style={{
//               marginTop: 12,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: 10,
//             }}
//           >
//             <div style={{ color: "#555" }}>
//               Tổng: <b>{Number(meta.total).toLocaleString("vi-VN")}</b> — Trang{" "}
//               <b>{meta.current_page}</b>/<b>{meta.last_page}</b>
//             </div>

//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//               <button onClick={() => gotoPage(1)} disabled={!canPrev} style={btnPager(!canPrev)}>« Đầu</button>
//               <button onClick={() => gotoPage(meta.current_page - 1)} disabled={!canPrev} style={btnPager(!canPrev)}>‹ Trước</button>

//               {pages.map((p, idx) => {
//                 const prev = pages[idx - 1];
//                 const needDots = prev && p - prev > 1;
//                 return (
//                   <span key={p} style={{ display: "inline-flex", gap: 6 }}>
//                     {needDots && <span style={{ padding: "6px 8px" }}>…</span>}
//                     <button
//                       onClick={() => gotoPage(p)}
//                       disabled={p === meta.current_page}
//                       style={btnNumber(p === meta.current_page)}
//                       title={`Trang ${p}`}
//                     >
//                       {p}
//                     </button>
//                   </span>
//                 );
//               })}

//               <button onClick={() => gotoPage(meta.current_page + 1)} disabled={!canNext} style={btnPager(!canNext)}>Sau ›</button>
//               <button onClick={() => gotoPage(meta.last_page)} disabled={!canNext} style={btnPager(!canNext)}>Cuối »</button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Modal xem chi tiết */}
//       {viewItem && (
//         <div
//           style={{
//             position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
//             background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
//             justifyContent: "center", zIndex: 1000,
//           }}
//           onClick={() => setViewItem(null)}
//         >
//           <div
//             style={{
//               background: "#fff", borderRadius: 10, padding: 20, width: 550,
//               maxHeight: "90vh", overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 style={{ fontSize: 20, marginBottom: 10, fontWeight: 700 }}>🏷 {viewItem.name}</h2>

//             <div style={{ textAlign: "center", marginBottom: 10 }}>
//               <img
//                 src={viewItem.thumbnail_url || PLACEHOLDER}
//                 alt={viewItem.name}
//                 style={{ width: 200, height: 150, objectFit: "cover", borderRadius: 6, boxShadow: "0 0 6px rgba(0,0,0,0.2)" }}
//                 onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//               />
//             </div>

//             <p><b>Slug:</b> {viewItem.slug}</p>
//             <p>
//               <b>Giá:</b> ₫{Number(viewItem.price_sale ?? 0).toLocaleString("vi-VN")}{" "}
//               <span style={{ color: "#888" }}>(Gốc: ₫{Number(viewItem.price_root ?? 0).toLocaleString("vi-VN")})</span>
//             </p>
//             <p><b>Thương hiệu:</b> {getBrandName(viewItem)}</p>
//             <p><b>Danh mục:</b> {getCategoryName(viewItem)}</p>
//             <p><b>Tồn kho (DB):</b> {getQty(viewItem).toLocaleString("vi-VN")}</p>
//             <p><b>Trạng thái:</b> {viewItem.status}</p>

//             <div style={{ marginTop: 10 }}>
//               <p><b>Mô tả:</b></p>
//               <div
//                 dangerouslySetInnerHTML={{ __html: viewItem.description?.trim() ? viewItem.description : "<em>Không có mô tả</em>" }}
//                 style={{ color: "#333", lineHeight: "1.6", background: "#f8fafc", padding: "8px 10px", borderRadius: 6 }}
//               />
//             </div>

//             <div style={{ marginTop: 10 }}>
//               <p><b>Chi tiết:</b></p>
//               <div
//                 dangerouslySetInnerHTML={{ __html: viewItem.detail?.trim() ? viewItem.detail : "<em>Không có chi tiết</em>" }}
//                 style={{ color: "#333", lineHeight: "1.6", background: "#f8fafc", padding: "8px 10px", borderRadius: 6 }}
//               />
//             </div>

//             <div style={{ textAlign: "right", marginTop: 20 }}>
//               <button
//                 onClick={() => setViewItem(null)}
//                 style={{ padding: "8px 16px", background: "#0f62fe", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}
//               >
//                 Đóng
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal PREVIEW IMPORT */}
//       {previewOpen && (
//         <div
//           style={{
//             position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
//             display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100,
//           }}
//           onClick={() => setPreviewOpen(false)}
//         >
//           <div
//             style={{
//               background: "#fff", borderRadius: 12, padding: 16, width: "90vw",
//               maxWidth: 1200, maxHeight: "92vh", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
//               <h2 style={{ fontSize: 20, fontWeight: 800 }}>
//                 📥 Xem trước Import — {originalFile?.name || "chưa đặt tên"}
//               </h2>
//               <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
//                   <input type="checkbox" checked={showOnlyErrors} onChange={(e) => setShowOnlyErrors(e.target.checked)} />
//                   Chỉ hiển thị dòng lỗi
//                 </label>
//                 <button onClick={() => setPreviewOpen(false)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}>
//                   Đóng
//                 </button>
//               </div>
//             </div>

//             <div style={{ margin: "8px 0", color: "#374151" }}>
//               <b>Tổng dòng:</b> {previewRows.length} • <b>Lỗi:</b> {previewRows.filter(r => r.errors?.length).length} • <b>Hợp lệ:</b> {previewRows.filter(r => !r.errors?.length).length}
//             </div>

//             <div style={{ height: "65vh", overflow: "auto", border: "1px solid #eee", borderRadius: 8 }}>
//               <table width="100%" cellPadding={6} style={{ borderCollapse: "collapse", background: "#fff" }}>
//                 <thead style={{ position: "sticky", top: 0, background: "#f9fafb", zIndex: 1 }}>
//                   <tr>
//                     <th>#</th>
//                     <th>Lỗi</th>
//                     <th>Tên</th>
//                     <th>Slug</th>
//                     <th>Brand ID</th>
//                     <th>Category ID</th>
//                     <th>Giá gốc</th>
//                     <th>Giá sale</th>
//                     <th>Qty</th>
//                     <th>Status</th>
//                     <th>Thumbnail</th>
//                     <th>Mô tả</th>
//                     <th>Chi tiết</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(showOnlyErrors ? previewRows.filter(r => r.errors?.length) : previewRows).map((r, idx) => {
//                     const hasErr = r.errors?.length > 0;
//                     return (
//                       <tr key={idx} style={{ borderTop: "1px solid #f0f0f0", background: hasErr ? "#fff7f7" : "#fff" }}>
//                         <td>{idx + 1}</td>
//                         <td style={{ minWidth: 180, color: hasErr ? "#b91c1c" : "#059669" }}>
//                           {hasErr ? r.errors.join("; ") : "OK"}
//                         </td>
//                         <td><input value={r.data.name ?? ""} onChange={(e)=>updateCell(idx, "name", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input value={r.data.slug ?? ""} onChange={(e)=>updateCell(idx, "slug", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input value={r.data.brand_id ?? ""} onChange={(e)=>updateCell(idx, "brand_id", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input value={r.data.category_id ?? ""} onChange={(e)=>updateCell(idx, "category_id", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input type="number" value={r.data.price_root ?? 0} onChange={(e)=>updateCell(idx, "price_root", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input type="number" value={r.data.price_sale ?? 0} onChange={(e)=>updateCell(idx, "price_sale", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input type="number" value={r.data.qty ?? 0} onChange={(e)=>updateCell(idx, "qty", e.target.value)} style={cellInputStyle} /></td>
//                         <td>
//                           <select value={r.data.status ?? 1} onChange={(e)=>updateCell(idx, "status", Number(e.target.value))} style={cellInputStyle}>
//                             <option value={1}>1</option>
//                             <option value={0}>0</option>
//                           </select>
//                         </td>
//                         <td><input value={r.data.thumbnail ?? ""} onChange={(e)=>updateCell(idx, "thumbnail", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input value={r.data.description ?? ""} onChange={(e)=>updateCell(idx, "description", e.target.value)} style={{...cellInputStyle, minWidth: 140}} /></td>
//                         <td><input value={r.data.detail ?? ""} onChange={(e)=>updateCell(idx, "detail", e.target.value)} style={{...cellInputStyle, minWidth: 140}} /></td>
//                         <td>
//                           <button onClick={() => deleteRow(idx)} style={{ padding: "4px 8px", border: 0, borderRadius: 6, background: "#ef4444", color: "#fff", cursor: "pointer" }}>
//                             Xoá
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                   {(!previewRows.length) && (
//                     <tr><td colSpan={14} align="center" style={{ padding: 16, color: "#6b7280" }}>Không có dòng nào</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
//               <div style={{ color: hasAnyError(previewRows) ? "#b91c1c" : "#059669", fontWeight: 600 }}>
//                 {hasAnyError(previewRows) ? "Còn lỗi — vui lòng sửa hoặc xoá dòng lỗi." : "Dữ liệu hợp lệ — có thể Import."}
//               </div>
//               <div style={{ display: "flex", gap: 8 }}>
//                 <button
//                   onClick={() => {
//                     if (!window.confirm("Xoá toàn bộ các dòng đang preview?")) return;
//                     setPreviewRows([]);
//                   }}
//                   style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
//                 >
//                   🧹 Xoá tất cả
//                 </button>
//                 <button
//                   onClick={confirmImportValidRows}
//                   disabled={!previewRows.some(r => !r.errors?.length) || importing}
//                   style={{
//                     padding: "8px 12px",
//                     borderRadius: 8,
//                     border: "1px solid #10b981",
//                     background: previewRows.some(r => !r.errors?.length) && !importing ? "#10b981" : "#a7f3d0",
//                     color: "#fff",
//                     cursor: previewRows.some(r => !r.errors?.length) && !importing ? "pointer" : "not-allowed",
//                     fontWeight: 700,
//                   }}
//                 >
//                   {importing ? "Đang import…" : "✅ Xác nhận Import (chỉ dòng hợp lệ)"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// // ===== Styles helper cho nút phân trang =====
// function btnPager(disabled) {
//   return {
//     padding: "6px 10px",
//     borderRadius: 8,
//     border: "1px solid #ddd",
//     background: disabled ? "#f3f4f6" : "#fff",
//     color: disabled ? "#9ca3af" : "#111",
//     cursor: disabled ? "not-allowed" : "pointer",
//   };
// }
// function btnNumber(active) {
//   return {
//     padding: "6px 10px",
//     borderRadius: 8,
//     border: active ? "1px solid #2563eb" : "1px solid #ddd",
//     background: active ? "#2563eb" : "#fff",
//     color: active ? "#fff" : "#111",
//     cursor: active ? "default" : "pointer",
//     minWidth: 40,
//   };
// }

// // style input nhỏ gọn cho ô trong bảng preview
// const cellInputStyle = {
//   width: 140,
//   padding: "6px 8px",
//   borderRadius: 6,
//   border: "1px solid #e5e7eb",
//   background: "#fff",
// };  đó là code hoàn chỉnh import excel 























// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx"; // ✅ dùng để đọc Excel

// const API_ROOT = "http://127.0.0.1:8000";       // không có /api
// const API_BASE = `${API_ROOT}/api`;             // có /api
// const PLACEHOLDER = "https://placehold.co/120x90?text=No+Img";

// // 👉 URL tổng hợp tồn kho theo IDs (ưu tiên DB)
// const STOCK_SUMMARY_URL = (ids) =>
//   `${API_BASE}/admin/stock/summary?product_ids=${ids.join(",")}`;

// // 👉 URL tổng hợp thương hiệu & danh mục theo IDs (từ bảng ptdt_product - nếu BE hỗ trợ)
// const BRAND_CATEGORY_SUMMARY_URL = (ids) =>
//   `${API_BASE}/admin/ptdt_product/brand-category?product_ids=${ids.join(",")}`;

// // 👉 NEW: URL tổng tồn kho & tổng đã bán (đổi lại nếu BE của bạn khác đường dẫn)
// const STOCK_TOTAL_URL = `${API_BASE}/admin/stock/total`;
// const SOLD_TOTAL_URL  = `${API_BASE}/admin/orders/total-sold-products`;

// /** Helper: trích đúng object paginator dù BE trả trực tiếp hay bọc trong {data: {...}} */
// function pickPaginator(payload) {
//   if (payload && Array.isArray(payload.data) && typeof payload.current_page !== "undefined") {
//     return payload;
//   }
//   if (payload && payload.data && Array.isArray(payload.data.data) && typeof payload.data.current_page !== "undefined") {
//     return payload.data;
//   }
//   if (Array.isArray(payload)) {
//     return { data: payload, current_page: 1, last_page: 1, total: payload.length, per_page: payload.length || 10 };
//   }
//   return { data: [], current_page: 1, last_page: 1, total: 0, per_page: 10 };
// }

// // ==== Helpers cho Import Preview ====
// function toSlug(str = "") {
//   return String(str)
//     .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// }

// // 👉 Thêm: chuẩn hoá thumbnail (giữ nguyên trùng, auto prefix assets/images/ nếu chỉ là tên file)
// function normalizeThumb(v) {
//   if (v == null) return "";
//   let s = String(v).trim();
//   // nếu không phải URL tuyệt đối và không bắt đầu bằng "/" thì coi là file nội bộ
//   if (s && !/^https?:\/\//i.test(s) && !s.startsWith("/")) {
//     if (!s.startsWith("assets/images/")) s = `assets/images/${s}`;
//   }
//   return s;
// }

// // Map header linh hoạt -> key chuẩn của BE
// const HEADER_MAP = {
//   "name": "name", "tên": "name", "ten": "name",
//   "slug": "slug",
//   "brand_id": "brand_id", "brand": "brand_id", "thương hiệu": "brand_id", "thuonghieu": "brand_id",
//   "category_id": "category_id", "category": "category_id", "danh mục": "category_id", "danhmuc": "category_id",
//   "price_root": "price_root", "giá gốc": "price_root", "giagoc": "price_root",
//   "price_sale": "price_sale", "giá sale": "price_sale", "giasale": "price_sale",
//   "qty": "qty", "số lượng": "qty", "soluong": "qty",
//   "description": "description", "mô tả": "description", "mota": "description",
//   "detail": "detail", "chi tiết": "detail", "chitiet": "detail",
//   "status": "status", "trạng thái": "status", "trangthai": "status",
//   // 👉 Mở rộng alias cho cột ảnh
//   "thumbnail": "thumbnail",
//   "thumbnail_url": "thumbnail",
//   "ảnh": "thumbnail", "anh": "thumbnail",
//   "hình": "thumbnail", "hinh": "thumbnail",
//   "image": "thumbnail", "img": "thumbnail",
//   "url ảnh": "thumbnail", "link ảnh": "thumbnail",
// };

// function normalizeHeaders(rawObj) {
//   const out = {};
//   Object.keys(rawObj || {}).forEach((k) => {
//     const key = String(k || "").trim().toLowerCase();
//     const mapped = HEADER_MAP[key];
//     if (mapped) out[mapped] = rawObj[k];
//   });
//   return out;
// }

// // 👉 Helper đọc số từ payload {data:number} | {total:number} | {count:number}
// function pickNumber(obj, keys = ["data", "total", "count", "value"]) {
//   if (!obj || typeof obj !== "object") return 0;
//   for (const k of keys) {
//     const v = obj[k];
//     if (typeof v === "number" && isFinite(v)) return v;
//   }
//   return 0;
// }

// /* =========================
//    DonutChart (SVG thuần)
//    ========================= */
// function DonutChart({ sold = 0, inStock = 0, size = 150, thickness = 22 }) {
//   const total = Math.max(0, Number(sold)) + Math.max(0, Number(inStock));
//   const r = size / 2 - thickness / 2;
//   const c = 2 * Math.PI * r;

//   // phần trăm đã bán
//   const soldRatio = total > 0 ? Math.min(1, Math.max(0, sold / total)) : 0;
//   const soldLength = c * soldRatio;

//   // màu theo mockup (hồng/đỏ cho đã bán, xanh cho tồn kho)
//   const SOLD_COLOR = "#ef4444";
//   const STOCK_COLOR = "#3b82f6";

//   return (
//     <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//         <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
//           {/* nền: tồn kho */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={r}
//             fill="none"
//             stroke={STOCK_COLOR}
//             strokeWidth={thickness}
//             strokeLinecap="round"
//             opacity={0.9}
//           />
//           {/* phần đã bán nằm trên */}
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={r}
//             fill="none"
//             stroke={SOLD_COLOR}
//             strokeWidth={thickness}
//             strokeDasharray={`${soldLength} ${Math.max(0, c - soldLength)}`}
//             strokeLinecap="round"
//           />
//         </g>
//         {/* lỗ donut */}
//         <circle cx={size / 2} cy={size / 2} r={r - thickness / 2} fill="#fff" />
//       </svg>

//       {/* Legend */}
//       <div style={{ display: "grid", gap: 8 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <span style={{ width: 14, height: 8, background: SOLD_COLOR, borderRadius: 2 }}></span>
//           {/* sửa chữ thừa "5" */}
//           <span style={{ fontSize: 14 }}>Đã bán: <b>{Number(sold || 0).toLocaleString("vi-VN")}</b></span>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <span style={{ width: 14, height: 8, background: STOCK_COLOR, borderRadius: 2 }}></span>
//           <span style={{ fontSize: 14 }}>Tồn kho: <b>{Number(inStock || 0).toLocaleString("vi-VN")}</b></span>
//         </div>
//         <div style={{ color: "#6b7280", fontSize: 13 }}>
//           Tổng: <b>{Number(total).toLocaleString("vi-VN")}</b>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Products() {
//   const [items, setItems] = useState([]);
//   const [stocks, setStocks] = useState({});
//   const [q, setQ] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [stockLoading, setStockLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [deletingId, setDeletingId] = useState(null);
//   const [deletingMany, setDeletingMany] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const [viewItem, setViewItem] = useState(null);

//   // 🔢 Phân trang
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   const [meta, setMeta] = useState({
//     current_page: 1,
//     last_page: 1,
//     total: 0,
//     per_page: 10,
//   });

//   // 🔁 Reload sau import
//   const [reload, setReload] = useState(0);

//   // ⬆️ Import Excel states
//   const [importing, setImporting] = useState(false);
//   const fileInputRef = useRef(null);

//   // ==== Import Preview states ====
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewRows, setPreviewRows] = useState([]);
//   const [originalFile, setOriginalFile] = useState(null);
//   const [showOnlyErrors, setShowOnlyErrors] = useState(false);

//   // ✅ map thương hiệu & danh mục
//   const [brandCats, setBrandCats] = useState({});
//   const [brandCatLoading, setBrandCatLoading] = useState(false);

//   // ✅ Tổng số sp hiện có (tồn kho) & đã bán
//   const [totalInStock, setTotalInStock] = useState(null);
//   const [totalSold, setTotalSold] = useState(null);
//   const [topCardLoading, setTopCardLoading] = useState(false);

//   const navigate = useNavigate();

//   /* ===== Load danh sách theo trang ===== */
//   useEffect(() => {
//     const ac = new AbortController();
//     const token = localStorage.getItem("admin_token");

//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");

//         const url = `${API_BASE}/admin/products?page=${page}&per_page=${perPage}`;
//         const res = await fetch(url, {
//           signal: ac.signal,
//           headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const raw = await res.json();

//         const pg = pickPaginator(raw);
//         const list = pg.data ?? [];
//         setItems(Array.isArray(list) ? list : []);

//         setMeta({
//           current_page: Number(pg.current_page ?? page),
//           last_page: Number(pg.last_page ?? 1),
//           total: Number(pg.total ?? (Array.isArray(list) ? list.length : 0)),
//           per_page: Number(pg.per_page ?? perPage),
//         });

//         setSelected([]);

//         const ids = (Array.isArray(list) ? list : []).map((x) => x.id).filter(Boolean);
//         if (ids.length) {
//           try {
//             setStockLoading(true);
//             const res2 = await fetch(STOCK_SUMMARY_URL(ids), {
//               signal: ac.signal,
//               headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//             });
//             if (res2.ok) {
//               const sum = await res2.json();
//               const map = sum?.data ?? {};
//               setStocks(map);
//             }
//           } catch {} finally { setStockLoading(false); }

//           try {
//             setBrandCatLoading(true);
//             const res3 = await fetch(BRAND_CATEGORY_SUMMARY_URL(ids), {
//               signal: ac.signal,
//               headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//             });
//             if (res3.ok) {
//               const bc = await res3.json();
//               const mapBC = bc?.data ?? {};
//               setBrandCats(mapBC);
//             } else setBrandCats({});
//           } catch { setBrandCats({}); }
//           finally { setBrandCatLoading(false); }
//         } else {
//           setStocks({});
//           setBrandCats({});
//         }
//       } catch (e) {
//         if (e.name !== "AbortError") setErr("Không tải được danh sách sản phẩm.");
//         setItems([]);
//         setMeta({ current_page: 1, last_page: 1, total: 0, per_page: perPage });
//         setStocks({});
//         setBrandCats({});
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => ac.abort();
//   }, [page, perPage, reload]);

//   /* ===== NEW: load số liệu tổng (2 thẻ / donut) ===== */
//   useEffect(() => {
//     const ac = new AbortController();
//     const token = localStorage.getItem("admin_token");

//     (async () => {
//       try {
//         setTopCardLoading(true);

//         const [r1, r2] = await Promise.allSettled([
//           fetch(STOCK_TOTAL_URL, { signal: ac.signal, headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
//           fetch(SOLD_TOTAL_URL,  { signal: ac.signal, headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
//         ]);

//         if (r1.status === "fulfilled" && r1.value.ok) {
//           const j = await r1.value.json().catch(() => ({}));
//           setTotalInStock(pickNumber(j));
//         } else {
//           setTotalInStock((prev) => {
//             const est = Object.values(stocks).reduce((s, v) => s + Number(v || 0), 0);
//             return Number.isFinite(est) ? est : (prev ?? 0);
//           });
//         }

//         if (r2.status === "fulfilled" && r2.value.ok) {
//           const j = await r2.value.json().catch(() => ({}));
//           setTotalSold(pickNumber(j));
//         } else {
//           setTotalSold((v) => v ?? 0);
//         }
//       } catch {} finally { setTopCardLoading(false); }
//     })();

//     return () => ac.abort();
//   }, [reload, stocks]);

//   // ===== Helper tồn kho / brand / category =====
//   const getQty = (p) => {
//     const id = p?.id;
//     if (id != null && Object.prototype.hasOwnProperty.call(stocks, id))
//       return Number(stocks[id] ?? 0);
//     return Number(p?.qty ?? 0);
//   };

//   const getBrandName = (p) => {
//     const id = p?.id;
//     const fromMap = id != null ? brandCats[id] : null;
//     return (
//       fromMap?.brand_name ??
//       p?.brand_name ??
//       p?.brand?.name ??
//       (p?.brand_id != null ? `#${p.brand_id}` : "")
//     );
//   };
//   const getCategoryName = (p) => {
//     const id = p?.id;
//     const fromMap = id != null ? brandCats[id] : null;
//     return (
//       fromMap?.category_name ??
//       p?.category_name ??
//       p?.category?.name ??
//       (p?.category_id != null ? `#${p.category_id}` : "")
//     );
//   };

//   // ===== Xoá sản phẩm & xoá nhiều =====
//   async function handleDelete(id, { silent = false } = {}) {
//     const token = localStorage.getItem("admin_token");
//     if (!silent) {
//       if (!window.confirm("Bạn chắc chắn muốn xoá sản phẩm này?")) return false;
//     }
//     try {
//       setDeletingId(id);
//       const res = await fetch(`${API_BASE}/admin/products/${id}`, {
//         method: "DELETE",
//         headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data.message || "Xoá thất bại");

//       setItems((prev) => prev.filter((x) => x.id !== id));
//       setStocks((prev) => { const n = { ...prev }; delete n[id]; return n; });
//       setBrandCats((prev) => { const n = { ...prev }; delete n[id]; return n; });

//       if (!silent) alert("✅ Đã chuyển sản phẩm vào thùng rác");
//       return true;
//     } catch (err) {
//       if (!silent) alert(`❌ Lỗi xoá: ${err.message}`);
//       return false;
//     } finally {
//       setDeletingId(null);
//     }
//   }

//   async function handleBulkDelete() {
//     if (!selected.length) return alert("Chưa chọn sản phẩm nào");
//     if (!window.confirm(`Xoá ${selected.length} sản phẩm?`)) return;

//     setDeletingMany(true);
//     let ok = 0; const fail = [];
//     for (const id of selected) {
//       const okOne = await handleDelete(id, { silent: true });
//       if (okOne) ok++; else fail.push(id);
//     }
//     setDeletingMany(false); setSelected([]);

//     if (ok && fail.length === 0) alert(`✅ Đã xoá ${ok} sản phẩm.`);
//     else if (ok && fail.length > 0) alert(`⚠️ Thành công ${ok}, thất bại ${fail.length}: ${fail.join(", ")}`);
//     else alert("❌ Không xoá được sản phẩm nào.");
//   }

//   // ===== Import cũ / Preview mới (giữ nguyên) =====
//   async function handleImport(file) {
//     const token = localStorage.getItem("admin_token");
//     try {
//       setImporting(true);
//       const form = new FormData();
//       form.append("file", file);
//       form.append("mode", "upsert");
//       const res = await fetch(`${API_BASE}/admin/products/import`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: form,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Import thất bại");
//       alert(`✔ Import xong:
// - Thêm: ${data.inserted}
// - Cập nhật: ${data.updated}
// - Bỏ qua: ${data.skipped}
// ${data.errors?.length ? `- Lỗi: ${data.errors.length} dòng` : ""}`);
//       setReload((x) => x + 1); setPage(1);
//     } catch (e) { alert(`❌ Lỗi import: ${e.message}`); }
//     finally { setImporting(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
//   }

//   function validateRow(d, idx, allRows) {
//     const errors = [];
//     const price_root = Number(d.price_root ?? 0);
//     const price_sale = Number(d.price_sale ?? 0);
//     const qty = Number.isFinite(Number(d.qty)) ? Number(d.qty) : d.qty;

//     if (!d.name || String(d.name).trim() === "") errors.push("Thiếu tên (name)");
//     if (!d.slug || String(d.slug).trim() === "") errors.push("Thiếu slug (đã auto-gợi ý)");
//     if (d.brand_id === undefined || d.brand_id === "") errors.push("Thiếu brand_id");
//     if (d.category_id === undefined || d.category_id === "") errors.push("Thiếu category_id");

//     if (isNaN(price_root) || price_root < 0) errors.push("price_root phải là số ≥ 0");
//     if (isNaN(price_sale) || price_sale < 0) errors.push("price_sale phải là số ≥ 0");
//     if (!Number.isInteger(Number(qty)) || Number(qty) < 0) errors.push("qty phải là số nguyên ≥ 0");
//     if (!isNaN(price_root) && !isNaN(price_sale) && price_sale > price_root) {
//       errors.push("price_sale không được lớn hơn price_root");
//     }

//     const curSlug = (d.slug || "").toString().trim().toLowerCase();
//     if (curSlug) {
//       const dupIndex = allRows.findIndex((r, i2) =>
//         i2 !== idx && (r.data.slug || "").toString().trim().toLowerCase() === curSlug
//       );
//       if (dupIndex !== -1) errors.push(`Slug trùng ở dòng ${dupIndex + 2}`);
//     }
//     return errors;
//   }

//   async function handleFileSelected(file) {
//     try {
//       const ab = await file.arrayBuffer();
//       const wb = XLSX.read(ab, { type: "array" });
//       const sheet = wb.Sheets[wb.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

//       let rows = json.map((raw, i) => {
//         const d = normalizeHeaders(raw);
//         if (!d.thumbnail && d.thumbnail_url) d.thumbnail = d.thumbnail_url;
//         // 👉 chuẩn hoá thumbnail (tự thêm assets/images/ nếu chỉ là tên file)
//         if (d.thumbnail !== undefined) d.thumbnail = normalizeThumb(d.thumbnail);
//         if (!d.slug && d.name) d.slug = toSlug(d.name);
//         if (d.price_root !== undefined) d.price_root = Number(d.price_root || 0);
//         if (d.price_sale !== undefined) d.price_sale = Number(d.price_sale || 0);
//         if (d.qty !== undefined) d.qty = Number.isFinite(Number(d.qty)) ? Number(d.qty) : 0;
//         if (typeof d.status === "string") {
//           const s = d.status.trim().toLowerCase();
//           d.status = ["1","true","active","đang bán","dang ban"].includes(s) ? 1 : 0;
//         }
//         return { rowIndex: i, data: d, errors: [] };
//       });

//       rows = rows.map((r, idx) => ({ ...r, errors: validateRow(r.data, idx, rows) }));
//       rows.sort((a, b) => (b.errors.length > 0) - (a.errors.length > 0));

//       setPreviewRows(rows);
//       setOriginalFile(file);
//       setPreviewOpen(true);
//     } catch (e) {
//       alert("Không đọc được file Excel: " + e.message);
//     } finally {
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   }

//   function updateCell(idx, key, value) {
//     setPreviewRows((prev) => {
//       const copy = prev.map((r) => ({ ...r, data: { ...r.data }, errors: [...r.errors] }));
//       copy[idx].data[key] = value;
//       if (key === "name" && (!copy[idx].data.slug || copy[idx].data.slug.trim() === "")) {
//         copy[idx].data.slug = toSlug(value);
//       }
//       copy[idx].errors = validateRow(copy[idx].data, idx, copy);
//       copy.sort((a, b) => (b.errors.length > 0) - (a.errors.length > 0));
//       return copy;
//     });
//   }

//   function deleteRow(idx) {
//     setPreviewRows((prev) => {
//       const copy = prev.slice();
//       copy.splice(idx, 1);
//       return copy
//         .map((r, i) => ({ ...r, errors: validateRow(r.data, i, copy) }))
//         .sort((a, b) => (b.errors.length > 0) - (a.errors.length > 0));
//     });
//   }

//   function hasAnyError(rows = previewRows) {
//     return rows.some((r) => r.errors?.length);
//   }

//   function toCSV(rows) {
//     const headers = [
//       "name","slug","brand_id","category_id",
//       "price_root","price_sale","qty",
//       "description","detail","status","thumbnail"
//     ];
//     const esc = (v) => {
//       const s = v == null ? "" : String(v);
//       if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
//       return s;
//     };
//     const lines = [];
//     lines.push(headers.join(","));
//     rows.forEach(({ data }) => {
//       const row = headers.map((h) => esc(data[h] ?? ""));
//       lines.push(row.join(","));
//     });
//     return "\uFEFF" + lines.join("\n");
//   }

//   async function confirmImportValidRows() {
//     const validRows = previewRows.filter((r) => !r.errors?.length);
//     if (!validRows.length) return alert("Không có dòng hợp lệ để import.");

//     const token = localStorage.getItem("admin_token");
//     try {
//       setImporting(true);
//       const csv = toCSV(validRows);
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
//       const file = new File([blob], (originalFile?.name?.replace(/\.[^.]+$/,"") || "import") + "_clean.csv", { type: blob.type });

//       const form = new FormData();
//       form.append("file", file);
//       form.append("mode", "upsert");

//       const res = await fetch(`${API_BASE}/admin/products/import`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: form,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Import thất bại");

//       alert(`✔ Import xong:
// - Thêm: ${data.inserted}
// - Cập nhật: ${data.updated}
// - Bỏ qua: ${data.skipped}
// ${data.errors?.length ? `- Lỗi: ${data.errors.length} dòng` : ""}`);

//       setPreviewOpen(false);
//       setPreviewRows([]);
//       setOriginalFile(null);
//       setReload((x) => x + 1);
//       setPage(1);
//     } catch (e) {
//       alert(`❌ Lỗi import: ${e.message}`);
//     } finally {
//       setImporting(false);
//     }
//   }

//   // ===== Lọc cục bộ theo tên/slug (trên TRANG hiện tại) =====
//   const filtered = useMemo(() => {
//     const s = q.trim().toLowerCase();
//     if (!s) return items;
//     return items.filter(
//       (x) =>
//         x.name?.toLowerCase().includes(s) ||
//         x.slug?.toLowerCase().includes(s)
//     );
//   }, [q, items]);

//   const toggleSelect = (id) =>
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );

//   const allChecked = filtered.length > 0 && selected.length === filtered.length;

//   const toggleAll = () => setSelected(allChecked ? [] : filtered.map((x) => x.id));

//   // ===== Pagination helpers =====
//   const canPrev = meta.current_page > 1;
//   const canNext = meta.current_page < meta.last_page;

//   const gotoPage = (p) => {
//     if (p < 1 || p > meta.last_page || p === meta.current_page) return;
//     setPage(p);
//   };

//   const buildPageNumbers = () => {
//     const total = meta.last_page;
//     const cur = meta.current_page;
//     const delta = 1;
//     const pages = new Set([1, total]);

//     for (let i = cur - delta; i <= cur + delta; i++) {
//       if (i >= 1 && i <= total) pages.add(i);
//     }
//     if (total >= 2) {
//       pages.add(2);
//       pages.add(total - 1);
//     }
//     return Array.from(pages).sort((a, b) => a - b);
//   };

//   const pages = buildPageNumbers();

//   // ===== Styles helper cho thẻ thống kê =====
//   const statCard = () => ({
//     background: "#fff",
//     border: "1px solid #e5e7eb",
//     borderRadius: 12,
//     padding: 16,
//     minWidth: 260,
//     boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//     display: "flex",
//     flexDirection: "column",
//     gap: 8,
//   });

//   // ===== Render =====
//   return (
//     <section style={{ padding: 20 }}>
//       {/* ====== HÀNG THẺ THỐNG KÊ ====== */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//           gap: 12,
//           marginBottom: 12,
//         }}
//       >
//         {/* Card 1: Tổng số sản phẩm hiện có */}
//         <div style={statCard()}>
//           <div style={{ fontSize: 14, color: "#374151", fontWeight: 700 }}>
//             Tổng số sản phẩm hiện có
//           </div>
//           <div style={{ fontSize: 32, fontWeight: 800 }}>
//             {topCardLoading && totalInStock === null ? "…" : (Number(totalInStock ?? 0)).toLocaleString("vi-VN")}
//           </div>
//           <div style={{ color: "#10b981", fontSize: 13 }}>
//             ↑ Tổng số sản phẩm còn trong kho
//           </div>
//         </div>

//         {/* Card 2: Donut thống kê sản phẩm */}
//         <div style={statCard()}>
//           <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
//             Thống kê sản phẩm
//           </div>
//           <DonutChart
//             sold={Number(totalSold ?? 0)}
//             inStock={Number(totalInStock ?? 0)}
//             size={160}
//             thickness={24}
//           />
//         </div>
//       </div>

//       {/* Thanh tiêu đề */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 10,
//           flexWrap: "wrap",
//         }}
//       >
//         <h1 style={{ fontSize: 24, fontWeight: 700 }}>
//           Quản lý sản phẩm
//           {stockLoading ? " · đang tải tồn kho…" : ""}
//           {brandCatLoading ? " · đang tải thương hiệu/danh mục…" : ""}
//         </h1>

//         <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Tìm tên/slug… (trang hiện tại)"
//             style={{
//               height: 36,
//               padding: "0 10px",
//               border: "1px solid #ddd",
//               borderRadius: 8,
//             }}
//           />

//           <select
//             value={perPage}
//             onChange={(e) => {
//               setPerPage(Number(e.target.value));
//               setPage(1);
//             }}
//             style={{ height: 36, borderRadius: 8, border: "1px solid #ddd" }}
//             title="Số dòng mỗi trang"
//           >
//             {[5, 10, 20, 30, 50, 100].map((n) => (
//               <option key={n} value={n}>
//                 {n}/trang
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={() => navigate("/admin/products/add")}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 8,
//               border: "1px solid #0f62fe",
//               background: "#0f62fe",
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             + Thêm
//           </button>

//           <button
//             onClick={() => fileInputRef.current?.click()}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 10,
//               border: "none",
//               background: "#2563eb",
//               color: "#fff",
//               cursor: "pointer",
//               fontWeight: 700,
//             }}
//           >
//             ⬆ Import Excel
//           </button>

//           <button
//             onClick={async () => {
//               // đồng bộ token
//               const token = localStorage.getItem("admin_token") || "";
//               try {
//                 const res = await fetch("http://127.0.0.1:8000/api/admin/products/export", {
//                   method: "GET",
//                   headers: {
//                     Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                   },
//                 });
//                 if (!res.ok) throw new Error("Export thất bại");
//                 const blob = await res.blob();
//                 const url = window.URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = url;
//                 a.download = "products_export.xlsx";
//                 a.click();
//                 window.URL.revokeObjectURL(url);
//               } catch (err) {
//                 alert("❌ " + err.message);
//               }
//             }}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 10,
//               border: "none",
//               background: "#10b981",
//               color: "#fff",
//               cursor: "pointer",
//               fontWeight: 700,
//             }}
//           >
//             ⬇ Export Excel
//           </button>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".xlsx,.xls,.csv"
//             className="hidden"
//             onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
//             style={{ display: "none" }}
//           />

//           <button
//             onClick={handleBulkDelete}
//             disabled={deletingMany || !selected.length}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 8,
//               border: "1px solid #e11d48",
//               background: selected.length && !deletingMany ? "#e11d48" : "#fca5a5",
//               color: "#fff",
//               cursor: selected.length && !deletingMany ? "pointer" : "not-allowed",
//             }}
//           >
//             {deletingMany ? "Đang xoá…" : `🗑 Xoá chọn (${selected.length})`}
//           </button>
//           <button
//             onClick={() => navigate("/admin/products/trash")}
//             style={{
//               padding: "8px 12px",
//               borderRadius: 8,
//               border: "1px solid #6b7280",
//               background: "#6b7280",
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             🗂 Thùng rác
//           </button>
//         </div>
//       </div>

//       {/* Bảng sản phẩm */}
//       {loading && <p>Đang tải dữ liệu…</p>}
//       {err && <p style={{ color: "red" }}>{err}</p>}

//       {!loading && (
//         <>
//           <div style={{ overflowX: "auto", marginTop: 12 }}>
//             <table
//               width="100%"
//               cellPadding={8}
//               style={{ borderCollapse: "collapse", background: "#fff", borderRadius: 8 }}
//             >
//               <thead>
//                 <tr style={{ background: "#fafafa" }}>
//                   <th><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
//                   <th align="left">ID</th>
//                   <th align="left">Tên</th>
//                   <th align="left">Slug</th>
//                   <th align="left">Thương hiệu</th>
//                   <th align="left">Danh mục</th>
//                   <th align="right">Giá gốc</th>
//                   <th align="right">Giá sale</th>
//                   <th align="right">Tồn kho (DB)</th>
//                   <th align="center">Ảnh</th>
//                   <th align="center">Hành động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((p) => (
//                   <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={selected.includes(p.id)}
//                         onChange={() => toggleSelect(p.id)}
//                       />
//                     </td>
//                     <td>{p.id}</td>
//                     <td>{p.name}</td>
//                     <td>{p.slug}</td>
//                     <td>{getBrandName(p)}</td>
//                     <td>{getCategoryName(p)}</td>
//                     <td align="right">₫{(p.price_root || 0).toLocaleString("vi-VN")}</td>
//                     <td align="right">₫{(p.price_sale || 0).toLocaleString("vi-VN")}</td>
//                     <td align="right">{getQty(p).toLocaleString("vi-VN")}</td>
//                     <td align="center">
//                       <img
//                         // 👉 Fallback đủ: thumbnail_url -> thumbnail -> placeholder
//                         src={p.thumbnail_url || p.thumbnail || PLACEHOLDER}
//                         alt={p.name}
//                         style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
//                         onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//                       />
//                     </td>
//                     <td align="center">
//                       <button
//                         onClick={() => setViewItem(p)}
//                         style={{ padding: "4px 10px", marginRight: 4, background: "#2563eb", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}
//                       >
//                         👁 Xem
//                       </button>
//                       <button
//                         onClick={() => navigate(`/admin/products/edit/${p.id}`)}
//                         style={{ padding: "4px 10px", marginRight: 4, background: "#2e7d32", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}
//                       >
//                         ✏️ Sửa
//                       </button>
//                       <button
//                         onClick={() => handleDelete(p.id)}
//                         disabled={deletingId === p.id || deletingMany}
//                         style={{ padding: "4px 10px", background: deletingId === p.id || deletingMany ? "#ef9a9a" : "#c62828", color: "#fff", border: 0, borderRadius: 6, cursor: deletingId === p.id || deletingMany ? "not-allowed" : "pointer" }}
//                       >
//                         {deletingId === p.id ? "Đang xoá..." : "🗑 Xóa"}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {!filtered.length && (
//                   <tr>
//                     <td colSpan={11} align="center" style={{ padding: 18, color: "#777" }}>
//                       Không có dữ liệu
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Thanh phân trang */}
//           <div
//             style={{
//               marginTop: 12,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: 10,
//             }}
//           >
//             <div style={{ color: "#555" }}>
//               Tổng: <b>{Number(meta.total).toLocaleString("vi-VN")}</b> — Trang{" "}
//               <b>{meta.current_page}</b>/<b>{meta.last_page}</b>
//             </div>

//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//               <button onClick={() => gotoPage(1)} disabled={!canPrev} style={btnPager(!canPrev)}>« Đầu</button>
//               <button onClick={() => gotoPage(meta.current_page - 1)} disabled={!canPrev} style={btnPager(!canPrev)}>‹ Trước</button>

//               {pages.map((p, idx) => {
//                 const prev = pages[idx - 1];
//                 const needDots = prev && p - prev > 1;
//                 return (
//                   <span key={p} style={{ display: "inline-flex", gap: 6 }}>
//                     {needDots && <span style={{ padding: "6px 8px" }}>…</span>}
//                     <button
//                       onClick={() => gotoPage(p)}
//                       disabled={p === meta.current_page}
//                       style={btnNumber(p === meta.current_page)}
//                       title={`Trang ${p}`}
//                     >
//                       {p}
//                     </button>
//                   </span>
//                 );
//               })}

//               <button onClick={() => gotoPage(meta.current_page + 1)} disabled={!canNext} style={btnPager(!canNext)}>Sau ›</button>
//               <button onClick={() => gotoPage(meta.last_page)} disabled={!canNext} style={btnPager(!canNext)}>Cuối »</button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Modal xem chi tiết */}
//       {viewItem && (
//         <div
//           style={{
//             position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
//             background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
//             justifyContent: "center", zIndex: 1000,
//           }}
//           onClick={() => setViewItem(null)}
//         >
//           <div
//             style={{
//               background: "#fff", borderRadius: 10, padding: 20, width: 550,
//               maxHeight: "90vh", overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 style={{ fontSize: 20, marginBottom: 10, fontWeight: 700 }}>🏷 {viewItem.name}</h2>

//             <div style={{ textAlign: "center", marginBottom: 10 }}>
//               <img
//                 // 👉 Fallback đủ: thumbnail_url -> thumbnail -> placeholder
//                 src={viewItem.thumbnail_url || viewItem.thumbnail || PLACEHOLDER}
//                 alt={viewItem.name}
//                 style={{ width: 200, height: 150, objectFit: "cover", borderRadius: 6, boxShadow: "0 0 6px rgba(0,0,0,0.2)" }}
//                 onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//               />
//             </div>

//             <p><b>Slug:</b> {viewItem.slug}</p>
//             <p>
//               <b>Giá:</b> ₫{Number(viewItem.price_sale ?? 0).toLocaleString("vi-VN")}{" "}
//               <span style={{ color: "#888" }}>(Gốc: ₫{Number(viewItem.price_root ?? 0).toLocaleString("vi-VN")})</span>
//             </p>
//             <p><b>Thương hiệu:</b> {getBrandName(viewItem)}</p>
//             <p><b>Danh mục:</b> {getCategoryName(viewItem)}</p>
//             <p><b>Tồn kho (DB):</b> {getQty(viewItem).toLocaleString("vi-VN")}</p>
//             <p><b>Trạng thái:</b> {viewItem.status}</p>

//             <div style={{ marginTop: 10 }}>
//               <p><b>Mô tả:</b></p>
//               <div
//                 dangerouslySetInnerHTML={{ __html: viewItem.description?.trim() ? viewItem.description : "<em>Không có mô tả</em>" }}
//                 style={{ color: "#333", lineHeight: "1.6", background: "#f8fafc", padding: "8px 10px", borderRadius: 6 }}
//               />
//             </div>

//             <div style={{ marginTop: 10 }}>
//               <p><b>Chi tiết:</b></p>
//               <div
//                 dangerouslySetInnerHTML={{ __html: viewItem.detail?.trim() ? viewItem.detail : "<em>Không có chi tiết</em>" }}
//                 style={{ color: "#333", lineHeight: "1.6", background: "#f8fafc", padding: "8px 10px", borderRadius: 6 }}
//               />
//             </div>

//             <div style={{ textAlign: "right", marginTop: 20 }}>
//               <button
//                 onClick={() => setViewItem(null)}
//                 style={{ padding: "8px 16px", background: "#0f62fe", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}
//               >
//                 Đóng
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal PREVIEW IMPORT */}
//       {previewOpen && (
//         <div
//           style={{
//             position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
//             display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100,
//           }}
//           onClick={() => setPreviewOpen(false)}
//         >
//           <div
//             style={{
//               background: "#fff", borderRadius: 12, padding: 16, width: "90vw",
//               maxWidth: 1200, maxHeight: "92vh", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
//               <h2 style={{ fontSize: 20, fontWeight: 800 }}>
//                 📥 Xem trước Import — {originalFile?.name || "chưa đặt tên"}
//               </h2>
//               <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
//                   <input type="checkbox" checked={showOnlyErrors} onChange={(e) => setShowOnlyErrors(e.target.checked)} />
//                   Chỉ hiển thị dòng lỗi
//                 </label>
//                 <button onClick={() => setPreviewOpen(false)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}>
//                   Đóng
//                 </button>
//               </div>
//             </div>

//             <div style={{ margin: "8px 0", color: "#374151" }}>
//               <b>Tổng dòng:</b> {previewRows.length} • <b>Lỗi:</b> {previewRows.filter(r => r.errors?.length).length} • <b>Hợp lệ:</b> {previewRows.filter(r => !r.errors?.length).length}
//             </div>

//             <div style={{ height: "65vh", overflow: "auto", border: "1px solid #eee", borderRadius: 8 }}>
//               <table width="100%" cellPadding={6} style={{ borderCollapse: "collapse", background: "#fff" }}>
//                 <thead style={{ position: "sticky", top: 0, background: "#f9fafb", zIndex: 1 }}>
//                   <tr>
//                     <th>#</th>
//                     <th>Lỗi</th>
//                     <th>Tên</th>
//                     <th>Slug</th>
//                     <th>Brand ID</th>
//                     <th>Category ID</th>
//                     <th>Giá gốc</th>
//                     <th>Giá sale</th>
//                     <th>Qty</th>
//                     <th>Status</th>
//                     <th>Thumbnail</th>
//                     <th>Mô tả</th>
//                     <th>Chi tiết</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(showOnlyErrors ? previewRows.filter(r => r.errors?.length) : previewRows).map((r, idx) => {
//                     const hasErr = r.errors?.length > 0;
//                     return (
//                       <tr key={idx} style={{ borderTop: "1px solid #f0f0f0", background: hasErr ? "#fff7f7" : "#fff" }}>
//                         <td>{idx + 1}</td>
//                         <td style={{ minWidth: 180, color: hasErr ? "#b91c1c" : "#059669" }}>
//                           {hasErr ? r.errors.join("; ") : "OK"}
//                         </td>
//                         <td><input value={r.data.name ?? ""} onChange={(e)=>updateCell(idx, "name", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input value={r.data.slug ?? ""} onChange={(e)=>updateCell(idx, "slug", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input value={r.data.brand_id ?? ""} onChange={(e)=>updateCell(idx, "brand_id", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input value={r.data.category_id ?? ""} onChange={(e)=>updateCell(idx, "category_id", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input type="number" value={r.data.price_root ?? 0} onChange={(e)=>updateCell(idx, "price_root", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input type="number" value={r.data.price_sale ?? 0} onChange={(e)=>updateCell(idx, "price_sale", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input type="number" value={r.data.qty ?? 0} onChange={(e)=>updateCell(idx, "qty", e.target.value)} style={cellInputStyle} /></td>
//                         <td>
//                           <select value={r.data.status ?? 1} onChange={(e)=>updateCell(idx, "status", Number(e.target.value))} style={cellInputStyle}>
//                             <option value={1}>1</option>
//                             <option value={0}>0</option>
//                           </select>
//                         </td>
//                         <td><input value={r.data.thumbnail ?? ""} onChange={(e)=>updateCell(idx, "thumbnail", e.target.value)} style={cellInputStyle} /></td>
//                         <td><input value={r.data.description ?? ""} onChange={(e)=>updateCell(idx, "description", e.target.value)} style={{...cellInputStyle, minWidth: 140}} /></td>
//                         <td><input value={r.data.detail ?? ""} onChange={(e)=>updateCell(idx, "detail", e.target.value)} style={{...cellInputStyle, minWidth: 140}} /></td>
//                         <td>
//                           <button onClick={() => deleteRow(idx)} style={{ padding: "4px 8px", border: 0, borderRadius: 6, background: "#ef4444", color: "#fff", cursor: "pointer" }}>
//                             Xoá
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                   {(!previewRows.length) && (
//                     <tr><td colSpan={14} align="center" style={{ padding: 16, color: "#6b7280" }}>Không có dòng nào</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
//               <div style={{ color: hasAnyError(previewRows) ? "#b91c1c" : "#059669", fontWeight: 600 }}>
//                 {hasAnyError(previewRows) ? "Còn lỗi — vui lòng sửa hoặc xoá dòng lỗi." : "Dữ liệu hợp lệ — có thể Import."}
//               </div>
//               <div style={{ display: "flex", gap: 8 }}>
//                 <button
//                   onClick={() => {
//                     if (!window.confirm("Xoá toàn bộ các dòng đang preview?")) return;
//                     setPreviewRows([]);
//                   }}
//                   style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
//                 >
//                   🧹 Xoá tất cả
//                 </button>
//                 <button
//                   onClick={confirmImportValidRows}
//                   disabled={!previewRows.some(r => !r.errors?.length) || importing}
//                   style={{
//                     padding: "8px 12px",
//                     borderRadius: 8,
//                     border: "1px solid #10b981",
//                     background: previewRows.some(r => !r.errors?.length) && !importing ? "#10b981" : "#a7f3d0",
//                     color: "#fff",
//                     cursor: previewRows.some(r => !r.errors?.length) && !importing ? "pointer" : "not-allowed",
//                     fontWeight: 700,
//                   }}
//                 >
//                   {importing ? "Đang import…" : "✅ Xác nhận Import (chỉ dòng hợp lệ)"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// // ===== Styles helper cho nút phân trang =====
// function btnPager(disabled) {
//   return {
//     padding: "6px 10px",
//     borderRadius: 8,
//     border: "1px solid #ddd",
//     background: disabled ? "#f3f4f6" : "#fff",
//     color: disabled ? "#9ca3af" : "#111",
//     cursor: disabled ? "not-allowed" : "pointer",
//   };
// }
// function btnNumber(active) {
//   return {
//     padding: "6px 10px",
//     borderRadius: 8,
//     border: active ? "1px solid #2563eb" : "1px solid #ddd",
//     background: active ? "#2563eb" : "#fff",
//     color: active ? "#fff" : "#111",
//     cursor: active ? "default" : "pointer",
//     minWidth: 40,
//   };
// }

// // style input nhỏ gọn cho ô trong bảng preview
// const cellInputStyle = {
//   width: 140,
//   padding: "6px 8px",
//   borderRadius: 6,
//   border: "1px solid #e5e7eb",
//   background: "#fff",
// };  CODE SAU KHI  SỬA CHÈN IMPORT CÙNG LINK ẢNH  




import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // ✅ dùng để đọc Excel

const API_ROOT = "http://127.0.0.1:8000";       // không có /api
const API_BASE = `${API_ROOT}/api`;             // có /api
const PLACEHOLDER = "https://placehold.co/120x90?text=No+Img";

// 👉 URL tổng hợp tồn kho theo IDs (ưu tiên DB)
const STOCK_SUMMARY_URL = (ids) =>
  `${API_BASE}/admin/stock/summary?product_ids=${ids.join(",")}`;

// 👉 URL tổng hợp thương hiệu & danh mục theo IDs (từ bảng ptdt_product - nếu BE hỗ trợ)
const BRAND_CATEGORY_SUMMARY_URL = (ids) =>
  `${API_BASE}/admin/ptdt_product/brand-category?product_ids=${ids.join(",")}`;

// 👉 NEW: URL tổng tồn kho & tổng đã bán (đổi lại nếu BE của bạn khác đường dẫn)
const STOCK_TOTAL_URL = `${API_BASE}/admin/stock/total`;
const SOLD_TOTAL_URL  = `${API_BASE}/admin/orders/total-sold-products`;

/** Helper: trích đúng object paginator dù BE trả trực tiếp hay bọc trong {data: {...}} */
function pickPaginator(payload) {
  if (payload && Array.isArray(payload.data) && typeof payload.current_page !== "undefined") {
    return payload;
  }
  if (payload && payload.data && Array.isArray(payload.data.data) && typeof payload.data.current_page !== "undefined") {
    return payload.data;
  }
  if (Array.isArray(payload)) {
    return { data: payload, current_page: 1, last_page: 1, total: payload.length, per_page: payload.length || 10 };
  }
  return { data: [], current_page: 1, last_page: 1, total: 0, per_page: 10 };
}

// ==== Helpers cho Import Preview ====
function toSlug(str = "") {
  return String(str)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// 👉 Thêm: chuẩn hoá thumbnail (giữ nguyên trùng, auto prefix assets/images/ nếu chỉ là tên file)
function normalizeThumb(v) {
  if (v == null) return "";
  let s = String(v).trim();
  // nếu không phải URL tuyệt đối và không bắt đầu bằng "/" thì coi là file nội bộ
  if (s && !/^https?:\/\//i.test(s) && !s.startsWith("/")) {
    if (!s.startsWith("assets/images/")) s = `assets/images/${s}`;
  }
  return s;
}

// Map header linh hoạt -> key chuẩn của BE
const HEADER_MAP = {
  "name": "name", "tên": "name", "ten": "name",
  "slug": "slug",
  "brand_id": "brand_id", "brand": "brand_id", "thương hiệu": "brand_id", "thuonghieu": "brand_id",
  "category_id": "category_id", "category": "category_id", "danh mục": "category_id", "danhmuc": "category_id",
  "price_root": "price_root", "giá gốc": "price_root", "giagoc": "price_root",
  "price_sale": "price_sale", "giá sale": "price_sale", "giasale": "price_sale",
  "qty": "qty", "số lượng": "qty", "soluong": "qty",
  "description": "description", "mô tả": "description", "mota": "description",
  "detail": "detail", "chi tiết": "detail", "chitiet": "detail",
  "status": "status", "trạng thái": "status", "trangthai": "status",
  // 👉 Mở rộng alias cho cột ảnh
  "thumbnail": "thumbnail",
  "thumbnail_url": "thumbnail",
  "ảnh": "thumbnail", "anh": "thumbnail",
  "hình": "thumbnail", "hinh": "thumbnail",
  "image": "thumbnail", "img": "thumbnail",
  "url ảnh": "thumbnail", "link ảnh": "thumbnail",
};

function normalizeHeaders(rawObj) {
  const out = {};
  Object.keys(rawObj || {}).forEach((k) => {
    const key = String(k || "").trim().toLowerCase();
    const mapped = HEADER_MAP[key];
    if (mapped) out[mapped] = rawObj[k];
  });
  return out;
}

// 👉 Helper đọc số từ payload {data:number} | {total:number} | {count:number}
function pickNumber(obj, keys = ["data", "total", "count", "value"]) {
  if (!obj || typeof obj !== "object") return 0;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && isFinite(v)) return v;
  }
  return 0;
}

/* ====== Helpers hiển thị thời gian import ====== */
function pad2(n) { return String(n).padStart(2, "0"); }
function formatTime(d) {
  const hh = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  const ss = pad2(d.getSeconds());
  return `${hh}:${mm}:${ss}`;
}
function humanizeDuration(ms) {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec} giây`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m} phút ${s} giây`;
}

/* =========================
   DonutChart (SVG thuần)
   ========================= */
function DonutChart({ sold = 0, inStock = 0, size = 150, thickness = 22 }) {
  const total = Math.max(0, Number(sold)) + Math.max(0, Number(inStock));
  const r = size / 2 - thickness / 2;
  const c = 2 * Math.PI * r;

  // phần trăm đã bán
  const soldRatio = total > 0 ? Math.min(1, Math.max(0, sold / total)) : 0;
  const soldLength = c * soldRatio;

  // màu theo mockup (hồng/đỏ cho đã bán, xanh cho tồn kho)
  const SOLD_COLOR = "#ef4444";
  const STOCK_COLOR = "#3b82f6";

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* nền: tồn kho */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={STOCK_COLOR}
            strokeWidth={thickness}
            strokeLinecap="round"
            opacity={0.9}
          />
          {/* phần đã bán nằm trên */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={SOLD_COLOR}
            strokeWidth={thickness}
            strokeDasharray={`${soldLength} ${Math.max(0, c - soldLength)}`}
            strokeLinecap="round"
          />
        </g>
        {/* lỗ donut */}
        <circle cx={size / 2} cy={size / 2} r={r - thickness / 2} fill="#fff" />
      </svg>

      {/* Legend */}
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 14, height: 8, background: SOLD_COLOR, borderRadius: 2 }}></span>
          {/* sửa chữ thừa "5" */}
          <span style={{ fontSize: 14 }}>Đã bán: <b>{Number(sold || 0).toLocaleString("vi-VN")}</b></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 14, height: 8, background: STOCK_COLOR, borderRadius: 2 }}></span>
          <span style={{ fontSize: 14 }}>Tồn kho: <b>{Number(inStock || 0).toLocaleString("vi-VN")}</b></span>
        </div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          Tổng: <b>{Number(total).toLocaleString("vi-VN")}</b>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [items, setItems] = useState([]);
  const [stocks, setStocks] = useState({});
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [stockLoading, setStockLoading] = useState(false);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deletingMany, setDeletingMany] = useState(false);
  const [selected, setSelected] = useState([]);
  const [viewItem, setViewItem] = useState(null);

  // 🔢 Phân trang
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  // 🔁 Reload sau import
  const [reload, setReload] = useState(0);

  // ⬆️ Import Excel states
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  // ==== Import Preview states ====
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewRows, setPreviewRows] = useState([]);
  const [originalFile, setOriginalFile] = useState(null);
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  // ✅ map thương hiệu & danh mục
  const [brandCats, setBrandCats] = useState({});
  const [brandCatLoading, setBrandCatLoading] = useState(false);

  // ✅ Tổng số sp hiện có (tồn kho) & đã bán
  const [totalInStock, setTotalInStock] = useState(null);
  const [totalSold, setTotalSold] = useState(null);
  const [topCardLoading, setTopCardLoading] = useState(false);

  // 🆕 Tóm tắt lần import gần nhất (để hiển thị thẻ giống ảnh)
  const [lastImport, setLastImport] = useState(null);
  // { startedAt: Date, finishedAt: Date, durationMs: number, inserted, updated, skipped, errors }

  const navigate = useNavigate();

  /* ===== Load danh sách theo trang ===== */
  useEffect(() => {
    const ac = new AbortController();
    const token = localStorage.getItem("admin_token");

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const url = `${API_BASE}/admin/products?page=${page}&per_page=${perPage}`;
        const res = await fetch(url, {
          signal: ac.signal,
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();

        const pg = pickPaginator(raw);
        const list = pg.data ?? [];
        setItems(Array.isArray(list) ? list : []);

        setMeta({
          current_page: Number(pg.current_page ?? page),
          last_page: Number(pg.last_page ?? 1),
          total: Number(pg.total ?? (Array.isArray(list) ? list.length : 0)),
          per_page: Number(pg.per_page ?? perPage),
        });

        setSelected([]);

        const ids = (Array.isArray(list) ? list : []).map((x) => x.id).filter(Boolean);
        if (ids.length) {
          try {
            setStockLoading(true);
            const res2 = await fetch(STOCK_SUMMARY_URL(ids), {
              signal: ac.signal,
              headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
            });
            if (res2.ok) {
              const sum = await res2.json();
              const map = sum?.data ?? {};
              setStocks(map);
            }
          } catch {} finally { setStockLoading(false); }

          try {
            setBrandCatLoading(true);
            const res3 = await fetch(BRAND_CATEGORY_SUMMARY_URL(ids), {
              signal: ac.signal,
              headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
            });
            if (res3.ok) {
              const bc = await res3.json();
              const mapBC = bc?.data ?? {};
              setBrandCats(mapBC);
            } else setBrandCats({});
          } catch { setBrandCats({}); }
          finally { setBrandCatLoading(false); }
        } else {
          setStocks({});
          setBrandCats({});
        }
      } catch (e) {
        if (e.name !== "AbortError") setErr("Không tải được danh sách sản phẩm.");
        setItems([]);
        setMeta({ current_page: 1, last_page: 1, total: 0, per_page: perPage });
        setStocks({});
        setBrandCats({});
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [page, perPage, reload]);

  /* ===== NEW: load số liệu tổng (2 thẻ / donut) ===== */
  useEffect(() => {
    const ac = new AbortController();
    const token = localStorage.getItem("admin_token");

    (async () => {
      try {
        setTopCardLoading(true);

        const [r1, r2] = await Promise.allSettled([
          fetch(STOCK_TOTAL_URL, { signal: ac.signal, headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
          fetch(SOLD_TOTAL_URL,  { signal: ac.signal, headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }),
        ]);

        if (r1.status === "fulfilled" && r1.value.ok) {
          const j = await r1.value.json().catch(() => ({}));
          setTotalInStock(pickNumber(j));
        } else {
          setTotalInStock((prev) => {
            const est = Object.values(stocks).reduce((s, v) => s + Number(v || 0), 0);
            return Number.isFinite(est) ? est : (prev ?? 0);
          });
        }

        if (r2.status === "fulfilled" && r2.value.ok) {
          const j = await r2.value.json().catch(() => ({}));
          setTotalSold(pickNumber(j));
        } else {
          setTotalSold((v) => v ?? 0);
        }
      } catch {} finally { setTopCardLoading(false); }
    })();

    return () => ac.abort();
  }, [reload, stocks]);

  // ===== Helper tồn kho / brand / category =====
  const getQty = (p) => {
    const id = p?.id;
    if (id != null && Object.prototype.hasOwnProperty.call(stocks, id))
      return Number(stocks[id] ?? 0);
    return Number(p?.qty ?? 0);
  };

  const getBrandName = (p) => {
    const id = p?.id;
    const fromMap = id != null ? brandCats[id] : null;
    return (
      fromMap?.brand_name ??
      p?.brand_name ??
      p?.brand?.name ??
      (p?.brand_id != null ? `#${p.brand_id}` : "")
    );
  };
  const getCategoryName = (p) => {
    const id = p?.id;
    const fromMap = id != null ? brandCats[id] : null;
    return (
      fromMap?.category_name ??
      p?.category_name ??
      p?.category?.name ??
      (p?.category_id != null ? `#${p.category_id}` : "")
    );
  };

  // ===== Xoá sản phẩm & xoá nhiều =====
  async function handleDelete(id, { silent = false } = {}) {
    const token = localStorage.getItem("admin_token");
    if (!silent) {
      if (!window.confirm("Bạn chắc chắn muốn xoá sản phẩm này?")) return false;
    }
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Xoá thất bại");

      setItems((prev) => prev.filter((x) => x.id !== id));
      setStocks((prev) => { const n = { ...prev }; delete n[id]; return n; });
      setBrandCats((prev) => { const n = { ...prev }; delete n[id]; return n; });

      if (!silent) alert("✅ Đã chuyển sản phẩm vào thùng rác");
      return true;
    } catch (err) {
      if (!silent) alert(`❌ Lỗi xoá: ${err.message}`);
      return false;
    } finally {
      setDeletingId(null);
    }
  }

  async function handleBulkDelete() {
    if (!selected.length) return alert("Chưa chọn sản phẩm nào");
    if (!window.confirm(`Xoá ${selected.length} sản phẩm?`)) return;

    setDeletingMany(true);
    let ok = 0; const fail = [];
    for (const id of selected) {
      const okOne = await handleDelete(id, { silent: true });
      if (okOne) ok++; else fail.push(id);
    }
    setDeletingMany(false); setSelected([]);

    if (ok && fail.length === 0) alert(`✅ Đã xoá ${ok} sản phẩm.`);
    else if (ok && fail.length > 0) alert(`⚠️ Thành công ${ok}, thất bại ${fail.length}: ${fail.join(", ")}`);
    else alert("❌ Không xoá được sản phẩm nào.");
  }

  /* ====== IMPORT (giữ logic, thêm đo thời gian) ====== */
  async function handleImport(file) {
    const token = localStorage.getItem("admin_token");
    const t0 = new Date();
    try {
      setImporting(true);
      const form = new FormData();
      form.append("file", file);
      form.append("mode", "upsert");
      const res = await fetch(`${API_BASE}/admin/products/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Import thất bại");

      const t1 = new Date();
      const dur = t1 - t0;

      // 🧾 thông báo có thời gian
      alert(
        `✔ Import xong:
- Thêm: ${data.inserted}
- Cập nhật: ${data.updated}
- Bỏ qua: ${data.skipped}
- Bắt đầu: ${formatTime(t0)}
- Hoàn thành: ${formatTime(t1)} (mất ${humanizeDuration(dur)})`
        + `${data.errors?.length ? `\n- Lỗi: ${data.errors.length} dòng` : ""}`
      );

      // 🆕 Lưu thẻ tóm tắt lần import
      setLastImport({
        startedAt: t0,
        finishedAt: t1,
        durationMs: dur,
        inserted: Number(data.inserted || 0),
        updated: Number(data.updated || 0),
        skipped: Number(data.skipped || 0),
        errors: Array.isArray(data.errors) ? data.errors.length : 0,
      });

      setReload((x) => x + 1); setPage(1);
    } catch (e) {
      alert(`❌ Lỗi import: ${e.message}`);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function validateRow(d, idx, allRows) {
    const errors = [];
    const price_root = Number(d.price_root ?? 0);
    const price_sale = Number(d.price_sale ?? 0);
    const qty = Number.isFinite(Number(d.qty)) ? Number(d.qty) : d.qty;

    if (!d.name || String(d.name).trim() === "") errors.push("Thiếu tên (name)");
    if (!d.slug || String(d.slug).trim() === "") errors.push("Thiếu slug (đã auto-gợi ý)");
    if (d.brand_id === undefined || d.brand_id === "") errors.push("Thiếu brand_id");
    if (d.category_id === undefined || d.category_id === "") errors.push("Thiếu category_id");

    if (isNaN(price_root) || price_root < 0) errors.push("price_root phải là số ≥ 0");
    if (isNaN(price_sale) || price_sale < 0) errors.push("price_sale phải là số ≥ 0");
    if (!Number.isInteger(Number(qty)) || Number(qty) < 0) errors.push("qty phải là số nguyên ≥ 0");
    if (!isNaN(price_root) && !isNaN(price_sale) && price_sale > price_root) {
      errors.push("price_sale không được lớn hơn price_root");
    }

    const curSlug = (d.slug || "").toString().trim().toLowerCase();
    if (curSlug) {
      const dupIndex = allRows.findIndex((r, i2) =>
        i2 !== idx && (r.data.slug || "").toString().trim().toLowerCase() === curSlug
      );
      if (dupIndex !== -1) errors.push(`Slug trùng ở dòng ${dupIndex + 2}`);
    }
    return errors;
  }

  async function handleFileSelected(file) {
    try {
      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      let rows = json.map((raw, i) => {
        const d = normalizeHeaders(raw);
        if (!d.thumbnail && d.thumbnail_url) d.thumbnail = d.thumbnail_url;
        // 👉 chuẩn hoá thumbnail (tự thêm assets/images/ nếu chỉ là tên file)
        if (d.thumbnail !== undefined) d.thumbnail = normalizeThumb(d.thumbnail);
        if (!d.slug && d.name) d.slug = toSlug(d.name);
        if (d.price_root !== undefined) d.price_root = Number(d.price_root || 0);
        if (d.price_sale !== undefined) d.price_sale = Number(d.price_sale || 0);
        if (d.qty !== undefined) d.qty = Number.isFinite(Number(d.qty)) ? Number(d.qty) : 0;
        if (typeof d.status === "string") {
          const s = d.status.trim().toLowerCase();
          d.status = ["1","true","active","đang bán","dang ban"].includes(s) ? 1 : 0;
        }
        return { rowIndex: i, data: d, errors: [] };
      });

      rows = rows.map((r, idx) => ({ ...r, errors: validateRow(r.data, idx, rows) }));
      rows.sort((a, b) => (b.errors.length > 0) - (a.errors.length > 0));

      setPreviewRows(rows);
      setOriginalFile(file);
      setPreviewOpen(true);
    } catch (e) {
      alert("Không đọc được file Excel: " + e.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function updateCell(idx, key, value) {
    setPreviewRows((prev) => {
      const copy = prev.map((r) => ({ ...r, data: { ...r.data }, errors: [...r.errors] }));
      copy[idx].data[key] = value;
      if (key === "name" && (!copy[idx].data.slug || copy[idx].data.slug.trim() === "")) {
        copy[idx].data.slug = toSlug(value);
      }
      copy[idx].errors = validateRow(copy[idx].data, idx, copy);
      copy.sort((a, b) => (b.errors.length > 0) - (a.errors.length > 0));
      return copy;
    });
  }

  function deleteRow(idx) {
    setPreviewRows((prev) => {
      const copy = prev.slice();
      copy.splice(idx, 1);
      return copy
        .map((r, i) => ({ ...r, errors: validateRow(r.data, i, copy) }))
        .sort((a, b) => (b.errors.length > 0) - (a.errors.length > 0));
    });
  }

  function hasAnyError(rows = previewRows) {
    return rows.some((r) => r.errors?.length);
  }

  function toCSV(rows) {
    const headers = [
      "name","slug","brand_id","category_id",
      "price_root","price_sale","qty",
      "description","detail","status","thumbnail"
    ];
    const esc = (v) => {
      const s = v == null ? "" : String(v);
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const lines = [];
    lines.push(headers.join(","));
    rows.forEach(({ data }) => {
      const row = headers.map((h) => esc(data[h] ?? ""));
      lines.push(row.join(","));
    });
    return "\uFEFF" + lines.join("\n");
  }

  async function confirmImportValidRows() {
    const validRows = previewRows.filter((r) => !r.errors?.length);
    if (!validRows.length) return alert("Không có dòng hợp lệ để import.");

    const token = localStorage.getItem("admin_token");
    const t0 = new Date();
    try {
      setImporting(true);
      const csv = toCSV(validRows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const file = new File([blob], (originalFile?.name?.replace(/\.[^.]+$/,"") || "import") + "_clean.csv", { type: blob.type });

      const form = new FormData();
      form.append("file", file);
      form.append("mode", "upsert");

      const res = await fetch(`${API_BASE}/admin/products/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Import thất bại");

      const t1 = new Date();
      const dur = t1 - t0;

      alert(
        `✔ Import xong:
- Thêm: ${data.inserted}
- Cập nhật: ${data.updated}
- Bỏ qua: ${data.skipped}
- Bắt đầu: ${formatTime(t0)}
- Hoàn thành: ${formatTime(t1)} (mất ${humanizeDuration(dur)})`
        + `${data.errors?.length ? `\n- Lỗi: ${data.errors.length} dòng` : ""}`
      );

      // lưu thẻ tóm tắt
      setLastImport({
        startedAt: t0,
        finishedAt: t1,
        durationMs: dur,
        inserted: Number(data.inserted || 0),
        updated: Number(data.updated || 0),
        skipped: Number(data.skipped || 0),
        errors: Array.isArray(data.errors) ? data.errors.length : 0,
      });

      setPreviewOpen(false);
      setPreviewRows([]);
      setOriginalFile(null);
      setReload((x) => x + 1);
      setPage(1);
    } catch (e) {
      alert(`❌ Lỗi import: ${e.message}`);
    } finally {
      setImporting(false);
    }
  }

  // ===== Lọc cục bộ theo tên/slug (trên TRANG hiện tại) =====
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (x) =>
        x.name?.toLowerCase().includes(s) ||
        x.slug?.toLowerCase().includes(s)
    );
  }, [q, items]);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const allChecked = filtered.length > 0 && selected.length === filtered.length;

  const toggleAll = () => setSelected(allChecked ? [] : filtered.map((x) => x.id));

  // ===== Pagination helpers =====
  const canPrev = meta.current_page > 1;
  const canNext = meta.current_page < meta.last_page;

  const gotoPage = (p) => {
    if (p < 1 || p > meta.last_page || p === meta.current_page) return;
    setPage(p);
  };

  const buildPageNumbers = () => {
    const total = meta.last_page;
    const cur = meta.current_page;
    const delta = 1;
    const pages = new Set([1, total]);

    for (let i = cur - delta; i <= cur + delta; i++) {
      if (i >= 1 && i <= total) pages.add(i);
    }
    if (total >= 2) {
      pages.add(2);
      pages.add(total - 1);
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const pages = buildPageNumbers();

  // ===== Styles helper cho thẻ thống kê =====
  const statCard = () => ({
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    minWidth: 260,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  });

  // ===== Render =====
  return (
    <section style={{ padding: 20 }}>
      {/* ====== HÀNG THẺ THỐNG KÊ ====== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {/* Card 1: Tổng số sản phẩm hiện có */}
        <div style={statCard()}>
          <div style={{ fontSize: 14, color: "#374151", fontWeight: 700 }}>
            Tổng số sản phẩm hiện có
          </div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>
            {topCardLoading && totalInStock === null ? "…" : (Number(totalInStock ?? 0)).toLocaleString("vi-VN")}
          </div>
          <div style={{ color: "#10b981", fontSize: 13 }}>
            ↑ Tổng số sản phẩm còn trong kho
          </div>
        </div>

        {/* Card 2: Donut thống kê sản phẩm */}
        <div style={statCard()}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
            Thống kê sản phẩm
          </div>
          <DonutChart
            sold={Number(totalSold ?? 0)}
            inStock={Number(totalInStock ?? 0)}
            size={160}
            thickness={24}
          />
        </div>

        {/* 🆕 Card 3: Tóm tắt lần import gần nhất (giống ảnh) */}
        {lastImport && (
          <div style={statCard()}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>Import xong:</div>
            <div style={{ lineHeight: 1.7 }}>
              <div>• Thêm: <b style={{ color: "#ec4899" }}>{lastImport.inserted}</b></div>
              <div>• Cập nhật: <b style={{ color: "#ec4899" }}>{lastImport.updated}</b></div>
              <div>• Bỏ qua: <b style={{ color: "#ec4899" }}>{lastImport.skipped}</b></div>
              {typeof lastImport.errors === "number" && lastImport.errors > 0 && (
                <div>• Lỗi: <b style={{ color: "#ef4444" }}>{lastImport.errors} dòng</b></div>
              )}
              <div style={{ marginTop: 6 }}>
                <span role="img" aria-label="clock">⏱</span> Bắt đầu: <b>{formatTime(new Date(lastImport.startedAt))}</b>
              </div>
              <div>
                ✅ Hoàn thành: <b>{formatTime(new Date(lastImport.finishedAt))}</b>{" "}
                <span style={{ color: "#6b7280" }}>(mất {humanizeDuration(lastImport.durationMs)})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thanh tiêu đề */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>
          Quản lý sản phẩm
          {stockLoading ? " · đang tải tồn kho…" : ""}
          {brandCatLoading ? " · đang tải thương hiệu/danh mục…" : ""}
        </h1>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm tên/slug… (trang hiện tại)"
            style={{
              height: 36,
              padding: "0 10px",
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />

          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            style={{ height: 36, borderRadius: 8, border: "1px solid #ddd" }}
            title="Số dòng mỗi trang"
          >
            {[5, 10, 20, 30, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}/trang
              </option>
            ))}
          </select>

          <button
            onClick={() => navigate("/admin/products/add")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #0f62fe",
              background: "#0f62fe",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            + Thêm
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ⬆ Import Excel
          </button>

          <button
            onClick={async () => {
              // đồng bộ token
              const token = localStorage.getItem("admin_token") || "";
              try {
                const res = await fetch("http://127.0.0.1:8000/api/admin/products/export", {
                  method: "GET",
                  headers: {
                    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                });
                if (!res.ok) throw new Error("Export thất bại");
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "products_export.xlsx";
                a.click();
                window.URL.revokeObjectURL(url);
              } catch (err) {
                alert("❌ " + err.message);
              }
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",
              background: "#10b981",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ⬇ Export Excel
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
            style={{ display: "none" }}
          />

          <button
            onClick={handleBulkDelete}
            disabled={deletingMany || !selected.length}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e11d48",
              background: selected.length && !deletingMany ? "#e11d48" : "#fca5a5",
              color: "#fff",
              cursor: selected.length && !deletingMany ? "pointer" : "not-allowed",
            }}
          >
            {deletingMany ? "Đang xoá…" : `🗑 Xoá chọn (${selected.length})`}
          </button>
          <button
            onClick={() => navigate("/admin/products/trash")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #6b7280",
              background: "#6b7280",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            🗂 Thùng rác
          </button>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      {loading && <p>Đang tải dữ liệu…</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {!loading && (
        <>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table
              width="100%"
              cellPadding={8}
              style={{ borderCollapse: "collapse", background: "#fff", borderRadius: 8 }}
            >
              <thead>
                <tr style={{ background: "#fafafa" }}>
                  <th><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
                  <th align="left">ID</th>
                  <th align="left">Tên</th>
                  <th align="left">Slug</th>
                  <th align="left">Thương hiệu</th>
                  <th align="left">Danh mục</th>
                  <th align="right">Giá gốc</th>
                  <th align="right">Giá sale</th>
                  <th align="right">Tồn kho (DB)</th>
                  <th align="center">Ảnh</th>
                  <th align="center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.slug}</td>
                    <td>{getBrandName(p)}</td>
                    <td>{getCategoryName(p)}</td>
                    <td align="right">₫{(p.price_root || 0).toLocaleString("vi-VN")}</td>
                    <td align="right">₫{(p.price_sale || 0).toLocaleString("vi-VN")}</td>
                    <td align="right">{getQty(p).toLocaleString("vi-VN")}</td>
                    <td align="center">
                      <img
                        // 👉 Fallback đủ: thumbnail_url -> thumbnail -> placeholder
                        src={p.thumbnail_url || p.thumbnail || PLACEHOLDER}
                        alt={p.name}
                        style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                        onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                      />
                    </td>
                    <td align="center">
                      <button
                        onClick={() => setViewItem(p)}
                        style={{ padding: "4px 10px", marginRight: 4, background: "#2563eb", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}
                      >
                        👁 Xem
                      </button>
                      <button
                        onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                        style={{ padding: "4px 10px", marginRight: 4, background: "#2e7d32", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id || deletingMany}
                        style={{ padding: "4px 10px", background: deletingId === p.id || deletingMany ? "#ef9a9a" : "#c62828", color: "#fff", border: 0, borderRadius: 6, cursor: deletingId === p.id || deletingMany ? "not-allowed" : "pointer" }}
                      >
                        {deletingId === p.id ? "Đang xoá..." : "🗑 Xóa"}
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={11} align="center" style={{ padding: 18, color: "#777" }}>
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Thanh phân trang */}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ color: "#555" }}>
              Tổng: <b>{Number(meta.total).toLocaleString("vi-VN")}</b> — Trang{" "}
              <b>{meta.current_page}</b>/<b>{meta.last_page}</b>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button onClick={() => gotoPage(1)} disabled={!canPrev} style={btnPager(!canPrev)}>« Đầu</button>
              <button onClick={() => gotoPage(meta.current_page - 1)} disabled={!canPrev} style={btnPager(!canPrev)}>‹ Trước</button>

              {pages.map((p, idx) => {
                const prev = pages[idx - 1];
                const needDots = prev && p - prev > 1;
                return (
                  <span key={p} style={{ display: "inline-flex", gap: 6 }}>
                    {needDots && <span style={{ padding: "6px 8px" }}>…</span>}
                    <button
                      onClick={() => gotoPage(p)}
                      disabled={p === meta.current_page}
                      style={btnNumber(p === meta.current_page)}
                      title={`Trang ${p}`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}

              <button onClick={() => gotoPage(meta.current_page + 1)} disabled={!canNext} style={btnPager(!canNext)}>Sau ›</button>
              <button onClick={() => gotoPage(meta.last_page)} disabled={!canNext} style={btnPager(!canNext)}>Cuối »</button>
            </div>
          </div>
        </>
      )}

      {/* Modal xem chi tiết */}
      {viewItem && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1000,
          }}
          onClick={() => setViewItem(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 10, padding: 20, width: 550,
              maxHeight: "90vh", overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 20, marginBottom: 10, fontWeight: 700 }}>🏷 {viewItem.name}</h2>

            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <img
                // 👉 Fallback đủ: thumbnail_url -> thumbnail -> placeholder
                src={viewItem.thumbnail_url || viewItem.thumbnail || PLACEHOLDER}
                alt={viewItem.name}
                style={{ width: 200, height: 150, objectFit: "cover", borderRadius: 6, boxShadow: "0 0 6px rgba(0,0,0,0.2)" }}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />
            </div>

            <p><b>Slug:</b> {viewItem.slug}</p>
            <p>
              <b>Giá:</b> ₫{Number(viewItem.price_sale ?? 0).toLocaleString("vi-VN")}{" "}
              <span style={{ color: "#888" }}>(Gốc: ₫{Number(viewItem.price_root ?? 0).toLocaleString("vi-VN")})</span>
            </p>
            <p><b>Thương hiệu:</b> {getBrandName(viewItem)}</p>
            <p><b>Danh mục:</b> {getCategoryName(viewItem)}</p>
            <p><b>Tồn kho (DB):</b> {getQty(viewItem).toLocaleString("vi-VN")}</p>
            <p><b>Trạng thái:</b> {viewItem.status}</p>

            <div style={{ marginTop: 10 }}>
              <p><b>Mô tả:</b></p>
              <div
                dangerouslySetInnerHTML={{ __html: viewItem.description?.trim() ? viewItem.description : "<em>Không có mô tả</em>" }}
                style={{ color: "#333", lineHeight: "1.6", background: "#f8fafc", padding: "8px 10px", borderRadius: 6 }}
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <p><b>Chi tiết:</b></p>
              <div
                dangerouslySetInnerHTML={{ __html: viewItem.detail?.trim() ? viewItem.detail : "<em>Không có chi tiết</em>" }}
                style={{ color: "#333", lineHeight: "1.6", background: "#f8fafc", padding: "8px 10px", borderRadius: 6 }}
              />
            </div>

            <div style={{ textAlign: "right", marginTop: 20 }}>
              <button
                onClick={() => setViewItem(null)}
                style={{ padding: "8px 16px", background: "#0f62fe", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal PREVIEW IMPORT */}
      {previewOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100,
          }}
          onClick={() => setPreviewOpen(false)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 12, padding: 16, width: "90vw",
              maxWidth: 1200, maxHeight: "92vh", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>
                📥 Xem trước Import — {originalFile?.name || "chưa đặt tên"}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <input type="checkbox" checked={showOnlyErrors} onChange={(e) => setShowOnlyErrors(e.target.checked)} />
                  Chỉ hiển thị dòng lỗi
                </label>
                <button onClick={() => setPreviewOpen(false)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}>
                  Đóng
                </button>
              </div>
            </div>

            <div style={{ margin: "8px 0", color: "#374151" }}>
              <b>Tổng dòng:</b> {previewRows.length} • <b>Lỗi:</b> {previewRows.filter(r => r.errors?.length).length} • <b>Hợp lệ:</b> {previewRows.filter(r => !r.errors?.length).length}
            </div>

            <div style={{ height: "65vh", overflow: "auto", border: "1px solid #eee", borderRadius: 8 }}>
              <table width="100%" cellPadding={6} style={{ borderCollapse: "collapse", background: "#fff" }}>
                <thead style={{ position: "sticky", top: 0, background: "#f9fafb", zIndex: 1 }}>
                  <tr>
                    <th>#</th>
                    <th>Lỗi</th>
                    <th>Tên</th>
                    <th>Slug</th>
                    <th>Brand ID</th>
                    <th>Category ID</th>
                    <th>Giá gốc</th>
                    <th>Giá sale</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Thumbnail</th>
                    <th>Mô tả</th>
                    <th>Chi tiết</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(showOnlyErrors ? previewRows.filter(r => r.errors?.length) : previewRows).map((r, idx) => {
                    const hasErr = r.errors?.length > 0;
                    return (
                      <tr key={idx} style={{ borderTop: "1px solid #f0f0f0", background: hasErr ? "#fff7f7" : "#fff" }}>
                        <td>{idx + 1}</td>
                        <td style={{ minWidth: 180, color: hasErr ? "#b91c1c" : "#059669" }}>
                          {hasErr ? r.errors.join("; ") : "OK"}
                        </td>
                        <td><input value={r.data.name ?? ""} onChange={(e)=>updateCell(idx, "name", e.target.value)} style={cellInputStyle} /></td>
                        <td><input value={r.data.slug ?? ""} onChange={(e)=>updateCell(idx, "slug", e.target.value)} style={cellInputStyle} /></td>
                        <td><input value={r.data.brand_id ?? ""} onChange={(e)=>updateCell(idx, "brand_id", e.target.value)} style={cellInputStyle} /></td>
                        <td><input value={r.data.category_id ?? ""} onChange={(e)=>updateCell(idx, "category_id", e.target.value)} style={cellInputStyle} /></td>
                        <td><input type="number" value={r.data.price_root ?? 0} onChange={(e)=>updateCell(idx, "price_root", e.target.value)} style={cellInputStyle} /></td>
                        <td><input type="number" value={r.data.price_sale ?? 0} onChange={(e)=>updateCell(idx, "price_sale", e.target.value)} style={cellInputStyle} /></td>
                        <td><input type="number" value={r.data.qty ?? 0} onChange={(e)=>updateCell(idx, "qty", e.target.value)} style={cellInputStyle} /></td>
                        <td>
                          <select value={r.data.status ?? 1} onChange={(e)=>updateCell(idx, "status", Number(e.target.value))} style={cellInputStyle}>
                            <option value={1}>1</option>
                            <option value={0}>0</option>
                          </select>
                        </td>
                        <td><input value={r.data.thumbnail ?? ""} onChange={(e)=>updateCell(idx, "thumbnail", e.target.value)} style={cellInputStyle} /></td>
                        <td><input value={r.data.description ?? ""} onChange={(e)=>updateCell(idx, "description", e.target.value)} style={{...cellInputStyle, minWidth: 140}} /></td>
                        <td><input value={r.data.detail ?? ""} onChange={(e)=>updateCell(idx, "detail", e.target.value)} style={{...cellInputStyle, minWidth: 140}} /></td>
                        <td>
                          <button onClick={() => deleteRow(idx)} style={{ padding: "4px 8px", border: 0, borderRadius: 6, background: "#ef4444", color: "#fff", cursor: "pointer" }}>
                            Xoá
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {(!previewRows.length) && (
                    <tr><td colSpan={14} align="center" style={{ padding: 16, color: "#6b7280" }}>Không có dòng nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <div style={{ color: hasAnyError(previewRows) ? "#b91c1c" : "#059669", fontWeight: 600 }}>
                {hasAnyError(previewRows) ? "Còn lỗi — vui lòng sửa hoặc xoá dòng lỗi." : "Dữ liệu hợp lệ — có thể Import."}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    if (!window.confirm("Xoá toàn bộ các dòng đang preview?")) return;
                    setPreviewRows([]);
                  }}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
                >
                  🧹 Xoá tất cả
                </button>
                <button
                  onClick={confirmImportValidRows}
                  disabled={!previewRows.some(r => !r.errors?.length) || importing}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #10b981",
                    background: previewRows.some(r => !r.errors?.length) && !importing ? "#10b981" : "#a7f3d0",
                    color: "#fff",
                    cursor: previewRows.some(r => !r.errors?.length) && !importing ? "pointer" : "not-allowed",
                    fontWeight: 700,
                  }}
                >
                  {importing ? "Đang import…" : "✅ Xác nhận Import (chỉ dòng hợp lệ)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ===== Styles helper cho nút phân trang =====
function btnPager(disabled) {
  return {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: disabled ? "#f3f4f6" : "#fff",
    color: disabled ? "#9ca3af" : "#111",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
function btnNumber(active) {
  return {
    padding: "6px 10px",
    borderRadius: 8,
    border: active ? "1px solid #2563eb" : "1px solid #ddd",
    background: active ? "#2563eb" : "#fff",
    color: active ? "#fff" : "#111",
    cursor: active ? "default" : "pointer",
    minWidth: 40,
  };
}

// style input nhỏ gọn cho ô trong bảng preview
const cellInputStyle = {
  width: 140,
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#fff",
};
