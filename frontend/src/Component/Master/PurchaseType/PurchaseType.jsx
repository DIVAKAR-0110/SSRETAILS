// src/Component/Master/PurchaseType/PurchaseType.jsx
import Tools from "../../Tools";

export default function PurchaseType({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Purchase Type Name",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "ENTER PURCHASE TYPE",
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
      name: "maximumamount",
      label: "Maximum Amount",
      type: "number",
      step: "0.00001",
      min: "0",
      placeholder: "0.00000",
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
  };

  return (
    <Tools
      title="Purchase Type Master"
      columns={columns}
      apiBase="http://localhost:8000/purchase-types/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
