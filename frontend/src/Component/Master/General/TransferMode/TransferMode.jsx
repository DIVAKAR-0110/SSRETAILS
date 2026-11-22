// src/pages/TransferMode.jsx
import Tools from "../../../Tools";

export default function TransferMode({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Transfer Mode Name",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "ENTER TRANSFER MODE",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "shortname",
      label: "Short Name",
      type: "text",
      maxLength: 25,
      required: false,
      placeholder: "ENTER SHORT CODE",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "numgeneration",
      label: "Number Generation",
      type: "boolean",
      default: false,
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
    // created_at is auto_now_add in model
  };

  return (
    <Tools
      title="Transfer Mode Master"
      columns={columns}
      apiBase="http://localhost:8000/transfer-modes/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
