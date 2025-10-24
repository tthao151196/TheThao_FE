﻿// src/components/ProductCard.jsx


import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HeartButton from "./HeartButton";

const PLACEHOLDER = "https://placehold.co/300x200?text=No+Image";

export default function ProductCard({ p }) {
  const navigate = useNavigate();

  const root = Number(p.price_root || 0);
  const sale = Number(p.price_sale || p.price || 0);
  const off = root > 0 && sale < root ? Math.round(((root - sale) / root) * 100) : 0;
  const imgSrc = p.thumbnail_url || p.thumbnail || PLACEHOLDER;

  // === Compare state (localStorage) ===
  const [isCompared, setIsCompared] = useState(false);
  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem("compare") || "[]");
      setIsCompared(arr.some((it) => Number(it?.id) === Number(p.id)));
    } catch {
      setIsCompared(false);
    }
  }, [p?.id]);

  const toggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const key = "compare";
      const arr = JSON.parse(localStorage.getItem(key) || "[]").filter(Boolean);
      const exists = arr.find((it) => Number(it?.id) === Number(p.id));

      let next;
      if (exists) {
        next = arr.filter((it) => Number(it?.id) !== Number(p.id));
      } else {
        // Giá»›i háº¡n tá»‘i Ä‘a 4 sáº£n pháº©m so sÃ¡nh
        if (arr.length >= 4) {
          // Ä‘áº©y cÃ¡i cÅ© nháº¥t ra
          arr.shift();
        }
        next = [...arr, { id: p.id, name: p.name, thumbnail_url: imgSrc, price: sale }];
      }
      localStorage.setItem(key, JSON.stringify(next));
      setIsCompared(!exists);

      // phÃ¡t event Ä‘á»ƒ Drawer so sÃ¡nh (náº¿u cÃ³) cáº­p nháº­t
      window.dispatchEvent(new CustomEvent("compare:changed", { detail: next }));
    } catch {}
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/quick/${p.id}`);
  };

  const inStock =
    p?.in_stock !== undefined
      ? !!p.in_stock
      : (Number(p?.stock) || 0) > 0; // fallback náº¿u cÃ³ trÆ°á»ng stock

  return (
    <div
      className="product-card"
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = styles.card.boxShadow;
      }}
    >
      {/* Badge giáº£m giÃ¡ */}
      {off > 0 && <div style={styles.saleTag}>-{off}%</div>}

      {/* Badge háº¿t hÃ ng (náº¿u cÃ³) */}
      {!inStock && <div style={styles.oosTag}>Háº¿t hÃ ng</div>}

      {/* NÃºt trÃ¡i tim */}
      <div className="heart-wrapper" style={styles.heartWrapper}>
        <HeartButton productId={p.id} />
      </div>

      {/* áº¢nh + overlay action */}
      <Link
        to={`/products/${p.id}`}
        style={{ textDecoration: "none", color: "inherit", display: "block", position: "relative" }}
      >
        <div style={styles.imageWrap}>
          <img
            src={imgSrc}
            alt={p.name}
            style={styles.image}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          {/* Overlay action buttons */}
          <div className="overlay-actions" style={styles.overlay}>
            <button
              onClick={openQuickView}
              style={styles.qvBtn}
              className="btn-qv"
              title="Xem nhanh"
            >
              ðŸ‘ï¸ Xem nhanh
            </button>

            <button
              onClick={toggleCompare}
              style={{
                ...styles.compareBtn,
                ...(isCompared ? styles.compareBtnActive : null),
              }}
              className="btn-compare"
              title={isCompared ? "Bá» khá»i so sÃ¡nh" : "ThÃªm vÃ o so sÃ¡nh"}
            >
              {isCompared ? "âœ“ ÄÃ£ thÃªm so sÃ¡nh" : "â‡„ So sÃ¡nh"}
            </button>
          </div>
        </div>

        <div style={styles.info}>
          <div style={styles.name} title={p.name}>{p.name}</div>
          <div style={styles.brand}>{p.brand_name || "KhÃ´ng rÃµ"}</div>
          <div style={styles.priceBox}>
            <span style={styles.priceSale}>{sale.toLocaleString()} Ä‘</span>
            {root > sale && <span style={styles.priceRoot}>{root.toLocaleString()} Ä‘</span>}
          </div>
        </div>
      </Link>

      <style>{`
        .product-card:hover .heart-wrapper { transform: scale(1.1); }
        .heart-wrapper svg { width: 22px; height: 22px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }

        /* overlay xuáº¥t hiá»‡n khi hover card */
        .product-card:hover .overlay-actions { opacity: 1; transform: translateY(0); }
      `}</style>
    </div>
  );
}

/* ======= Styles ======= */
const styles = {
  card: {
    position: "relative",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    textAlign: "center",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    background: "#f9fafb",
    overflow: "hidden",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  image: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    display: "block",
    transition: "transform .25s ease",
  },
  /* Tim cÄƒn chá»‰nh chuáº©n pixel */
  heartWrapper: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.25s ease",
  },
  saleTag: {
    position: "absolute",
    top: 14,
    left: 14,
    background: "#f97316",
    color: "#fff",
    fontSize: 12,
    fontWeight: 800,
    borderRadius: 12,
    padding: "4px 8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    zIndex: 9,
  },
  oosTag: {
    position: "absolute",
    top: 14,
    left: 14 + 58, // Ä‘áº©y sang pháº£i sau saleTag ~58px
    background: "#ef4444",
    color: "#fff",
    fontSize: 12,
    fontWeight: 800,
    borderRadius: 12,
    padding: "4px 8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    zIndex: 9,
  },
  overlay: {
    position: "absolute",
    inset: "auto 0 0 0",
    height: 52,
    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.45) 80%)",
    display: "flex",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: "6px 10px",
    opacity: 0,
    transform: "translateY(8px)",
    transition: "all .2s ease",
  },
  qvBtn: {
    background: "#fff",
    color: "#111827",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "6px 10px",
    fontWeight: 700,
    fontSize: 13,
    boxShadow: "0 2px 6px rgba(0,0,0,.08)",
  },
  compareBtn: {
    background: "linear-gradient(135deg,#e9d5ff,#c7d2fe)",
    color: "#1f2937",
    border: "1px solid rgba(99,102,241,.35)",
    borderRadius: 10,
    padding: "6px 10px",
    fontWeight: 800,
    fontSize: 13,
    boxShadow: "0 2px 6px rgba(0,0,0,.08)",
  },
  compareBtnActive: {
    background: "linear-gradient(135deg,#a7f3d0,#6ee7b7)",
    borderColor: "rgba(16,185,129,.5)",
  },
  info: {
    padding: "12px 14px 16px",
  },
  name: {
    fontWeight: 700,
    fontSize: 15,
    color: "#111827",
    lineHeight: 1.4,
    minHeight: 38,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },
  brand: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },
  priceBox: {
    marginTop: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  priceSale: {
    color: "#ec4899",
    fontWeight: 800,
    fontSize: 15,
  },
  priceRoot: {
    color: "#9ca3af",
    textDecoration: "line-through",
    fontSize: 13,
  },
};


