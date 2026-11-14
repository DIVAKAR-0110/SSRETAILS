// src/pages/Group.jsx
import Tools from "../../../Tools";

export default function Group({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Group Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER GROUP NAME",
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
