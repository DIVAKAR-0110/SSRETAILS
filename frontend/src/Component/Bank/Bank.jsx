// src/pages/Bank.jsx
import Tools from "../Tools";

export default function Bank({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Bank Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    {
      name: "cardservicecharge",
      label: "Card Service Charge",
      type: "number", // handled in Tools
      step: "0.001",
      required: true,
    },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at & altered_at handled by backend
  };

  return (
    <Tools
      title="Bank Master"
      columns={columns}
      apiBase="http://localhost:8000/banks/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
