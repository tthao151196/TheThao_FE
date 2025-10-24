import { useMemo, useState } from "react";

/**
 * Æ¯u tiÃªn láº¥y API_BASE tá»« .env (Vite):
 *   VITE_API_BASE=http://127.0.0.1:8000/api
 * Náº¿u khÃ´ng cÃ³ thÃ¬ fallback vá» 127.0.0.1:8000/api.
 */
const API_BASE =
  import.meta?.env?.VITE_API_BASE?.replace(/\/+$/, "") ||
  "http://127.0.0.1:8000/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const validEmail = useMemo(() => {
    // kiá»ƒm tra cÆ¡ báº£n
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!validEmail) {
      setErr("Email khÃ´ng há»£p lá»‡");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      // cá»‘ gáº¯ng parse JSON; náº¿u BE tráº£ rá»—ng, giá»¯ object rá»—ng
      let data = {};
      try {
        data = await res.json();
      } catch {
        /* ignore parse error */
      }

      if (!res.ok) {
        // PhÃ¢n loáº¡i lá»—i Ä‘á»ƒ hiá»ƒn thá»‹ rÃµ rÃ ng
        if (res.status === 404) {
          setErr(data?.message || "Email khÃ´ng tá»“n táº¡i trong há»‡ thá»‘ng");
        } else if (res.status === 500) {
          // Náº¿u BE cÃ³ tráº£ 'error' -> show Ä‘á»ƒ debug SMTP/SendGrid
          const detail = data?.error ? ` (${String(data.error)})` : "";
          setErr(
            (data?.message || "Gá»­i email tháº¥t báº¡i. Vui lÃ²ng thá»­ láº¡i sau.") +
              detail
          );
        } else if (res.status === 422) {
          setErr(
            data?.message ||
              "Thiáº¿u dá»¯ liá»‡u hoáº·c dá»¯ liá»‡u khÃ´ng há»£p lá»‡. Vui lÃ²ng kiá»ƒm tra láº¡i."
          );
        } else {
          setErr(
            data?.message ||
              `CÃ³ lá»—i xáº£y ra (HTTP ${res.status}). Vui lÃ²ng thá»­ láº¡i.`
          );
        }
        return;
      }

      setMsg(data?.message || "ÄÃ£ gá»­i máº­t kháº©u má»›i vá» email!");
      setErr("");
    } catch (e) {
      setErr("KhÃ´ng thá»ƒ káº¿t ná»‘i mÃ¡y chá»§.");
    } finally {
      setLoading(false);
    }
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    // Khi ngÆ°á»i dÃ¹ng sá»­a email, áº©n thÃ´ng bÃ¡o cÅ© Ä‘á»ƒ trÃ¡nh hiá»ƒu nháº§m
    if (msg) setMsg("");
    if (err) setErr("");
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 16,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>QuÃªn máº­t kháº©u</h2>
      <p style={{ color: "#555" }}>
        Nháº­p email tÃ i khoáº£n Ä‘á»ƒ nháº­n máº­t kháº©u má»›i.
      </p>

      <form onSubmit={submit} noValidate>
        <label style={{ display: "block", fontSize: 14, marginBottom: 8 }}>
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={onChangeEmail}
          placeholder="you@example.com"
          autoComplete="email"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            marginBottom: 12,
            outline: "none",
          }}
        />

        <button
          type="submit"
          disabled={loading || !validEmail}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            background: loading ? "#9ca3af" : "#0ea5e9",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            cursor: loading || !validEmail ? "not-allowed" : "pointer",
            opacity: loading || !validEmail ? 0.9 : 1,
          }}
          aria-busy={loading ? "true" : "false"}
        >
          {loading ? "Äang gá»­i..." : "Gá»­i máº­t kháº©u má»›i"}
        </button>
      </form>

      {msg && (
        <div
          style={{
            marginTop: 12,
            color: "#065f46",
            background: "#ecfdf5",
            padding: "8px 12px",
            borderRadius: 8,
          }}
        >
          {msg}
        </div>
      )}

      {err && (
        <div
          style={{
            marginTop: 12,
            color: "#991b1b",
            background: "#fef2f2",
            padding: "8px 12px",
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {err}
        </div>
      )}

      {/* Gá»£i Ã½ cáº¥u hÃ¬nh nhanh */}
      <div style={{ marginTop: 16, fontSize: 12, color: "#6b7280" }}>
        <div>
          <strong>API_BASE:</strong> {API_BASE}
        </div>
      </div>
    </div>
  );
}


