import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

const HOST = "http://127.0.0.1:8000";
const API_BASE = `${HOST}/api`;
const IMG_FALLBACK = "https://placehold.co/120x90?text=No+Img";

// Render mÃ´ táº£ HTML an toÃ n + preview ngáº¯n gá»n (~3 dÃ²ng)
function DescCell({ html }) {
  const safe = DOMPurify.sanitize(html || "");
  return (
    <div
      style={{
        maxWidth: 420,
        maxHeight: 64,
        overflow: "hidden",
        lineHeight: "20px",
      }}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

export default function Categories() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState([]); // âœ… Danh sÃ¡ch tick
  const navigate = useNavigate();

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API_BASE}/categories`, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data ?? [];

        // Chuáº©n hÃ³a nháº¹ áº£nh (náº¿u BE tráº£ 'image' thÃ¬ tá»± táº¡o url)
        const normalized = list.map((c) => ({
          ...c,
          image_url: c.image_url || (c.image ? `${HOST}/storage/${c.image}` : null),
        }));

        setRows(normalized);
      } catch (e) {
        if (e.name !== "AbortError") setErr("KhÃ´ng táº£i Ä‘Æ°á»£c danh má»¥c.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // âœ… XÃ³a (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm(`XÃ³a danh má»¥c #${id}?`)) return;
    try {
      const token = localStorage.getItem("admin_token") || "";
      if (!token) {
        alert("Báº¡n cáº§n Ä‘Äƒng nháº­p admin Ä‘á»ƒ xÃ³a.");
        return;
      }

      const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let payload = null;
      try {
        payload = await res.json();
      } catch {}

      if (!res.ok) {
        const msg = payload?.message || `XÃ³a tháº¥t báº¡i (HTTP ${res.status})`;
        throw new Error(msg);
      }

      setRows((prev) => prev.filter((x) => x.id !== id));
      setSelected((prev) => prev.filter((x) => x !== id));
    } catch (e) {
      console.error(e);
      alert(e.message || "KhÃ´ng xÃ³a Ä‘Æ°á»£c danh má»¥c.");
    }
  };

  // âœ… XÃ³a nhiá»u má»¥c Ä‘Ã£ chá»n
  const handleBulkDelete = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Chuyá»ƒn ${selected.length} danh má»¥c vÃ o thÃ¹ng rÃ¡c?`)) return;

    // Thá»±c hiá»‡n tuáº§n tá»± Ä‘á»ƒ Ä‘Æ¡n giáº£n (cÃ³ thá»ƒ tá»‘i Æ°u song song náº¿u cáº§n)
    for (const id of selected) {
      // eslint-disable-next-line no-await-in-loop
      await handleDelete(id);
    }
    setSelected([]);
  };

  // Tick all
  const allChecked = rows.length > 0 && selected.length === rows.length;

  return (
    <section style={{ padding: 20 }}>
      {/* ==== Header ==== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Quáº£n lÃ½ danh má»¥c</h1>
        <div>
          <button
            onClick={() => navigate("/admin/categories/add")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #0f62fe",
              background: "#0f62fe",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            + ThÃªm
          </button>

          <button
            onClick={() => navigate("/admin/categories/trash")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              marginLeft: 8,
              background: "#616161",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ðŸ—‘ï¸ ThÃ¹ng rÃ¡c
          </button>

          {selected.length > 0 && (
            <button
              onClick={handleBulkDelete}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                marginLeft: 8,
                background: "#c62828",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              XÃ³a Ä‘Ã£ chá»n ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* ==== Table ==== */}
      {loading && <p>Äang táº£i dá»¯ liá»‡uâ€¦</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {!loading && (
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table
            width="100%"
            cellPadding={8}
            style={{
              borderCollapse: "collapse",
              background: "#fff",
              minWidth: 700,
            }}
          >
            <thead>
              <tr style={{ background: "#fafafa" }}>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelected(e.target.checked ? rows.map((r) => r.id) : [])
                    }
                    checked={allChecked}
                  />
                </th>
                <th align="left">ID</th>
                <th align="left">TÃªn</th>
                <th align="left">Slug</th>
                <th align="center">áº¢nh</th>
                <th align="left">MÃ´ táº£</th>
                <th align="center">HÃ nh Ä‘á»™ng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #eee" }}>
                  <td align="center">
                    <input
                      type="checkbox"
                      checked={selected.includes(c.id)}
                      onChange={() =>
                        setSelected((sel) =>
                          sel.includes(c.id)
                            ? sel.filter((x) => x !== c.id)
                            : [...sel, c.id]
                        )
                      }
                    />
                  </td>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td align="center">
                    <img
                      src={c.image_url || (c.image ? `${HOST}/storage/${c.image}` : IMG_FALLBACK)}
                      alt={c.name}
                      style={{
                        width: 60,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                      onError={(e) => {
                        e.currentTarget.src = IMG_FALLBACK;
                      }}
                    />
                  </td>
                  <td>
                    {/* âœ… render HTML an toÃ n thay vÃ¬ hiá»ƒn thá»‹ chuá»—i thÃ´ */}
                    <DescCell html={c.description} />
                  </td>
                  <td align="center">
                    <button
                      onClick={() => navigate(`/admin/categories/edit/${c.id}`)}
                      style={{
                        padding: "4px 10px",
                        marginRight: 4,
                        background: "#2e7d32",
                        color: "#fff",
                        border: 0,
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Sá»­a
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{
                        padding: "4px 10px",
                        background: "#c62828",
                        color: "#fff",
                        border: 0,
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      XÃ³a
                    </button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={7} align="center" style={{ padding: 18, color: "#777" }}>
                    Trá»‘ng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}


