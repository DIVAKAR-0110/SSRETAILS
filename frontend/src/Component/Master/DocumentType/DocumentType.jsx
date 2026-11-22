// src/Component/Master/DocumentType/DocumentType.jsx
import Tools from "../../Tools";

export default function DocumentType({ adminId, onExit }) {
  const columns = [
    {
      name: "name",
      label: "Document Type Name",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "ENTER DOCUMENT TYPE",
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
  ];

  const extraPayload = {
    admin_id: adminId,
  };

  return (
    <Tools
      title="Document Type Master"
      columns={columns}
      apiBase="http://localhost:8000/document-types/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
