// src/pages/Admin/User/Users.jsx
import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState(null); // giá»‘ng Products: khoÃ¡ nÃºt khi xoÃ¡

  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data?.data ?? []);
    } catch (e) {
      setErr("KhÃ´ng táº£i Ä‘Æ°á»£c danh sÃ¡ch ngÆ°á»i dÃ¹ng.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // XoÃ¡: cÃ¹ng pattern nhÆ° Products (confirm + disabled + mÃ u ná»n khÃ¡c khi xoÃ¡)
  const removeUser = async (id) => {
    if (!window.confirm("Báº¡n cháº¯c cháº¯n muá»‘n xoÃ¡ ngÆ°á»i dÃ¹ng nÃ y?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("âœ… ÄÃ£ xoÃ¡ ngÆ°á»i dÃ¹ng");
    } catch (e) {
      console.error("Delete error:", e);
      alert("âŒ XoÃ¡ tháº¥t báº¡i");
    } finally {
      setDeletingId(null);
    }
  };

  // Lá»c: giá»‘ng Products (client-side keyword)
  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return users;
    return users.filter(
      (u) =>
        String(u.id).includes(kw) ||
        (u.name || "").toLowerCase().includes(kw) ||
        (u.email || "").toLowerCase().includes(kw) ||
        (u.username || "").toLowerCase().includes(kw) ||
        (u.roles || "").toLowerCase().includes(kw)
    );
  }, [q, users]);

  return (
    <section style={{ padding: 20 }}>
      {/* Toolbar giá»‘ng Products */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h1 style={{ fontSize: 24 }}>Quáº£n lÃ½ ngÆ°á»i dÃ¹ng</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="TÃ¬m tÃªn/email/username/roleâ€¦"
            style={{
              height: 36,
              padding: "0 10px",
              border: "1px solid #ddd",
              borderRadius: 8,
              minWidth: 260,
            }}
          />
          <button
            onClick={() => alert("Chá»©c nÄƒng thÃªm user Ä‘ang phÃ¡t triá»ƒn")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #0f62fe",
              background: "#0f62fe",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            + Add
          </button>
        </div>
      </div>

      {loading && <p>Äang táº£i dá»¯ liá»‡uâ€¦</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {!loading && !err && (
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", background: "#fff" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                <th align="left">ID</th>
                <th align="left">TÃªn</th>
                <th align="left">Email</th>
                <th align="left">Username</th>
                <th align="left">Vai trÃ²</th>
                <th align="left">Tráº¡ng thÃ¡i</th>
                <th align="center">HÃ nh Ä‘á»™ng</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.username}</td>
                  <td style={{ textTransform: "capitalize" }}>{u.roles || "-"}</td>
                  <td>{u.status === 1 ? "Hoáº¡t Ä‘á»™ng" : "KhoÃ¡"}</td>
                  <td align="center">
                    {/* Giá»¯ Ä‘Ãºng pattern nÃºt nhÆ° Products */}

                    <button
                      onClick={() => removeUser(u.id)}
                      disabled={deletingId === u.id}
                      style={{
                        padding: "4px 10px",
                        background: deletingId === u.id ? "#ef9a9a" : "#c62828",
                        color: "#fff",
                        border: 0,
                        borderRadius: 6,
                        cursor: deletingId === u.id ? "not-allowed" : "pointer",
                      }}
                    >
                      {deletingId === u.id ? "Äang xoÃ¡..." : "XÃ³a"}
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} align="center" style={{ padding: 18, color: "#777" }}>
                    KhÃ´ng cÃ³ dá»¯ liá»‡u
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


