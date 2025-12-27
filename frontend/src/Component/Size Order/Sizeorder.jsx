// src/pages/Country.jsx
import Tools from "../Tools";

export default function Sizeorder({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Size Order Name",
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
      title="Size Order Category"
      columns={columns}
      apiBase="http://localhost:8000/sizeorder/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
