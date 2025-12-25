// src/pages/GiftVoucher.jsx
import Tools from "../Tools";

export default function GiftVoucher({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Gift Voucher Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add
  };

  return (
    <Tools
      title="Gift Voucher Master"
      columns={columns}
      apiBase="http://localhost:8000/giftvouchers/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
