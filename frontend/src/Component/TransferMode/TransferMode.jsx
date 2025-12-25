// src/pages/TransferMode.jsx
import Tools from "../Tools";

export default function TransferMode({ adminId, onExit }) {
  const columns = [
    { name: "name", label: "Transfer Mode Name", required: true },
    { name: "shortname", label: "Short Name", required: false },
    { name: "active", label: "Active", type: "boolean" },
    {
      name: "numgeneration",
      label: "Number Generation",
      type: "boolean",
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
