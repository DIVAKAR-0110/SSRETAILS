// src/pages/Title.jsx
import Tools from "../../../Tools";

export default function Title({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Title Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER TITLE NAME",
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
