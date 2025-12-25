// src/pages/DiscountType.jsx
import Tools from "../Tools";

export default function DiscountType({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Discount Type Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    {
      name: "discper",
      label: "Discount % (discper)",
      type: "number",
      step: "0.01",
      required: true,
    },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add
  };

  return (
    <Tools
      title="Discount Type Master"
      columns={columns}
      apiBase="http://localhost:8000/discount-types/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
