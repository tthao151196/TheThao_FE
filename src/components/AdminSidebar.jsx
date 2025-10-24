import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "12px 16px",
  textDecoration: "none",
  color: isActive ? "#34eff6ff" : "#e0e0e0",
  background: isActive ? "rgba(0,230,118,0.15)" : "transparent",
  borderRadius: 8,
  marginBottom: 6,
  fontWeight: 600,
  transition: "all 0.2s",
  outline: "none",
  // thanh nháº¥n nhÃ¡ khi active
  boxShadow: isActive ? "inset 2px 0 0 #34eff6ff" : "none",
});

export default function AdminSidebar() {
  return (
    <aside
      style={{
        padding: 16,
        background: "#121212",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#110defff",
          textTransform: "uppercase",
          letterSpacing: 1,
          textShadow: "0 0 6px rgba(3, 46, 237, 0.6)",
          padding: "4px 0 8px",
        }}
      >
        Admin
      </div>

      {/* Navigation */}
      <nav
        style={{
          overflowY: "auto",
          paddingRight: 4,
          flex: 1,
        }}
      >
        <NavLink to="/admin" end style={linkStyle} title="Tá»•ng quan">
          Dashboard
        </NavLink>

        <NavLink to="/admin/products" style={linkStyle} title="Quáº£n lÃ½ sáº£n pháº©m">
          Quáº£n LÃ½ Sáº£n Pháº©m
        </NavLink>

        <NavLink to="/admin/categories" style={linkStyle} title="Quáº£n lÃ½ danh má»¥c">
          Quáº£n LÃ½ Danh Má»¥c
        </NavLink>

        <NavLink to="/admin/orders" style={linkStyle} title="Quáº£n lÃ½ Ä‘Æ¡n hÃ ng">
          Quáº£n LÃ½ ÄÆ¡n HÃ ng
        </NavLink>

        <NavLink to="/admin/posts" style={linkStyle} title="Quáº£n lÃ½ bÃ i viáº¿t">
          Quáº£n LÃ½ BÃ i Viáº¿t
        </NavLink>

        <NavLink to="/admin/contacts" style={linkStyle} title="Quáº£n lÃ½ liÃªn há»‡">
          Quáº£n LÃ½ LiÃªn Há»‡
        </NavLink>

        <NavLink to="/admin/stock-movements" style={linkStyle} title="Nháº­p/Xuáº¥t/Kiá»ƒm kÃª kho">
          Quáº£n LÃ½ Tá»“n Kho
        </NavLink>

        {/* âœ… Má»¥c má»›i: MÃ£ giáº£m giÃ¡ */}
        <NavLink to="/admin/coupons" style={linkStyle} title="Táº¡o vÃ  quáº£n lÃ½ mÃ£ giáº£m giÃ¡">
          Quáº£n LÃ½ MÃ£ Giáº£m GiÃ¡
        </NavLink>
      </nav>

      {/* Footer nho nhá» */}
      <div
        style={{
          fontSize: 12,
          color: "#9e9e9e",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 8,
        }}
      >
        v1.0 â€¢ TheThao Admin
      </div>
    </aside>
  );
}


