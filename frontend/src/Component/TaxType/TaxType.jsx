// src/pages/TaxType.jsx
import { useEffect, useMemo, useState } from "react";
import Tools from "../Tools";

export default function TaxType({ adminId, onExit }) {
  const TYPE_TAX = "TAX_TYPE";
  const TYPE_ADD_LESS = "ADD_LESS";

  const [accountHeads, setAccountHeads] = useState([]);

  // Load Account Heads for dropdown
  useEffect(() => {
    async function loadAccountHeads() {
      try {
        const res = await fetch("http://localhost:8000/account-heads/");
        if (!res.ok) {
          console.error("Failed to load account heads", res.status);
          return;
        }
        const data = await res.json();
        setAccountHeads(data);
      } catch (e) {
        console.error("Failed to load account heads", e);
      }
    }
    loadAccountHeads();
  }, []);

  const columns = useMemo(() => {
    const isTaxType = (f) =>
      String(f.entry_type || "").toUpperCase() === TYPE_TAX;
    const isAddLess = (f) =>
      String(f.entry_type || "").toUpperCase() === TYPE_ADD_LESS;

    return [
      // Type dropdown
      {
        name: "entry_type",
        label: "Type",
        type: "select",
        options: [
          { value: TYPE_TAX, label: "TAX TYPE" },
          { value: TYPE_ADD_LESS, label: "ADD / LESS" },
        ],
        required: true,
      },

      // Common text fields (characters only, limited length)
      { name: "name", label: "Name", required: true, maxLength: 50 },
      {
        name: "short_name",
        label: "Short Name",
        required: true,
        maxLength: 25,
      },

      // Tax / Add-Less percentage – numeric with 5 decimals
      {
        name: "tax_percent",
        label: "Tax (%)",
        type: "number",
        step: "0.00001",
        required: true,
        visibleWhen: isTaxType,
      },
      {
        name: "tax_percent",
        label: "Add / Less (%)",
        type: "number",
        step: "0.00001",
        required: true,
        visibleWhen: isAddLess,
      },

      // === TAX TYPE specific ===
      {
        name: "tax_on",
        label: "Cal Type (tax_on)",
        type: "number", // integer only
        step: "1",
        visibleWhen: isTaxType,
      },
      {
        name: "tax_amt_cal_type",
        label: "TaxAmt Cal Type",
        type: "number", // integer only
        step: "1",
        visibleWhen: isTaxType,
      },
      {
        name: "allow_tax_amt_cal",
        label: "TaxAmt Cal?",
        type: "boolean",
        visibleWhen: isTaxType,
      },
      {
        name: "include",
        label: "Include",
        type: "boolean",
        visibleWhen: isTaxType,
      },
      {
        name: "is_discount",
        label: "Discount",
        type: "boolean",
        visibleWhen: isTaxType,
      },
      {
        name: "allow_purchase",
        label: "Purchase",
        type: "boolean",
        visibleWhen: isTaxType,
      },
      {
        name: "allow_sales",
        label: "Sales",
        type: "boolean",
        visibleWhen: isTaxType,
      },

      // === ADD / LESS specific ===
      {
        name: "include",
        label: "Include",
        type: "boolean",
        visibleWhen: isAddLess,
      },
      {
        name: "is_discount",
        label: "Discount",
        type: "boolean",
        visibleWhen: isAddLess,
      },
      {
        name: "allow_purchase",
        label: "Purchase",
        type: "boolean",
        visibleWhen: isAddLess,
      },
      {
        name: "allow_sales",
        label: "Sales",
        type: "boolean",
        visibleWhen: isAddLess,
      },

      // === Right-side commodity/category (character fields) ===
      { name: "commodity_code", label: "Commodity Code", maxLength: 15 },
      { name: "section", label: "Section", maxLength: 15 },
      { name: "local_category", label: "Local Category", maxLength: 15 },
      { name: "other_category", label: "Other Category", maxLength: 15 },
      { name: "import_category", label: "Import Category", maxLength: 15 },
      { name: "category", label: "Category", maxLength: 15 },

      // === Account zone: dropdown + integer ids ===
      { name: "acc_head_name", label: "Account Head Name", maxLength: 100 },

      {
        name: "account_head_id",
        label: "Account Head",
        type: "select",
        options: accountHeads.map((h) => ({
          value: h.id, // integer id
          label: `${h.code} - ${h.name}`, // show code + name
        })),
      },
      {
        name: "account_sales_head_id",
        label: "Sales Head Id",
        type: "number",
        step: "1",
      },
      {
        name: "ss_pur_acc_head_id",
        label: "SS Purchase Head Id",
        type: "number",
        step: "1",
      },
      {
        name: "ss_sal_acc_head_id",
        label: "SS Sales Head Id",
        type: "number",
        step: "1",
      },
      { name: "account_post", label: "Account Post", type: "boolean" },

      // bottom
      { name: "active", label: "Active", type: "boolean" },
    ];
  }, [accountHeads]);

  const extraPayload = {
    admin_id: adminId,
  };

  return (
    <Tools
      title="Tax Type Master"
      columns={columns}
      apiBase="http://localhost:8000/tax-types/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
