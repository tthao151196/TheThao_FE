import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";
const VND = new Intl.NumberFormat("vi-VN");

const STATUS_COLORS = {
  pending:   { bg: "#fff8e1", color: "#b26a00" },
  confirmed: { bg: "#e3f2fd", color: "#1565c0" },
  ready:     { bg: "#e8f5e9", color: "#2e7d32" },
  shipping:  { bg: "#e0f7fa", color: "#00796b" },
  delivered: { bg: "#e8f5e9", color: "#1b5e20" },
  canceled:  { bg: "#ffebee", color: "#c62828" },
};

const humanStatus = (key) => {
  const map = {
    pending:   "Chá» xÃ¡c nháº­n",
    confirmed: "ÄÃ£ xÃ¡c nháº­n",
    ready:     "Chá» giao hÃ ng",
    shipping:  "Äang giao",
    delivered: "Giao thÃ nh cÃ´ng",
    canceled:  "ÄÃ£ há»§y",
  };
  return map[key] || key;
};

// FIX: map 2 chiá»u code <-> key
const STATUS_CODE_FROM_KEY = {
  pending: 0,
  confirmed: 1,
  ready: 2,
  shipping: 3,
  delivered: 4,
  canceled: 5,
};

const STATUS_KEY_FROM_CODE = (code) => {
  const n = Number(code);
  switch (n) {
    case 0: return "pending";
    case 1: return "confirmed";
    case 2: return "ready";
    case 3: return "shipping";
    case 4: return "delivered";
    case 5: return "canceled";
    default: return "pending";
  }
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
  }, [search]);

  async function loadOrders() {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("admin_token") || localStorage.getItem("token");
      const url = `${API_BASE}/admin/orders?per_page=100${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setOrders(list);
    } catch (e) {
      console.error(e);
      setErr("KhÃ´ng táº£i Ä‘Æ°á»£c danh sÃ¡ch Ä‘Æ¡n hÃ ng.");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, newKey) => {
    // newKey lÃ  "pending/confirmed/..."
    if (!window.confirm(`Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n #${id} thÃ nh "${humanStatus(newKey)}"?`))
      return;

    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // FE váº«n gá»­i chuá»—i theo UI Ä‘á»ƒ BE map (Ä‘Ã£ há»— trá»£)
        body: JSON.stringify({ status: newKey }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`HTTP ${res.status} - ${t}`);
      }

      const updated = await res.json();

      // FIX: BE tráº£ vá» code (sá»‘). LÆ°u láº¡i vÃ o orders[i].status lÃ  sá»‘.
      const newCode =
        updated?.data?.status ?? updated?.status ?? null;

      if (newCode === null) {
        // fallback: reload toÃ n danh sÃ¡ch náº¿u response khÃ´ng nhÆ° mong Ä‘á»£i
        await loadOrders();
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newCode } : o))
        );
      }

      alert("âœ… Cáº­p nháº­t tráº¡ng thÃ¡i thÃ nh cÃ´ng!");
    } catch (e) {
      console.error(e);
      alert("âŒ Lá»—i khi cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng!");
    }
  };

  return (
    <section style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <h1 style={{ fontSize: 24 }}>Quáº£n lÃ½ Ä‘Æ¡n hÃ ng</h1>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="TÃ¬m theo mÃ£ Ä‘Æ¡n / tÃªn / email / sÄ‘t"
            style={{
              height: 36,
              padding: "0 10px",
              border: "1px solid #ddd",
              borderRadius: 8,
              minWidth: 260,
            }}
          />
          <button
            onClick={() => setSearch("")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            XÃ³a tÃ¬m
          </button>
        </div>
      </div>

      {loading && <p>Äang táº£i dá»¯ liá»‡uâ€¦</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {!loading && !err && (
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table
            width="100%"
            cellPadding={8}
            style={{ borderCollapse: "collapse", background: "#fff" }}
          >
            <thead>
              <tr style={{ background: "#f5f6fa" }}>
                <th align="left">MÃ£ Ä‘Æ¡n</th>
                <th align="left">KhÃ¡ch hÃ ng</th>
                <th align="left">Email</th>
                <th align="left">SÄT</th>
                <th align="right">Tá»•ng tiá»n</th>
                <th align="left">Tráº¡ng thÃ¡i</th>
                <th align="center">Cáº­p nháº­t</th>
                <th align="center">HÃ nh Ä‘á»™ng</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                // FIX: chuyá»ƒn code -> key Ä‘á»ƒ hiá»ƒn thá»‹ Ä‘Ãºng mÃ u/label/select
                const statusKey = STATUS_KEY_FROM_CODE(o.status);
                const sColor = STATUS_COLORS[statusKey] || {};
                return (
                  <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
                    <td>#{o.id}</td>
                    <td>{o.name}</td>
                    <td>{o.email}</td>
                    <td>{o.phone}</td>
                    <td align="right">â‚«{VND.format(Number(o.total ?? 0))}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: sColor.bg,
                          color: sColor.color,
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {humanStatus(statusKey)}
                      </span>
                    </td>
                    <td align="center">
                      <select
                        // FIX: select dÃ¹ng key (chuá»—i) Ä‘á»ƒ khá»›p option
                        value={statusKey}
                        onChange={(e) =>
                          handleStatusChange(o.id, e.target.value)
                        }
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          border: "1px solid #ccc",
                        }}
                      >
                        <option value="pending">Chá» xÃ¡c nháº­n</option>
                        <option value="confirmed">ÄÃ£ xÃ¡c nháº­n</option>
                        <option value="ready">Chá» giao hÃ ng</option>
                        <option value="shipping">Äang giao</option>
                        <option value="delivered">Giao thÃ nh cÃ´ng</option>
                        <option value="canceled">ÄÃ£ há»§y</option>
                      </select>
                    </td>
                    <td align="center">
                      <button
                        onClick={() => navigate(`/admin/orders/${o.id}`)}
                        style={{
                          padding: "4px 10px",
                          background: "#0f62fe",
                          color: "#fff",
                          border: 0,
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} align="center" style={{ color: "#666" }}>
                    KhÃ´ng cÃ³ Ä‘Æ¡n hÃ ng.
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


