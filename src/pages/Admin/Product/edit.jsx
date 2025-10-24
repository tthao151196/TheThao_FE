// // src/pages/Admin/Product/edit.jsx
// import { useState, useEffect, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const API_BASE = "http://127.0.0.1:8000/api";

// export default function EditProduct() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const token = useMemo(() => localStorage.getItem("admin_token") || "", []);

//   const [form, setForm] = useState({
//     name: "",
//     slug: "",
//     brand_id: "",
//     category_id: "",
//     price_root: "",
//     price_sale: "",
//     qty: "",
//     detail: "",
//     description: "",
//     status: 1,
//     thumbnail: null, // file
//   });

//   const [preview, setPreview] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // âœ… Load danh má»¥c & thÆ°Æ¡ng hiá»‡u
//   useEffect(() => {
//     (async () => {
//       try {
//         const [rc, rb] = await Promise.all([
//           fetch(`${API_BASE}/categories`),
//           fetch(`${API_BASE}/brands?status=active`),
//         ]);
//         const jc = await rc.json().catch(() => ({}));
//         const jb = await rb.json().catch(() => ({}));
//         setCategories(Array.isArray(jc) ? jc : jc.data ?? []);
//         setBrands(Array.isArray(jb) ? jb : jb.data ?? []);
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, []);

//   // âœ… Load thÃ´ng tin sáº£n pháº©m
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/admin/products/${id}`, {
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           if (res.status === 401)
//             throw new Error("Báº¡n chÆ°a Ä‘Äƒng nháº­p hoáº·c token háº¿t háº¡n");
//           throw new Error("KhÃ´ng láº¥y Ä‘Æ°á»£c dá»¯ liá»‡u sáº£n pháº©m");
//         }

//         const json = await res.json();
//         const data = json.data || json; // âœ… Láº¥y Ä‘Ãºng pháº§n 'data' cá»§a response

//         setForm((prev) => ({
//           ...prev,
//           name: data.name || "",
//           slug: data.slug || "",
//           brand_id: data.brand_id ?? "",
//           category_id: data.category_id ?? "",
//           price_root: data.price_root ?? "",
//           price_sale: data.price_sale ?? "",
//           qty: data.qty ?? "",
//           detail: data.detail ?? "",
//           description: data.description ?? "",
//           status: data.status ?? 1,
//           thumbnail: null,
//         }));

//         setPreview(data.thumbnail_url || null);
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "KhÃ´ng táº£i Ä‘Æ°á»£c dá»¯ liá»‡u sáº£n pháº©m");
//       }
//     };
//     fetchProduct();
//   }, [id, token]);

//   // âœ… Xá»­ lÃ½ thay Ä‘á»•i input
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((s) => ({ ...s, [name]: value }));
//     if (name === "name" && !form.slug) {
//       const slug = value
//         .toLowerCase()
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "")
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/(^-|-$)/g, "");
//       setForm((s) => ({ ...s, slug }));
//     }
//   };

//   // âœ… Xá»­ lÃ½ upload file + preview
//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     setForm((s) => ({ ...s, thumbnail: file || null }));
//     setPreview(file ? URL.createObjectURL(file) : preview);
//   };

//   // âœ… Gá»­i cáº­p nháº­t sáº£n pháº©m
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const fd = new FormData();

//       const payload = {
//         ...form,
//         status: String(form.status) === "0" ? 0 : 1,
//       };

//       Object.entries(payload).forEach(([k, v]) => {
//         if (v !== null && v !== "") {
//           if (k === "thumbnail" && v) fd.append("thumbnail", v);
//           else fd.append(k, v);
//         }
//       });
//       fd.append("_method", "PUT");

//       const res = await fetch(`${API_BASE}/admin/products/${id}`, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: fd,
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data.message || "Cáº­p nháº­t tháº¥t báº¡i");

//       setSuccess("âœ… Cáº­p nháº­t sáº£n pháº©m thÃ nh cÃ´ng!");
//       setTimeout(() => navigate("/admin/products"), 900);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "CÃ³ lá»—i xáº£y ra");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section style={{ padding: 20 }}>
//       <div
//         style={{
//           background: "white",
//           borderRadius: 12,
//           padding: 20,
//           boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
//           maxWidth: 980,
//           margin: "0 auto",
//         }}
//       >
//         <h1 style={{ fontSize: 24, marginBottom: 16, fontWeight: 700 }}>
//           Chá»‰nh sá»­a sáº£n pháº©m
//         </h1>

//         {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
//         {success && <p style={{ color: "green", marginBottom: 12 }}>{success}</p>}

//         <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 12,
//               alignItems: "start",
//             }}
//           >
//             <label style={{ display: "grid", gap: 6 }}>
//               <span>TÃªn sáº£n pháº©m</span>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 style={{
//                   height: 36,
//                   padding: "0 10px",
//                   border: "1px solid #ddd",
//                   borderRadius: 8,
//                 }}
//               />
//             </label>

//             <label style={{ display: "grid", gap: 6 }}>
//               <span>Slug</span>
//               <input
//                 type="text"
//                 name="slug"
//                 value={form.slug}
//                 onChange={handleChange}
//                 style={{
//                   height: 36,
//                   padding: "0 10px",
//                   border: "1px solid #ddd",
//                   borderRadius: 8,
//                 }}
//               />
//             </label>

//             {/* Brand */}
//             <label style={{ display: "grid", gap: 6 }}>
//               <span>ThÆ°Æ¡ng hiá»‡u</span>
//               <select
//                 name="brand_id"
//                 value={form.brand_id ?? ""}
//                 onChange={handleChange}
//                 style={{
//                   height: 36,
//                   padding: "0 10px",
//                   border: "1px solid #ddd",
//                   borderRadius: 8,
//                 }}
//               >
//                 <option value="">-- chá»n thÆ°Æ¡ng hiá»‡u --</option>
//                 {brands.map((b) => (
//                   <option key={b.id} value={b.id}>
//                     {b.name}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             {/* Category */}
//             <label style={{ display: "grid", gap: 6 }}>
//               <span>Danh má»¥c</span>
//               <select
//                 name="category_id"
//                 value={form.category_id ?? ""}
//                 onChange={handleChange}
//                 style={{
//                   height: 36,
//                   padding: "0 10px",
//                   border: "1px solid #ddd",
//                   borderRadius: 8,
//                 }}
//               >
//                 <option value="">-- chá»n danh má»¥c --</option>
//                 {categories.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             {/* GiÃ¡ gá»‘c */}
//             <label style={{ display: "grid", gap: 6 }}>
//               <span>GiÃ¡ gá»‘c</span>
//               <input
//                 type="number"
//                 name="price_root"
//                 value={form.price_root}
//                 onChange={handleChange}
//                 min="0"
//                 style={{
//                   height: 36,
//                   padding: "0 10px",
//                   border: "1px solid #ddd",
//                   borderRadius: 8,
//                 }}
//               />
//             </label>

//             {/* GiÃ¡ sale */}
//             <label style={{ display: "grid", gap: 6 }}>
//               <span>GiÃ¡ sale</span>
//               <input
//                 type="number"
//                 name="price_sale"
//                 value={form.price_sale}
//                 onChange={handleChange}
//                 min="0"
//                 style={{
//                   height: 36,
//                   padding: "0 10px",
//                   border: "1px solid #ddd",
//                   borderRadius: 8,
//                 }}
//               />
//             </label>

//             {/* Tá»“n kho */}
//             <label style={{ display: "grid", gap: 6 }}>
//               <span>Tá»“n kho</span>
//               <input
//                 type="number"
//                 name="qty"
//                 value={form.qty}
//                 onChange={handleChange}
//                 min="0"
//                 style={{
//                   height: 36,
//                   padding: "0 10px",
//                   border: "1px solid #ddd",
//                   borderRadius: 8,
//                 }}
//               />
//             </label>

//             {/* Tráº¡ng thÃ¡i */}
//             <label style={{ display: "grid", gap: 6 }}>
//               <span>Tráº¡ng thÃ¡i</span>
//               <select
//                 name="status"
//                 value={form.status}
//                 onChange={handleChange}
//                 style={{
//                   height: 36,
//                   padding: "0 10px",
//                   border: "1px solid #ddd",
//                   borderRadius: 8,
//                 }}
//               >
//                 <option value={1}>Hiá»ƒn thá»‹</option>
//                 <option value={0}>áº¨n</option>
//               </select>
//             </label>

//             {/* áº¢nh sáº£n pháº©m */}
//             <label style={{ display: "grid", gap: 6 }}>
//               <span>áº¢nh sáº£n pháº©m</span>
//               <input type="file" accept="image/*" onChange={handleFile} />
//             </label>
//           </div>

//           {preview && (
//             <img
//               src={preview}
//               alt="preview"
//               style={{
//                 width: 180,
//                 height: 130,
//                 objectFit: "cover",
//                 borderRadius: 10,
//                 border: "1px solid #eee",
//               }}
//             />
//           )}

//           <label style={{ display: "grid", gap: 6 }}>
//             <span>MÃ´ táº£</span>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               rows={4}
//               style={{
//                 padding: 10,
//                 border: "1px solid #ddd",
//                 borderRadius: 8,
//               }}
//             />
//           </label>

//           <label style={{ display: "grid", gap: 6 }}>
//             <span>Chi tiáº¿t</span>
//             <textarea
//               name="detail"
//               value={form.detail}
//               onChange={handleChange}
//               rows={4}
//               style={{
//                 padding: 10,
//                 border: "1px solid #ddd",
//                 borderRadius: 8,
//               }}
//             />
//           </label>

//           <div style={{ display: "flex", gap: 8 }}>
//             <button
//               type="button"
//               onClick={() => navigate("/admin/products")}
//               style={{
//                 padding: "8px 12px",
//                 borderRadius: 8,
//                 border: "1px solid #999",
//                 background: "transparent",
//                 cursor: "pointer",
//               }}
//             >
//               Há»§y
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 padding: "8px 12px",
//                 borderRadius: 8,
//                 border: "1px solid #0f62fe",
//                 background: "#0f62fe",
//                 color: "#fff",
//                 cursor: "pointer",
//               }}
//             >
//               {loading ? "Äang lÆ°uâ€¦" : "Cáº­p nháº­t"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// }



// src/pages/Admin/Product/EditProduct.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react"; // âœ… TinyMCE Editor

const API_BASE = "http://127.0.0.1:8000/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("admin_token") || "", []);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    brand_id: "",
    category_id: "",
    price_root: "",
    price_sale: "",
    qty: "",
    detail: "",
    description: "",
    status: 1,
    thumbnail: null,
  });

  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // âœ… Load danh má»¥c & thÆ°Æ¡ng hiá»‡u
  useEffect(() => {
    (async () => {
      try {
        const [rc, rb] = await Promise.all([
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/brands?status=active`),
        ]);
        const jc = await rc.json().catch(() => ({}));
        const jb = await rb.json().catch(() => ({}));
        setCategories(Array.isArray(jc) ? jc : jc.data ?? []);
        setBrands(Array.isArray(jb) ? jb : jb.data ?? []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // âœ… Load thÃ´ng tin sáº£n pháº©m
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/products/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401)
            throw new Error("Báº¡n chÆ°a Ä‘Äƒng nháº­p hoáº·c token háº¿t háº¡n");
          throw new Error("KhÃ´ng láº¥y Ä‘Æ°á»£c dá»¯ liá»‡u sáº£n pháº©m");
        }

        const json = await res.json();
        const data = json.data || json;

        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          slug: data.slug || "",
          brand_id: data.brand_id ?? "",
          category_id: data.category_id ?? "",
          price_root: data.price_root ?? "",
          price_sale: data.price_sale ?? "",
          qty: data.qty ?? "",
          detail: data.detail ?? "",
          description: data.description ?? "",
          status: data.status ?? 1,
          thumbnail: null,
        }));

        setPreview(data.thumbnail_url || null);
      } catch (err) {
        console.error(err);
        setError(err.message || "KhÃ´ng táº£i Ä‘Æ°á»£c dá»¯ liá»‡u sáº£n pháº©m");
      }
    };
    fetchProduct();
  }, [id, token]);

  // âœ… Xá»­ lÃ½ thay Ä‘á»•i input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (name === "name" && !form.slug) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setForm((s) => ({ ...s, slug }));
    }
  };

  // âœ… Upload file + preview
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setForm((s) => ({ ...s, thumbnail: file || null }));
    setPreview(file ? URL.createObjectURL(file) : preview);
  };

  // âœ… Gá»­i cáº­p nháº­t sáº£n pháº©m
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      const payload = {
        ...form,
        status: String(form.status) === "0" ? 0 : 1,
      };

      Object.entries(payload).forEach(([k, v]) => {
        if (v !== null && v !== "") {
          if (k === "thumbnail" && v) fd.append("thumbnail", v);
          else fd.append(k, v);
        }
      });
      fd.append("_method", "PUT");

      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Cáº­p nháº­t tháº¥t báº¡i");

      setSuccess("âœ… Cáº­p nháº­t sáº£n pháº©m thÃ nh cÃ´ng!");
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || "CÃ³ lá»—i xáº£y ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: 20 }}>
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 16, fontWeight: 700 }}>
          Chá»‰nh sá»­a sáº£n pháº©m
        </h1>

        {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: 12 }}>{success}</p>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              alignItems: "start",
            }}
          >
            {/* TÃªn vÃ  Slug */}
            <label style={{ display: "grid", gap: 6 }}>
              <span>TÃªn sáº£n pháº©m</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Slug</span>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </label>

            {/* Brand */}
            <label style={{ display: "grid", gap: 6 }}>
              <span>ThÆ°Æ¡ng hiá»‡u</span>
              <select
                name="brand_id"
                value={form.brand_id ?? ""}
                onChange={handleChange}
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              >
                <option value="">-- chá»n thÆ°Æ¡ng hiá»‡u --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Category */}
            <label style={{ display: "grid", gap: 6 }}>
              <span>Danh má»¥c</span>
              <select
                name="category_id"
                value={form.category_id ?? ""}
                onChange={handleChange}
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              >
                <option value="">-- chá»n danh má»¥c --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            {/* GiÃ¡ gá»‘c / GiÃ¡ sale */}
            <label style={{ display: "grid", gap: 6 }}>
              <span>GiÃ¡ gá»‘c</span>
              <input
                type="number"
                name="price_root"
                value={form.price_root}
                onChange={handleChange}
                min="0"
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>GiÃ¡ sale</span>
              <input
                type="number"
                name="price_sale"
                value={form.price_sale}
                onChange={handleChange}
                min="0"
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </label>

            {/* Tá»“n kho */}
            <label style={{ display: "grid", gap: 6 }}>
              <span>Tá»“n kho</span>
              <input
                type="number"
                name="qty"
                value={form.qty}
                onChange={handleChange}
                min="0"
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </label>

            {/* Tráº¡ng thÃ¡i */}
            <label style={{ display: "grid", gap: 6 }}>
              <span>Tráº¡ng thÃ¡i</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              >
                <option value={1}>Hiá»ƒn thá»‹</option>
                <option value={0}>áº¨n</option>
              </select>
            </label>

            {/* áº¢nh */}
            <label style={{ display: "grid", gap: 6 }}>
              <span>áº¢nh sáº£n pháº©m</span>
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>
          </div>

          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: 180,
                height: 130,
                objectFit: "cover",
                borderRadius: 10,
                border: "1px solid #eee",
              }}
            />
          )}

          {/* âœ… MÃ” Táº¢ - TinyMCE Editor */}
          <label style={{ display: "grid", gap: 6 }}>
            <span>MÃ´ táº£</span>
            <Editor
              apiKey="43suu6t6wy8vgq44sgpw0vsnwdodva8jlalw6zys9ckjhs56"
              value={form.description}
              onEditorChange={(val) => setForm((s) => ({ ...s, description: val }))}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist", "autolink", "lists", "link", "image", "charmap",
                  "preview", "anchor", "searchreplace", "visualblocks", "code",
                  "fullscreen", "insertdatetime", "media", "table", "help", "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                content_style: "body { font-family:Montserrat,sans-serif; font-size:14px }",
              }}
            />
          </label>

          {/* Chi tiáº¿t */}
          <label style={{ display: "grid", gap: 6 }}>
            <span>Chi tiáº¿t</span>
            <textarea
              name="detail"
              value={form.detail}
              onChange={handleChange}
              rows={4}
              style={{
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            />
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #999",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Há»§y
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #0f62fe",
                background: "#0f62fe",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {loading ? "Äang lÆ°uâ€¦" : "Cáº­p nháº­t"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}


