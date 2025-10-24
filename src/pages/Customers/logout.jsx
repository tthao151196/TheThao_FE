const handleLogout = async () => {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      // Gá»i API logout Ä‘á»ƒ xoÃ¡ token trong server
      const res = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // gá»­i token
        },
      });

      // Log káº¿t quáº£ Ä‘á»ƒ debug (khÃ´ng báº¯t buá»™c)
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.warn("Logout API error:", data);
      }
    }
  } catch (err) {
    console.error("Logout request failed:", err);
  } finally {
    // âœ… XoÃ¡ localStorage báº¥t ká»ƒ API cÃ³ thÃ nh cÃ´ng hay khÃ´ng
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // âœ… Chuyá»ƒn vá» trang login
    window.location.href = "/login";
  }
};


