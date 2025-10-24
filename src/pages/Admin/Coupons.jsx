import { useEffect, useMemo, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Coupons() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // {id,...} or null
  const [form, setForm] = useState(blankForm());

  function blankForm() {
    return {
      code: "",
      type: "fixed", // fixed | percent
      value: 10000,
      max_discount: "",
      min_order_total: 0,
      usage_limit: "",
      per_user_limit: 1,
      start_at: "",
      end_at: "",
      is_active: true,
    };
  }

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    }),
    []
  );

  async function safeJson(res) {
    try {
      return await res.json();
    } catch {
      const text = await res.text();
      return { __raw: text };
    }
  }

  function normalizeArray(payload) {
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload)) return payload;
    return [];
  }

  async function fetchList(keyword = "") {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `${API}/api/admin/coupons${keyword ? `?q=${encodeURIComponent(keyword)}` : ""}`,
        { headers }
      );
      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data?.message || `Lá»—i ${res.status}`);
      }

      setList(normalizeArray(data));
    } catch (e) {
      console.error(e);
      setList([]);
      setMessage(`âŒ ${e.message || "KhÃ´ng táº£i Ä‘Æ°á»£c danh sÃ¡ch."}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(blankForm());
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      code: row.code || "",
      type: row.type || "fixed",
      value: Number(row.value ?? 0),
      max_discount: row.max_discount ?? "",
      min_order_total: Number(row.min_order_total || 0),
      usage_limit: row.usage_limit ?? "",
      per_user_limit: Number(row.per_user_limit || 1),
      start_at: row.start_at ? row.start_at.slice(0, 16) : "",
      end_at: row.end_at ? row.end_at.slice(0, 16) : "",
      is_active: !!row.is_active,
    });
    setModalOpen(true);
  }

  async function saveForm() {
    setLoading(true);
    setMessage("");
    try {
      const body = {
        ...form,
        code: String(form.code || "").toUpperCase().replace(/\s+/g, ""),
        value: Number(form.value),
        min_order_total: Number(form.min_order_total || 0),
        per_user_limit: Number(form.per_user_limit || 1),
        usage_limit: form.usage_limit === "" ? null : Number(form.usage_limit),
        max_discount:
          form.type === "percent"
            ? form.max_discount === "" ? null : Number(form.max_discount)
            : null,
      };

      const url = editing
        ? `${API}/api/admin/coupons/${editing.id}`
        : `${API}/api/admin/coupons`;
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data?.message || "LÆ°u tháº¥t báº¡i.");
      }

      setMessage(editing ? "âœ… ÄÃ£ cáº­p nháº­t!" : "âœ… ÄÃ£ táº¡o mÃ£ má»›i!");
      setModalOpen(false);
      setEditing(null);
      await fetchList(q);
    } catch (e) {
      console.error(e);
      setMessage(`âŒ ${e.message || "Lá»—i káº¿t ná»‘i mÃ¡y chá»§."}`);
    } finally {
      setLoading(false);
    }
  }

  async function removeRow(id) {
    if (!window.confirm("XoÃ¡ mÃ£ nÃ y?")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/api/admin/coupons/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "XoÃ¡ tháº¥t báº¡i.");
      setMessage("ðŸ—‘ï¸ ÄÃ£ xoÃ¡!");
      await fetchList(q);
    } catch (e) {
      console.error(e);
      setMessage(`âŒ ${e.message || "Lá»—i káº¿t ná»‘i."}`);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(row) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/api/admin/coupons/${row.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ is_active: !row.is_active }),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Äá»•i tráº¡ng thÃ¡i tháº¥t báº¡i.");
      await fetchList(q);
    } catch (e) {
      console.error(e);
      setMessage(`âŒ ${e.message || "Lá»—i káº¿t ná»‘i."}`);
    } finally {
      setLoading(false);
    }
  }

  // ====== Táº O NHANH: GIAM10K / GIAM20K / GIAM50K ======
  function quickCreateFixed(amount) {
    const code = `GIAM${amount / 1000}K`;
    setForm({
      ...blankForm(),
      code,
      type: "fixed",
      value: amount,
      min_order_total: 0,
      usage_limit: 100,
      per_user_limit: 1,
      is_active: true,
    });
    setEditing(null);
    setModalOpen(true);
  }

  return (
    <div className="admin-screen">
      {/* Toolbar */}
      <div className="toolbar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h2>Quáº£n LÃ½ MÃ£ Giáº£m GiÃ¡</h2>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <input
            placeholder="TÃ¬m mÃ£..."
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchList(q)}
            style={{ minWidth: 240 }}
          />
          <button className="btn" onClick={() => fetchList(q)}>TÃ¬m</button>
          <button className="btn btn-primary" onClick={openCreate}>+ ThÃªm mÃ£</button>
        </div>
      </div>

      {/* Quick templates */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => quickCreateFixed(10000)}>+ GIAM10K</button>
          <button className="btn" onClick={() => quickCreateFixed(20000)}>+ GIAM20K</button>
          <button className="btn" onClick={() => quickCreateFixed(50000)}>+ GIAM50K</button>
          <button
            className="btn"
            onClick={() => {
              setForm({
                ...blankForm(),
                code: "GIAM10",
                type: "percent",
                value: 10,
                max_discount: 50000,
                min_order_total: 100000,
                usage_limit: 100,
              });
              setEditing(null);
              setModalOpen(true);
            }}
          >
            + GIAM10% (tráº§n 50K)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {message && <div style={{ marginBottom: 10, color: "#c62828" }}>{message}</div>}

        <div style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Code</th>
                <th>Loáº¡i</th>
                <th>GiÃ¡ trá»‹</th>
                <th>Tá»‘i thiá»ƒu Ä‘Æ¡n</th>
                <th>Tráº§n (percent)</th>
                <th>DÃ¹ng/Limit</th>
                <th>Thá»i gian</th>
                <th>TT</th>
                <th style={{ width: 160 }}>HÃ nh Ä‘á»™ng</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9}>Äang táº£i...</td></tr>
              ) : !Array.isArray(list) || list.length === 0 ? (
                <tr><td colSpan={9}>ChÆ°a cÃ³ mÃ£</td></tr>
              ) : (
                list.map((r) => (
                  <tr key={r.id}>
                    <td style={{ textAlign: "left", fontWeight: 600 }}>{r.code}</td>
                    <td>{r.type}</td>
                    <td>{r.type === "fixed"
                        ? Number(r.value).toLocaleString("vi-VN") + " Ä‘"
                        : Number(r.value) + " %"}</td>
                    <td>{Number(r.min_order_total || 0).toLocaleString("vi-VN")} Ä‘</td>
                    <td>{r.type === "percent"
                          ? (r.max_discount ? Number(r.max_discount).toLocaleString("vi-VN") + " Ä‘" : "â€”")
                          : "â€”"}</td>
                    <td>{(r.used_count || 0)}/{r.usage_limit ?? "âˆž"}</td>
                    <td style={{ fontSize: 12 }}>
                      {r.start_at ? new Date(r.start_at).toLocaleString() : "â€”"} <br />
                      {r.end_at ? "â†’ " + new Date(r.end_at).toLocaleString() : ""}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: r.is_active ? "rgba(16,185,129,.15)" : "rgba(239,68,68,.12)",
                          color: r.is_active ? "#10b981" : "#ef4444",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {r.is_active ? "ON" : "OFF"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-green" onClick={() => openEdit(r)}>Sá»­a</button>
                        <button className="btn" onClick={() => toggleActive(r)}>
                          {r.is_active ? "Táº¯t" : "Báº­t"}
                        </button>
                        <button className="btn btn-danger" onClick={() => removeRow(r.id)}>XoÃ¡</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div
            style={{
              width: 720, maxWidth: "95%", background: "#fff",
              borderRadius: 12, padding: 16, boxShadow: "0 10px 30px rgba(0,0,0,.2)"
            }}
          >
            <h3 style={{ marginBottom: 12 }}>
              {editing ? "Sá»­a mÃ£ giáº£m giÃ¡" : "ThÃªm mÃ£ giáº£m giÃ¡"}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label>MÃ£ (CODE)</label>
                <input
                  className="input"
                  value={form.code}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, code: e.target.value.toUpperCase() }))
                  }
                  placeholder="GIAM10K / GIAM20K / SUMMER10 ..."
                />
              </div>

              <div>
                <label>Loáº¡i</label>
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                >
                  <option value="fixed">Cá»‘ Ä‘á»‹nh (Ä‘)</option>
                  <option value="percent">Pháº§n trÄƒm (%)</option>
                </select>
              </div>

              <div>
                <label>GiÃ¡ trá»‹</label>
                <input
                  type="number"
                  className="input"
                  value={form.value}
                  onChange={(e) => setForm((s) => ({ ...s, value: Number(e.target.value) }))}
                  placeholder="10 hoáº·c 50000"
                />
              </div>

              <div>
                <label>Tráº§n giáº£m (cho %)</label>
                <input
                  type="number"
                  className="input"
                  value={form.max_discount}
                  onChange={(e) => setForm((s) => ({ ...s, max_discount: e.target.value }))}
                  placeholder="VD 50000"
                  disabled={form.type !== "percent"}
                />
              </div>

              <div>
                <label>GiÃ¡ trá»‹ tá»‘i thiá»ƒu Ä‘Æ¡n</label>
                <input
                  type="number"
                  className="input"
                  value={form.min_order_total}
                  onChange={(e) => setForm((s) => ({ ...s, min_order_total: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>

              <div>
                <label>Giá»›i háº¡n tá»•ng lÆ°á»£t</label>
                <input
                  type="number"
                  className="input"
                  value={form.usage_limit}
                  onChange={(e) => setForm((s) => ({ ...s, usage_limit: e.target.value }))}
                  placeholder="Ä‘á»ƒ trá»‘ng = khÃ´ng giá»›i háº¡n"
                />
              </div>

              <div>
                <label>Giá»›i háº¡n má»—i user</label>
                <input
                  type="number"
                  className="input"
                  value={form.per_user_limit}
                  onChange={(e) => setForm((s) => ({ ...s, per_user_limit: Number(e.target.value) }))}
                  placeholder="1"
                />
              </div>

              <div>
                <label>Báº¯t Ä‘áº§u</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={form.start_at}
                  onChange={(e) => setForm((s) => ({ ...s, start_at: e.target.value }))}
                />
              </div>

              <div>
                <label>Káº¿t thÃºc</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={form.end_at}
                  onChange={(e) => setForm((s) => ({ ...s, end_at: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  id="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.checked }))}
                />
                <label htmlFor="is_active">KÃ­ch hoáº¡t</label>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <button className="btn" onClick={() => setModalOpen(false)}>ÄÃ³ng</button>
              <button className="btn btn-primary" onClick={saveForm} disabled={loading}>
                {editing ? "LÆ°u thay Ä‘á»•i" : "Táº¡o mÃ£"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


