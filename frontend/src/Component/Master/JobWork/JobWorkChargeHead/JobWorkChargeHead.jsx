// src/Component/Master/JobWork/JobWorkChargeHead/JobWorkChargeHead.jsx
import Tools from "../../../Tools";

export default function JobWorkChargeHead({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Charge Name",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "ENTER CHARGE NAME",
      transform: (val) => (val ? val.toUpperCase() : ""),
    },
    {
      name: "shortname",
      label: "Short Name",
      type: "text",
      maxLength: 25,
      required: true,
      placeholder: "ENTER SHORT CODE",
      transform: (val) => (val ? val.toUpperCase() : ""),
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
      title="Job Work Charge Head Master"
      columns={columns}
      apiBase="http://localhost:8000/job-work/charge-heads/"
      extraPayload={{ admin_id: adminId }}
      onExit={onExit}
    />
  );
}
