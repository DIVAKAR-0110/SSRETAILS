// src/pages/Category.jsx
import Tools from "../../../Tools";

export default function Category({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER CATEGORY NAME",
      transform: (value) => value.toUpperCase(),
    },
    {
      name: "shortname",
      label: "Short Name",
      type: "text",
      required: true,
      maxLength: 25,
      placeholder: "ENTER SHORT CODE",
      transform: (value) => value.toUpperCase(),
    },
    {
      name: "active",
      label: "Active",
      type: "boolean",
      default: true,
    },
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
