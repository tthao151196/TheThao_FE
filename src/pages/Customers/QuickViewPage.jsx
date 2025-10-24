// src/pages/Customers/QuickViewPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import QuickViewModal from "./QuickViewModal.jsx";

export default function QuickViewPage() {
  const { id } = useParams();
  const nav = useNavigate();

  return (
    <QuickViewModal
      productId={id}
      open={true}
      onClose={() => nav(-1)} // ÄÃ³ng modal â†’ quay láº¡i trang trÆ°á»›c
      onAdd={(prod, variant) => {
        // PhÃ¡t event Ä‘á»ƒ App nháº­n vÃ  thÃªm vÃ o giá» (khÃ´ng Ä‘á»¥ng logic hiá»‡n cÃ³)
        window.dispatchEvent(
          new CustomEvent("qv:add", { detail: { prod, variant } })
        );
      }}
    />
  );
}


