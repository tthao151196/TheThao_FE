// src/pages/Admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";
const ADMIN_LOGIN_URL = `${API_BASE}/api/admin/login`;

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

export default function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const navState = location.state || {};

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const validate = () => {
        const e = {};
        if (!form.email) e.email = "Vui lÃ²ng nháº­p email";
        if (!form.password) e.password = "Vui lÃ²ng nháº­p máº­t kháº©u";
        return e;
    };

    const submit = async (e) => {
        e.preventDefault();
        setServerError("");
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;

        setLoading(true);
        try {
            const res = await fetch(ADMIN_LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                if (res.status === 401) setServerError("Sai email hoáº·c máº­t kháº©u.");
                else if (res.status === 403) setServerError("Chá»‰ Admin Ä‘Æ°á»£c phÃ©p Ä‘Äƒng nháº­p.");
                else if (res.status === 422) {
                    setErrors({
                        email: data?.errors?.email?.[0],
                        password: data?.errors?.password?.[0],
                    });
                    setServerError(data?.message || "Dá»¯ liá»‡u khÃ´ng há»£p lá»‡.");
                } else {
                    setServerError(data?.message || `ÄÄƒng nháº­p tháº¥t báº¡i (HTTP ${res.status}).`);
                }
                return;
            }

            const { token, user } = data;
            if (!token || !user) {
                setServerError("Pháº£n há»“i Ä‘Äƒng nháº­p khÃ´ng há»£p lá»‡.");
                return;
            }

            const role = String(user?.roles || user?.role || "").toLowerCase();
            if (role !== "admin") {
                setServerError("Chá»‰ Admin Ä‘Æ°á»£c phÃ©p Ä‘Äƒng nháº­p.");
                return;
            }

            // âœ… LÆ°u RIÃŠNG cho Admin (Ä‘á»«ng dÃ¹ng "token"/"user" Ä‘á»ƒ trÃ¡nh áº£nh hÆ°á»Ÿng Customer)
            localStorage.setItem(ADMIN_TOKEN_KEY, token);                 // CHANGED
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));   // CHANGED
            localStorage.setItem("admin_session", "1");

            const from = navState.from;
            const target =
                typeof from === "string" && from.startsWith("/admin") ? from
                    : (from && from.pathname) || "/admin";
            navigate(target, { replace: true });
        } catch {
            setServerError("KhÃ´ng thá»ƒ káº¿t ná»‘i mÃ¡y chá»§. Kiá»ƒm tra BE & CORS.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            <img
                src="http://127.0.0.1:8000/assets/images/banner2.jpg"
                alt="Admin Banner"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "blur(4px) brightness(0.6)",
                    zIndex: 0,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    zIndex: 1,
                }}
            />
            <div
                style={{
                    width: "100%",
                    maxWidth: 460,
                    background: "rgba(255,255,255,0.92)",
                    padding: "32px 28px",
                    borderRadius: 16,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    zIndex: 2,
                }}
            >
                <h2
                    style={{
                        marginBottom: 24,
                        textAlign: "center",
                        color: "#023ea5c6",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                    }}
                >
                    ÄÄƒng nháº­p Quáº£n trá»‹
                </h2>

                {(navState.fromAdmin || navState.denied) && (
                    <div
                        style={{
                            color: "#8a6d3b",
                            marginBottom: 16,
                            padding: "10px 12px",
                            borderRadius: 8,
                            background: "#fff3cd",
                            border: "1px solid #ffeeba",
                        }}
                    >
                        {navState.denied || "Báº¡n cáº§n Ä‘Äƒng nháº­p Ä‘á»ƒ vÃ o trang Quáº£n trá»‹."}
                    </div>
                )}

                {serverError && (
                    <div
                        style={{
                            color: "#d32f2f",
                            marginBottom: 16,
                            padding: "10px 12px",
                            borderRadius: 8,
                            background: "#fdecea",
                        }}
                    >
                        {serverError}
                    </div>
                )}

                <form onSubmit={submit} noValidate>
                    <div style={{ marginBottom: 18 }}>
                        <label htmlFor="email" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="admin@domain.com"
                            style={{
                                display: "block",
                                width: "90%",
                                maxWidth: 380,
                                margin: "0 auto",
                                padding: "10px 14px",
                                borderRadius: 10,
                                border: "1px solid #ccc",
                                outline: "none",
                                backgroundColor: "#fff",
                                transition: "all 0.2s",
                            }}
                            onFocus={(e) => (e.target.style.border = "1px solid #1e88e5")}
                            onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                        />
                        {errors.email && (
                            <div style={{ color: "#b42318", fontSize: 12, marginTop: 6 }}>
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: 18 }}>
                        <label htmlFor="password" style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
                            Máº­t kháº©u
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                id="password"
                                name="password"
                                type={showPass ? "text" : "password"}
                                value={form.password}
                                onChange={onChange}
                                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                style={{
                                    display: "block",
                                    width: "90%",
                                    maxWidth: 380,
                                    margin: "0 auto",
                                    padding: "10px 44px 10px 14px",
                                    borderRadius: 10,
                                    border: "1px solid #ccc",
                                    outline: "none",
                                    backgroundColor: "#fff",
                                    transition: "all 0.2s",
                                }}
                                onFocus={(e) => (e.target.style.border = "1px solid #1e88e5")}
                                onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass((s) => !s)}
                                style={{
                                    position: "absolute",
                                    right: "calc(5% + 8px)",
                                    top: 2,
                                    transform: "translateY(50%)",
                                    padding: "6px 10px",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    background: "#fafafa",
                                    cursor: "pointer",
                                }}
                            >
                                {showPass ? "áº¨n" : "Hiá»‡n"}
                            </button>
                        </div>
                        {errors.password && (
                            <div style={{ color: "#b42318", fontSize: 12, marginTop: 6 }}>
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: 10,
                            border: 0,
                            cursor: loading ? "not-allowed" : "pointer",
                            background: loading ? "#9ccc65" : "#023ea5c6",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 16,
                            transition: "background 0.2s",
                        }}
                    >
                        {loading ? "Äang xá»­ lÃ½..." : "ÄÄƒng nháº­p"}
                    </button>

                    <div style={{ marginTop: 12, fontSize: 12, color: "#64748b", textAlign: "center" }}>
                        Chá»‰ tÃ i khoáº£n <b>roles = 'admin'</b> má»›i Ä‘Äƒng nháº­p Ä‘Æ°á»£c.
                    </div>
                </form>
            </div>
        </div>
    );
}


