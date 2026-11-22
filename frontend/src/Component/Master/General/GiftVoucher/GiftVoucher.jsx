// src/pages/GiftVoucher.jsx
import Tools from "../../../Tools";

export default function GiftVoucher({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Gift Voucher Name",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "ENTER VOUCHER NAME",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "shortname",
      label: "Short Name",
      type: "text",
      maxLength: 25,
      required: true,
      placeholder: "ENTER SHORT CODE",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "active",
      label: "Active",
      type: "boolean",
      default: true,
    },
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
