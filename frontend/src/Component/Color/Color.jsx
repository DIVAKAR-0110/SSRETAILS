// src/pages/Country.jsx
import Tools from "../Tools";

export default function Color({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Color Name",
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
      title="Color Category"
      columns={columns}
      apiBase="http://localhost:8000/color/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
