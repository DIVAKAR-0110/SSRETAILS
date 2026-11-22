import React from "react";
import Tools from "../../../Tools";

export default function UOM({ adminId = 1, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER UOM NAME",
      transform: (value) => (value ? value.toUpperCase() : ""),
    },
    {
      name: "shortname",
      label: "Short Name",
      type: "text",
      required: true,
      maxLength: 25,
      placeholder: "ENTER SHORT NAME",
      transform: (value) => (value ? value.toUpperCase() : ""),
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
      title="UOM Master"
      columns={columns}
      apiBase="http://localhost:8000/uoms/"
      extraPayload={{ admin_id: adminId }}
      onExit={onExit}
    />
  );
}
