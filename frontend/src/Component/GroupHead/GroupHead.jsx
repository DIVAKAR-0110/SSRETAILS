// src/pages/GroupHead.jsx
import Tools from "../Tools";

export default function GroupHead({ adminId, onExit }) {
  // In GroupHead.jsx - make sure labels are clear
  const columns = [
    { name: "name", label: "Group Head Name", required: true },
    { name: "short_name", label: "Short Name", required: true },
    { name: "group_head_code", label: "Group Head Code" },
    { name: "type", label: "Type", placeholder: "e.g., A, B, C" },
    { name: "is_primary", label: "Is Primary", type: "boolean" },
    { name: "active", label: "Active Status", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add
  };

  return (
    <Tools
      title="Group Head Master"
      columns={columns}
      apiBase="http://localhost:8000/group-heads/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
