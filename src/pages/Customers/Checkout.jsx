// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const API_BASE = "http://127.0.0.1:8000";

// export default function Checkout({ setCart }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // âœ… nháº­n dá»¯ liá»‡u cart tá»« Cart.jsx
//   const cart = location.state?.cart || [];

//   const [form, setForm] = useState({
//     customer_name: "",
//     phone: "",
//     email: "",
//     address: "",
//     note: "",
//     payment_method: "MoMo_QR", // COD | Bank | MoMo_QR | MoMo_CARD
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ====== COUPON STATE ======
//   const [couponCode, setCouponCode] = useState("");
//   const [couponResult, setCouponResult] = useState({
//     applied: false,
//     discount: 0,
//     message: "",
//     code: "",
//   });

//   // TÃ­nh tiá»n
//   const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
//   const total = Math.max(0, subtotal - (couponResult.discount || 0));

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((s) => ({ ...s, [name]: value }));
//   };

//   // ====== ÃP MÃƒ GIáº¢M GIÃ ======
//   async function applyCoupon() {
//     if (!couponCode.trim()) {
//       return setCouponResult({
//         applied: false,
//         discount: 0,
//         message: "Vui lÃ²ng nháº­p mÃ£.",
//         code: "",
//       });
//     }
//     setCouponResult((s) => ({ ...s, message: "Äang kiá»ƒm tra..." }));
//     try {
//       const res = await fetch(`${API_BASE}/api/coupons/validate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         },
//         body: JSON.stringify({
//           code: couponCode.trim(),
//           subtotal, // gá»­i táº¡m tÃ­nh Ä‘á»ƒ BE tÃ­nh giáº£m
//         }),
//       });
//       const data = await res.json();
//       if (res.ok && data?.valid) {
//         setCouponResult({
//           applied: true,
//           discount: Number(data.discount || 0),
//           message: `Ãp dá»¥ng mÃ£ ${data.code} thÃ nh cÃ´ng.`,
//           code: data.code,
//         });
//       } else {
//         setCouponResult({
//           applied: false,
//           discount: 0,
//           message: data?.message || "MÃ£ khÃ´ng há»£p lá»‡.",
//           code: "",
//         });
//       }
//     } catch (e) {
//       setCouponResult({
//         applied: false,
//         discount: 0,
//         message: "KhÃ´ng thá»ƒ kiá»ƒm tra mÃ£. Thá»­ láº¡i sau.",
//         code: "",
//       });
//     }
//   }

//   async function placeOrderCODorBank() {
//     const res = await fetch(`${API_BASE}/api/checkout`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//       },
//       body: JSON.stringify({
//         ...form,
//         items: cart,
//         // gá»­i kÃ¨m cho BE (náº¿u BE cÃ³ há»— trá»£)
//         coupon_code: couponResult.applied ? (couponResult.code || couponCode.trim()) : null,
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       const orderCode =
//         data?.code ||
//         data?.order_code ||
//         data?.order?.code ||
//         data?.order_id ||
//         data?.id;

//       alert("âœ… Äáº·t hÃ ng thÃ nh cÃ´ng!" + (orderCode ? " MÃ£ Ä‘Æ¡n: " + orderCode : ""));
//       if (orderCode) localStorage.setItem("last_order_code", String(orderCode));

//       // xÃ³a giá» (state + localStorage)
//       setCart([]);
//       localStorage.setItem("cart", "[]");
//       window.dispatchEvent(new Event("cart:clear"));
//       window.dispatchEvent(new CustomEvent("cart-changed", { detail: 0 }));

//       if (orderCode) {
//         navigate(`/track?code=${encodeURIComponent(orderCode)}`, { replace: true });
//       } else {
//         navigate("/track", { replace: true });
//       }
//     } else {
//       throw new Error(data?.message || "CÃ³ lá»—i xáº£y ra.");
//     }
//   }

//   async function createMoMoSession() {
//     const momo_type = form.payment_method === "MoMo_CARD" ? "card" : "qr";

//     const res = await fetch(`${API_BASE}/api/payments/momo/create`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//       },
//       body: JSON.stringify({
//         name: form.customer_name,
//         phone: form.phone,
//         email: form.email,
//         address: form.address,
//         note: form.note,
//         amount: total, // âœ… gá»­i tá»•ng sau giáº£m
//         items: cart,
//         momo_type, // ðŸ‘ˆ gá»­i loáº¡i QR/card vá» BE
//         coupon_code: couponResult.applied ? (couponResult.code || couponCode.trim()) : null, // âœ… gá»­i mÃ£
//       }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data?.message || "KhÃ´ng táº¡o Ä‘Æ°á»£c phiÃªn thanh toÃ¡n MoMo.");

//     // ðŸ‘‡ LÆ°u thÃ´ng tin Ä‘á»ƒ xá»­ lÃ½ khi quay vá»
//     const moOrderCode = data?.momo?.orderId || data?.orderId;
//     const orderId = data?.order_id;
//     if (moOrderCode) localStorage.setItem("momo_last_order_code", moOrderCode);
//     if (orderId) localStorage.setItem("momo_last_order_id", String(orderId));
//     localStorage.setItem("cart_backup", JSON.stringify(cart)); // phÃ²ng khi fail thÃ¬ khÃ´i phá»¥c

//     const payUrl = data?.momo?.payUrl || data?.payUrl || data?.momo?.deeplink;
//     if (!payUrl) throw new Error("Thiáº¿u payUrl tá»« MoMo.");

//     window.location.href = payUrl;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (cart.length === 0) return setError("Giá» hÃ ng Ä‘ang trá»‘ng.");
//     if (!form.customer_name || !form.phone || !form.email || !form.address)
//       return setError("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin giao hÃ ng.");

//     setLoading(true);
//     setError("");

//     try {
//       if (form.payment_method.startsWith("MoMo")) {
//         await createMoMoSession(); // âœ… cáº£ QR & Card Ä‘á»u Ä‘i lá»‘i nÃ y
//       } else {
//         await placeOrderCODorBank();
//       }
//     } catch (err) {
//       setError(err?.message || "KhÃ´ng thá»ƒ káº¿t ná»‘i mÃ¡y chá»§.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 800, margin: "30px auto", padding: 20 }}>
//       <h2 style={{ marginBottom: 20, color: "#388e3c" }}>ðŸ§¾ Thanh toÃ¡n</h2>

//       {cart.length === 0 ? (
//         <p>âš ï¸ Giá» hÃ ng cá»§a báº¡n Ä‘ang trá»‘ng, vui lÃ²ng quay láº¡i chá»n sáº£n pháº©m.</p>
//       ) : (
//         <>
//           {error && (
//             <p
//               style={{
//                 color: "#d32f2f",
//                 background: "#fdecea",
//                 padding: "10px 12px",
//                 borderRadius: 8,
//                 marginBottom: 16,
//               }}
//             >
//               {error}
//             </p>
//           )}

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "2fr 1fr",
//               gap: 20,
//               alignItems: "flex-start",
//             }}
//           >
//             {/* Form thÃ´ng tin */}
//             <form
//               onSubmit={handleSubmit}
//               style={{
//                 background: "#fff",
//                 padding: 20,
//                 borderRadius: 12,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//               }}
//             >
//               <h3 style={{ marginBottom: 16 }}>ThÃ´ng tin khÃ¡ch hÃ ng</h3>

//               <div style={{ marginBottom: 12 }}>
//                 <label>Há» vÃ  tÃªn</label>
//                 <input
//                   name="customer_name"
//                   value={form.customer_name}
//                   onChange={handleChange}
//                   required
//                   style={{ width: "100%", padding: 10 }}
//                 />
//               </div>

//               <div style={{ marginBottom: 12 }}>
//                 <label>Sá»‘ Ä‘iá»‡n thoáº¡i</label>
//                 <input
//                   name="phone"
//                   value={form.phone}
//                   onChange={handleChange}
//                   required
//                   style={{ width: "100%", padding: 10 }}
//                 />
//               </div>

//               <div style={{ marginBottom: 12 }}>
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                   style={{ width: "100%", padding: 10 }}
//                 />
//               </div>

//               <div style={{ marginBottom: 12 }}>
//                 <label>Äá»‹a chá»‰ giao hÃ ng</label>
//                 <textarea
//                   name="address"
//                   value={form.address}
//                   onChange={handleChange}
//                   required
//                   rows={3}
//                   style={{ width: "100%", padding: 10 }}
//                 />
//               </div>

//               <div style={{ marginBottom: 12 }}>
//                 <label>Ghi chÃº (tuá»³ chá»n)</label>
//                 <textarea
//                   name="note"
//                   value={form.note}
//                   onChange={handleChange}
//                   rows={2}
//                   style={{ width: "100%", padding: 10 }}
//                 />
//               </div>

//               <div style={{ marginBottom: 20 }}>
//                 <label>PhÆ°Æ¡ng thá»©c thanh toÃ¡n</label>
//                 <select
//                   name="payment_method"
//                   value={form.payment_method}
//                   onChange={handleChange}
//                   style={{ width: "100%", padding: 10 }}
//                 >
//                   <option value="COD">Thanh toÃ¡n khi nháº­n hÃ ng</option>
//                   <option value="MoMo_QR">MoMo (QR)</option>
//                   <option value="MoMo_CARD">MoMo (Tháº»/ATM)</option>
//                 </select>
//                 {form.payment_method.startsWith("MoMo") && (
//                   <p style={{ fontSize: 12, color: "#555", marginTop: 6 }}>
//                     Báº¡n sáº½ Ä‘Æ°á»£c chuyá»ƒn sang cá»•ng MoMo Ä‘á»ƒ thanh toÃ¡n an toÃ n.
//                   </p>
//                 )}
//               </div>

//               {/* Ã” nháº­p mÃ£ giáº£m giÃ¡ */}
//               <div
//                 style={{
//                   marginBottom: 16,
//                   padding: 12,
//                   border: "1px dashed #ddd",
//                   borderRadius: 10,
//                   background: "#fafafa",
//                 }}
//               >
//                 <label style={{ display: "block", marginBottom: 8 }}>
//                   MÃ£ giáº£m giÃ¡
//                 </label>
//                 <div style={{ display: "flex", gap: 8 }}>
//                   <input
//                     placeholder="Nháº­p mÃ£ (VD: ABC10)"
//                     value={couponCode}
//                     onChange={(e) => setCouponCode(e.target.value)}
//                     style={{ flex: 1, padding: 10 }}
//                   />
//                   <button
//                     type="button"
//                     onClick={applyCoupon}
//                     style={{
//                       padding: "10px 14px",
//                       borderRadius: 8,
//                       border: "none",
//                       background: "#4f46e5",
//                       color: "#fff",
//                       fontWeight: 600,
//                       cursor: "pointer",
//                     }}
//                   >
//                     Ãp dá»¥ng
//                   </button>
//                 </div>
//                 {couponResult.message && (
//                   <p style={{ marginTop: 8, fontSize: 13 }}>{couponResult.message}</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 style={{
//                   width: "100%",
//                   padding: "12px 16px",
//                   background: "#388e3c",
//                   color: "#fff",
//                   fontWeight: 600,
//                   fontSize: 16,
//                   border: "none",
//                   borderRadius: 10,
//                   cursor: "pointer",
//                 }}
//               >
//                 {loading
//                   ? "â³ Äang xá»­ lÃ½..."
//                   : form.payment_method.startsWith("MoMo")
//                   ? "ðŸŸ£ Thanh toÃ¡n vá»›i MoMo"
//                   : "âœ… XÃ¡c nháº­n Ä‘áº·t hÃ ng"}
//               </button>
//             </form>

//             {/* ThÃ´ng tin giá» hÃ ng */}
//             <div
//               style={{
//                 background: "#fff",
//                 padding: 20,
//                 borderRadius: 12,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//               }}
//             >
//               <h3 style={{ marginBottom: 16 }}>ÄÆ¡n hÃ ng cá»§a báº¡n</h3>
//               <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//                 {cart.map((item) => (
//                   <li
//                     key={item.id}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       marginBottom: 10,
//                       borderBottom: "1px dashed #eee",
//                       paddingBottom: 6,
//                     }}
//                   >
//                     <span>
//                       {item.name} x {item.qty}
//                     </span>
//                     <span>{(item.price * item.qty).toLocaleString()} Ä‘</span>
//                   </li>
//                 ))}
//               </ul>

//               {/* TÃ­nh tiá»n chi tiáº¿t */}
//               <div style={{ marginTop: 12 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between" }}>
//                   <span>Táº¡m tÃ­nh</span>
//                   <strong>{subtotal.toLocaleString()} Ä‘</strong>
//                 </div>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
//                   <span>Giáº£m giÃ¡ {couponResult.applied && couponResult.code ? `(${couponResult.code})` : ""}</span>
//                   <strong>-{(couponResult.discount || 0).toLocaleString()} Ä‘</strong>
//                 </div>
//                 <h3
//                   style={{
//                     marginTop: 12,
//                     color: "#d32f2f",
//                     fontWeight: 700,
//                     fontSize: 18,
//                     textAlign: "right",
//                   }}
//                 >
//                   Tá»•ng cá»™ng: {total.toLocaleString()} Ä‘
//                 </h3>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";
const VND = new Intl.NumberFormat("vi-VN");

// Fallback mÃ£ (dÃ¹ng khi BE khÃ´ng cÃ³/Ä‘ang lá»—i)
const DEMO_COUPONS = [
  { code: "GIAM10K", type: "flat", value: 10000, min_order: 0 },
  { code: "GIAM20K", type: "flat", value: 20000, min_order: 0 },
  { code: "GIAM50K", type: "flat", value: 50000, min_order: 0 },
  { code: "GIAM10",  type: "percent", value: 10, max_discount: 50000, min_order: 100000 },
];

export default function Checkout({ setCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  // âœ… nháº­n dá»¯ liá»‡u cart tá»« Cart.jsx
  const cart = location.state?.cart || [];

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    payment_method: "MoMo_QR", // COD | Bank | MoMo_QR | MoMo_CARD
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ====== COUPON STATE ======
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState({
    applied: false,
    discount: 0,
    message: "",
    code: "",
  });

  // Danh sÃ¡ch mÃ£ Ä‘á»ƒ â€œxá»•â€; láº¥y tá»« BE, rá»›t thÃ¬ fallback DEMO_COUPONS
  const [couponList, setCouponList] = useState(DEMO_COUPONS);
  const [showList, setShowList] = useState(false);

  // TÃ­nh tiá»n
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = Math.max(0, subtotal - (couponResult.discount || 0));

  const fmt = (n) => VND.format(Number(n || 0));

  // Ä‘á»§ Ä‘iá»u kiá»‡n theo min_order
  const eligible = (c) => !c?.min_order || subtotal >= Number(c.min_order || 0);

  // ðŸ‘‰ Æ¯á»šC TÃNH GIáº¢M GIÃ (client) cho 1 mÃ£
  const estimateDiscount = (c) => {
    if (!eligible(c)) return 0;
    const type = c.type || c.discount_type || "flat";
    const val = Number(c.value || c.discount_value || 0);
    if (type === "percent") {
      const maxCap = Number(c.max_discount || Infinity);
      const d = Math.floor((subtotal * val) / 100);
      return Math.min(d, isFinite(maxCap) ? maxCap : d);
    }
    // flat
    return Math.min(val, subtotal); // khÃ´ng vÆ°á»£t quÃ¡ subtotal
  };

  // ðŸ‘‰ CHá»ŒN MÃƒ Tá»I Æ¯U: giáº£m nhiá»u nháº¥t; hÃ²a thÃ¬ Æ°u tiÃªn min_order tháº¥p hÆ¡n, sau Ä‘Ã³ Æ°u tiÃªn mÃ£ cÃ³ value cao hÆ¡n
  const bestCoupon = useMemo(() => {
    if (!couponList || couponList.length === 0) return null;
    const ranked = couponList
      .map((c) => ({ c, saving: estimateDiscount(c) }))
      .filter((x) => x.saving > 0)
      .sort((a, b) => {
        if (b.saving !== a.saving) return b.saving - a.saving;
        const aMin = Number(a.c.min_order || 0);
        const bMin = Number(b.c.min_order || 0);
        if (aMin !== bMin) return aMin - bMin;
        return Number((b.c.value || 0)) - Number((a.c.value || 0));
      });
    return ranked[0] ? { ...ranked[0].c, saving: ranked[0].saving } : null;
  }, [couponList, subtotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // ðŸ”Ž táº£i danh sÃ¡ch mÃ£ tá»« BE (náº¿u cÃ³)
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/coupons`);
        if (!r.ok) return; // giá»¯ fallback
        const data = await r.json();
        const list = Array.isArray(data) ? data : data.data ?? [];
        if (!ignore && list.length) setCouponList(list);
      } catch {}
    })();
    return () => { ignore = true; };
  }, []);

  // ====== ÃP MÃƒ GIáº¢M GIÃ ======
  async function applyCoupon() {
    if (!couponCode.trim()) {
      return setCouponResult({
        applied: false,
        discount: 0,
        message: "Vui lÃ²ng nháº­p hoáº·c chá»n mÃ£.",
        code: "",
      });
    }
    setCouponResult((s) => ({ ...s, message: "Äang kiá»ƒm tra..." }));
    try {
      const res = await fetch(`${API_BASE}/api/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal, // gá»­i táº¡m tÃ­nh Ä‘á»ƒ BE tÃ­nh giáº£m & kiá»ƒm tra Ä‘iá»u kiá»‡n
        }),
      });
      const data = await res.json();
      if (res.ok && data?.valid) {
        setCouponResult({
          applied: true,
          discount: Number(data.discount || 0),
          message: `Ãp dá»¥ng mÃ£ ${data.code} thÃ nh cÃ´ng.`,
          code: data.code,
        });
      } else {
        setCouponResult({
          applied: false,
          discount: 0,
          message: data?.message || "MÃ£ khÃ´ng há»£p lá»‡ hoáº·c khÃ´ng Ä‘á»§ Ä‘iá»u kiá»‡n.",
          code: "",
        });
      }
    } catch (e) {
      setCouponResult({
        applied: false,
        discount: 0,
        message: "KhÃ´ng thá»ƒ kiá»ƒm tra mÃ£. Thá»­ láº¡i sau.",
        code: "",
      });
    }
  }

  async function placeOrderCODorBank() {
    const res = await fetch(`${API_BASE}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({
        ...form,
        items: cart,
        coupon_code: couponResult.applied ? (couponResult.code || couponCode.trim()) : null,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      const orderCode =
        data?.code || data?.order_code || data?.order?.code || data?.order_id || data?.id;

      alert("âœ… Äáº·t hÃ ng thÃ nh cÃ´ng!" + (orderCode ? " MÃ£ Ä‘Æ¡n: " + orderCode : ""));
      if (orderCode) localStorage.setItem("last_order_code", String(orderCode));

      setCart([]);
      localStorage.setItem("cart", "[]");
      window.dispatchEvent(new Event("cart:clear"));
      window.dispatchEvent(new CustomEvent("cart-changed", { detail: 0 }));

      navigate(orderCode ? `/track?code=${encodeURIComponent(orderCode)}` : "/track", { replace: true });
    } else {
      throw new Error(data?.message || "CÃ³ lá»—i xáº£y ra.");
    }
  }

  async function createMoMoSession() {
    const momo_type = form.payment_method === "MoMo_CARD" ? "card" : "qr";

    const res = await fetch(`${API_BASE}/api/payments/momo/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({
        name: form.customer_name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        note: form.note,
        amount: total, // tá»•ng sau giáº£m
        items: cart,
        momo_type,
        coupon_code: couponResult.applied ? (couponResult.code || couponCode.trim()) : null,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "KhÃ´ng táº¡o Ä‘Æ°á»£c phiÃªn thanh toÃ¡n MoMo.");

    const moOrderCode = data?.momo?.orderId || data?.orderId;
    const orderId = data?.order_id;
    if (moOrderCode) localStorage.setItem("momo_last_order_code", moOrderCode);
    if (orderId) localStorage.setItem("momo_last_order_id", String(orderId));
    localStorage.setItem("cart_backup", JSON.stringify(cart));

    const payUrl = data?.momo?.payUrl || data?.payUrl || data?.momo?.deeplink;
    if (!payUrl) throw new Error("Thiáº¿u payUrl tá»« MoMo.");

    window.location.href = payUrl;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return setError("Giá» hÃ ng Ä‘ang trá»‘ng.");
    if (!form.customer_name || !form.phone || !form.email || !form.address)
      return setError("Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin giao hÃ ng.");

    setLoading(true);
    setError("");

    try {
      if (form.payment_method.startsWith("MoMo")) {
        await createMoMoSession();
      } else {
        await placeOrderCODorBank();
      }
    } catch (err) {
      setError(err?.message || "KhÃ´ng thá»ƒ káº¿t ná»‘i mÃ¡y chá»§.");
    } finally {
      setLoading(false);
    }
  };

  // helper UI nhá» cho chip
  const Chip = ({ children, style }) => (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, border: "1px dashed #f9a8d4", background: "#fff1f7", color: "#9d174d", fontWeight: 800, ...style }}>
      {children}
    </span>
  );

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20, color: "#388e3c" }}>ðŸ§¾ Thanh toÃ¡n</h2>

      {cart.length === 0 ? (
        <p>âš ï¸ Giá» hÃ ng cá»§a báº¡n Ä‘ang trá»‘ng, vui lÃ²ng quay láº¡i chá»n sáº£n pháº©m.</p>
      ) : (
        <>
          {error && (
            <p style={{ color: "#d32f2f", background: "#fdecea", padding: "10px 12px", borderRadius: 8, marginBottom: 16 }}>
              {error}
            </p>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, alignItems: "flex-start" }}>
            {/* Form thÃ´ng tin */}
            <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginBottom: 16 }}>ThÃ´ng tin khÃ¡ch hÃ ng</h3>

              <div style={{ marginBottom: 12 }}>
                <label>Há» vÃ  tÃªn</label>
                <input name="customer_name" value={form.customer_name} onChange={handleChange} required style={{ width: "100%", padding: 10 }} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label>Sá»‘ Ä‘iá»‡n thoáº¡i</label>
                <input name="phone" value={form.phone} onChange={handleChange} required style={{ width: "100%", padding: 10 }} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: "100%", padding: 10 }} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label>Äá»‹a chá»‰ giao hÃ ng</label>
                <textarea name="address" value={form.address} onChange={handleChange} required rows={3} style={{ width: "100%", padding: 10 }} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label>Ghi chÃº (tuá»³ chá»n)</label>
                <textarea name="note" value={form.note} onChange={handleChange} rows={2} style={{ width: "100%", padding: 10 }} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label>PhÆ°Æ¡ng thá»©c thanh toÃ¡n</label>
                <select name="payment_method" value={form.payment_method} onChange={handleChange} style={{ width: "100%", padding: 10 }}>
                  <option value="COD">Thanh toÃ¡n khi nháº­n hÃ ng</option>
                  <option value="MoMo_QR">MoMo (QR)</option>
                  <option value="MoMo_CARD">MoMo (Tháº»/ATM)</option>
                </select>
                {form.payment_method.startsWith("MoMo") && (
                  <p style={{ fontSize: 12, color: "#555", marginTop: 6 }}>Báº¡n sáº½ Ä‘Æ°á»£c chuyá»ƒn sang cá»•ng MoMo Ä‘á»ƒ thanh toÃ¡n an toÃ n.</p>
                )}
              </div>

              {/* Ã” nháº­p & Xá»” mÃ£ giáº£m giÃ¡ */}
              <div style={{ marginBottom: 16, padding: 12, border: "1px dashed #ddd", borderRadius: 10, background: "#fafafa" }}>
                <label style={{ display: "block", marginBottom: 8 }}>MÃ£ giáº£m giÃ¡</label>

                {/* Gá»£i Ã½ tá»‘t nháº¥t */}
                {bestCoupon ? (
                  <div style={{ marginBottom: 8, background: "#fff", border: "1px dashed #86efac", borderRadius: 10, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 900, color: "#14532d" }}>
                          ðŸŽ¯ Gá»£i Ã½ tá»‘t nháº¥t: <Chip>{bestCoupon.code || bestCoupon.coupon_code}</Chip>
                        </div>
                        <div style={{ fontSize: 12, color: "#065f46", marginTop: 4 }}>
                          Æ¯á»›c tÃ­nh tiáº¿t kiá»‡m: <b>{fmt(bestCoupon.saving)}Ä‘</b>
                          {bestCoupon.min_order ? ` â€¢ ÄH tá»« ${fmt(bestCoupon.min_order)}Ä‘` : " â€¢ KhÃ´ng Ä‘iá»u kiá»‡n"}
                          {bestCoupon.type === "percent" && bestCoupon.max_discount ? ` â€¢ Tá»‘i Ä‘a ${fmt(bestCoupon.max_discount)}Ä‘` : ""}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => { 
                          const code = bestCoupon.code || bestCoupon.coupon_code;
                          setCouponCode(code);
                          await new Promise(r => setTimeout(r, 0));
                          applyCoupon();
                        }}
                        style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}
                        title="Ãp dá»¥ng Ä‘á» xuáº¥t"
                      >
                        Ãp dá»¥ng Ä‘á» xuáº¥t
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>
                    Hiá»‡n chÆ°a cÃ³ mÃ£ nÃ o Ä‘á»§ Ä‘iá»u kiá»‡n cho Ä‘Æ¡n {fmt(subtotal)}Ä‘.
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    placeholder="Nháº­p mÃ£ (VD: GIAM10K)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: 10 }}
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    style={{ padding: "10px 14px", borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 600, cursor: "pointer" }}
                  >
                    Ãp dá»¥ng
                  </button>
                </div>

                {/* NÃºt xá»• danh sÃ¡ch gá»£i Ã½ */}
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowList((s) => !s)}
                    style={{ background: "transparent", border: "0", color: "#0ea5e9", cursor: "pointer", fontWeight: 700 }}
                  >
                    {showList ? "áº¨n mÃ£ gá»£i Ã½ â–²" : "Xem táº¥t cáº£ mÃ£ phÃ¹ há»£p â–¼"}
                  </button>

                  {showList && (
                    <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                      {couponList
                        .map((c) => ({ c, saving: estimateDiscount(c) }))
                        .sort((a, b) => b.saving - a.saving)
                        .map(({ c, saving }) => {
                          const ok = saving > 0;
                          const code = c.code || c.coupon_code || "COUPON";
                          const label =
                            (c.type === "percent" ? `Giáº£m ${c.value}%` : `Giáº£m ${fmt(c.value)}Ä‘`) +
                            (c.max_discount ? ` â€¢ Tá»‘i Ä‘a ${fmt(c.max_discount)}Ä‘` : "") +
                            (c.min_order ? ` â€¢ ÄH tá»« ${fmt(c.min_order)}Ä‘` : " â€¢ KhÃ´ng Ä‘iá»u kiá»‡n");
                          return (
                            <button
                              key={code}
                              type="button"
                              disabled={!ok}
                              onClick={() => { setCouponCode(code); setShowList(false); }}
                              title={ok ? `Æ¯á»›c tÃ­nh tiáº¿t kiá»‡m ${fmt(saving)}Ä‘` : `ChÆ°a Ä‘á»§ Ä‘iá»u kiá»‡n (ÄH tá»« ${fmt(c.min_order)}Ä‘)`}
                              style={{
                                textAlign: "left",
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px dashed #f9a8d4",
                                background: ok ? "#fff" : "#f3f4f6",
                                color: ok ? "#9d174d" : "#6b7280",
                                cursor: ok ? "pointer" : "not-allowed",
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 10,
                              }}
                            >
                              <span style={{ fontWeight: 800 }}>
                                {code} {ok ? <Chip style={{ marginLeft: 6 }}>~{fmt(saving)}Ä‘</Chip> : null}
                              </span>
                              <span style={{ fontSize: 12 }}>{label}</span>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

                {couponResult.message && (
                  <p style={{ marginTop: 8, fontSize: 13 }}>{couponResult.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "#388e3c",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                {loading
                  ? "â³ Äang xá»­ lÃ½..."
                  : form.payment_method.startsWith("MoMo")
                  ? "ðŸŸ£ Thanh toÃ¡n vá»›i MoMo"
                  : "âœ… XÃ¡c nháº­n Ä‘áº·t hÃ ng"}
              </button>
            </form>

            {/* ThÃ´ng tin giá» hÃ ng */}
            <div style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginBottom: 16 }}>ÄÆ¡n hÃ ng cá»§a báº¡n</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {cart.map((item) => (
                  <li key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, borderBottom: "1px dashed #eee", paddingBottom: 6 }}>
                    <span>{item.name} x {item.qty}</span>
                    <span>{(item.price * item.qty).toLocaleString()} Ä‘</span>
                  </li>
                ))}
              </ul>

              {/* TÃ­nh tiá»n chi tiáº¿t */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Táº¡m tÃ­nh</span>
                  <strong>{subtotal.toLocaleString()} Ä‘</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span>Giáº£m giÃ¡ {couponResult.applied && couponResult.code ? `(${couponResult.code})` : ""}</span>
                  <strong>-{(couponResult.discount || 0).toLocaleString()} Ä‘</strong>
                </div>
                <h3 style={{ marginTop: 12, color: "#d32f2f", fontWeight: 700, fontSize: 18, textAlign: "right" }}>
                  Tá»•ng cá»™ng: {total.toLocaleString()} Ä‘
                </h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


