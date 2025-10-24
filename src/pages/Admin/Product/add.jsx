// src/pages/Admin/Product/AddProduct.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function AddProduct() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    brand_id: "",
    category_id: "",
    price_root: "",
    price_sale: "",
    qty: "",
    status: "active",
    description: "",
    detail: "",
  });

  const [thumb, setThumb] = useState(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  /* ========= Load categories ========= */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/categories`, {
          headers: { Accept: "application/json" },
        });
        const j = await r.json();
        setCategories(Array.isArray(j) ? j : j.data ?? []);
      } catch (e) {
        console.error("KhÃ´ng táº£i Ä‘Æ°á»£c danh má»¥c", e);
      }
    })();
  }, []);

  /* ========= Load brands ========= */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/brands?status=active`, {
          headers: { Accept: "application/json" },
        });
        const ct = r.headers.get("content-type") || "";
        const raw = await r.text();
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${raw.slice(0, 200)}`);
        if (!ct.includes("application/json"))
          throw new Error(`Server khÃ´ng tráº£ JSON: ${raw.slice(0, 200)}`);
        const j = JSON.parse(raw);
        setBrands(Array.isArray(j) ? j : j.data ?? []);
      } catch (e) {
        console.error("KhÃ´ng táº£i Ä‘Æ°á»£c thÆ°Æ¡ng hiá»‡u", e);
        setBrands([]);
      }
    })();
  }, []);

  /* ========= Form handlers ========= */
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Auto slug náº¿u slug Ä‘ang trá»‘ng
    if (name === "name" && !form.slug) {
      const s = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setForm((f) => ({ ...f, slug: s }));
    }
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    setThumb(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  /* ========= Submit ========= */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      if (!form.category_id) throw new Error("Vui lÃ²ng chá»n danh má»¥c");
      if (!form.brand_id) throw new Error("Vui lÃ²ng chá»n thÆ°Æ¡ng hiá»‡u");

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (thumb) fd.append("thumbnail", thumb, thumb.name); // ðŸ‘ˆ quan trá»ng

      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: "POST",
        body: fd,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          // â›” KHÃ”NG set Content-Type, Ä‘á»ƒ trÃ¬nh duyá»‡t tá»± sinh boundary
        },
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`HTTP ${res.status} - ${t}`);
      }

      // Reset form
      setForm({
        name: "",
        slug: "",
        brand_id: "",
        category_id: "",
        price_root: "",
        price_sale: "",
        qty: "",
        status: "active",
        description: "",
        detail: "",
      });
      setThumb(null);
      setPreview("");

      nav("/admin/products");
    } catch (e) {
      console.error(e);
      setErr(e.message || "KhÃ´ng thÃªm Ä‘Æ°á»£c sáº£n pháº©m. Vui lÃ²ng kiá»ƒm tra dá»¯ liá»‡u.");
    } finally {
      setLoading(false);
    }
  };

  /* ========= TinyMCE config ========= */
  const TINY_INIT = {
    menubar: false,
    height: 280,
    plugins:
      "advlist autolink lists link image charmap preview anchor " +
      "searchreplace visualblocks code insertdatetime media table paste wordcount",
    toolbar:
      "undo redo | bold italic underline forecolor backcolor | " +
      "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
    branding: false,
    statusbar: false,
    toolbar_mode: "sliding",
    content_style: `
      body{font-family: Arial, sans-serif; font-size:15px; color:#111; margin:10px}
      p{margin:0}
    `,
  };

  return (
    <section style={{ padding: 20 }}>
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 16, fontWeight: 700 }}>
          ThÃªm sáº£n pháº©m
        </h1>

        {err && <p style={{ color: "red", marginBottom: 12 }}>{err}</p>}

        {/* ðŸ”§ encType Ä‘á»ƒ upload file */}
        <form onSubmit={submit} encType="multipart/form-data" style={{ display: "grid", gap: 12 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              alignItems: "start",
            }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              <span>TÃªn</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Slug</span>
              <input
                name="slug"
                value={form.slug}
                onChange={onChange}
                required
                style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>ThÆ°Æ¡ng hiá»‡u</span>
              <select
                name="brand_id"
                value={form.brand_id}
                onChange={onChange}
                required
                style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              >
                <option value="">-- chá»n thÆ°Æ¡ng hiá»‡u --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Danh má»¥c</span>
              <select
                name="category_id"
                value={form.category_id}
                onChange={onChange}
                required
                style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              >
                <option value="">-- chá»n danh má»¥c --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>GiÃ¡ gá»‘c</span>
              <input
                name="price_root"
                type="number"
                min="0"
                value={form.price_root}
                onChange={onChange}
                required
                style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>GiÃ¡ sale</span>
              <input
                name="price_sale"
                type="number"
                min="0"
                value={form.price_sale}
                onChange={onChange}
                style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Tá»“n kho</span>
              <input
                name="qty"
                type="number"
                min="0"
                value={form.qty}
                onChange={onChange}
                style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Tráº¡ng thÃ¡i</span>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8 }}
              >
                <option value="active">Hiá»ƒn thá»‹</option>
                <option value="draft">NhÃ¡p</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>áº¢nh Ä‘áº¡i diá»‡n</span>
              {/* ðŸ‘‡ Quan trá»ng: cÃ³ name="thumbnail" */}
              <input type="file" name="thumbnail" accept="image/*" onChange={onFile} />
            </label>
          </div>

          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{ width: 180, height: 130, objectFit: "cover", borderRadius: 10, border: "1px solid #eee" }}
            />
          )}

          <label style={{ display: "grid", gap: 6 }}>
            <span>MÃ´ táº£</span>
            <Editor
              apiKey="43suu6t6wy8vgq44sgpw0vsnwdodva8jlalw6zys9ckjhs56"
              init={TINY_INIT}
              value={form.description}
              onEditorChange={(html) => setForm((f) => ({ ...f, description: html }))}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Chi tiáº¿t</span>
            <Editor
              apiKey="43suu6t6wy8vgq44sgpw0vsnwdodva8jlalw6zys9ckjhs56"
              init={{ ...TINY_INIT, height: 360 }}
              value={form.detail}
              onEditorChange={(html) => setForm((f) => ({ ...f, detail: html }))}
            />
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => nav("/admin/products")}
              style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #999", background: "transparent" }}
            >
              Há»§y
            </button>
            <button
              disabled={loading}
              type="submit"
              style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #0f62fe", background: "#0f62fe", color: "#fff" }}
            >
              {loading ? "Äang lÆ°uâ€¦" : "LÆ°u sáº£n pháº©m"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}


