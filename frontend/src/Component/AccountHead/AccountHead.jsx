// src/pages/AccountHead.jsx
import { useEffect, useState } from "react";
import Tools from "../Tools";

export default function AccountHead({ adminId, onExit }) {
  const [groupHeads, setGroupHeads] = useState([]);
  const [loadingGroupHeads, setLoadingGroupHeads] = useState(false);

  useEffect(() => {
    async function loadGroupHeads() {
      try {
        setLoadingGroupHeads(true);
        const res = await fetch("http://localhost:8000/group-heads/");
        const data = await res.json();
        setGroupHeads(data);
      } catch (err) {
        console.error("Failed to load group heads", err);
      } finally {
        setLoadingGroupHeads(false);
      }
    }
    loadGroupHeads();
  }, []);

  const columns = [
    { name: "name", label: "Account Head Name", required: true },
    { name: "short_name", label: "Short Name", required: true },
    {
      name: "group_head_id",
      label: "Group Head",
      type: "select",
      options: groupHeads.map((gh) => ({
        value: gh.id, // saved to group_head_id
        label: gh.name, // shown in dropdown
      })),
      disableWhileLoading: loadingGroupHeads,
      required: false,
    },
    { name: "head_type", label: "Head Type" },
    { name: "classification_name", label: "Classification Name" },
    { name: "active", label: "Active", type: "boolean" },
    { name: "accessible_value", label: "Accessible Value", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add
  };

  return (
    <Tools
      title="Account Head Master"
      columns={columns}
      apiBase="http://localhost:8000/account-heads/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
