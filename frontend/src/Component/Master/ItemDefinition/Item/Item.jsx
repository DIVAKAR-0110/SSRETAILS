import React from "react";
import Tools from "../../../Tools";

export default function Item({ adminId = 1, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER ITEM NAME",
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
      title="Item Master"
      columns={columns}
      apiBase="http://localhost:8000/items/"
      extraPayload={{ admin_id: adminId }}
      onExit={onExit}
    />
  );
}
