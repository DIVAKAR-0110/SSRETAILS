// src/pages/Grade.jsx
import Tools from "../Tools";

export default function Grade({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Grade Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    createddatetime: new Date().toISOString(),
  };

  return (
    <Tools
      title="Grade Master"
      columns={columns}
      apiBase="http://localhost:8000/grades/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
