﻿// src/pages/Customers/Cart.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER = "https://placehold.co/90x68?text=No+Image";
const fmt = (n) => (Number(n) || 0).toLocaleString("vi-VN");


export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  // ðŸ‘‡ Láº¯ng nghe khi trang khÃ¡c phÃ¡t 'cart:clear' hoáº·c khi localStorage 'cart' Ä‘á»•i
  useEffect(() => {
    const syncFromLS = () => {
      try {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(Array.isArray(items) ? items : []);
      } catch { setCart([]); }
    };
    const onStorage = (e) => { if (e.key === "cart") syncFromLS(); };
    window.addEventListener("cart:clear", syncFromLS);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:clear", syncFromLS);
      window.removeEventListener("storage", onStorage);
    };
  }, [setCart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const increaseQty = (id) => {
    const next = cart.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it));
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("cart-changed", {
      detail: next.reduce((s,i)=>s+(Number(i.qty)||0),0)
    }));
  };

  const decreaseQty = (id) => {
    const next = cart.map((it) =>
      it.id === id && it.qty > 1 ? { ...it, qty: it.qty - 1 } : it
    );
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("cart-changed", {
      detail: next.reduce((s,i)=>s+(Number(i.qty)||0),0)
    }));
  };

  const removeItem = (id) => {
    const next = cart.filter((it) => it.id !== id);
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("cart-changed", {
      detail: next.reduce((s,i)=>s+(Number(i.qty)||0),0)
    }));
  };

  const clearCart = () => {
    if (window.confirm("Báº¡n cÃ³ cháº¯c muá»‘n xoÃ¡ toÃ n bá»™ giá» hÃ ng?")) {
      setCart([]);
      localStorage.setItem("cart", "[]");
      window.dispatchEvent(new Event("cart:clear"));
      window.dispatchEvent(new CustomEvent("cart-changed", { detail: 0 }));
    }
  };

  return (
    <div className="cart-page">
      <StyleTag />

      {/* HERO (padding-top 110px Ä‘á»ƒ KHÃ”NG bá»‹ header che) */}
      <section className="hero">
        <div className="wrap">
          <h1>Giá» hÃ ng</h1>
          <p>Kiá»ƒm tra cÃ¡c sáº£n pháº©m báº¡n Ä‘Ã£ thÃªm trÆ°á»›c khi thanh toÃ¡n.</p>
        </div>
      </section>

      <div className="container">
        {cart.length === 0 ? (
          <div className="card empty">
            <p>Giá» hÃ ng trá»‘ng</p>
            <button
              className="btn"
              onClick={() => navigate("/products")}
              aria-label="Tiáº¿p tá»¥c mua sáº¯m"
            >
              Tiáº¿p tá»¥c mua sáº¯m
            </button>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th className="left">Sáº£n pháº©m</th>
                    <th>áº¢nh</th>
                    <th>GiÃ¡</th>
                    <th>Sá»‘ lÆ°á»£ng</th>
                    <th>ThÃ nh tiá»n</th>
                    <th>HÃ nh Ä‘á»™ng</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 ? "odd" : ""}>
                      <td className="left">
                        <strong>{item.name}</strong>
                      </td>
                      <td>
                        <img
                          src={item.thumbnail_url || item.thumbnail || PLACEHOLDER}
                          alt={item.name}
                          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                          loading="lazy"
                        />
                      </td>
                      <td className="muted">{fmt(item.price)} Ä‘</td>
                      <td>
                        <div className="qty">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => decreaseQty(item.id)}
                            aria-label="Giáº£m sá»‘ lÆ°á»£ng"
                          >
                            âˆ’
                          </button>
                          <span className="qty-num">{item.qty}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => increaseQty(item.id)}
                            aria-label="TÄƒng sá»‘ lÆ°á»£ng"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="total">{fmt(item.price * item.qty)} Ä‘</td>
                      <td>
                        <button
                          type="button"
                          className="btn danger"
                          onClick={() => removeItem(item.id)}
                          aria-label="XoÃ¡ sáº£n pháº©m"
                        >
                          XoÃ¡
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer actions */}
            <div className="footer">
              <button type="button" className="btn gray" onClick={clearCart}>
                ðŸ—‘ XoÃ¡ toÃ n bá»™
              </button>

              <h3 className="sum">
                Tá»•ng cá»™ng: <span>{fmt(total)} Ä‘</span>
              </h3>

              <button
                type="button"
                className="btn"
                onClick={() => navigate("/checkout", { state: { cart } })}
              >
                Thanh toÃ¡n
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Styles (match Contact page look & feel) ===== */
/* ===== Styles: chá»¯ sÃ¡ng â€“ ná»•i báº­t hÆ¡n ===== */
function StyleTag() {
  return (
    <style>{`
      .cart-page{
        --brand1:#6366f1;      /* indigo */
        --brand2:#06b6d4;      /* cyan   */
        --accent:#ff7043;      /* orange for money */
        --surface:#fff;
        --text:#0b1220;        /* chá»¯ Ä‘áº­m hÆ¡n */
        --text-strong:#020617; /* chá»¯ tiÃªu Ä‘á» ráº¥t Ä‘áº­m */
        --muted:#334155;       /* ghi Ä‘áº­m, dá»… Ä‘á»c */
        --header-offset:110px;
        background:#f8fafc;
        min-height:100vh;
        padding-top:var(--header-offset);
        color:var(--text);
      }

      .hero{
        background:linear-gradient(135deg,#fdf2f8 0%,#eef2ff 60%,#ecfeff 100%);
        padding:28px 16px;
      }
      .hero .wrap{ max-width:1040px; margin:0 auto; }
      .hero h1{
        margin:0 0 6px;
        font-size:clamp(26px,3.4vw,36px);
        font-weight:900;
        letter-spacing:-.02em;
        color:var(--text-strong);
        /* lÃ m chá»¯ ná»•i nháº¹ */
        text-shadow:0 1px 0 #fff, 0 0 24px rgba(99,102,241,.25);
      }
      .hero p{ margin:0; color:var(--muted); opacity:.95; }

      .container{ max-width:1040px; margin:0 auto; padding:18px 16px 56px; }

      .card{
        background:var(--surface);
        border:1px solid rgba(2,6,23,.08);
        border-radius:16px;
        box-shadow:0 6px 18px rgba(2,6,23,.06);
        padding:16px;
      }
      .card.empty{ text-align:center; padding:26px 16px; }
      .card.empty p{ color:var(--muted); margin-bottom:12px; font-weight:700; }

      .btn{
        height:42px; padding:0 18px; border-radius:12px; border:0;
        background:linear-gradient(135deg,var(--brand1),var(--brand2));
        color:#fff; font-weight:900; cursor:pointer;
        box-shadow:0 8px 22px rgba(37,99,235,.25);
        text-shadow:0 1px 0 rgba(0,0,0,.06); /* tÄƒng Ä‘á»™ rÃµ chá»¯ trÃªn ná»n sÃ¡ng */
        transition:transform .12s, box-shadow .12s, filter .12s;
      }
      .btn:hover{ filter:saturate(1.05); box-shadow:0 10px 26px rgba(37,99,235,.32); }
      .btn.gray{ background:#475569; box-shadow:none; }
      .btn.gray:hover{ filter:brightness(1.05); }
      .btn.danger{ background:#d32f2f; box-shadow:0 8px 22px rgba(211,47,47,.20); }
      .btn.danger:hover{ box-shadow:0 10px 26px rgba(211,47,47,.28); }

      .table-wrap{ overflow:auto; }
      .table{ width:100%; border-collapse:collapse; min-width:760px; }

      .table thead th{
        padding:12px; text-align:center; font-weight:900;
        letter-spacing:.2px;
        color:var(--text-strong);
        background:linear-gradient(90deg,rgba(99,102,241,.10),rgba(6,182,212,.10));
        border-bottom:2px solid rgba(2,6,23,.08);
        text-shadow:0 1px 0 #fff; /* sÃ¡ng hÆ¡n */
      }
      .table thead th.left, .table tbody td.left{ text-align:left; }

      .table tbody tr{ border-bottom:1px solid rgba(2,6,23,.06); }
      .table tbody tr.odd{ background:#f6fbff; } /* zebra nháº¹ cho dá»… Ä‘á»c */

      .table tbody td{
        padding:12px; text-align:center; vertical-align:middle;
        color:var(--text);
        font-weight:700; /* tÄƒng Ä‘á»™ nÃ©t chá»¯ */
      }
      .table tbody td.left strong{ color:var(--text-strong); }
      .table tbody td img{
        width:90px; height:68px; object-fit:cover; border-radius:10px;
        border:1px solid rgba(2,6,23,.06);
      }
      .table .muted{ color:#1f2937; font-weight:800; }  /* giÃ¡ Ä‘Æ¡n vá»‹ rÃµ hÆ¡n */
      .table .total{
        font-weight:900; color:var(--accent);
        text-shadow:0 0 0 #fff, 0 0 14px rgba(255,112,67,.35); /* lÃ m sá»‘ tiá»n ná»•i */
      }

      .qty{ display:inline-flex; align-items:center; gap:10px; padding:4px 8px;
            background:#f1f5f9; border-radius:999px; border:1px solid rgba(2,6,23,.08); }
      .qty-btn{ width:28px; height:28px; border-radius:50%; border:0; cursor:pointer;
                background:#e2e8f0; font-weight:900; color:var(--text-strong); }
      .qty-btn:hover{ filter:brightness(1.05); }
      .qty-num{ min-width:28px; text-align:center; font-weight:900; color:var(--text-strong); }

      .footer{ margin-top:18px; display:flex; gap:12px; flex-wrap:wrap;
               align-items:center; justify-content:space-between; }
      .sum{ margin:0; font-size:18px; font-weight:900; color:var(--text-strong); }
      .sum span{
        color:var(--accent);
        text-shadow:0 0 0 #fff, 0 0 14px rgba(255,112,67,.35), 0 0 2px rgba(255,112,67,.25);
      }
    `}</style>
  );
}


