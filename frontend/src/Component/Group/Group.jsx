// src/pages/Group.jsx
import Tools from "../Tools";

export default function Group({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Group Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add on model, so no need to send
  };

  return (
    <Tools
      title="Group Master"
      columns={columns}
      apiBase="http://localhost:8000/groups/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
