// // src/pages/Customers/Products.jsx
// import { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import ProductCardHome from "../../components/ProductCardHome"; // Ä‘á»“ng bá»™ card nhÆ° Home

// const API_BASE = "http://127.0.0.1:8000/api";
// const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";
// const HEADER_OFFSET = 110;

// /* ========= Helpers ========= */
// const toNum = (x) => {
//   if (x == null || x === "") return 0;
//   if (typeof x === "string") return Number(x.replace(/[^\d.-]/g, "")) || 0;
//   const n = Number(x);
//   return Number.isFinite(n) ? n : 0;
// };
// const getName = (p) => p.name || p.title || `Sáº£n pháº©m #${p.id}`;
// const getCreatedTs = (p) => new Date(p.created_at || p.updated_at || 0).getTime();
// const getPrice = (p) =>
//   toNum(p.price_sale ?? p.sale_price ?? p.price ?? p.price_buy ?? p.amount);
// const getRootPrice = (p) =>
//   toNum(p.price_root ?? p.original_price ?? p.root_price);
// const getCategoryId = (p) => {
//   if (p.category_id != null) return String(p.category_id);
//   if (p.categoryId != null) return String(p.categoryId);
//   if (p.category && p.category.id != null) return String(p.category.id);
//   return "";
// };
// const inStock = (p) => {
//   const stock = toNum(p.stock ?? p.qty ?? p.quantity);
//   const status = String(p.status || "").toLowerCase();
//   return stock > 0 || status === "active" || status === "1";
// };

// function applyClientFilterAndSort(list, f) {
//   let arr = Array.isArray(list) ? [...list] : [];

//   // keyword
//   if (f.q) {
//     const kw = f.q.toLowerCase().trim();
//     arr = arr.filter((p) => {
//       const n = getName(p).toLowerCase();
//       const slug = String(p.slug || "").toLowerCase();
//       return n.includes(kw) || slug.includes(kw);
//     });
//   }

//   // category
//   if (f.category_id)
//     arr = arr.filter((p) => getCategoryId(p) === String(f.category_id));

//   // sale only
//   if (f.only_sale) {
//     arr = arr.filter((p) => {
//       const price = getPrice(p),
//         root = getRootPrice(p);
//       return root && price && price < root;
//     });
//   }

//   // in stock
//   if (f.in_stock) arr = arr.filter((p) => inStock(p));

//   // price range
//   if (f.min_price) arr = arr.filter((p) => getPrice(p) >= toNum(f.min_price));
//   if (f.max_price) arr = arr.filter((p) => getPrice(p) <= toNum(f.max_price));

//   // sort
//   const by = f.sort || "newest";
//   const collator = new Intl.Collator("vi", { sensitivity: "base" });
//   if (by === "price-asc") arr.sort((a, b) => getPrice(a) - getPrice(b));
//   else if (by === "price-desc") arr.sort((a, b) => getPrice(b) - getPrice(a));
//   else if (by === "name-asc")
//     arr.sort((a, b) => collator.compare(getName(a), getName(b)));
//   else if (by === "name-desc")
//     arr.sort((a, b) => collator.compare(getName(b), getName(a)));
//   else arr.sort((a, b) => getCreatedTs(b) - getCreatedTs(a));
//   return arr;
// }

// function useDebounce(value, delay = 400) {
//   const [v, setV] = useState(value);
//   useEffect(() => {
//     const t = setTimeout(() => setV(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return v;
// }

// /* âœ… build query Ä‘á»ƒ gá»i server-side filter */
// function buildQuery(f) {
//   const q = new URLSearchParams();
//   if (f.q) q.set("keyword", f.q); // server Ä‘á»c keyword|q
//   if (f.category_id) q.set("category_id", f.category_id);
//   if (f.min_price) q.set("min_price", f.min_price);
//   if (f.max_price) q.set("max_price", f.max_price);
//   if (f.only_sale) q.set("only_sale", "1");
//   if (f.in_stock) q.set("in_stock", "1");
//   const map = {
//     newest: "created_at:desc",
//     "price-asc": "price:asc",
//     "price-desc": "price:desc",
//     "name-asc": "name:asc",
//     "name-desc": "name:desc",
//   };
//   const s = map[f.sort || "newest"];
//   if (s) q.set("sort", s);
//   q.set("per_page", 120); // tÄƒng nháº¹ Ä‘á»ƒ Ä‘á»§ hÃ ng gá»£i Ã½/related
//   return q.toString();
// }

// /* ========= Page ========= */
// export default function Products() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [items, setItems] = useState([]);
//   const [all, setAll] = useState([]); // Ä‘á»ƒ tÃ­nh "liÃªn quan / gá»£i Ã½"
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const [categories, setCategories] = useState([]);
//   const [filter, setFilter] = useState({
//     q: "",
//     category_id: "",
//     min_price: "",
//     max_price: "",
//     only_sale: false,
//     in_stock: false,
//     sort: "newest",
//   });
//   const debounced = useDebounce(filter, 400);

//   // âœ… Náº¡p tá»« khoÃ¡ (vÃ  má»™t sá»‘ bá»™ lá»c cÆ¡ báº£n) tá»« URL
//   useEffect(() => {
//     const sp = new URLSearchParams(location.search);
//     const qFromUrl = sp.get("q") || sp.get("keyword") || "";
//     const cat = sp.get("category_id") || "";
//     const onlySale = sp.get("only_sale") === "1";
//     setFilter((s) => ({
//       ...s,
//       q: qFromUrl,
//       category_id: cat,
//       only_sale: onlySale,
//     }));
//   }, [location.search]);

//   // load categories
//   useEffect(() => {
//     const ac = new AbortController();
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/categories`, { signal: ac.signal });
//         const data = await res.json().catch(() => ({}));
//         const list = Array.isArray(data) ? data : data?.data ?? [];
//         setCategories(
//           list.map((c) => ({ id: c.id, name: c.name || c.title || `Danh má»¥c ${c.id}` }))
//         );
//       } catch {
//         setCategories([]);
//       }
//     })();
//     return () => ac.abort();
//   }, []);

//   // load products (server filter + client fallback)
//   useEffect(() => {
//     const ac = new AbortController();
//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");

//         // 1) Dá»¯ liá»‡u Ä‘Ã£ lá»c theo server
//         const qs = buildQuery(debounced);
//         const res = await fetch(
//           `${API_BASE}/products${qs ? "?" + qs : ""}`,
//           { signal: ac.signal }
//         );
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();
//         const list = Array.isArray(data) ? data : data?.data ?? [];
//         setItems(applyClientFilterAndSort(list, debounced)); // fallback client

//         // 2) Láº¥y má»™t báº£n "all" Ä‘á»ƒ tÃ­nh gá»£i Ã½/related (láº¥y Ã­t nhiá»u tuá»³ Ã½)
//         const resAll = await fetch(`${API_BASE}/products?per_page=200`, {
//           signal: ac.signal,
//         });
//         const dataAll = await resAll.json().catch(() => ({}));
//         const listAll = Array.isArray(dataAll) ? dataAll : dataAll?.data ?? [];
//         setAll(listAll);
//       } catch (e) {
//         if (e.name !== "AbortError")
//           setErr("KhÃ´ng táº£i Ä‘Æ°á»£c danh sÃ¡ch sáº£n pháº©m.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => ac.abort();
//   }, [debounced]);

//   const clearAll = () => {
//     setFilter({
//       q: "",
//       category_id: "",
//       min_price: "",
//       max_price: "",
//       only_sale: false,
//       in_stock: false,
//       sort: "newest",
//     });
//     navigate("/products", { replace: true }); // xoÃ¡ query
//   };

//   /* ====== TÃ­nh "LiÃªn quan / Gá»£i Ã½" (1 hÃ ng / 4 sp) ====== */
//   const related = (() => {
//     if (!all.length) return [];
//     const exclude = new Set(items.map((x) => x.id));
//     let pool = all;

//     // Æ°u tiÃªn theo danh má»¥c hiá»‡n táº¡i náº¿u cÃ³
//     if (filter.category_id) {
//       pool = all.filter(
//         (p) => getCategoryId(p) === String(filter.category_id)
//       );
//     }

//     // loáº¡i trá»« nhá»¯ng sp Ä‘ang hiá»ƒn thá»‹ á»Ÿ list
//     let suggestion = pool.filter((p) => !exclude.has(p.id));

//     // fallback náº¿u quÃ¡ Ã­t
//     if (suggestion.length < 4) {
//       const plus = all.filter(
//         (p) =>
//           !exclude.has(p.id) && !suggestion.find((s) => s.id === p.id)
//       );
//       suggestion = suggestion.concat(plus);
//     }
//     // sáº¯p xáº¿p má»›i nháº¥t
//     suggestion.sort((a, b) => getCreatedTs(b) - getCreatedTs(a));
//     return suggestion.slice(0, 4);
//   })();

//   /* ======= UI states ======= */
//   if (loading && items.length === 0)
//     return (
//       <p style={{ padding: 20, textAlign: "center", color: "#2563eb" }}>
//         Äang táº£i sáº£n pháº©m...
//       </p>
//     );
//   if (err)
//     return (
//       <p style={{ padding: 20, textAlign: "center", color: "#d32f2f" }}>
//         {err}
//       </p>
//     );

//   return (
//     <div
//       className="products-page"
//       style={{
//         padding: `${HEADER_OFFSET}px 20px 40px`,
//         fontFamily: "Montserrat, Arial, sans-serif",
//         background: "#f8fafc",     // Ná»€N SÃNG
//         color: "#0b1220",          // CHá»® Äáº¬M
//       }}
//     >
//       <StyleTag />

//       <h2 className="products-title">Táº¤T Cáº¢ Sáº¢N PHáº¨M</h2>
//       {filter.q ? (
//         <p
//           style={{
//             textAlign: "center",
//             marginTop: -6,
//             marginBottom: 8,
//             color: "#334155",
//             fontWeight: 700,
//           }}
//         >
//           Káº¿t quáº£ cho: <strong>{filter.q}</strong>
//         </p>
//       ) : null}

//       {/* Filter Bar */}
//       <FilterBar
//         filter={filter}
//         setFilter={(patch) => setFilter((s) => ({ ...s, ...patch }))}
//         categories={categories}
//         loading={loading}
//         onClear={clearAll}
//       />

//       {/* LÆ°á»›i sáº£n pháº©m (4 cá»™t giá»‘ng Home) */}
//       {items.length === 0 ? (
//         <p
//           style={{
//             padding: 20,
//             textAlign: "center",
//             color: "#475569",
//             fontWeight: 700,
//           }}
//         >
//           KhÃ´ng cÃ³ sáº£n pháº©m phÃ¹ há»£p bá»™ lá»c.
//         </p>
//       ) : (
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <div className="grid4">
//             {items.map((p) => (
//               <ProductCardHome
//                 key={p.id}
//                 p={{ ...p, image: p.thumbnail_url || p.thumbnail || PLACEHOLDER }}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* HÃ ng "LiÃªn quan / Gá»£i Ã½" */}
//       {related.length > 0 && (
//         <section style={{ marginTop: 36 }}>
//           <h3
//             style={{
//               textAlign: "center",
//               color: "#6366f1",
//               fontSize: 22,
//               fontWeight: 900,
//               textTransform: "uppercase",
//               textShadow: "0 1px 0 #fff, 0 0 14px rgba(99,102,241,.28)", // ná»•i chá»¯
//               borderBottom: "3px solid #6366f1",
//               display: "inline-block",
//               paddingBottom: 6,
//               margin: "0 auto 16px",
//             }}
//           >
//             {filter.category_id ? "Sáº£n pháº©m liÃªn quan" : "Gá»£i Ã½ cho báº¡n"}
//           </h3>

//           <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//             <div className="grid4">
//               {related.map((p) => (
//                 <ProductCardHome
//                   key={p.id}
//                   p={{ ...p, image: p.thumbnail_url || p.thumbnail || PLACEHOLDER }}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       <p style={{ marginTop: 40, textAlign: "center" }}>
//         <Link
//           to="/"
//           style={{
//             color: "#2563eb",
//             fontWeight: 800,
//             textDecoration: "none",
//           }}
//         >
//           â† Vá» trang chá»§
//         </Link>
//       </p>
//     </div>
//   );
// }

// /* ===== Filter Bar ===== */
// function FilterBar({ filter, setFilter, categories, loading, onClear }) {
//   const onChange = (patch) => setFilter(patch);
//   return (
//     <div className={`filter-wrap ${loading ? "is-loading" : ""}`}>
//       <div className="field">
//         <label>TÃ¬m kiáº¿m</label>
//         <input
//           type="text"
//           value={filter.q}
//           placeholder="Nháº­p tÃªn sáº£n pháº©m..."
//           onChange={(e) => onChange({ q: e.target.value })}
//         />
//       </div>

//       <div className="field">
//         <label>Danh má»¥c</label>
//         <select
//           value={filter.category_id}
//           onChange={(e) => onChange({ category_id: e.target.value })}
//         >
//           <option value="">â€” Táº¥t cáº£ â€”</option>
//           {categories.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="field">
//         <label>Khoáº£ng giÃ¡ (VNÄ)</label>
//         <div className="row-2">
//           <input
//             type="number"
//             min={0}
//             placeholder="Tá»«"
//             value={filter.min_price}
//             onChange={(e) => onChange({ min_price: e.target.value })}
//           />
//           <input
//             type="number"
//             min={0}
//             placeholder="Äáº¿n"
//             value={filter.max_price}
//             onChange={(e) => onChange({ max_price: e.target.value })}
//           />
//         </div>
//       </div>

//       <div className="field">
//         <label>Sáº¯p xáº¿p</label>
//         <select
//           value={filter.sort}
//           onChange={(e) => onChange({ sort: e.target.value })}
//         >
//           <option value="newest">Má»›i nháº¥t</option>
//           <option value="price-asc">GiÃ¡ tháº¥p â†’ cao</option>
//           <option value="price-desc">GiÃ¡ cao â†’ tháº¥p</option>
//           <option value="name-asc">TÃªn A â†’ Z</option>
//           <option value="name-desc">TÃªn Z â†’ A</option>
//         </select>
//       </div>

//       <div className="field toggles">
//         <label className="ck">
//           <input
//             type="checkbox"
//             checked={!!filter.only_sale}
//             onChange={(e) => onChange({ only_sale: e.target.checked })}
//           />
//           <span>Chá»‰ sáº£n pháº©m giáº£m giÃ¡</span>
//         </label>

//         <label className="ck">
//           <input
//             type="checkbox"
//             checked={!!filter.in_stock}
//             onChange={(e) => onChange({ in_stock: e.target.checked })}
//           />
//           <span>Chá»‰ cÃ²n hÃ ng</span>
//         </label>

//         <button className="btn-clear" onClick={onClear}>
//           XoÃ¡ lá»c
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ===== Styles (sÃ¡ng â€“ ná»•i, Ä‘á»“ng bá»™ LiÃªn há»‡) ===== */


// /* ===== Styles (pastel â€“ nháº¹ nhÃ ng, Ä‘á»“ng bá»™ toÃ n trang) ===== */
// function StyleTag() {
//   return (
//     <style>{`
//      /* === TiÃªu Ä‘á» === */
//      .products-title {
//         font-size: clamp(26px, 4vw, 38px);
//         font-weight: 500; /* ðŸ‘ˆ khÃ´ng in Ä‘áº­m */
//         line-height: 1.2;
//         letter-spacing: 0.5px;
//         text-transform: none;

//         margin: 8px auto 20px;
//         padding-bottom: 10px;
//         display: inline-flex;
//         align-items: center;
//         gap: 10px;
//         position: relative;

//         /* mÃ u pastel tÃ­m-xanh nháº¹ */
//         background: linear-gradient(180deg, #a5b4fc 0%, #c7d2fe 70%, #e0e7ff 100%);
//         -webkit-background-clip: text;
//         -webkit-text-fill-color: transparent;

//         text-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
//       }

//       /* gáº¡ch chÃ¢n pastel */
//       .products-title::after {
//         content: "";
//         position: absolute;
//         left: 0;
//         bottom: 0;
//         width: 100%;
//         height: 3px;
//         background: linear-gradient(90deg, #c4b5fd 0%, #a5b4fc 80%, rgba(199,210,254,0) 100%);
//         border-radius: 6px;
//         box-shadow: 0 1px 6px rgba(165,180,252,0.25);
//       }

//       /* icon cup */
//       .products-title .cup {
//         font-size: clamp(24px, 3.6vw, 32px);
//         filter: drop-shadow(0 1px 1px rgba(0,0,0,0.05));
//       }

//       /* === Bá»™ lá»c sáº£n pháº©m === */
//       .filter-wrap {
//         display: grid;
//         grid-template-columns: repeat(12, 1fr);
//         gap: 14px;
//         margin: 22px auto 26px;
//         padding: 16px;
//         border-radius: 18px;

//         background: linear-gradient(180deg, #f9faff 0%, #f1f5ff 100%);
//         border: 1px solid rgba(147, 197, 253, 0.35);
//         box-shadow: 0 6px 16px rgba(147, 197, 253, 0.15);
//         max-width: 1200px;
//       }

//       .filter-wrap.is-loading {
//         opacity: 0.7;
//         pointer-events: none;
//       }

//       .field {
//         grid-column: span 12;
//       }

//       @media (min-width: 768px) {
//         .field:nth-child(1) { grid-column: span 4; }
//         .field:nth-child(2) { grid-column: span 3; }
//         .field:nth-child(3) { grid-column: span 3; }
//         .field:nth-child(4) { grid-column: span 2; }
//         .field.toggles { grid-column: span 12; }
//       }

//       .field > label {
//         display: block;
//         color: #334155;
//         font-size: 13px;
//         margin-bottom: 6px;
//         font-weight: 600;
//       }

//       .field input[type="text"],
//       .field input[type="number"],
//       .field select {
//         width: 100%;
//         padding: 10px 12px;
//         border-radius: 12px;
//         border: 1px solid #e0e7ff;
//         background: #fff;
//         color: #1e293b;
//         outline: none;
//         transition: box-shadow .15s ease, border-color .15s ease;
//       }

//       .field input::placeholder {
//         color: #94a3b8;
//       }

//       .field input:focus,
//       .field select:focus {
//         border-color: #a5b4fc;
//         box-shadow: 0 0 0 4px rgba(165,180,252,0.25);
//       }

//       .row-2 {
//         display: flex;
//         gap: 10px;
//       }
//       .row-2 > * {
//         flex: 1;
//       }

//       .field.toggles {
//         display: flex;
//         flex-wrap: wrap;
//         gap: 14px;
//         align-items: center;
//         margin-top: 2px;
//       }

//       .ck {
//         display: inline-flex;
//         align-items: center;
//         gap: 8px;
//         font-size: 14px;
//         color: #334155;
//         font-weight: 600;
//       }

//       .ck input {
//         width: 18px;
//         height: 18px;
//         accent-color: #a5b4fc;
//       }

//       /* === NÃºt clear === */
//       .btn-clear {
//         margin-left: auto;
//         background: linear-gradient(135deg, #a5b4fc, #93c5fd);
//         color: #fff;
//         font-weight: 700;
//         border: 0;
//         border-radius: 12px;
//         padding: 9px 14px;
//         cursor: pointer;
//         box-shadow: 0 6px 16px rgba(165,180,252,0.25);
//         transition: all 0.25s ease;
//       }

//       .btn-clear:hover {
//         filter: brightness(1.05);
//         box-shadow: 0 8px 20px rgba(147,197,253,0.3);
//       }

//       /* === LÆ°á»›i 4 cá»™t === */
//       .grid4 {
//         display: grid;
//         grid-template-columns: repeat(4, minmax(0, 1fr));
//         gap: 20px;
//         align-items: stretch;
//       }

//       @media (max-width: 1024px) {
//         .grid4 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
//       }

//       @media (max-width: 768px) {
//         .grid4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//       }

//       @media (max-width: 480px) {
//         .grid4 { grid-template-columns: 1fr; }
//       }
//     `}</style>
//   );
// }// src/pages/Customers/Products.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductCardHome from "../../components/ProductCardHome";

// 👉 Chỉ 1 import duy nhất từ env (đổi "@/config/env" thành "../config/env" nếu project bạn chưa cấu hình alias @)
import { API_BASE } from "@/config/env";

const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";
const HEADER_OFFSET = 110;

/* ========= Helpers ========= */
const toNum = (x) => {
  if (x == null || x === "") return 0;
  if (typeof x === "string") return Number(x.replace(/[^\d.-]/g, "")) || 0;
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
};
const getName = (p) => p.name || p.title || `Sản phẩm #${p.id}`;
const getCreatedTs = (p) => new Date(p.created_at || p.updated_at || 0).getTime();
const getPrice = (p) =>
  toNum(p.price_sale ?? p.sale_price ?? p.price ?? p.price_buy ?? p.amount);
const getRootPrice = (p) =>
  toNum(p.price_root ?? p.original_price ?? p.root_price);
const getCategoryId = (p) => {
  if (p.category_id != null) return String(p.category_id);
  if (p.categoryId != null) return String(p.categoryId);
  if (p.category && p.category.id != null) return String(p.category.id);
  return "";
};
const inStock = (p) => {
  const stock = toNum(p.stock ?? p.qty ?? p.quantity);
  const status = String(p.status || "").toLowerCase();
  return stock > 0 || status === "active" || status === "1";
};

function applyClientFilterAndSort(list, f) {
  let arr = Array.isArray(list) ? [...list] : [];

  if (f.q) {
    const kw = f.q.toLowerCase().trim();
    arr = arr.filter((p) => {
      const n = getName(p).toLowerCase();
      const slug = String(p.slug || "").toLowerCase();
      return n.includes(kw) || slug.includes(kw);
    });
  }

  if (f.category_id) arr = arr.filter((p) => getCategoryId(p) === String(f.category_id));

  if (f.only_sale) {
    arr = arr.filter((p) => {
      const price = getPrice(p), root = getRootPrice(p);
      return root && price && price < root;
    });
  }

  if (f.in_stock) arr = arr.filter((p) => inStock(p));
  if (f.min_price) arr = arr.filter((p) => getPrice(p) >= toNum(f.min_price));
  if (f.max_price) arr = arr.filter((p) => getPrice(p) <= toNum(f.max_price));

  const by = f.sort || "newest";
  const collator = new Intl.Collator("vi", { sensitivity: "base" });
  if (by === "price-asc") arr.sort((a, b) => getPrice(a) - getPrice(b));
  else if (by === "price-desc") arr.sort((a, b) => getPrice(b) - getPrice(a));
  else if (by === "name-asc") arr.sort((a, b) => collator.compare(getName(a), getName(b)));
  else if (by === "name-desc") arr.sort((a, b) => collator.compare(getName(b), getName(a)));
  else arr.sort((a, b) => getCreatedTs(b) - getCreatedTs(a));

  return arr;
}

function useDebounce(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function buildQuery(f) {
  const q = new URLSearchParams();
  if (f.q) q.set("keyword", f.q);
  if (f.category_id) q.set("category_id", f.category_id);
  if (f.min_price) q.set("min_price", f.min_price);
  if (f.max_price) q.set("max_price", f.max_price);
  if (f.only_sale) q.set("only_sale", "1");
  if (f.in_stock) q.set("in_stock", "1");
  const map = {
    newest: "created_at:desc",
    "price-asc": "price:asc",
    "price-desc": "price:desc",
    "name-asc": "name:asc",
    "name-desc": "name:desc",
  };
  const s = map[f.sort || "newest"];
  if (s) q.set("sort", s);
  q.set("per_page", 120);
  return q.toString();
}

/* ========= Page ========= */
export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({
    q: "",
    category_id: "",
    min_price: "",
    max_price: "",
    only_sale: false,
    in_stock: false,
    sort: "newest",
  });
  const debounced = useDebounce(filter, 400);

  // sync filter từ URL
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const qFromUrl = sp.get("q") || sp.get("keyword") || "";
    const cat = sp.get("category_id") || "";
    const onlySale = sp.get("only_sale") === "1";
    setFilter((s) => ({ ...s, q: qFromUrl, category_id: cat, only_sale: onlySale }));
  }, [location.search]);

  // load categories
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`, { signal: ac.signal });
        const data = await res.json().catch(() => ({}));
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setCategories(list.map((c) => ({ id: c.id, name: c.name || c.title || `Danh mục ${c.id}` })));
      } catch {
        setCategories([]);
      }
    })();
    return () => ac.abort();
  }, []);

  // load products theo filter
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const qs = buildQuery(debounced);
        const res = await fetch(`${API_BASE}/products${qs ? "?" + qs : ""}`, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setItems(applyClientFilterAndSort(list, debounced));

        // lấy thêm all (phục vụ client filter khác nếu cần)
        const resAll = await fetch(`${API_BASE}/products?per_page=200`, { signal: ac.signal });
        const dataAll = await resAll.json().catch(() => ({}));
        const listAll = Array.isArray(dataAll) ? dataAll : dataAll?.data ?? [];
        setAll(listAll);
      } catch (e) {
        if (e.name !== "AbortError") setErr("Không tải được danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [debounced]);

  const clearAll = () => {
    setFilter({
      q: "",
      category_id: "",
      min_price: "",
      max_price: "",
      only_sale: false,
      in_stock: false,
      sort: "newest",
    });
    navigate("/products", { replace: true });
  };

  if (loading && items.length === 0)
    return <p style={{ padding: 20, textAlign: "center", color: "#2563eb" }}>Đang tải sản phẩm...</p>;
  if (err)
    return <p style={{ padding: 20, textAlign: "center", color: "#d32f2f" }}>{err}</p>;

  return (
    <div
      className="products-page"
      style={{
        padding: `${HEADER_OFFSET}px 20px 40px`,
        fontFamily: "Montserrat, Arial, sans-serif",
        background: "#f8fafc",
        color: "#0b1220",
      }}
    >
      <StyleTag />

      <h2 className="products-title">TẤT CẢ SẢN PHẨM</h2>

      <div className="products-layout">
        {/* Bộ lọc trái */}
        <FilterBar
          filter={filter}
          setFilter={(patch) => setFilter((s) => ({ ...s, ...patch }))}
          categories={categories}
          loading={loading}
          onClear={clearAll}
        />

        {/* Danh sách sản phẩm */}
        <div className="product-list-area">
          {items.length === 0 ? (
            <p style={{ padding: 20, textAlign: "center", color: "#475569", fontWeight: 700 }}>
              Không có sản phẩm phù hợp bộ lọc.
            </p>
          ) : (
            <div className="grid4">
              {items.map((p) => (
                <ProductCardHome
                  key={p.id}
                  p={{ ...p, image: p.thumbnail_url || p.thumbnail || PLACEHOLDER }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <p style={{ marginTop: 40, textAlign: "center" }}>
        <Link to="/" style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}>
          ← Về trang chủ
        </Link>
      </p>
    </div>
  );
}

/* ===== Filter Bar ===== */
function FilterBar({ filter, setFilter, categories, loading, onClear }) {
  const onChange = (patch) => setFilter(patch);
  return (
    <div className={`filter-wrap ${loading ? "is-loading" : ""}`}>
      <div className="field">
        <label>Tìm kiếm</label>
        <input
          type="text"
          value={filter.q}
          placeholder="Nhập tên sản phẩm..."
          onChange={(e) => onChange({ q: e.target.value })}
        />
      </div>

      <div className="field">
        <label>Danh mục</label>
        <select value={filter.category_id} onChange={(e) => onChange({ category_id: e.target.value })}>
          <option value="">— Tất cả —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Khoảng giá (VNĐ)</label>
        <div className="row-2">
          <input
            type="number"
            min={0}
            placeholder="Từ"
            value={filter.min_price}
            onChange={(e) => onChange({ min_price: e.target.value })}
          />
          <input
            type="number"
            min={0}
            placeholder="Đến"
            value={filter.max_price}
            onChange={(e) => onChange({ max_price: e.target.value })}
          />
        </div>
      </div>

      <div className="field">
        <label>Sắp xếp</label>
        <select value={filter.sort} onChange={(e) => onChange({ sort: e.target.value })}>
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá thấp → cao</option>
          <option value="price-desc">Giá cao → thấp</option>
          <option value="name-asc">Tên A → Z</option>
          <option value="name-desc">Tên Z → A</option>
        </select>
      </div>

      <div className="field toggles">
        <label className="ck">
          <input
            type="checkbox"
            checked={!!filter.only_sale}
            onChange={(e) => onChange({ only_sale: e.target.checked })}
          />
          <span>Chỉ sản phẩm giảm giá</span>
        </label>

        <button className="btn-clear" onClick={onClear}>
          Xoá lọc
        </button>
      </div>
    </div>
  );
}

/* ===== CSS Pastel Sidebar Layout ===== */
function StyleTag() {
  return (
    <style>{`
      .products-title {
        font-size: clamp(26px, 4vw, 38px);
        font-weight: 500;
        margin: 8px auto 20px;
        background: linear-gradient(180deg, #a5b4fc 0%, #c7d2fe 70%, #e0e7ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
      }

      .products-layout {
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 24px;
        max-width: 1280px;
        margin: 0 auto;
        align-items: start;
      }
      @media (max-width: 900px) { .products-layout { grid-template-columns: 1fr; } }

      .filter-wrap {
        display: flex; flex-direction: column; gap: 14px;
        padding: 16px; border-radius: 18px;
        background: linear-gradient(180deg, #f9faff 0%, #f1f5ff 100%);
        border: 1px solid rgba(147, 197, 253, 0.35);
        box-shadow: 0 6px 16px rgba(147, 197, 253, 0.15);
      }
      .filter-wrap.is-loading { opacity: .7; }

      .field > label {
        display: block; color: #334155; font-size: 13px; margin-bottom: 6px; font-weight: 600;
      }
      .field input, .field select {
        width: 100%; padding: 10px 12px; border-radius: 12px;
        border: 1px solid #e0e7ff; background: #fff; color: #1e293b;
      }

      .row-2 { display: flex; gap: 10px; }
      .row-2 > * { flex: 1; }

      .field.toggles { display: flex; flex-direction: column; gap: 10px; }

      .btn-clear {
        background: linear-gradient(135deg, #a5b4fc, #93c5fd);
        color: #fff; font-weight: 700; border: 0; border-radius: 12px; padding: 9px 14px; cursor: pointer;
      }

      .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

      .ck { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #334155; }
      .ck input { width: 16px; height: 16px; accent-color: #6366f1; cursor: pointer; }

      @media (max-width: 1024px) { .grid4 { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 768px) { .grid4 { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 480px) { .grid4 { grid-template-columns: 1fr; } }
    `}</style>
  );
}
