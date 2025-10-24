import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

const HOST = "http://127.0.0.1:8000";
const API_BASE = `${HOST}/api`;
const IMG_FALLBACK = "https://placehold.co/120x90?text=No+Img";

// Render mô tả HTML an toàn + preview ngắn gọn (~3 dòng)
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
  const [selected, setSelected] = useState([]); // ✅ Danh sách tick
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

        // Chuẩn hóa nhẹ ảnh (nếu BE trả 'image' thì tự tạo url)
        const normalized = list.map((c) => ({
          ...c,
          image_url: c.image_url || (c.image ? `${HOST}/storage/${c.image}` : null),
        }));

        setRows(normalized);
      } catch (e) {
        if (e.name !== "AbortError") setErr("Không tải được danh mục.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // ✅ Xóa (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm(`Xóa danh mục #${id}?`)) return;
    try {
      const token = localStorage.getItem("admin_token") || "";
      if (!token) {
        alert("Bạn cần đăng nhập admin để xóa.");
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
        const msg = payload?.message || `Xóa thất bại (HTTP ${res.status})`;
        throw new Error(msg);
      }

      setRows((prev) => prev.filter((x) => x.id !== id));
      setSelected((prev) => prev.filter((x) => x !== id));
    } catch (e) {
      console.error(e);
      alert(e.message || "Không xóa được danh mục.");
    }
  };

  // ✅ Xóa nhiều mục đã chọn
  const handleBulkDelete = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Chuyển ${selected.length} danh mục vào thùng rác?`)) return;

    // Thực hiện tuần tự để đơn giản (có thể tối ưu song song nếu cần)
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
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Quản lý danh mục</h1>
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
            + Thêm
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
            🗑️ Thùng rác
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
              Xóa đã chọn ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* ==== Table ==== */}
      {loading && <p>Đang tải dữ liệu…</p>}
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
                <th align="left">Tên</th>
                <th align="left">Slug</th>
                <th align="center">Ảnh</th>
                <th align="left">Mô tả</th>
                <th align="center">Hành động</th>
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
                    {/* ✅ render HTML an toàn thay vì hiển thị chuỗi thô */}
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
                      Sửa
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
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={7} align="center" style={{ padding: 18, color: "#777" }}>
                    Trống
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
