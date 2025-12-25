// src/pages/IncomeAndExpense.jsx
import { useEffect, useState } from "react";
import Tools from "../Tools";

export default function IncomeAndExpense({ adminId, onExit }) {
  const [accountHeads, setAccountHeads] = useState([]);
  const [loadingHeads, setLoadingHeads] = useState(false);

  useEffect(() => {
    async function loadAccountHeads() {
      try {
        setLoadingHeads(true);
        const res = await fetch("http://localhost:8000/account-heads/");
        const data = await res.json();
        setAccountHeads(data);
      } catch (err) {
        console.error("Failed to load account heads", err);
      } finally {
        setLoadingHeads(false);
      }
    }
    loadAccountHeads();
  }, []);

  const columns = [
    { name: "name", label: "Income/Expense Name", required: true },
    { name: "short_name", label: "Short Name", required: true },

    // DROPDOWN: Account Head (stores id into account_head_code)
    {
      name: "account_head_code",
      label: "Account Head",
      type: "select",
      options: accountHeads.map((h) => ({
        value: h.id, // will be saved in account_head_code
        label: h.name, // shown in dropdown
      })),
      disableWhileLoading: loadingHeads,
      required: false,
    },

    // optional: also store/display the name text field if you still want it
    { name: "account_head_name", label: "Account Head Name (optional)" },

    { name: "active", label: "Active", type: "boolean" },
    { name: "head_type", label: "Head Type", type: "boolean" },
    { name: "account_post", label: "Account Post", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add
  };

  return (
    <Tools
      title="Income & Expense Master"
      columns={columns}
      apiBase="http://localhost:8000/income-expenses/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
