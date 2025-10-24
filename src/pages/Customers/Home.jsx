


// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ProductCardHome from "../../components/ProductCardHome";

// const API_BASE = "http://127.0.0.1:8000";
// const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";

// /* ====== BANNER SLIDES ====== */
// const BANNERS = [
//   { src: `${API_BASE}/assets/images/banner.webp`, alt: "SiÃªu Æ°u Ä‘Ã£i thá»ƒ thao", link: "/products" },
//   { src: `${API_BASE}/assets/images/banner1.jpg`, alt: "Phong cÃ¡ch & hiá»‡u nÄƒng", link: "/products?only_sale=1" },
//   { src: `${API_BASE}/assets/images/banner11.jpg`, alt: "BÃ¹ng ná»• mÃ¹a giáº£i má»›i", link: "/category/1" },
// ];

// /* ---------- Icon chevron ---------- */
// function IconChevron({ dir = "left", size = 24 }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24"
//       fill="none" stroke="white" strokeWidth="2.2"
//       strokeLinecap="round" strokeLinejoin="round"
//       style={{ display: "block" }}>
//       {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
//     </svg>
//   );
// }

// /* ---------- Style nÃºt mÅ©i tÃªn ---------- */
// function arrowStyle(side) {
//   const base = {
//     position: "absolute",
//     top: "50%", transform: "translateY(-50%)",
//     zIndex: 5, width: 48, height: 48,
//     borderRadius: 999,
//     border: "1px solid rgba(255,255,255,.6)",
//     background: "rgba(0,0,0,.45)",
//     color: "#fff", display: "grid", placeItems: "center",
//     cursor: "pointer",
//     boxShadow: "0 10px 26px rgba(0,0,0,.25)",
//     backdropFilter: "blur(3px)",
//     transition: "transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease",
//     outline: "none",
//   };
//   return side === "left" ? { ...base, left: 18 } : { ...base, right: 18 };
// }

// /* ---------- Slider tá»± Ä‘á»™ng ---------- */
// function BannerSlider({ banners = [], heightCSS = "clamp(360px, 50vw, 620px)", auto = 5000 }) {
//   const [idx, setIdx] = useState(0);
//   const touch = useRef({ x: 0, dx: 0, active: false });
//   const navigate = useNavigate();
//   const count = banners.length || 0;

//   const go = (n) => setIdx((p) => (count ? (p + n + count) % count : 0));
//   const goTo = (i) => setIdx(() => (count ? (i + count) % count : 0));

//   useEffect(() => { if (count && auto > 0) { const t = setInterval(() => go(1), auto); return () => clearInterval(t); } }, [count, auto]);
//   useEffect(() => {
//     const onKey = (e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, dx: 0, active: true }; };
//   const onTouchMove = (e) => { if (touch.current.active) touch.current.dx = e.touches[0].clientX - touch.current.x; };
//   const onTouchEnd = () => { if (!touch.current.active) return; const dx = touch.current.dx; touch.current.active = false; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); };

//   if (!count) return null;

//   return (
//     <div style={{ position: "relative", height: heightCSS, overflow: "hidden" }}
//       onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
//       {/* Track */}
//       <div style={{
//         display: "flex", width: `${count * 100}%`, height: "100%",
//         transform: `translateX(-${idx * (100 / count)}%)`,
//         transition: "transform .55s ease",
//       }}>
//         {banners.map((b, i) => (
//           <button key={i} type="button" onClick={() => b.link && navigate(b.link)}
//             aria-label={b.alt || `Slide ${i + 1}`}
//             style={{
//               width: `${100 / count}%`, minWidth: `${100 / count}%`,
//               height: "100%", border: 0, padding: 0, cursor: b.link ? "pointer" : "default",
//               position: "relative", background: "#000",
//             }}>
//             <img
//               src={b.src} alt={b.alt || ""}
//               onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//               style={{
//                 width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%",
//                 filter: "brightness(.82) contrast(1.06)",
//               }}
//               loading={i === 0 ? "eager" : "lazy"}
//             />
//             {/* Overlay nháº¹ Ä‘á»ƒ chá»¯ rÃµ */}
//             <div aria-hidden style={{
//               position: "absolute", inset: 0,
//               background: "linear-gradient(to top, rgba(0,0,0,.45), rgba(0,0,0,.18) 45%, rgba(0,0,0,0) 70%)",
//             }} />
//           </button>
//         ))}
//       </div>

//       {/* Arrows */}
//       {count > 1 && (
//         <>
//           <button
//             onClick={() => go(-1)} aria-label="Slide trÆ°á»›c" style={arrowStyle("left")}
//             onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-50%) scale(1.07)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,.35)"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(-50%)"; e.currentTarget.style.boxShadow = "0 10px 26px rgba(0,0,0,.25)"; }}
//           >
//             <IconChevron dir="left" />
//           </button>
//           <button
//             onClick={() => go(1)} aria-label="Slide sau" style={arrowStyle("right")}
//             onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-50%) scale(1.07)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,.35)"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(-50%)"; e.currentTarget.style.boxShadow = "0 10px 26px rgba(0,0,0,.25)"; }}
//           >
//             <IconChevron dir="right" />
//           </button>
//         </>
//       )}

//       {/* Dots */}
//       {count > 1 && (
//         <div style={{
//           position: "absolute", left: 0, right: 0, bottom: 16,
//           display: "flex", alignItems: "center", justifyContent: "center", gap: 10, zIndex: 6,
//         }}>
//           {banners.map((_, i) => (
//             <button key={i} onClick={() => goTo(i)} aria-label={`Tá»›i slide ${i + 1}`}
//               style={{
//                 width: i === idx ? 14 : 11, height: i === idx ? 14 : 11,
//                 borderRadius: 999, border: 0,
//                 background: i === idx ? "#111827" : "rgba(255,255,255,.8)",
//                 transform: i === idx ? "scale(1.05)" : "scale(1)",
//                 transition: "transform .2s ease, background .2s ease, width .2s ease, height .2s ease",
//                 cursor: "pointer",
//                 boxShadow: i === idx ? "0 0 0 2px rgba(0,0,0,.15)" : "none",
//               }} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- SEARCH BAR with autocomplete ---------- */
// function SearchBar() {
//   const [q, setQ] = useState("");
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [items, setItems] = useState([]); // gá»£i Ã½
//   const [highlight, setHighlight] = useState(-1);
//   const nav = useNavigate();
//   const boxRef = useRef(null);
//   const abortRef = useRef(null);
//   const timerRef = useRef(null);

//   // click ngoÃ i Ä‘á»ƒ Ä‘Ã³ng
//   useEffect(() => {
//     const fn = (e) => {
//       if (!boxRef.current) return;
//       if (!boxRef.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", fn);
//     return () => document.removeEventListener("mousedown", fn);
//   }, []);

//   // debounce gá»i API
//   useEffect(() => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     if (abortRef.current) abortRef.current.abort();

//     if (!q || q.trim().length < 1) {
//       setItems([]);
//       setLoading(false);
//       return;
//     }

//     timerRef.current = setTimeout(async () => {
//       setLoading(true);
//       const ac = new AbortController();
//       abortRef.current = ac;
//       try {
//         const url = `${API_BASE}/products?q=${encodeURIComponent(q.trim())}&per_page=8`;
//         const res = await fetch(url, { signal: ac.signal });
//         if (!res.ok) throw new Error("HTTP " + res.status);
//         const data = await res.json();
//         const list = Array.isArray(data) ? data : data?.data ?? [];
//         // Chuáº©n hoÃ¡ trÆ°á»ng áº£nh
//         const mapped = list.map((p) => ({
//           id: p.id,
//           name: p.name || p.title || `#${p.id}`,
//           thumbnail_url: p.thumbnail_url || (p.thumbnail ? `${API_BASE}/storage/${p.thumbnail}` : null),
//           slug: p.slug,
//         }));
//         setItems(mapped);
//         setOpen(true);
//       } catch (e) {
//         // ignore khi abort
//       } finally {
//         setLoading(false);
//       }
//     }, 350);

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//       if (abortRef.current) abortRef.current.abort();
//     };
//   }, [q]);

//   const goSearch = () => {
//     const key = (q || "").trim();
//     if (!key) return;
//     setOpen(false);
//     nav(`/products?q=${encodeURIComponent(key)}`);
//   };

//   const goDetail = (id) => {
//     setOpen(false);
//     nav(`/product/${id}`);
//   };

//   const onKeyDown = (e) => {
//     if (!open) return;
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlight((h) => Math.min(h + 1, items.length - 1));
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setHighlight((h) => Math.max(h - 1, 0));
//     } else if (e.key === "Enter") {
//       if (highlight >= 0 && items[highlight]) {
//         goDetail(items[highlight].id);
//       } else {
//         goSearch();
//       }
//     } else if (e.key === "Escape") {
//       setOpen(false);
//     }
//   };

//   return (
//     <div ref={boxRef} className="sb-wrap">
//       <div className="sb-box">
//         <input
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           onFocus={() => (items.length ? setOpen(true) : null)}
//           onKeyDown={onKeyDown}
//           placeholder="TÃ¬m nhanh: giÃ y, Ã¡o, táº¥t... (gÃµ Ä‘á»ƒ gá»£i Ã½)"
//           className="sb-input"
//           aria-label="TÃ¬m kiáº¿m sáº£n pháº©m"
//         />
//         <button className="sb-btn" onClick={goSearch} aria-label="TÃ¬m kiáº¿m">
//           ðŸ”
//         </button>
//       </div>

//       {/* dropdown */}
//       {open && (
//         <div className="sb-dd">
//           {loading && <div className="sb-dd-row muted">Äang tÃ¬m...</div>}
//           {!loading && items.length === 0 && (
//             <div className="sb-dd-row muted">KhÃ´ng cÃ³ káº¿t quáº£ phÃ¹ há»£p</div>
//           )}
//           {!loading &&
//             items.map((it, i) => (
//               <button
//                 type="button"
//                 key={it.id}
//                 className={`sb-dd-row ${i === highlight ? "active" : ""}`}
//                 onMouseEnter={() => setHighlight(i)}
//                 onMouseLeave={() => setHighlight(-1)}
//                 onClick={() => goDetail(it.id)}
//               >
//                 <div className="sb-thumb">
//                   <img
//                     src={it.thumbnail_url || PLACEHOLDER}
//                     alt={it.name}
//                     onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//                   />
//                 </div>
//                 <div className="sb-name">{it.name}</div>
//               </button>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- Card danh má»¥c (light) ---------- */
// function CategoryCard({ c, onClick, style }) {
//   return (
//     <button
//       type="button" onClick={onClick}
//       style={{
//         background: "#ffffff",
//         borderRadius: 14,
//         boxShadow: "0 10px 22px rgba(2,6,23,.06)",
//         padding: 16,
//         minWidth: 300, width: 320,
//         textAlign: "center",
//         fontWeight: 800, fontSize: 18, color: "#0f172a",
//         border: "1px solid #e5e7eb",
//         cursor: "pointer",
//         transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
//         ...style,
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.transform = "translateY(-3px)";
//         e.currentTarget.style.boxShadow = "0 16px 28px rgba(2,6,23,.12)";
//         e.currentTarget.style.borderColor = "#cbd5e1";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "translateY(0)";
//         e.currentTarget.style.boxShadow = "0 10px 22px rgba(2,6,23,.06)";
//         e.currentTarget.style.borderColor = "#e5e7eb";
//       }}
//     >
//       <div style={{
//         height: 160, marginBottom: 10, overflow: "hidden",
//         borderRadius: 10, background: "#f3f4f6", border: "1px solid #e5e7eb",
//       }}>
//         <img
//           src={c.image_url || PLACEHOLDER} alt={c.name}
//           style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//         />
//       </div>
//       {c.name}
//     </button>
//   );
// }

// export default function Home() {
//   const [categories, setCategories] = useState([]);
//   const [newItems, setNewItems] = useState([]);
//   const [saleItems, setSaleItems] = useState([]);
//   const [suggestItems, setSuggestItems] = useState([]); // 1 hÃ ng gá»£i Ã½
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const ac = new AbortController();
//     (async () => {
//       try {
//         setLoading(true); setError("");

//         const resCats = await fetch(`${API_BASE}/categories`, { signal: ac.signal });
//         if (!resCats.ok) throw new Error(`HTTP ${resCats.status}`);
//         const cats = await resCats.json();
//         setCategories(Array.isArray(cats) ? cats : cats?.data ?? []);

//         const resProds = await fetch(`${API_BASE}/products`, { signal: ac.signal });
//         if (!resProds.ok) throw new Error(`HTTP ${resProds.status}`);
//         const prods = await resProds.json();
//         const list = Array.isArray(prods) ? prods : prods?.data ?? [];

//         const normalized = list.map((p) => ({
//           ...p,
//           price_root: Number(p.price_root ?? 0),
//           price_sale: Number(p.price_sale ?? p.price ?? 0),
//         }));

//         const _new = normalized.slice(0, 8);
//         const _sale = normalized
//           .filter((x) => x.price_root > 0 && x.price_sale > 0 && x.price_sale < x.price_root)
//           .slice(0, 8);

//         setNewItems(_new);
//         setSaleItems(_sale);

//         const exclude = new Set([..._new.map((x) => x.id), ..._sale.map((x) => x.id)]);
//         let suggestion = normalized.filter((p) => !exclude.has(p.id)).slice(0, 4);
//         if (suggestion.length < 4) {
//           const filler = normalized.filter((p) => !suggestion.find((s) => s.id === p.id));
//           suggestion = suggestion.concat(filler.slice(0, 4 - suggestion.length));
//         }
//         setSuggestItems(suggestion.slice(0, 4));
//       } catch (err) {
//         if (err.name !== "AbortError") setError("KhÃ´ng táº£i Ä‘Æ°á»£c dá»¯ liá»‡u");
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => ac.abort();
//   }, []);

//   const topCats = categories.slice(0, 2);
//   const bottomCats = categories.slice(2, 5);
//   const restCats = categories.slice(5);

//   return (
//     <div style={{
//       fontFamily: "Montserrat, Arial, sans-serif",
//       background: "#ffffff", color: "#0f172a", minHeight: "100vh",
//     }}>
//       <LightStyle />
//       <SearchBarStyle />

//       {/* ====== HERO ====== */}
//       <section style={{ position: "relative", overflow: "hidden" }}>
//         <BannerSlider banners={BANNERS} heightCSS="clamp(360px, 50vw, 620px)" auto={5000} />

//         {/* Text á»Ÿ giá»¯a banner */}
//         <div style={{
//           position: "absolute", zIndex: 4, top: "50%", left: "50%",
//           transform: "translate(-50%, -50%)",
//           textAlign: "center", color: "#ffffff", width: "min(92%, 1100px)",
//           textShadow: "0 2px 14px rgba(0,0,0,.45)",
//         }}>
//           <h1 style={{
//             fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 900,
//             marginBottom: 14, textTransform: "uppercase", letterSpacing: 2,
//           }}>
//             THETHAO SPORTS
//           </h1>
//           <p style={{ fontSize: "clamp(14px, 2.2vw, 22px)", fontWeight: 600, marginBottom: 22 }}>
//             Hiá»‡u nÄƒng bÃ¹ng ná»• â€“ Phong cÃ¡ch thá»ƒ thao hiá»‡n Ä‘áº¡i
//           </p>

//           {/* === SearchBar Ä‘áº·t ngay dÆ°á»›i hero text === */}
//           <div style={{ display: "flex", justifyContent: "center" }}>
//             <SearchBar />
//           </div>
//         </div>
//       </section>

//       {/* ====== DANH Má»¤C Ná»”I Báº¬T ====== */}
//       <section style={{ margin: "54px 0" }}>
//         <h2 className="lt-section-title">Danh má»¥c ná»•i báº­t</h2>

//         {categories.length === 0 ? (
//           <p style={{ textAlign: "center", color: "#6b7280" }}>ChÆ°a cÃ³ danh má»¥c.</p>
//         ) : (
//           <div className="lt-wrap">
//             <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 18 }}>
//               {topCats.map((c) => (
//                 <CategoryCard key={c.id} c={c} onClick={() => navigate(`/category/${c.id}`)} />
//               ))}
//             </div>

//             <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: restCats.length ? 28 : 0 }}>
//               {bottomCats.map((c) => (
//                 <CategoryCard key={c.id} c={c} onClick={() => navigate(`/category/${c.id}`)} style={{ transform: "translateY(6px)" }} />
//               ))}
//             </div>

//             {restCats.length > 0 && (
//               <>
//                 <h3 style={{ textAlign: "center", color: "#6b7280", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
//                   CÃ¡c danh má»¥c khÃ¡c
//                 </h3>
//                 <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
//                   {restCats.map((c) => (
//                     <CategoryCard key={c.id} c={c} onClick={() => navigate(`/category/${c.id}`)} />
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </section>

//       {/* ====== TRáº NG THÃI ====== */}
//       {loading && <p style={{ textAlign: "center", color: "#2563eb" }}>Äang táº£i dá»¯ liá»‡u...</p>}
//       {error && <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>}

//       {/* ====== LÆ¯á»šI Sáº¢N PHáº¨M ====== */}
//       {!loading && !error && (
//         <>
//           {/* Sáº£n pháº©m má»›i */}
//           <section style={{ margin: "52px 0" }}>
//             <h2 className="lt-section-title">Sáº£n pháº©m má»›i</h2>
//             <div className="lt-wrap">
//               <div className="lt-grid4">
//                 {newItems.slice(0, 8).map((p) => <ProductCardHome key={p.id} p={p} />)}
//               </div>
//             </div>
//           </section>

//           {/* Äang giáº£m giÃ¡ */}
//           <section style={{ margin: "52px 0" }}>
//             <h2 className="lt-section-title">Äang giáº£m giÃ¡</h2>
//             <div className="lt-wrap">
//               <div className="lt-grid4">
//                 {saleItems.slice(0, 8).map((p) => <ProductCardHome key={p.id} p={p} />)}
//               </div>
//             </div>
//           </section>

//           {/* Gá»£i Ã½ cho báº¡n */}
//           <section style={{ margin: "44px 0" }}>
//             <h2 className="lt-section-title">Gá»£i Ã½ cho báº¡n</h2>
//             <div className="lt-wrap">
//               <div className="lt-grid4">
//                 {suggestItems.slice(0, 4).map((p) => <ProductCardHome key={p.id} p={p} />)}
//               </div>
//             </div>
//           </section>
//         </>
//       )}

//       {/* ====== Footer/info (card nháº¡t) ====== */}
//       <section style={{
//         background: "#f8fafc", borderRadius: 16, border: "1px solid #e5e7eb",
//         boxShadow: "0 8px 22px rgba(2,6,23,.06)", padding: "28px 22px",
//         margin: "50px auto 10px", maxWidth: 760, textAlign: "center",
//       }}>
//         <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10, color: "#0f172a", textTransform: "uppercase" }}>
//           âš½ Cáº£m Æ¡n báº¡n Ä‘Ã£ Ä‘á»“ng hÃ nh cÃ¹ng SPORT OH!
//         </h2>
//         <p style={{ color: "#334155", fontSize: 16, lineHeight: 1.6 }}>
//           THETHAO SPORTS mang Ä‘áº¿n trang phá»¥c & phá»¥ kiá»‡n thá»ƒ thao chÃ­nh hÃ£ng, bá»n bá»‰ vÃ  thá»i
//           thÆ°á»£ng. ChÃºng tÃ´i tá»‘i Æ°u hiá»‡u nÄƒng cho tá»«ng chuyá»ƒn Ä‘á»™ng, Ä‘á»ƒ báº¡n tá»± tin luyá»‡n táº­p,
//           thi Ä‘áº¥u vÃ  phÃ¡ vá»¡ giá»›i háº¡n má»—i ngÃ y.
//         </p>
//       </section>
//     </div>
//   );
// }

// /* ====== CSS LIGHT ====== */
// function LightStyle() {
//   return (
//     <style>{`
//       .lt-wrap{ max-width:1200px; margin:0 auto; padding:0 12px; }

//       .lt-grid4{
//         display:grid; grid-template-columns: repeat(4, minmax(0,1fr));
//         gap:20px; align-items:stretch;
//       }
//       @media (max-width:1024px){ .lt-grid4{ grid-template-columns: repeat(3, minmax(0,1fr)); } }
//       @media (max-width:768px){ .lt-grid4{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
//       @media (max-width:480px){ .lt-grid4{ grid-template-columns: 1fr; } }

//       /* TITLE â€“ Ä‘áº­m, mÃ u Ä‘en, gáº¡ch chÃ¢n gradient */
//       .lt-section-title{
//         font-size: clamp(22px, 3.2vw, 28px);
//         font-weight: 1000;
//         letter-spacing: .8px;
//         text-transform: uppercase;
//         margin: 0 auto 18px;
//         display: block;
//         text-align:center;
//         color:#0f172a;
//         text-shadow: 0 1px 0 #ffffff, 0 8px 18px rgba(2,6,23,.06);
//         position: relative;
//         padding-bottom: 10px;
//         width: max-content;
//       }
//       .lt-section-title::after{
//         content:"";
//         position:absolute; left:0; right:0; bottom:0;
//         height:4px; border-radius:3px;
//         background: linear-gradient(90deg,#6366f1,#a78bfa,#60a5fa);
//         box-shadow: 0 4px 14px rgba(99,102,241,.25);
//       }
//     `}</style>
//   );
// }

// /* ====== CSS cho SearchBar ====== */
// function SearchBarStyle() {
//   return (
//     <style>{`
//       .sb-wrap { position: relative; width: min(760px, 92vw); }
//       .sb-box {
//         display:flex; align-items:center; gap:10px;
//         background: rgba(255,255,255,.16);
//         border: 1px solid rgba(255,255,255,.6);
//         border-radius: 40px;
//         box-shadow: 0 12px 26px rgba(0,0,0,.25);
//         padding: 10px 12px 10px 16px;
//         backdrop-filter: blur(3px);
//         transition: transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
//       }
//       .sb-box:focus-within {
//         transform: scale(1.01);
//         box-shadow: 0 18px 36px rgba(0,0,0,.32);
//         background: rgba(255,255,255,.22);
//         border-color: rgba(255,255,255,.9);
//       }
//       .sb-input{
//         flex:1; height: 42px; font-size:16px; font-weight:700;
//         color:#fff; background:transparent; border:0; outline:none;
//         letter-spacing:.3px;
//       }
//       .sb-input::placeholder{ color: rgba(255,255,255,.85); font-weight:600; }
//       .sb-btn{
//         height:40px; min-width:40px;
//         border-radius:999px; border:0; cursor:pointer;
//         background: rgba(0,0,0,.35); color:#fff;
//         box-shadow: 0 6px 16px rgba(0,0,0,.25);
//       }
//       .sb-dd{
//         position:absolute; left:0; right:0; top: calc(100% + 8px);
//         background:#ffffff; border:1px solid #e5e7eb; border-radius: 14px;
//         box-shadow: 0 16px 36px rgba(2,6,23,.18);
//         overflow:hidden; z-index: 50;
//       }
//       .sb-dd-row{
//         display:flex; align-items:center; gap:12px;
//         width:100%; text-align:left;
//         background:#fff; border:0; cursor:pointer; padding:10px 12px;
//         transition: background .12s ease;
//       }
//       .sb-dd-row:hover, .sb-dd-row.active{ background:#f3f4f6; }
//       .sb-dd-row.muted{ color:#6b7280; cursor:default; }
//       .sb-thumb{ width:44px; height:34px; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb; background:#f8fafc; display:grid; place-items:center; }
//       .sb-thumb img{ width:100%; height:100%; object-fit:cover; }
//       .sb-name{ font-weight:800; color:#0f172a; font-size:14px; }
//     `}</style>
//   );
// }
import { API_BASE, ASSET_ORIGIN, toHttps } from "../config/env";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCardHome from "../../components/ProductCardHome";

const API_BASE = "http://127.0.0.1:8000";
const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";

/* ====== BANNER SLIDES ====== */
const BANNERS = [
 { src: toHttps(`${ASSET_ORIGIN}/assets/images/banner.webp`),  alt: "Siêu ưu đãi thể thao",          link: "/products" },
  { src: toHttps(`${ASSET_ORIGIN}/assets/images/banner1.jpg`),  alt: "Phong cách & hiệu năng",        link: "/products?only_sale=1" },
  { src: toHttps(`${ASSET_ORIGIN}/assets/images/banner11.jpg`), alt: "Bùng nổ mùa giải mới",           link: "/category/1" }, ];

/* ---------- Icon chevron ---------- */
function IconChevron({ dir = "left", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="white" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block" }}>
      {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

/* ---------- Style nÃºt mÅ©i tÃªn ---------- */
function arrowStyle(side) {
  const base = {
    position: "absolute",
    top: "50%", transform: "translateY(-50%)",
    zIndex: 5, width: 48, height: 48,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.6)",
    background: "rgba(0,0,0,.45)",
    color: "#fff", display: "grid", placeItems: "center",
    cursor: "pointer",
    boxShadow: "0 10px 26px rgba(0,0,0,.25)",
    backdropFilter: "blur(3px)",
    transition: "transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease",
    outline: "none",
  };
  return side === "left" ? { ...base, left: 18 } : { ...base, right: 18 };
}

/* ---------- Slider tá»± Ä‘á»™ng ---------- */
function BannerSlider({ banners = [], heightCSS = "clamp(360px, 50vw, 620px)", auto = 5000 }) {
  const [idx, setIdx] = useState(0);
  const touch = useRef({ x: 0, dx: 0, active: false });
  const navigate = useNavigate();
  const count = banners.length || 0;

  const go = (n) => setIdx((p) => (count ? (p + n + count) % count : 0));
  const goTo = (i) => setIdx(() => (count ? (i + count) % count : 0));

  useEffect(() => { if (count && auto > 0) { const t = setInterval(() => go(1), auto); return () => clearInterval(t); } }, [count, auto]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, dx: 0, active: true }; };
  const onTouchMove = (e) => { if (touch.current.active) touch.current.dx = e.touches[0].clientX - touch.current.x; };
  const onTouchEnd = () => { if (!touch.current.active) return; const dx = touch.current.dx; touch.current.active = false; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); };

  if (!count) return null;

  return (
    <div style={{ position: "relative", height: heightCSS, overflow: "hidden" }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {/* Track */}
      <div style={{
        display: "flex", width: `${count * 100}%`, height: "100%",
        transform: `translateX(-${idx * (100 / count)}%)`,
        transition: "transform .55s ease",
      }}>
        {banners.map((b, i) => (
          <button key={i} type="button" onClick={() => b.link && navigate(b.link)}
            aria-label={b.alt || `Slide ${i + 1}`}
            style={{
              width: `${100 / count}%`, minWidth: `${100 / count}%`,
              height: "100%", border: 0, padding: 0, cursor: b.link ? "pointer" : "default",
              position: "relative", background: "#000",
            }}>
            <img
              src={b.src} alt={b.alt || ""}
              onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              style={{
                width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%",
                filter: "brightness(.82) contrast(1.06)",
              }}
              loading={i === 0 ? "eager" : "lazy"}
            />
            {/* Overlay nháº¹ Ä‘á»ƒ chá»¯ rÃµ */}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,.45), rgba(0,0,0,.18) 45%, rgba(0,0,0,0) 70%)",
            }} />
          </button>
        ))}
      </div>

      {/* Arrows */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)} aria-label="Slide trÆ°á»›c" style={arrowStyle("left")}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-50%) scale(1.07)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(-50%)"; e.currentTarget.style.boxShadow = "0 10px 26px rgba(0,0,0,.25)"; }}
          >
            <IconChevron dir="left" />
          </button>
          <button
            onClick={() => go(1)} aria-label="Slide sau" style={arrowStyle("right")}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-50%) scale(1.07)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(-50%)"; e.currentTarget.style.boxShadow = "0 10px 26px rgba(0,0,0,.25)"; }}
          >
            <IconChevron dir="right" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 16,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10, zIndex: 6,
        }}>
          {banners.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Tá»›i slide ${i + 1}`}
              style={{
                width: i === idx ? 14 : 11, height: i === idx ? 14 : 11,
                borderRadius: 999, border: 0,
                background: i === idx ? "#111827" : "rgba(255,255,255,.8)",
                transform: i === idx ? "scale(1.05)" : "scale(1)",
                transition: "transform .2s ease, background .2s ease, width .2s ease, height .2s ease",
                cursor: "pointer",
                boxShadow: i === idx ? "0 0 0 2px rgba(0,0,0,.15)" : "none",
              }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- SEARCH BAR with autocomplete ---------- */
function SearchBar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]); // gá»£i Ã½
  const [highlight, setHighlight] = useState(-1);
  const nav = useNavigate();
  const boxRef = useRef(null);
  const abortRef = useRef(null);
  const timerRef = useRef(null);

  // click ngoÃ i Ä‘á»ƒ Ä‘Ã³ng
  useEffect(() => {
    const fn = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // debounce gá»i API
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!q || q.trim().length < 1) {
      setItems([]);
      setLoading(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const url = `${API_BASE}/products?q=${encodeURIComponent(q.trim())}&per_page=8`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data ?? [];
        // Chuáº©n hoÃ¡ trÆ°á»ng áº£nh
        const mapped = list.map((p) => ({
          id: p.id,
          name: p.name || p.title || `#${p.id}`,
thumbnail_url: p.thumbnail_url || (p.thumbnail ? toHttps(`${ASSET_ORIGIN}/storage/${p.thumbnail}`) : null),          slug: p.slug,
        }));
        setItems(mapped);
        setOpen(true);
      } catch (e) {
        // ignore khi abort
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [q]);

  const goSearch = () => {
    const key = (q || "").trim();
    if (!key) return;
    setOpen(false);
    nav(`/products?q=${encodeURIComponent(key)}`);
  };

  const goDetail = (id) => {
    setOpen(false);
    nav(`/product/${id}`);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (highlight >= 0 && items[highlight]) {
        goDetail(items[highlight].id);
      } else {
        goSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="sb-wrap">
      <div className="sb-box">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => (items.length ? setOpen(true) : null)}
          onKeyDown={onKeyDown}
          placeholder="TÃ¬m nhanh: giÃ y, Ã¡o, táº¥t... (gÃµ Ä‘á»ƒ gá»£i Ã½)"
          className="sb-input"
          aria-label="TÃ¬m kiáº¿m sáº£n pháº©m"
        />
        <button className="sb-btn" onClick={goSearch} aria-label="TÃ¬m kiáº¿m">
          ðŸ”
        </button>
      </div>

      {/* dropdown */}
      {open && (
        <div className="sb-dd">
          {loading && <div className="sb-dd-row muted">Äang tÃ¬m...</div>}
          {!loading && items.length === 0 && (
            <div className="sb-dd-row muted">KhÃ´ng cÃ³ káº¿t quáº£ phÃ¹ há»£p</div>
          )}
          {!loading &&
            items.map((it, i) => (
              <button
                type="button"
                key={it.id}
                className={`sb-dd-row ${i === highlight ? "active" : ""}`}
                onMouseEnter={() => setHighlight(i)}
                onMouseLeave={() => setHighlight(-1)}
                onClick={() => goDetail(it.id)}
              >
                <div className="sb-thumb">
                  <img
                    src={it.thumbnail_url || PLACEHOLDER}
                    alt={it.name}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  />
                </div>
                <div className="sb-name">{it.name}</div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Card danh má»¥c (light) ---------- */
function CategoryCard({ c, onClick, style }) {
  return (
    <button
      type="button" onClick={onClick}
      style={{
        background: "#ffffff",
        borderRadius: 14,
        boxShadow: "0 10px 22px rgba(2,6,23,.06)",
        padding: 16,
        minWidth: 300, width: 320,
        textAlign: "center",
        fontWeight: 800, fontSize: 18, color: "#0f172a",
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 16px 28px rgba(2,6,23,.12)";
        e.currentTarget.style.borderColor = "#cbd5e1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 22px rgba(2,6,23,.06)";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      <div style={{
        height: 160, marginBottom: 10, overflow: "hidden",
        borderRadius: 10, background: "#f3f4f6", border: "1px solid #e5e7eb",
      }}>
        <img
          src={c.image_url || PLACEHOLDER} alt={c.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
      </div>
      {c.name}
    </button>
  );
}

/* ====== Tiá»‡n Ã­ch ====== */
const vnd = (n) => `${Number(n || 0).toLocaleString("vi-VN")}Ä‘`;
const discountPercent = (root, sale) =>
  root > 0 && sale > 0 && sale < root ? Math.round(((root - sale) / root) * 100) : 0;

/* ====== Countdown Ä‘Æ¡n giáº£n ====== */
function useCountdown(hours = 6) {
  const [left, setLeft] = useState(hours * 3600); // giÃ¢y
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

/* ====== Deal card (kÃ­ch thÆ°á»›c nhÆ° card SP má»›i) ====== */
function DealCard({ p }) {
  const off = discountPercent(p.price_root, p.price_sale);
  const status =
    (p.qty ?? 10) <= 0 ? "Háº¿t hÃ ng" : (p.qty ?? 10) < 5 ? "Sáº¯p chÃ¡y hÃ ng" : "Vá»«a má»Ÿ bÃ¡n";
  const badgeStyle =
    status === "Háº¿t hÃ ng"
      ? { bg: "#ef4444" }
      : status === "Sáº¯p chÃ¡y hÃ ng"
      ? { bg: "#f59e0b", icon: "ðŸ”¥" }
      : { bg: "#d1d5db" };

  return (
    <div className="deal-card">
      <div className="deal-img">
        <img
          src={p.thumbnail_url || p.thumbnail || PLACEHOLDER}
          alt={p.name}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
        <button className="deal-like" aria-label="YÃªu thÃ­ch">â™¡</button>
      </div>

      <div className="deal-name" title={p.name}>{p.name}</div>

      <div className="deal-price">
        <div className="deal-sale">{vnd(p.price_sale)}</div>
        <div className="deal-root">
          {p.price_root > 0 && p.price_sale < p.price_root ? (
            <>
              <span className="line">{vnd(p.price_root)}</span>
              <span className="off">-{off}%</span>
            </>
          ) : null}
        </div>
        <button className="deal-cart" aria-label="ThÃªm vÃ o giá»">ðŸ›’</button>
      </div>

      <div className="deal-status" style={{ background: badgeStyle.bg }}>
        {badgeStyle.icon ? `${badgeStyle.icon} ` : ""}{status}
      </div>
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [suggestItems, setSuggestItems] = useState([]); // 1 hÃ ng gá»£i Ã½
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true); setError("");

        const resCats = await fetch(`${API_BASE}/categories`);
        if (!resCats.ok) throw new Error(`HTTP ${resCats.status}`);
        const cats = await resCats.json();
        setCategories(Array.isArray(cats) ? cats : cats?.data ?? []);

        const resProds = await fetch(`${API_BASE}/products`)
        if (!resProds.ok) throw new Error(`HTTP ${resProds.status}`);
        const prods = await resProds.json();
        const list = Array.isArray(prods) ? prods : prods?.data ?? [];

        const normalized = list.map((p) => ({
          ...p,
          price_root: Number(p.price_root ?? 0),
          price_sale: Number(p.price_sale ?? p.price ?? 0),
        }));

        const _new = normalized.slice(0, 8);
        const _sale = normalized
          .filter((x) => x.price_root > 0 && x.price_sale > 0 && x.price_sale < x.price_root)
          .slice(0, 8);

        setNewItems(_new);
        setSaleItems(_sale);

        const exclude = new Set([..._new.map((x) => x.id), ..._sale.map((x) => x.id)]);
        let suggestion = normalized.filter((p) => !exclude.has(p.id)).slice(0, 4);
        if (suggestion.length < 4) {
          const filler = normalized.filter((p) => !suggestion.find((s) => s.id === p.id));
          suggestion = suggestion.concat(filler.slice(0, 4 - suggestion.length));
        }
        setSuggestItems(suggestion.slice(0, 4));
      } catch (err) {
        if (err.name !== "AbortError") setError("KhÃ´ng táº£i Ä‘Æ°á»£c dá»¯ liá»‡u");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const topCats = categories.slice(0, 2);
  const bottomCats = categories.slice(2, 5);
  const restCats = categories.slice(5);

  return (
    <div style={{
      fontFamily: "Montserrat, Arial, sans-serif",
      background: "#ffffff", color: "#0f172a", minHeight: "100vh",
    }}>
      <LightStyle />
      <SearchBarStyle />
      <DealStyle />

      {/* ====== HERO ====== */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <BannerSlider banners={BANNERS} heightCSS="clamp(360px, 50vw, 620px)" auto={5000} />

        {/* Text á»Ÿ giá»¯a banner */}
        <div style={{
          position: "absolute", zIndex: 4, top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", color: "#ffffff", width: "min(92%, 1100px)",
          textShadow: "0 2px 14px rgba(0,0,0,.45)",
        }}>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 900,
            marginBottom: 14, textTransform: "uppercase", letterSpacing: 2,
          }}>
            THETHAO SPORTS
          </h1>
          <p style={{ fontSize: "clamp(14px, 2.2vw, 22px)", fontWeight: 600, marginBottom: 22 }}>
            Hiá»‡u nÄƒng bÃ¹ng ná»• â€“ Phong cÃ¡ch thá»ƒ thao hiá»‡n Ä‘áº¡i
          </p>

          {/* === SearchBar Ä‘áº·t ngay dÆ°á»›i hero text === */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ====== DANH Má»¤C Ná»”I Báº¬T ====== */}
      <section style={{ margin: "54px 0" }}>
        <h2 className="lt-section-title">Danh má»¥c ná»•i báº­t</h2>

        {categories.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>ChÆ°a cÃ³ danh má»¥c.</p>
        ) : (
          <div className="lt-wrap">
            <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 18 }}>
              {topCats.map((c) => (
                <CategoryCard key={c.id} c={c} onClick={() => navigate(`/category/${c.id}`)} />
              ))}
            </div>

            <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: restCats.length ? 28 : 0 }}>
              {bottomCats.map((c) => (
                <CategoryCard key={c.id} c={c} onClick={() => navigate(`/category/${c.id}`)} style={{ transform: "translateY(6px)" }} />
              ))}
            </div>

            {restCats.length > 0 && (
              <>
                <h3 style={{ textAlign: "center", color: "#6b7280", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
                  CÃ¡c danh má»¥c khÃ¡c
                </h3>
                <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
                  {restCats.map((c) => (
                    <CategoryCard key={c.id} c={c} onClick={() => navigate(`/category/${c.id}`)} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* ====== TRáº NG THÃI ====== */}
      {loading && <p style={{ textAlign: "center", color: "#2563eb" }}>Äang táº£i dá»¯ liá»‡u...</p>}
      {error && <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>}

      {/* ====== LÆ¯á»šI Sáº¢N PHáº¨M ====== */}
      {!loading && !error && (
        <>
          {/* Sáº£n pháº©m má»›i */}
          <section style={{ margin: "52px 0" }}>
            <h2 className="lt-section-title">Sáº£n pháº©m má»›i</h2>
            <div className="lt-wrap">
              <div className="lt-grid4">
                {newItems.slice(0, 8).map((p) => <ProductCardHome key={p.id} p={p} />)}
              </div>
            </div>
          </section>

          {/* ====== ÄANG GIáº¢M GIÃ â€” ná»n Ä‘á» pastel, kÃ­ch thÆ°á»›c nhÆ° SP má»›i ====== */}
          <DealSection items={saleItems.slice(0, 4)} />

          {/* Gá»£i Ã½ cho báº¡n */}
          <section style={{ margin: "44px 0" }}>
            <h2 className="lt-section-title">Gá»£i Ã½ cho báº¡n</h2>
            <div className="lt-wrap">
              <div className="lt-grid4">
                {suggestItems.slice(0, 4).map((p) => <ProductCardHome key={p.id} p={p} />)}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ====== Footer/info (card nháº¡t) ====== */}
      <section style={{
        background: "#f8fafc", borderRadius: 16, border: "1px solid #e5e7eb",
        boxShadow: "0 8px 22px rgba(2,6,23,.06)", padding: "28px 22px",
        margin: "50px auto 10px", maxWidth: 760, textAlign: "center",
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10, color: "#0f172a", textTransform: "uppercase" }}>
          âš½ Cáº£m Æ¡n báº¡n Ä‘Ã£ Ä‘á»“ng hÃ nh cÃ¹ng SPORT OH!
        </h2>
        <p style={{ color: "#334155", fontSize: 16, lineHeight: 1.6 }}>
          THETHAO SPORTS mang Ä‘áº¿n trang phá»¥c & phá»¥ kiá»‡n thá»ƒ thao chÃ­nh hÃ£ng, bá»n bá»‰ vÃ  thá»i
          thÆ°á»£ng. ChÃºng tÃ´i tá»‘i Æ°u hiá»‡u nÄƒng cho tá»«ng chuyá»ƒn Ä‘á»™ng, Ä‘á»ƒ báº¡n tá»± tin luyá»‡n táº­p,
          thi Ä‘áº¥u vÃ  phÃ¡ vá»¡ giá»›i háº¡n má»—i ngÃ y.
        </p>
      </section>
    </div>
  );
}

/* ====== DEAL SECTION (dÃ¹ng cÃ¹ng layout .lt-wrap + .lt-grid4) ====== */
function DealSection({ items = [] }) {
  const { h, m, s } = useCountdown(6); // Ä‘áº¿m ngÆ°á»£c 6 giá»
  return (
    <section className="deal-surface">
      <div className="lt-wrap">
        <div className="deal-header">
          <div className="deal-title">
            MÃ™A YÃŠU, DEAL NGá»ŒT <span className="hot">HOT</span>
          </div>
          <div className="deal-timer">
            Káº¿t thÃºc sau&nbsp;
            <span className="time">{h}</span>
            <small>Giá»</small>
            <span className="time">{m}</span>
            <small>PhÃºt</small>
            <span className="time">{s}</span>
            <small>GiÃ¢y</small>
          </div>
        </div>

        <div className="deal-body">
          <div className="lt-grid4">
            {items.map((p) => <DealCard key={p.id} p={p} />)}
            {items.length < 4 &&
              Array.from({ length: 4 - items.length }).map((_, i) => (
                <div key={`placeholder-${i}`} className="deal-card placeholder" />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== CSS LIGHT ====== */
function LightStyle() {
  return (
    <style>{`
      .lt-wrap{ max-width:1200px; margin:0 auto; padding:0 12px; }

      .lt-grid4{
        display:grid; grid-template-columns: repeat(4, minmax(0,1fr));
        gap:20px; align-items:stretch;
      }
      @media (max-width:1024px){ .lt-grid4{ grid-template-columns: repeat(3, minmax(0,1fr)); } }
      @media (max-width:768px){ .lt-grid4{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
      @media (max-width:480px){ .lt-grid4{ grid-template-columns: 1fr; } }

      /* TITLE â€“ Ä‘áº­m, mÃ u Ä‘en, gáº¡ch chÃ¢n gradient */
      .lt-section-title{
        font-size: clamp(22px, 3.2vw, 28px);
        font-weight: 1000;
        letter-spacing: .8px;
        text-transform: uppercase;
        margin: 0 auto 18px;
        display: block;
        text-align:center;
        color:#0f172a;
        text-shadow: 0 1px 0 #ffffff, 0 8px 18px rgba(2,6,23,.06);
        position: relative;
        padding-bottom: 10px;
        width: max-content;
      }
      .lt-section-title::after{
        content:"";
        position:absolute; left:0; right:0; bottom:0;
        height:4px; border-radius:3px;
        background: linear-gradient(90deg,#6366f1,#a78bfa,#60a5fa);
        box-shadow: 0 4px 14px rgba(99,102,241,.25);
      }
    `}</style>
  );
}

/* ====== CSS cho SearchBar ====== */
function SearchBarStyle() {
  return (
    <style>{`
      .sb-wrap { position: relative; width: min(760px, 92vw); }
      .sb-box {
        display:flex; align-items:center; gap:10px;
        background: rgba(255,255,255,.16);
        border: 1px solid rgba(255,255,255,.6);
        border-radius: 40px;
        box-shadow: 0 12px 26px rgba(0,0,0,.25);
        padding: 10px 12px 10px 16px;
        backdrop-filter: blur(3px);
        transition: transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
      }
      .sb-box:focus-within {
        transform: scale(1.01);
        box-shadow: 0 18px 36px rgba(0,0,0,.32);
        background: rgba(255,255,255,.22);
        border-color: rgba(255,255,255,.9);
      }
      .sb-input{
        flex:1; height: 42px; font-size:16px; font-weight:700;
        color:#fff; background:transparent; border:0; outline:none;
        letter-spacing:.3px;
      }
      .sb-input::placeholder{ color: rgba(255,255,255,.85); font-weight:600; }
      .sb-btn{
        height:40px; min-width:40px;
        border-radius:999px; border:0; cursor:pointer;
        background: rgba(0,0,0,.35); color:#fff;
        box-shadow: 0 6px 16px rgba(0,0,0,.25);
      }
      .sb-dd{
        position:absolute; left:0; right:0; top: calc(100% + 8px);
        background:#ffffff; border:1px solid #e5e7eb; border-radius: 14px;
        box-shadow: 0 16px 36px rgba(2,6,23,.18);
        overflow:hidden; z-index: 50;
      }
      .sb-dd-row{
        display:flex; align-items:center; gap:12px;
        width:100%; text-align:left;
        background:#fff; border:0; cursor:pointer; padding:10px 12px;
        transition: background .12s ease;
      }
      .sb-dd-row:hover, .sb-dd-row.active{ background:#f3f4f6; }
      .sb-dd-row.muted{ color:#6b7280; cursor:default; }
      .sb-thumb{ width:44px; height:34px; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb; background:#f8fafc; display:grid; place-items:center; }
      .sb-thumb img{ width:100%; height:100%; object-fit:cover; }
      .sb-name{ font-weight:800; color:#0f172a; font-size:14px; }
    `}</style>
  );
}

/* ====== CSS cho DEAL (Ä‘á» pastel, card giá»‘ng kÃ­ch thÆ°á»›c SP má»›i) ====== */
/* ====== CSS cho DEAL (compact, Ä‘á» pastel, tháº¥p â€“ gá»n) ====== */
function DealStyle() {
  return (
    <style>{`
      :root{
        --deal-img-h: 98px;         /* ðŸ‘ˆ chiá»u cao áº£nh card (Ä‘iá»u chá»‰nh nhanh) */
        --deal-gap: 12px;           /* khoáº£ng cÃ¡ch giá»¯a cÃ¡c card */
      }

      /* Ná»€N KHU Vá»°C DEAL â€“ Ä‘á» pastel */
      .deal-surface{
        margin: 28px 0;             /* tháº¥p hÆ¡n */
        padding: 6px 0 10px 0;      /* giáº£m padding trÃªn/dÆ°á»›i */
        background: linear-gradient(180deg, #ffd8dc, #ffc7cd);
        border-top: 1px solid #f3b2b8;
        border-bottom: 1px solid #f3b2b8;
      }

      /* Header gá»n */
      .deal-header{
        display:flex; justify-content:space-between; align-items:center;
        gap: 10px; padding: 6px 10px;
        background: #b91c1c;
        color: #fff; border-radius: 10px;
        margin: 0 auto 10px; max-width:1200px;
      }
      .deal-title{ font-weight:1000; font-size: 16px; letter-spacing:.4px; }
      .deal-title .hot{
        margin-left: 6px; background: #ffc107; color:#7c2d12;
        padding: 1px 5px; border-radius: 6px; font-size: 11px; font-weight: 900;
      }
      .deal-timer{ display:flex; align-items:center; gap:5px; font-weight:800; font-size:13px; }
      .deal-timer .time{
        display:inline-flex; align-items:center; justify-content:center;
        min-width:30px; height:22px; padding:0 5px;
        background:#fbbf24; color:#111; border-radius:7px;
        font-size:13px; font-weight:1000;
        box-shadow: inset 0 -2px 0 rgba(0,0,0,.12);
      }

      /* BODY giá»‘ng layout .lt-grid4 nhÆ°ng gap nhá» */
      .deal-body .lt-grid4{ gap: var(--deal-gap); }

      /* CARD â€“ compact nhÆ° card Sáº£n pháº©m má»›i */
      .deal-card{
        background:#fff; border-radius: 12px;
        border:1px solid #f3f4f6;
        box-shadow: 0 8px 18px rgba(2,6,23,.07);
        padding: 8px;                /* ðŸ‘ˆ giáº£m padding */
        display:flex; flex-direction:column; gap:8px;
      }
      .deal-card.placeholder{ background:transparent; border:1px dashed rgba(0,0,0,.08); box-shadow:none; }

      /* áº¢nh tháº¥p */
      .deal-img{
        height: var(--deal-img-h);
        border-radius:10px; overflow:hidden; border:1px solid #e5e7eb; background:#fff; position:relative;
      }
      .deal-img img{ width:100%; height:100%; object-fit:cover; }
      .deal-like{
        position:absolute; right:6px; bottom:6px;
        width:30px; height:30px; border-radius:999px; border:0; cursor:pointer;
        background:#fff; box-shadow:0 5px 12px rgba(0,0,0,.14);
        font-size:15px;
      }

      /* TÃªn 1 dÃ²ng (ráº¥t gá»n) */
      .deal-name{
        font-weight:800; color:#111827; font-size:14px;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        min-height:auto; line-height:1.25;
      }

      /* GiÃ¡ + nÃºt */
      .deal-price{ display:flex; align-items:center; justify-content:space-between; gap:6px; }
      .deal-sale{ color:#dc2626; font-weight:1000; font-size:16px; }
      .deal-root{ color:#6b7280; font-weight:700; display:flex; align-items:center; gap:6px; font-size:12px; }
      .deal-root .line{ text-decoration: line-through; }
      .deal-root .off{
        background:#fee2e2; color:#991b1b; border-radius: 7px; padding:1px 5px; font-size:11px; font-weight:900;
      }
      .deal-cart{
        width:34px; height:34px; border-radius:9px; border:0; cursor:pointer;
        background:#ef4444; color:#fff; font-size:16px; box-shadow: 0 8px 16px rgba(239,68,68,.32);
      }

      /* NhÃ£n tráº¡ng thÃ¡i nhá» */
      .deal-status{
        margin-top:4px; color:#fff; font-weight:900; font-size:12px;
        border-radius: 9px; padding: 4px 8px; text-align:center;
      }

      @media (max-width:768px){
        :root{ --deal-img-h: 90px; }
        .deal-header{ padding:6px 8px; }
        .deal-title{ font-size:15px; }
        .deal-timer{ font-size:12px; }
      }
    `}</style>
  );
}



