// src/pages/Country.jsx
import Tools from "../Tools";

export default function Pattern({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Pattern Name",
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
      title="Pattern"
      columns={columns}
      apiBase="http://localhost:8000/pattern/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
