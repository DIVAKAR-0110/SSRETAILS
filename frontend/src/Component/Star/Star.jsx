// src/pages/Star.jsx
import Tools from "../Tools";

export default function Star({ adminId, onExit }) {
  const columns = [
    { name: "starname", label: "Star Name", required: true },
    {
      name: "starvalue",
      label: "Star Value",
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
      title="Star Master"
      columns={columns}
      apiBase="http://localhost:8000/stars/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
