// src/pages/Department.jsx
import Tools from "../../../Tools";

export default function Department({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Department Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER DEPARTMENT NAME",
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
      name: "perdaycommission",
      label: "Per Day Commission",
      type: "number",
      step: "0.01",
      min: "0",
      placeholder: "0.00",
      required: true,
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
