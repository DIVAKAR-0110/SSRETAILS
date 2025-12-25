// src/pages/Religion.jsx
import Tools from "../Tools";

export default function Religion({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Religion Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add on model
  };

  return (
    <Tools
      title="Religion Master"
      columns={columns}
      apiBase="http://localhost:8000/religions/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
