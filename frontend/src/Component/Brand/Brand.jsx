// src/pages/Country.jsx
import Tools from "../Tools";

export default function Brand({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Brand Name",
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
      title="BRAND"
      columns={columns}
      apiBase="http://localhost:8000/brand/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
