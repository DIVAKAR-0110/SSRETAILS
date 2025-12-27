// src/pages/Country.jsx
import Tools from "../Tools";

export default function Section({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Section Name",
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
      title="Section Category"
      columns={columns}
      apiBase="http://localhost:8000/section/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
