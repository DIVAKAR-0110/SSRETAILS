// src/pages/PaymentMode.jsx
import Tools from "../Tools";

export default function PaymentMode({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Payment Mode Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add on the model
  };

  return (
    <Tools
      title="Payment Mode Master"
      columns={columns}
      apiBase="http://localhost:8000/payment-modes/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
