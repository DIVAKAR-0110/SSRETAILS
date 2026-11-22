// src/pages/Bank.jsx
import Tools from "../../../Tools";

export default function Bank({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Bank Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER BANK NAME",
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
      name: "cardservicecharge",
      label: "Card Service Charge",
      suffix: "Perc (%)",
      type: "number",
      step: "0.01",
      min: "0",
      max: "100",
      placeholder: "0.00",
      required: true,
    },
    {
      name: "active",
      label: "Active",
      type: "boolean",
      default: true,
    },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at & altered_at handled by backend
  };

  return (
    <Tools
      title="Bank Master"
      columns={columns}
      apiBase="http://localhost:8000/banks/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
