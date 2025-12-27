// src/pages/Country.jsx
import Tools from "../Tools";

export default function Floors({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Floor Category Name",
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
      title="Floor Category"
      columns={columns}
      apiBase="http://localhost:8000/floor_category/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
