// src/pages/Relation.jsx
import Tools from "../Tools";

export default function Relation({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Relation Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add on model
  };

  return (
    <Tools
      title="Relation Master"
      columns={columns}
      apiBase="http://localhost:8000/relations/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
