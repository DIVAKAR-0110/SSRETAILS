// src/pages/DiscountType.jsx
import Tools from "../../../Tools";

export default function DiscountType({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Discount Type Name",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "ENTER DISCOUNT TYPE",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "shortname",
      label: "Short Name",
      type: "text",
      maxLength: 25,
      required: true,
      placeholder: "ENTER SHORT CODE",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "discper",
      label: "Discount Percentage",
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
    // created_at is auto_now_add
  };

  return (
    <Tools
      title="Discount Type Master"
      columns={columns}
      apiBase="http://localhost:8000/discount-types/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
