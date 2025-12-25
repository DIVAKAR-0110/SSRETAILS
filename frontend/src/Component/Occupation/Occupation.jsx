// src/pages/Occupation.jsx
import Tools from "../Tools";

export default function Occupation({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Occupation Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    created_at: new Date().toISOString(), // only used on Add by Tools
  };

  return (
    <Tools
      title="Occupation Master"
      columns={columns}
      apiBase="http://localhost:8000/occupations/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
