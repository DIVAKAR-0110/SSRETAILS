// src/pages/Country.jsx
import Tools from "../Tools";

export default function Style({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Style Name",
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
      title="Style"
      columns={columns}
      apiBase="http://localhost:8000/style/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
