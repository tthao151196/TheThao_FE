import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([
    { role: "assistant", text: "Xin chào 👋 Hỏi mình về: giá min/max/trung bình, giá theo tên sản phẩm (vd: “Con Chó giá bao nhiêu”), tìm sản phẩm theo mức giá (vd: 199.000đ), top bán chạy (trong N ngày), hoặc giờ hiện tại." }
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setItems(arr => [...arr, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      setItems(arr => [...arr, {
        role: "assistant",
        text: data?.reply ?? "Không có phản hồi.",
        title: data?.title ?? null,
        cards: Array.isArray(data?.cards) ? data.cards : [],
      }]);
    } catch (e) {
      setItems(arr => [...arr, { role: "assistant", text: "Lỗi gọi API (kiểm tra backend/CORS)." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [items]);

  return (
    <div className="min-h-[calc(100vh-110px)] bg-white text-slate-900 font-[Montserrat]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          Trợ lý AI
          <span className="block h-1 w-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 mt-2 rounded-full" />
        </h1>

        <div className="mt-6 border rounded-2xl shadow-sm overflow-hidden">
          <div ref={listRef} className="h-[60vh] overflow-y-auto bg-[#f8fafc] p-4 space-y-3">
            {items.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${m.role === "user" ? "ml-auto bg-indigo-100" : "bg-white border"}`}>
                <div className="text-xs opacity-60 mb-1">{m.role === "user" ? "Bạn" : "AI"}</div>

                {m.text && <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>}
                {m.title && <div className="font-semibold mt-2">{m.title}</div>}

                {Array.isArray(m.cards) && m.cards.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {m.cards.map((c, idx) => (
                      <a key={idx} href={c.url || '#'} className="block border rounded-xl overflow-hidden bg-white hover:shadow">
                        <div className="aspect-[4/3] bg-gray-100">
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={c.title || ''}
                              className="w-full h-full object-cover"
                              onError={(e)=>{e.currentTarget.style.display='none';}}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm opacity-60">No image</div>
                          )}
                        </div>
                        <div className="p-2">
                          <div className="text-sm font-medium line-clamp-2">{c.title || "Sản phẩm"}</div>
                          {c.subtitle && <div className="text-xs text-slate-500 mt-1">{c.subtitle}</div>}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="w-28 h-8 bg-white border rounded-2xl px-4 py-2 shadow-sm flex items-center">
                <span className="animate-pulse">Đang trả lời…</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t flex gap-2">
            <input
              className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Nhập câu hỏi… (vd: Con Chó giá bao nhiêu? | Sản phẩm giá 199.000đ | Top bán chạy 30 ngày?)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="rounded-xl px-4 py-2 bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
            >
              Gửi
            </button>
          </div>
        </div>

        <div className="text-sm text-slate-500 mt-3">
          Ví dụ: “Con Chó giá bao nhiêu?”, “Sản phẩm giá 199.000đ”, “Top bán chạy 30 ngày?”, “Bây giờ mấy giờ?”
        </div>
      </div>
    </div>
  );
}
