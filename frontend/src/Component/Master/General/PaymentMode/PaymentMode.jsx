// src/pages/PaymentMode.jsx
import Tools from "../../../Tools";

export default function PaymentMode({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Payment Mode Name",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "ENTER PAYMENT MODE",
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
