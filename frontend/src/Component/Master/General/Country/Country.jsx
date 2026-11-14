// src/pages/Country.jsx
import Tools from "../../../Tools";

export default function Country({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Country Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER COUNTRY NAME",
      transform: (value) => value.toUpperCase(),
    },
    {
      name: "shortname",
      label: "Short Name",
      type: "text",
      required: true,
      maxLength: 25,
      placeholder: "ENTER SHORT CODE",
      transform: (value) => value.toUpperCase(),
    },
    {
      name: "active",
      label: "Active",
      type: "boolean",
      default: true,
    },
  ];

  return (
    <Tools
      title="Country Master"
      columns={columns}
      apiBase="http://localhost:8000/countries/"
      extraPayload={{ admin_id: adminId }}
      onExit={onExit}
    />
  );
}
