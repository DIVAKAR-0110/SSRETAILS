// src/pages/Occupation.jsx
import Tools from "../../../Tools";

export default function Occupation({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Occupation Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER OCCUPATION NAME",
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
      title="Occupation Master"
      columns={columns}
      apiBase="http://localhost:8000/occupations/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
