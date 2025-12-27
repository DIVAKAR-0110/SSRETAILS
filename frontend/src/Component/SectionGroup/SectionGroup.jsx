// src/pages/Country.jsx
import Tools from "../Tools";

export default function SectionGroup({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Section Group Name",
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
      title="SECTION GROUP Category"
      columns={columns}
      apiBase="http://localhost:8000/section_group/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
