// src/pages/Religion.jsx
import Tools from "../../../Tools";

export default function Religion({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Religion Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER RELIGION NAME",
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
