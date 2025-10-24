import { useState } from "react";

const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://127.0.0.1:8000").replace(/\/+$/, "");
const API = `${API_BASE}/api`;

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "", email: "", phone: "", subject: "", message: ""
    });
    const [errors, setErrors] = useState({});
    const [okMsg, setOkMsg] = useState("");
    const [sending, setSending] = useState(false);

    const setField = (k, v) => {
        setForm(prev => ({ ...prev, [k]: v }));
        setErrors(prev => ({ ...prev, [k]: undefined }));
    };

    const validateLocal = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Vui lÃ²ng nháº­p tÃªn";
        if (!form.message.trim()) e.message = "Vui lÃ²ng nháº­p ná»™i dung";
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email khÃ´ng há»£p lá»‡";
        return e;
        // cÃ¡c rÃ ng buá»™c cÃ²n láº¡i Ä‘Ã£ validate á»Ÿ server
    };

    const submit = async (ev) => {
        ev.preventDefault();
        setOkMsg("");
        const e = validateLocal();
        if (Object.keys(e).length) { setErrors(e); return; }

        setSending(true);
        try {
            const res = await fetch(`${API}/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || data?.ok === false) {
                // 422
                setErrors(data?.errors || { _error: data?.message || "Gá»­i tháº¥t báº¡i" });
            } else {
                setOkMsg(data?.message || "ÄÃ£ gá»­i liÃªn há»‡!");
                setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            }
        } catch (err) {
            setErrors({ _error: "KhÃ´ng káº¿t ná»‘i Ä‘Æ°á»£c mÃ¡y chá»§" });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="contact-page">
            <style>{css}</style>

            <section className="hero">
                <div className="wrap">
                    <h1>LiÃªn há»‡ vá»›i chÃºng tÃ´i</h1>
                    <p>Báº¡n cÃ³ tháº¯c máº¯c hay gÃ³p Ã½? HÃ£y Ä‘á»ƒ láº¡i thÃ´ng tin, Ä‘á»™i ngÅ© CSKH sáº½ pháº£n há»“i sá»›m.</p>
                </div>
            </section>

            <div className="container">
                <div className="grid">
                    <form className="card form" onSubmit={submit} noValidate>
                        <h2>Gá»­i thÃ´ng tin liÃªn há»‡</h2>

                        {errors._error && <div className="alert error">{errors._error}</div>}
                        {okMsg && <div className="alert success">{okMsg}</div>}

                        <div className="row">
                            <label>Há» & TÃªn <span>*</span></label>
                            <input
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                placeholder="Nguyá»…n VÄƒn A"
                            />
                            {errors.name && <small className="err">{errors.name}</small>}
                        </div>

                        <div className="row two">
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setField("email", e.target.value)}
                                    placeholder="you@email.com"
                                />
                                {errors.email && <small className="err">{errors.email}</small>}
                            </div>
                            <div>
                                <label>Äiá»‡n thoáº¡i</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) => setField("phone", e.target.value)}
                                    placeholder="09xx xxx xxx"
                                />
                                {errors.phone && <small className="err">{errors.phone}</small>}
                            </div>
                        </div>

                        <div className="row">
                            <label>Chá»§ Ä‘á»</label>
                            <input
                                value={form.subject}
                                onChange={(e) => setField("subject", e.target.value)}
                                placeholder="VÃ­ dá»¥: TÆ° váº¥n size sáº£n pháº©m"
                            />
                            {errors.subject && <small className="err">{errors.subject}</small>}
                        </div>

                        <div className="row">
                            <label>Ná»™i dung <span>*</span></label>
                            <textarea
                                rows={6}
                                value={form.message}
                                onChange={(e) => setField("message", e.target.value)}
                                placeholder="Nháº­p ná»™i dung báº¡n muá»‘n liÃªn há»‡â€¦"
                            />
                            {errors.message && <small className="err">{errors.message}</small>}
                        </div>

                        <button className="btn" disabled={sending}>
                            {sending ? "Äang gá»­iâ€¦" : "Gá»­i liÃªn há»‡"}
                        </button>
                    </form>

                    <aside className="card info">
                        <h3>ThÃ´ng tin liÃªn há»‡</h3>
                        <ul>
                            <li><i className="fa-solid fa-phone" /> Hotline: 1900 8386</li>
                            <li><i className="fa-solid fa-envelope" /> support@sportoh.vn</li>
                            <li><i className="fa-solid fa-location-dot" /> 123 VÃµ VÄƒn Táº§n, Q.3, TP.HCM</li>
                            <li><i className="fa-regular fa-clock" /> 8:00 â€“ 21:00 (T2â€“CN)</li>
                        </ul>
                        <div className="map">
                            <iframe
                                title="map"
                                src="https://maps.google.com/maps?q=h%E1%BB%93%20ch%C3%AD%20minh&t=&z=12&ie=UTF8&iwloc=&output=embed"
                                loading="lazy"
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

const css = `
/* Ná»n & hero */
.contact-page{ background:#f8fafc; min-height:100vh; color:#0f172a; }
.hero{
  padding:56px 16px;
  background:linear-gradient(135deg,#fdf2f8 0%,#eef2ff 60%,#ecfeff 100%);
}
.hero .wrap{ max-width:1080px; margin:0 auto; text-align:center; }
.hero h1{
  margin:0 0 8px;
  font-size:clamp(28px,3.6vw,40px);
  font-weight:900;
  color:#0f172a;                 /* sÃ¡ng hÆ¡n */
  text-shadow:0 2px 10px rgba(2,6,23,.08);
}
.hero p{ color:#334155; font-weight:600; } /* chá»¯ mÃ´ táº£ Ä‘áº­m & rÃµ hÆ¡n */

/* Khung ná»™i dung + 2 cá»™t */
.container{ max-width:1120px; margin:0 auto; padding:28px 16px 64px; }
.grid{
  display:grid;
  grid-template-columns: 1.6fr 1fr;   /* bÃªn trÃ¡i bá»›t â€œdÃ iâ€ */
  gap:24px;
}
@media (max-width: 980px){ .grid{ grid-template-columns:1fr; } }

/* Card chung */
.card{
  background:#fff;
  border:1px solid rgba(2,6,23,.08);
  border-radius:16px;
  box-shadow:0 8px 20px rgba(2,6,23,.06);
  padding:22px;
  color:#0f172a;                 /* chá»¯ trong card sÃ¡ng rÃµ */
}

/* Form â€“ giá»›i háº¡n bá» rá»™ng Ä‘á»ƒ Ã´ khÃ´ng quÃ¡ dÃ i */
.form h2{ margin:0 0 12px; font-weight:900; }
.form .row,
.form .btn{ max-width:590px; margin-inline:auto; }  /* <- thu gá»n chiá»u ngang */
.row{ margin-bottom:14px; }
.row.two{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
@media (max-width: 600px){ .row.two{ grid-template-columns:1fr; } }

.row label{
  font-weight:800;
  color:#0f172a;                 /* label Ä‘áº­m mÃ u */
  display:block;
  margin-bottom:6px;
}
.row label span{ color:#ef4444; }

/* Ã” nháº­p â€“ chá»¯ vÃ  placeholder sÃ¡ng hÆ¡n */
input, textarea{
  width:100%;
  border:1px solid #cbd5e1;      /* viá»n rÃµ hÆ¡n */
  border-radius:12px;
  padding:12px 14px;
  font-size:15px;
  color:#0f172a;                 /* chá»¯ trong input rÃµ */
  background:#ffffff;
  outline:none;
  transition: box-shadow .15s,border-color .15s;
}
input::placeholder, textarea::placeholder{ color:#6b7280; opacity:1; }  /* placeholder rÃµ hÆ¡n */
input:focus, textarea:focus{
  border-color:#6366f1;
  box-shadow:0 0 0 4px rgba(99,102,241,.18);
}
textarea{ resize:vertical; }

/* NÃºt gá»­i */
.btn{
  height:46px;
  padding:0 22px;
  border-radius:12px;
  border:0;
  background:linear-gradient(135deg,#6366f1,#06b6d4);
  color:#fff;
  font-weight:900;
  cursor:pointer;
  box-shadow:0 10px 24px rgba(37,99,235,.25);
}
.btn:disabled{ opacity:.75; filter:grayscale(.15); cursor:not-allowed; }

/* Alert */
.alert{ padding:10px 12px; border-radius:12px; margin:0 auto 12px; font-weight:700; max-width:740px; }
.alert.success{ background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; }
.alert.error{ background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; }
.err{ color:#b91c1c; font-size:12px; margin-top:4px; display:block; }

/* Cá»™t thÃ´ng tin */
.info h3{ margin:4px 0 10px; font-weight:900; }
.info ul{ list-style:none; padding:0; margin:0; color:#0f172a; }
.info li{ display:flex; align-items:center; gap:10px; padding:7px 0; }
.info li i{ color:#0ea5e9; }     /* icon sÃ¡ng mÃ u, dá»… nhÃ¬n */
.map{ margin-top:14px; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; }
.map iframe{ width:100%; height:240px; border:0; }
`;


