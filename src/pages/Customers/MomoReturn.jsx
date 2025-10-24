import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export default function MomoReturn() {
  const nav = useNavigate();
  const [msg, setMsg] = useState("Äang xÃ¡c nháº­n thanh toÃ¡n vá»›i MoMo...");

  useEffect(() => {
    const moOrderCode = localStorage.getItem("momo_last_order_code");
    const localOrderId = localStorage.getItem("momo_last_order_id");

    if (!moOrderCode) {
      setMsg("KhÃ´ng tÃ¬m tháº¥y mÃ£ Ä‘Æ¡n MoMo Ä‘á»ƒ kiá»ƒm tra.");
      return;
    }

    let stopped = false;
    const poll = async (tries = 0) => {
      try {
        const res = await fetch(`${API_BASE}/api/payments/momo/check?order_code=${encodeURIComponent(moOrderCode)}`);
        const data = await res.json();

        // âœ… ThÃ nh cÃ´ng (IPN Ä‘Ã£ vá»)
        if (data?.payment_status === "paid" || data?.order_status === "paid" || data?.result_code === 0) {
          localStorage.setItem("cart", "[]");        // xÃ³a giá»
          window.dispatchEvent(new Event("cart:clear")); // bÃ¡o UI dá»n ngay
          window.dispatchEvent(new CustomEvent("cart-changed", { detail: 0 })); // badge = 0

          localStorage.removeItem("cart_backup");    // xÃ³a backup
          localStorage.removeItem("momo_last_order_code");
          const oid = data?.order_id || localOrderId || "";
          setMsg("Thanh toÃ¡n thÃ nh cÃ´ng! Äang chuyá»ƒn tá»›i trang theo dÃµi Ä‘Æ¡n...");
          setTimeout(() => nav(`/track?code=${encodeURIComponent(oid)}`, { replace: true }), 800);
          return;
        }

        // âŒ Tháº¥t báº¡i
        if (data?.payment_status === "failed") {
          setMsg("Thanh toÃ¡n tháº¥t báº¡i. Giá» hÃ ng Ä‘Ã£ Ä‘Æ°á»£c khÃ´i phá»¥c.");
          const backup = localStorage.getItem("cart_backup");
          if (backup) {
            localStorage.setItem("cart", backup);
            window.dispatchEvent(new Event("cart:clear")); // trigger sync láº¡i giá»
            try {
              const arr = JSON.parse(backup || "[]");
              const total = Array.isArray(arr) ? arr.reduce((s,i)=>s+(Number(i?.qty)||0),0) : 0;
              window.dispatchEvent(new CustomEvent("cart-changed", { detail: total }));
            } catch {
              window.dispatchEvent(new CustomEvent("cart-changed", { detail: 0 }));
            }
          }
          localStorage.removeItem("cart_backup");
          localStorage.removeItem("momo_last_order_code");
          return;
        }

        // â³ Pending â†’ poll láº¡i tá»‘i Ä‘a ~40s
        if (tries < 20 && !stopped) setTimeout(() => poll(tries + 1), 2000);
        else setMsg("ÄÆ¡n Ä‘ang chá» MoMo xÃ¡c nháº­n. Vui lÃ²ng kiá»ƒm tra láº¡i sau Ã­t phÃºt.");
      } catch (e) {
        if (tries < 10 && !stopped) setTimeout(() => poll(tries + 1), 2000);
        else setMsg("KhÃ´ng kiá»ƒm tra Ä‘Æ°á»£c tráº¡ng thÃ¡i thanh toÃ¡n.");
      }
    };

    poll();
    return () => { stopped = true; };
  }, [nav]);

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: 20 }}>
      <h2>MoMo Return</h2>
      <p>{msg}</p>
    </div>
  );
}

