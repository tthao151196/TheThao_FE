// src/pages/Customers/CanceledOrders.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";
const PLACEHOLDER = "https://placehold.co/64x48?text=No+Img";
const ORDER_TRACK_PATH = "/track";

export default function CanceledOrders() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const fmt = (v) => (v == null ? 0 : Number(v)).toLocaleString("vi-VN");
  const fmtTime = (t) => {
    if (!t) return "";
    const d = new Date(t);
    return isNaN(d) ? String(t) : d.toLocaleString("vi-VN");
  };

  const calcTotal = (o) => {
    const items = o.items || o.order_items || [];
    const subtotal =
      o.subtotal != null
        ? Number(o.subtotal)
        : items.reduce(
            (s, it) => s + (Number(it.price ?? 0) * Number(it.qty ?? it.quantity ?? 0)),
            0
          );
    const shipping = Number(o.shipping_fee ?? 0);
    const discount = Number(o.discount ?? 0);
    return o.total != null ? Number(o.total) : subtotal + shipping - discount;
  };

  // âœ… Nháº­n Ä‘Ãºng Ä‘Æ¡n Ä‘Ã£ há»§y (status = 5)
  const isCanceled = (o) => {
    const s = o?.status;
    if (s == 5 || s === "5") return true;
    const k = String(o?.status_step || o?.status_key || o?.step || "").toLowerCase();
    return k.includes("cancel");
  };

  // âœ… Gá»i danh sÃ¡ch Ä‘Æ¡n Ä‘Ã£ há»§y
  const fetchBaseList = async (signal) => {
    const headers = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    // Náº¿u cÃ³ token: gá»i my-orders rá»“i FE lá»c canceled
    if (token) {
      try {
        const r = await fetch(`${API_BASE}/orders/mine`, { signal, headers });
        if (r.ok) {
          const data = await r.json();
          if (Array.isArray(data.data)) return data.data;
        }
      } catch {}
    }

    // Public fallback: gá»i theo status=5
    try {
      const r = await fetch(`${API_BASE}/orders?status=5`, { signal, headers });
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
      }
    } catch {}
    return [];
  };

  // âœ… Hydrate Ä‘á»ƒ láº¥y chi tiáº¿t sáº£n pháº©m cho tá»«ng Ä‘Æ¡n
  const hydrateOrders = async (list, signal) => {
    const headers = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const jobs = list.map(async (o) => {
      const id = o.id || o.code;
      if (!id) return o;
      try {
        const r = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, { signal, headers });
        if (r.ok) {
          const d = await r.json();
          return { ...o, ...d, items: d.items || o.items || [] };
        }
      } catch {}
      return o;
    });

    const concurrency = 6;
    const out = [];
    for (let i = 0; i < jobs.length; i += concurrency) {
      const chunk = await Promise.all(jobs.slice(i, i + concurrency));
      out.push(...chunk);
    }
    return out;
  };

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const base = await fetchBaseList(ac.signal);
        const canceledOnly = base.filter(isCanceled);
        if (!canceledOnly.length) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const hydrated = await hydrateOrders(canceledOnly, ac.signal);
        setOrders(hydrated);
      } catch (e) {
        console.error(e);
        setErr("KhÃ´ng táº£i Ä‘Æ°á»£c danh sÃ¡ch Ä‘Æ¡n Ä‘Ã£ há»§y.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [token]);

  const visibleOrders = useMemo(() => {
    const list = (orders || [])
      .filter(isCanceled)
      .sort(
        (a, b) =>
          new Date(b.updated_at || b.created_at || 0) -
          new Date(a.updated_at || a.created_at || 0)
      );
    if (!q.trim()) return list;
    const k = q.trim().toLowerCase();
    return list.filter((o) => String(o.code || o.id).toLowerCase().includes(k));
  }, [orders, q]);

  // âœ… Mua láº¡i
  const reorder = (order) => {
    const src = order.items || order.order_items || [];
    if (!src.length) {
      alert("â— ÄÆ¡n nÃ y chÆ°a cÃ³ danh sÃ¡ch sáº£n pháº©m chi tiáº¿t.");
      return;
    }
    const load = () => {
      try {
        return JSON.parse(localStorage.getItem("cart") || "[]");
      } catch {
        return [];
      }
    };
    const save = (v) => localStorage.setItem("cart", JSON.stringify(v));

    const current = load();
    const merged = [...current];

    for (const it of src) {
      const id = it.product_id || it.product?.id || it.id;
      if (!id) continue;
      const name = it.name || it.product_name || it.product?.name || `#${id}`;
      const qty = it.qty ?? it.quantity ?? 1;
      const price = Number(
        it.price ?? it.product?.price_sale ?? it.product?.price_root ?? it.product?.price ?? 0
      );
      const thumb =
        it.thumbnail_url || it.product_image || it.image_url || it.thumbnail || PLACEHOLDER;

      const idx = merged.findIndex((x) => x.id === id);
      if (idx >= 0) merged[idx].qty += qty;
      else merged.push({ id, name, price, qty, thumbnail_url: thumb });
    }
    save(merged);
    alert("ðŸ›’ ÄÃ£ thÃªm láº¡i sáº£n pháº©m vÃ o giá»!");
    navigate("/cart");
  };

  return (
    <div className="cxl-page">
      <div className="card">
        <div className="topbar">
          <button className="back-home" onClick={() => navigate("/")}>ðŸ  Vá» trang chá»§</button>
          <h2 className="title">ðŸ—‚ï¸ ÄÆ¡n Ä‘Ã£ há»§y</h2>
        </div>

        <div className="toolbar">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="TÃ¬m theo mÃ£ Ä‘Æ¡nâ€¦"
            className="search"
          />
          <div className="who">
            {user?.name ? <>ðŸ‘¤ <b>{user.name}</b></> : "â€”"}
          </div>
        </div>

        {loading && <p className="muted">Äang táº£iâ€¦</p>}
        {err && !loading && <p className="error">âŒ {err}</p>}

        {!loading && !err && visibleOrders.length === 0 && (
          <div className="empty">
            <img src="https://illustrations.popsy.co/teal/paper-trash.svg" alt="" />
            <div>KhÃ´ng cÃ³ Ä‘Æ¡n nÃ o Ä‘Ã£ há»§y.</div>
          </div>
        )}

        <div className="grid">
          {visibleOrders.map((o) => {
            const items = o.items || o.order_items || [];
            const total = calcTotal(o);
            return (
              <div key={o.id || o.code} className="order">
                <div className="order-head">
                  <div className="code">#{o.code || o.id}</div>
                  <div className="time">{fmtTime(o.updated_at || o.created_at)}</div>
                </div>

                <div className="items">
                  {items.slice(0, 4).map((it, i) => (
                    <div key={i} className="item">
                      <img
                        src={it.thumbnail_url || it.product_image || it.image_url || it.thumbnail || PLACEHOLDER}
                        onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                        alt={it.name || it.product_name || `#${it.product_id || it.id}`}
                      />
                      <div className="info">
                        <div className="name">{it.name || it.product_name || `#${it.product_id || it.id}`}</div>
                        <div className="sub">
                          SL: {it.qty ?? it.quantity ?? 0} Ã— â‚«{fmt(it.price)}
                        </div>
                      </div>
                      <div className="sum">â‚«{fmt((it.qty || it.quantity || 0) * (it.price || 0))}</div>
                    </div>
                  ))}
                  {items.length > 4 && (
                    <div className="more">+{items.length - 4} sáº£n pháº©m khÃ¡câ€¦</div>
                  )}
                </div>

                <div className="foot">
                  <div className="total">Tá»•ng: <b>â‚«{fmt(total)}</b></div>
                  <div className="actions">
                    <button
                      className="btn outline"
                      onClick={() => navigate(`${ORDER_TRACK_PATH}?code=${encodeURIComponent(o.code || o.id)}`)}
                    >
                      Xem chi tiáº¿t
                    </button>
                    <button className="btn solid" onClick={() => reorder(o)}>Mua láº¡i</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Style />
    </div>
  );
}

/** Inline CSS giá»¯ nguyÃªn style */
function Style() {
  return (
    <style>{`
      :root { --e:cubic-bezier(.2,.8,.2,1); }
      .cxl-page{max-width:1100px;margin:0 auto;padding:20px;}
      .card{background:linear-gradient(180deg,#fff 0%, #fff1f2 100%);border:1px solid #ffe4e6;border-radius:18px;padding:20px;box-shadow:0 10px 28px rgba(244,63,94,.08);}
      .topbar{display:flex;align-items:center;gap:10px;margin-bottom:12px}
      .back-home{padding:8px 14px;border-radius:12px;border:1px solid #fecdd3;background:#fff1f2;color:#9f1239;font-weight:900;cursor:pointer;transition:transform .2s var(--e),box-shadow .2s var(--e)}
      .back-home:hover{transform:translateY(-1px);box-shadow:0 8px 18px rgba(244,63,94,.18)}
      .title{margin:0;font-size:22px;font-weight:900;color:#be123c}
      .toolbar{display:flex;gap:10px;align-items:center;margin:12px 0}
      .search{flex:1;height:44px;padding:0 14px;border-radius:12px;border:1px solid #fecdd3;}
      .search:focus{outline:none;box-shadow:0 0 0 2px #fecaca}
      .who{color:#334155}
      .muted{color:#6b7280}
      .error{color:#dc2626}
      .empty{display:grid;place-items:center;gap:10px;padding:30px;color:#64748b;}
      .empty img{width:120px;height:auto;opacity:.8}
      .grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:12px;}
      .order{background:#fff;border:1px solid #ffe4e6;border-radius:16px;padding:14px 18px;box-shadow:0 6px 18px rgba(0,0,0,.04);display:grid;gap:12px;transition:transform .2s ease,box-shadow .2s ease;}
      .order:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(244,63,94,.18)}
      .order-head{display:flex;justify-content:space-between;align-items:center}
      .order .code{font-weight:900;color:#be123c}
      .order .time{color:#64748b;font-size:13px}
      .items{display:flex;flex-direction:column;gap:10px;border-top:1px dashed #fecdd3;padding-top:10px;}
      .item{display:grid;grid-template-columns:80px 1fr auto;gap:12px;align-items:center;width:100%;}
      .item img{width:80px;height:60px;object-fit:cover;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.06)}
      .item .name{font-weight:700}
      .item .sub{font-size:13px;color:#64748b}
      .sum{font-weight:800;color:#be123c}
      .more{font-size:13px;color:#64748b}
      .foot{display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:10px;border-top:1px solid #fce7f3}
      .total{color:#0f172a;font-weight:700}
      .actions{display:flex;gap:10px}
      .btn{padding:9px 14px;border-radius:12px;font-weight:800;cursor:pointer;transition:transform .2s var(--e),box-shadow .2s var(--e)}
      .btn.solid{border:1px solid #f43f5e;background:#f43f5e;color:#fff}
      .btn.solid:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(244,63,94,.25)}
      .btn.outline{border:1px solid #f43f5e;background:#fff;color:#be123c}
      .btn.outline:hover{background:#fff1f2}
    `}</style>
  );
}


