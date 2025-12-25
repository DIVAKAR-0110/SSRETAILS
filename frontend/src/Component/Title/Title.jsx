// src/pages/Title.jsx
import Tools from "../Tools";

export default function Title({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Title Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // create_at is auto_now_add, no need to send
  };

  return (
    <Tools
      title="Title Master"
      columns={columns}
      apiBase="http://localhost:8000/titles/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
