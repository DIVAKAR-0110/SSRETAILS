// src/pages/Relation.jsx
import Tools from "../../../Tools";

export default function Relation({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Relation Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER RELATION NAME",
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
      title="Relation Master"
      columns={columns}
      apiBase="http://localhost:8000/relations/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
