// src/pages/Category.jsx
import Tools from "../Tools";

export default function Category({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Category Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add, no need to send from frontend
  };

  return (
    <Tools
      title="Category Master"
      columns={columns}
      apiBase="http://localhost:8000/categories/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
