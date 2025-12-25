// src/pages/Department.jsx
import Tools from "../Tools";

export default function Department({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Department Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    {
      name: "perdaycommission",
      label: "Per Day Commission",
      type: "number",
      step: "0.00001",
      required: true,
    },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // createddatetime is auto_now_add
  };

  return (
    <Tools
      title="Department Master"
      columns={columns}
      apiBase="http://localhost:8000/departments/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
