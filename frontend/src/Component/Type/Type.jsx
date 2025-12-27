// src/pages/Country.jsx
import Tools from "../Tools";

export default function Type({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Type Name",
      required: true,
      transform: (value) => value.toUpperCase(),
    },
    {
      name: "shortname",
      label: "Short Name",
      required: true,
      transform: (value) => value.toUpperCase(),
    },
    {
      name: "active",
      label: "Active",
      type: "boolean",
    },
  ];

  return (
    <Tools
      title="TYPE"
      columns={columns}
      apiBase="http://localhost:8000/type/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
