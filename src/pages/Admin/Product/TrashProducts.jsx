// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "http://127.0.0.1:8000/api";

// export default function TrashProducts() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const ac = new AbortController();
//     const token = localStorage.getItem("admin_token");

//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");
//         const res = await fetch(`${API_BASE}/admin/products/trash`, {
//           signal: ac.signal,
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         setItems(Array.isArray(data.data) ? data.data : []);
//       } catch {
//         setErr("KhÃ´ng táº£i Ä‘Æ°á»£c thÃ¹ng rÃ¡c.");
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => ac.abort();
//   }, []);

//   const restore = async (id) => {
//     const token = localStorage.getItem("admin_token");
//     if (!window.confirm("KhÃ´i phá»¥c sáº£n pháº©m nÃ y?")) return;
//     const res = await fetch(`${API_BASE}/admin/products/${id}/restore`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (res.ok) {
//       setItems((prev) => prev.filter((x) => x.id !== id));
//       alert("âœ… ÄÃ£ khÃ´i phá»¥c sáº£n pháº©m!");
//     } else alert("âŒ Lá»—i khi khÃ´i phá»¥c");
//   };

//   const forceDelete = async (id) => {
//     const token = localStorage.getItem("admin_token");
//     if (!window.confirm("XÃ³a vÄ©nh viá»…n sáº£n pháº©m nÃ y?")) return;
//     const res = await fetch(`${API_BASE}/admin/products/${id}/force`, {
//       method: "DELETE",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (res.ok) {
//       setItems((prev) => prev.filter((x) => x.id !== id));
//       alert("ðŸ—‘ ÄÃ£ xoÃ¡ vÄ©nh viá»…n!");
//     } else alert("âŒ Lá»—i xoÃ¡ vÄ©nh viá»…n");
//   };

//   return (
//     <section style={{ padding: 20 }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h1 style={{ fontSize: 24 }}>ðŸ—‚ ThÃ¹ng rÃ¡c sáº£n pháº©m</h1>
//         <button
//           onClick={() => navigate("/admin/products")}
//           style={{
//             padding: "8px 12px",
//             borderRadius: 8,
//             border: "1px solid #0f62fe",
//             background: "#0f62fe",
//             color: "#fff",
//             cursor: "pointer",
//           }}
//         >
//           â† Quay láº¡i danh sÃ¡ch
//         </button>
//       </div>

//       {loading && <p>Äang táº£i...</p>}
//       {err && <p style={{ color: "red" }}>{err}</p>}

//       {!loading && (
//         <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", background: "#fff", marginTop: 10 }}>
//           <thead>
//             <tr style={{ background: "#fafafa" }}>
//               <th>ID</th>
//               <th>TÃªn</th>
//               <th>Slug</th>
//               <th>áº¢nh</th>
//               <th align="center">HÃ nh Ä‘á»™ng</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((p) => (
//               <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
//                 <td>{p.id}</td>
//                 <td>{p.name}</td>
//                 <td>{p.slug}</td>
//                 <td align="center">
//                   <img
//                     src={p.thumbnail_url}
//                     alt={p.name}
//                     style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
//                     onError={(e) => (e.currentTarget.src = "https://placehold.co/60x40?text=No+Img")}
//                   />
//                 </td>
//                 <td align="center">
//                   <button
//                     onClick={() => restore(p.id)}
//                     style={{
//                       padding: "4px 10px",
//                       marginRight: 6,
//                       background: "#15803d",
//                       color: "#fff",
//                       border: 0,
//                       borderRadius: 6,
//                       cursor: "pointer",
//                     }}
//                   >
//                     KhÃ´i phá»¥c
//                   </button>
//                   <button
//                     onClick={() => forceDelete(p.id)}
//                     style={{
//                       padding: "4px 10px",
//                       background: "#b91c1c",
//                       color: "#fff",
//                       border: 0,
//                       borderRadius: 6,
//                       cursor: "pointer",
//                     }}
//                   >
//                     XoÃ¡ vÄ©nh viá»…n
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {!items.length && (
//               <tr>
//                 <td colSpan={5} align="center" style={{ padding: 20, color: "#777" }}>
//                   ThÃ¹ng rÃ¡c trá»‘ng
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}
//     </section>
//   );
// }


import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

export default function TrashProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState(() => new Set()); // lÆ°u cÃ¡c id Ä‘Ã£ chá»n
  const [busy, setBusy] = useState(false); // cháº·n báº¥m khi Ä‘ang thao tÃ¡c hÃ ng loáº¡t
  const navigate = useNavigate();

  const adminToken = () => localStorage.getItem("admin_token");

  // ===== Load danh sÃ¡ch trong thÃ¹ng rÃ¡c =====
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/admin/products/trash`, {
          signal: ac.signal,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${adminToken()}`,
          },
        });
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : [];
        setItems(list);
        setSelected(new Set()); // reset cÃ¡c chá»n cÅ©
      } catch {
        setErr("KhÃ´ng táº£i Ä‘Æ°á»£c thÃ¹ng rÃ¡c.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  // ====== Helpers chá»n ======
  const allIds = useMemo(() => items.map((x) => x.id), [items]);
  const isAllChecked = selected.size > 0 && selected.size === items.length;
  const isIndeterminate = selected.size > 0 && selected.size < items.length;

  const toggleOne = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === items.length) return new Set(); // bá» chá»n háº¿t
      return new Set(allIds); // chá»n táº¥t cáº£
    });
  }, [items.length, allIds]);

  // ====== API actions Ä‘Æ¡n láº» ======
  const restore = async (id) => {
    const token = adminToken();
    if (!window.confirm("KhÃ´i phá»¥c sáº£n pháº©m nÃ y?")) return;
    const res = await fetch(`${API_BASE}/admin/products/${id}/restore`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x.id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      alert("âœ… ÄÃ£ khÃ´i phá»¥c sáº£n pháº©m!");
    } else alert("âŒ Lá»—i khi khÃ´i phá»¥c");
  };

  const forceDelete = async (id) => {
    const token = adminToken();
    if (!window.confirm("XÃ³a vÄ©nh viá»…n sáº£n pháº©m nÃ y?")) return;
    const res = await fetch(`${API_BASE}/admin/products/${id}/force`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x.id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      alert("ðŸ—‘ ÄÃ£ xoÃ¡ vÄ©nh viá»…n!");
    } else alert("âŒ Lá»—i xoÃ¡ vÄ©nh viá»…n");
  };

  // ====== HÃ nh Ä‘á»™ng hÃ ng loáº¡t ======
  const doBulk = async (type) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;

    const confirmMsg =
      type === "restore"
        ? `KhÃ´i phá»¥c ${ids.length} sáº£n pháº©m Ä‘Ã£ chá»n?`
        : `XoÃ¡ vÄ©nh viá»…n ${ids.length} sáº£n pháº©m Ä‘Ã£ chá»n?`;
    if (!window.confirm(confirmMsg)) return;

    setBusy(true);
    const token = adminToken();

    // Náº¿u chÆ°a cÃ³ endpoint bulk, gá»i tuáº§n tá»± tá»«ng id
    const tasks = ids.map((id) =>
      fetch(
        type === "restore"
          ? `${API_BASE}/admin/products/${id}/restore`
          : `${API_BASE}/admin/products/${id}/force`,
        {
          method: type === "restore" ? "POST" : "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((r) => ({ id, ok: r.ok }))
       .catch(() => ({ id, ok: false }))
    );

    const results = await Promise.allSettled(tasks);
    let okCount = 0;
    let failIds = [];
    let okIds = [];

    results.forEach((r) => {
      if (r.status === "fulfilled" && r.value.ok) {
        okCount++;
        okIds.push(r.value.id);
      } else if (r.status === "fulfilled") {
        failIds.push(r.value.id);
      } else {
        // rejected
        // r.reason chá»©a promise bá»‹ lá»—i (Ä‘Ã£ catch á»Ÿ trÃªn nÃªn Ã­t khi vÃ o Ä‘Ã¢y)
      }
    });

    // Cáº­p nháº­t UI: bá» cÃ¡c item Ä‘Ã£ ok
    if (okIds.length) {
      setItems((prev) => prev.filter((x) => !okIds.includes(x.id)));
      setSelected((prev) => {
        const next = new Set(prev);
        okIds.forEach((id) => next.delete(id));
        return next;
      });
    }

    setBusy(false);
    if (okCount && !failIds.length) {
      alert(
        type === "restore"
          ? `âœ… ÄÃ£ khÃ´i phá»¥c ${okCount} sáº£n pháº©m.`
          : `ðŸ—‘ ÄÃ£ xoÃ¡ vÄ©nh viá»…n ${okCount} sáº£n pháº©m.`
      );
    } else if (okCount && failIds.length) {
      alert(
        `${type === "restore" ? "âš ï¸" : "âš ï¸"} ThÃ nh cÃ´ng ${okCount}, tháº¥t báº¡i ${
          failIds.length
        }: ${failIds.join(", ")}`
      );
    } else {
      alert("âŒ KhÃ´ng thao tÃ¡c Ä‘Æ°á»£c sáº£n pháº©m nÃ o.");
    }
  };

  return (
    <section style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>ðŸ—‚ ThÃ¹ng rÃ¡c sáº£n pháº©m</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => doBulk("restore")}
            disabled={busy || selected.size === 0}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: 0,
              background: selected.size === 0 ? "#9ca3af" : "#15803d",
              color: "#fff",
              cursor: selected.size === 0 ? "not-allowed" : "pointer",
            }}
            title="KhÃ´i phá»¥c cÃ¡c sáº£n pháº©m Ä‘Ã£ chá»n"
          >
            â†© KhÃ´i phá»¥c Ä‘Ã£ chá»n ({selected.size})
          </button>
          <button
            onClick={() => doBulk("force")}
            disabled={busy || selected.size === 0}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: 0,
              background: selected.size === 0 ? "#9ca3af" : "#b91c1c",
              color: "#fff",
              cursor: selected.size === 0 ? "not-allowed" : "pointer",
            }}
            title="XoÃ¡ vÄ©nh viá»…n cÃ¡c sáº£n pháº©m Ä‘Ã£ chá»n"
          >
            ðŸ—‘ XoÃ¡ vÄ©nh viá»…n Ä‘Ã£ chá»n ({selected.size})
          </button>
          <button
            onClick={() => navigate("/admin/products")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #0f62fe",
              background: "#0f62fe",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            â† Quay láº¡i danh sÃ¡ch
          </button>
        </div>
      </div>

      {loading && <p>Äang táº£i...</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {!loading && (
        <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", background: "#fff", marginTop: 10 }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ width: 36, textAlign: "center" }}>
                {/* Checkbox chá»n táº¥t cáº£ vá»›i tráº¡ng thÃ¡i indeterminate */}
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={toggleAll}
                  aria-label="Chá»n táº¥t cáº£"
                />
              </th>
              <th>ID</th>
              <th>TÃªn</th>
              <th>Slug</th>
              <th>áº¢nh</th>
              <th align="center">HÃ nh Ä‘á»™ng</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const checked = selected.has(p.id);
              return (
                <tr key={p.id} style={{ borderTop: "1px solid #eee", background: checked ? "#f0f9ff" : "transparent" }}>
                  <td align="center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOne(p.id)}
                      aria-label={`Chá»n sáº£n pháº©m ${p.name}`}
                    />
                  </td>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.slug}</td>
                  <td align="center">
                    <img
                      src={p.thumbnail_url}
                      alt={p.name}
                      style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/60x40?text=No+Img")}
                    />
                  </td>
                  <td align="center">
                    <button
                      onClick={() => restore(p.id)}
                      disabled={busy}
                      style={{
                        padding: "4px 10px",
                        marginRight: 6,
                        background: "#15803d",
                        color: "#fff",
                        border: 0,
                        borderRadius: 6,
                        cursor: busy ? "not-allowed" : "pointer",
                      }}
                    >
                      KhÃ´i phá»¥c
                    </button>
                    <button
                      onClick={() => forceDelete(p.id)}
                      disabled={busy}
                      style={{
                        padding: "4px 10px",
                        background: "#b91c1c",
                        color: "#fff",
                        border: 0,
                        borderRadius: 6,
                        cursor: busy ? "not-allowed" : "pointer",
                      }}
                    >
                      XoÃ¡ vÄ©nh viá»…n
                    </button>
                  </td>
                </tr>
              );
            })}
            {!items.length && (
              <tr>
                <td colSpan={6} align="center" style={{ padding: 20, color: "#777" }}>
                  ThÃ¹ng rÃ¡c trá»‘ng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}


