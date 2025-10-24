import React, { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API_BASE = "http://127.0.0.1:8000/api";
const VND = new Intl.NumberFormat("vi-VN");

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    lowStockProducts: [],
  });
  const [modal, setModal] = useState({ show: false, title: "", list: [], type: "" });

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("admin_token") || localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/admin/dashboard/overview`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json.data || {});
    } catch (e) {
      console.error(e);
      setErr("KhÃ´ng thá»ƒ táº£i dá»¯ liá»‡u dashboard.");
    } finally {
      setLoading(false);
    }
  }

  // ðŸ‘‰ Dá»¯ liá»‡u cho biá»ƒu Ä‘á»“: top 10 tá»“n kho tháº¥p nháº¥t (<= 10)
  const chartData = useMemo(() => {
    const arr = Array.isArray(data.lowStockProducts) ? data.lowStockProducts : [];
    return arr
      .slice() // clone
      .sort((a, b) => a.qty - b.qty) // tÄƒng dáº§n theo SL
      .slice(0, 10)                  // top 10
      .map((p) => ({
        name: p.name?.length > 15 ? p.name.slice(0, 15) + "â€¦" : p.name || `#${p.id}`,
        qty: Number(p.qty || 0),
      }));
  }, [data.lowStockProducts]);

  // ðŸ‘‰ Má»Ÿ modal xem chi tiáº¿t
  const handleOpenModal = async (type) => {
    try {
      const token =
        localStorage.getItem("admin_token") || localStorage.getItem("token");
      let url = "";
      let title = "";

      switch (type) {
        case "products":
          url = `${API_BASE}/admin/products?per_page=30`;
          title = "ðŸ“¦ Danh sÃ¡ch sáº£n pháº©m";
          break;
        case "orders":
          url = `${API_BASE}/admin/orders?per_page=30`;
          title = "ðŸ§¾ Danh sÃ¡ch Ä‘Æ¡n hÃ ng";
          break;
        case "users":
          url = `${API_BASE}/admin/users?per_page=30`;
          title = "ðŸ‘¤ Danh sÃ¡ch ngÆ°á»i dÃ¹ng";
          break;
        case "revenue":
          url = `${API_BASE}/admin/orders?status=4&per_page=30`;
          title = "ðŸ’° ÄÆ¡n hÃ ng Ä‘Ã£ giao (doanh thu)";
          break;
        default:
          return;
      }

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      const list = json.data || json;
      setModal({ show: true, title, list, type });
    } catch (e) {
      alert("KhÃ´ng táº£i Ä‘Æ°á»£c dá»¯ liá»‡u chi tiáº¿t!");
      console.error(e);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Äang táº£i dá»¯ liá»‡u...</p>;
  if (err) return <p style={{ color: "red", textAlign: "center" }}>{err}</p>;

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #f0f9ff, #e0f7fa)",
        minHeight: "100vh",
        padding: 20,
        borderRadius: 16,
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 20,
          textAlign: "center",
          color: "#0284c7",
        }}
      >
        ðŸ§­ Dashboard
      </h1>

      {/* CÃ¡c Ã´ thá»‘ng kÃª */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16,
        }}
      >
        <Card
          label="Táº¥t cáº£ sáº£n pháº©m"
          value={data.totalProducts}
          color="#3b82f6"
          onClick={() => handleOpenModal("products")}
        />
        <Card
          label="Tá»•ng Ä‘Æ¡n hÃ ng"
          value={data.totalOrders}
          color="#10b981"
          onClick={() => handleOpenModal("orders")}
        />
        <Card
          label="Tá»•ng doanh thu (Ä‘Ã£ giao)"
          value={`â‚«${VND.format(data.totalRevenue)}`}
          color="#22c55e"
          onClick={() => handleOpenModal("revenue")}
        />
        <Card
          label="NgÆ°á»i dÃ¹ng Ä‘Ã£ Ä‘Äƒng kÃ½"
          value={data.totalUsers}
          color="#9333ea"
          onClick={() => handleOpenModal("users")}
        />
      </div>

      {/* Biá»ƒu Ä‘á»“ tá»“n kho tháº¥p */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
            ðŸ“Š Biá»ƒu Ä‘á»“ Top sáº£n pháº©m tá»“n kho tháº¥p
          </h2>
          <small style={{ color: "#64748b" }}>
            Hiá»ƒn thá»‹ tá»‘i Ä‘a 10 sáº£n pháº©m cÃ³ SL tháº¥p nháº¥t
          </small>
        </div>

        {chartData.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
            âœ… KhÃ´ng cÃ³ sáº£n pháº©m nÃ o sáº¯p háº¿t hÃ ng.
          </div>
        ) : (
          <div style={{ height: 320, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(v) => [`${v}`, "SL tá»“n"]} />
                <Bar dataKey="qty" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Sáº£n pháº©m tá»“n kho tháº¥p (tháº») */}
      <div style={{ marginTop: 24 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 12,
            cursor: "pointer",
          }}
          title="Xem toÃ n bá»™ sáº£n pháº©m tá»“n kho tháº¥p"
          onClick={() =>
            setModal({
              show: true,
              title: "ðŸ“‰ Sáº£n pháº©m tá»“n kho tháº¥p (â‰¤10)",
              list: data.lowStockProducts || [],
              type: "lowstock",
            })
          }
        >
          ðŸ“‹ Sáº£n pháº©m tá»“n kho tháº¥p (â‰¤ 10)
        </h2>

        {data.lowStockProducts?.length === 0 ? (
          <p>âœ… KhÃ´ng cÃ³ sáº£n pháº©m nÃ o sáº¯p háº¿t hÃ ng.</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {data.lowStockProducts.slice(0, 5).map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "10px 16px",
                  minWidth: 200,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <b>{p.name}</b>
                <div style={{ fontSize: 14, color: "#475569" }}>MÃ£: {p.id}</div>
                <div style={{ fontSize: 14, color: "#e11d48" }}>SL: {p.qty}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal chi tiáº¿t */}
      {modal.show && (
        <DetailModal
          title={modal.title}
          data={modal.list}
          type={modal.type}
          onClose={() => setModal({ show: false, title: "", list: [], type: "" })}
        />
      )}
    </section>
  );
}

function Card({ label, value, color, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 20,
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        transition: "0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={{ color: "#64748b", fontSize: 15, marginBottom: 6, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: color || "#0f172a" }}>
        {value}
      </div>
    </div>
  );
}

// Modal hiá»ƒn thá»‹ chi tiáº¿t cÃ³ hÃ¬nh áº£nh
function DetailModal({ title, data, onClose, type }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          width: "90%",
          maxWidth: 900,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          {title}
        </h3>

        {(!data || data.length === 0) ? (
          <p>KhÃ´ng cÃ³ dá»¯ liá»‡u.</p>
        ) : (
          <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} align="left" style={{ borderBottom: "1px solid #e2e8f0" }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 ? "#fafafa" : "white" }}>
                  {Object.entries(item).map(([key, val], j) => (
                    <td key={j}>
                      {key === "thumbnail" || key === "thumbnail_url" ? (
                        <img
                          src={
                            String(val || "").startsWith("http")
                              ? val
                              : `http://127.0.0.1:8000/storage/${String(val || "").replace(/^public\//, "")}`
                          }
                          alt=""
                          style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      ) : (
                        String(val)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ textAlign: "right", marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#0f62fe",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ÄÃ³ng
          </button>
        </div>
      </div>
    </div>
  );
}


