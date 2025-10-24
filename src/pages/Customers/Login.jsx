﻿// vite-project/src/pages/Login.jsx


import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // â¬…ï¸ thÃªm Link

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = "http://127.0.0.1:8000";
  const LOGIN_URL = `${API_BASE}/api/login`;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // âœ… nháº­n message tá»« trang Ä‘Äƒng kÃ½ (náº¿u cÃ³)
  const successMsg = location.state?.success;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setLoading(true);

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
      };

      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch { }

      if (res.ok) {
        // âœ… LÆ°u token + user vÃ o localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // ðŸ”” BÃ¡o cho TopBar cáº­p nháº­t NGAY (khÃ´ng cáº§n refresh)
        window.dispatchEvent(new Event("auth-changed"));

        // âœ… ThÃ´ng bÃ¡o
        alert(data.message || "ÄÄƒng nháº­p thÃ nh cÃ´ng!");

        // âœ… Quay vá» trang chá»§
        navigate("/");
        return;
      }

      // Xá»­ lÃ½ lá»—i validation
      if (res.status === 422 && data?.errors) {
        setErrors(data.errors);
      } else {
        setServerError(data?.message || `CÃ³ lá»—i xáº£y ra (HTTP ${res.status}).`);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setServerError("KhÃ´ng thá»ƒ káº¿t ná»‘i mÃ¡y chá»§.");
    } finally {
      setLoading(false);
    }
  };

  const Err = ({ name }) =>
    errors[name] ? (
      <div style={{ color: "#c00", fontSize: 13, marginTop: 4 }}>
        {Array.isArray(errors[name]) ? errors[name].join(", ") : String(errors[name])}
      </div>
    ) : null;

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
      {/* Background image */}
      <img
        src="http://127.0.0.1:8000/assets/images/banner2.jpg"
        alt="Sports Banner"
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

      {/* Overlay má» Ä‘en */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 1,
        }}
      ></div>

      {/* Form card */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.92)",
          padding: "32px 28px",
          borderRadius: 16,
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          zIndex: 2,
        }}
      >
        <h2 style={{ marginBottom: 24, textAlign: "center", color: "#023ea5c6" }}>
          ÄÄƒng nháº­p
        </h2>

        {successMsg && (
          <div
            style={{
              color: "green",
              marginBottom: 16,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#e8f5e9",
            }}
          >
            {successMsg}
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
          {[
            { label: "Email", name: "email", type: "email" },
            { label: "Máº­t kháº©u", name: "password", type: "password" },
          ].map((f) => (
            <div key={f.name} style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={onChange}
                required
                style={{
                  display: "block",
                  width: "90%",
                  maxWidth: 360,
                  margin: "0 auto",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  outline: "none",
                  transition: "all 0.2s",
                  backgroundColor: "#fff",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid #1e88e5")}
                onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
              />
              <Err name={f.name} />
            </div>
          ))}

          {/* â¬‡ï¸ Link tá»›i trang QuÃªn máº­t kháº©u */}
          <div style={{ textAlign: "right", marginBottom: 18 }}>
            <Link to="/forgot-password" style={{ color: "#1e88e5", textDecoration: "underline", fontSize: 14 }}>
              QuÃªn máº­t kháº©u?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              border: 0, // âœ… fix lá»—i cÃº phÃ¡p: bá» chá»¯ "token" dÆ°
              cursor: "pointer",
              background: loading ? "#9ccc65" : "#023ea5c6",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              transition: "background 0.2s",
            }}
          >
            {loading ? "Äang xá»­ lÃ½..." : "ÄÄƒng nháº­p"}
          </button>
        </form>
      </div>
    </div>
  );
}


