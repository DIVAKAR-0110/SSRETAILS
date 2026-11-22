import React from "react";
import Tools from "../../../Tools";

export default function CommodityCode({ adminId = 1, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Code",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER COMMODITY CODE",
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
      title="Commodity Code Master"
      columns={columns}
      apiBase="http://localhost:8000/commodity-codes/"
      extraPayload={{ admin_id: adminId }}
      onExit={onExit}
    />
  );
}
