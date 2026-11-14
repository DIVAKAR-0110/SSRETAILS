// src/pages/Grade.jsx
import Tools from "../../../Tools";

export default function Grade({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Grade Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER GRADE NAME",
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
  };

  return (
    <Tools
      title="Grade Master"
      columns={columns}
      apiBase="http://localhost:8000/grades/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
