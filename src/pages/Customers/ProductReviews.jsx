// src/components/ProductReviews.jsx


import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

export default function ProductReviews({ productId }) {
    const [list, setList] = useState([]);
    const [meta, setMeta] = useState({ avg_rating: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");

    const token = localStorage.getItem("token");

    const load = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/products/${productId}/reviews`);
            const json = await r.json();
            setList(Array.isArray(json?.data) ? json.data : json);
            setMeta(json?.meta || {});
        } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [productId]);

    const submit = async (e) => {
        e.preventDefault();
        if (!token) { alert("Báº¡n cáº§n Ä‘Äƒng nháº­p Ä‘á»ƒ Ä‘Ã¡nh giÃ¡."); return; }
        const r = await fetch(`${API}/products/${productId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rating, content }),
        });
        if (r.ok) {
            setContent(""); setRating(5); await load();
        } else {
            alert("Gá»­i Ä‘Ã¡nh giÃ¡ tháº¥t báº¡i.");
        }
    };

    return (
        <div style={{ marginTop: 30 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
                ÄÃ¡nh giÃ¡ & BÃ¬nh luáº­n â€¢ â˜… {meta.avg_rating || 0} ({meta.total || 0})
            </h3>

            {loading ? <p>Äang táº£i...</p> : (
                <div style={{ display: "grid", gap: 12 }}>
                    {list.length === 0 ? <div>ChÆ°a cÃ³ Ä‘Ã¡nh giÃ¡ nÃ o.</div> : list.map((c) => (
                        <div key={c.id} style={{ background: "#1f1f1f", borderRadius: 10, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <strong>{c?.user?.name || "NgÆ°á»i dÃ¹ng"}</strong>
                                <span style={{ color: "#ffd166" }}>{"â˜…".repeat(c.rating)}{"â˜†".repeat(5 - c.rating)}</span>
                            </div>
                            <div style={{ color: "#ddd", whiteSpace: "pre-wrap" }}>{c.content}</div>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={submit} style={{ marginTop: 16, background: "#172026", padding: 12, borderRadius: 10 }}>
                <div style={{ marginBottom: 8 }}>
                    <label>Chá»n sao: </label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} â˜…</option>)}
                    </select>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Cáº£m nháº­n cá»§a báº¡nâ€¦"
                    rows={3}
                    style={{ width: "100%", borderRadius: 8, padding: 10 }}
                />
                <div style={{ marginTop: 8 }}>
                    <button type="submit" style={{ background: "#00c853", color: "#fff", border: 0, padding: "8px 14px", borderRadius: 8, cursor: "pointer" }}>
                        Gá»­i Ä‘Ã¡nh giÃ¡
                    </button>
                </div>
            </form>
        </div>
    );
}


