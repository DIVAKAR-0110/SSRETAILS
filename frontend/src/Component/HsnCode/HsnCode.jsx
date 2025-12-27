// src/pages/Country.jsx
import Tools from "../Tools";

export default function HsnCode({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Hsn Code Name",
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
      title="Hsn Code Category"
      columns={columns}
      apiBase="http://localhost:8000/hsn_code/"
      extraPayload={{ admin_id: adminId }}
    />
  );
}
