// frontend/src/Component/Master/Tally/AccountHead/AccountHead.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import Dialog from "../../../Common/Dialog.jsx";
import "./AccountHead.css";

const API_ROOT = "http://localhost:8000";

const HEAD_TYPE_OPTIONS = [
  { value: 0, label: "[SELECT]" },
  { value: 1, label: "Direct Expense" },
  { value: 2, label: "Indirect Expense" },
  { value: 3, label: "Purchase Account" },
  { value: 4, label: "Sales Account" },
  { value: 5, label: "Bank Account" },
  { value: 6, label: "Cash-in-Hand" },
  { value: 7, label: "Duties & Taxes" },
  { value: 8, label: "Current Assets" },
  { value: 9, label: "Current Liabilities" },
  { value: 10, label: "Sundry Debtors" },
  { value: 11, label: "Sundry Creditors" },
  { value: 12, label: "Capital Account" },
];

export default function AccountHead({ adminId = 1, onExit }) {
  const [groupHeads, setGroupHeads] = useState([]);
  const [loadingGroupHeads, setLoadingGroupHeads] = useState(false);
  const [dialog, setDialog] = useState(null);

  // Load group heads for the dropdown
  const loadGroupHeads = useCallback(async () => {
    try {
      setLoadingGroupHeads(true);
      const res = await fetch(`${API_ROOT}/group-heads/`);
      if (!res.ok) throw new Error("Failed to load group heads");
      const data = await res.json();
      setGroupHeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load group heads:", err);
    } finally {
      setLoadingGroupHeads(false);
    }
  }, []);

  useEffect(() => {
    loadGroupHeads();
  }, [loadGroupHeads]);

  // Listing Columns
  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Account Head Name",
        required: true,
        maxLength: 50,
        transform: (v) => (v ? v.toString().toUpperCase() : ""),
      },
      {
        name: "shortname",
        label: "Short Name",
        required: true,
        maxLength: 25,
        transform: (v) => (v ? v.toString().toUpperCase() : ""),
      },
      {
        name: "group_head_name",
        label: "Group Head",
      },
      {
        name: "classification_name",
        label: "Classification Name",
      },
      {
        name: "accessible_value",
        label: "Accessible Value",
        type: "boolean",
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
      },
    ],
    []
  );

  // Custom Form recreating the exact legacy ERP UI from Screenshot 3
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      const handleUppercaseInput = (field, maxLen) => (e) => {
        const val = e.target.value.toUpperCase();
        if (maxLen && val.length > maxLen) return;
        setFormData((prev) => ({ ...prev, [field]: val }));
      };

      const handleStandardInput = (field, maxLen) => (e) => {
        const val = e.target.value;
        if (maxLen && val.length > maxLen) return;
        setFormData((prev) => ({ ...prev, [field]: val }));
      };

      const handleCheckbox = (field) => (e) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
      };

      const handleHeadTypeSelect = (e) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          head_type: parseInt(e.target.value, 10) || 0,
        }));
      };

      const handleGroupHeadSelect = (e) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          group_head_id: parseInt(e.target.value, 10) || 0,
        }));
      };

      return (
        <div className="ah-container">
          <div className="ah-header-title">Account Head Master</div>

          {/* 1. Name Input */}
          <div className="ah-field-row">
            <label className="ah-label ah-label-req">Name</label>
            <div className="ah-input-wrap">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleUppercaseInput("name", 50)}
                disabled={isReadOnly}
                required
                maxLength={50}
                className="ah-input ah-input-upper"
                placeholder="ACCOUNT HEAD NAME"
              />
              <span className="ah-badge">{`${(formData.name || "").length}/50`}</span>
            </div>
          </div>

          {/* 2. Short Name Input */}
          <div className="ah-field-row">
            <label className="ah-label ah-label-req">Short Name</label>
            <div className="ah-input-wrap">
              <input
                type="text"
                name="shortname"
                value={formData.shortname || ""}
                onChange={handleUppercaseInput("shortname", 25)}
                disabled={isReadOnly}
                required
                maxLength={25}
                className="ah-input ah-input-upper"
                placeholder="SHORT NAME"
              />
              <span className="ah-badge">{`${(formData.shortname || "").length}/25`}</span>
            </div>
          </div>

          {/* 3. Head Type Dropdown */}
          <div className="ah-field-row">
            <label className="ah-label">Head Type</label>
            <div className="ah-input-wrap">
              <select
                name="head_type"
                value={formData.head_type || 0}
                onChange={handleHeadTypeSelect}
                disabled={isReadOnly}
                className="ah-select"
              >
                {HEAD_TYPE_OPTIONS.map((ht) => (
                  <option key={ht.value} value={ht.value}>
                    {ht.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Group Head Dropdown */}
          <div className="ah-field-row">
            <label className="ah-label">Group Head</label>
            <div className="ah-input-wrap">
              <select
                name="group_head_id"
                value={formData.group_head_id || 0}
                onChange={handleGroupHeadSelect}
                disabled={isReadOnly || loadingGroupHeads}
                className="ah-select"
              >
                <option value={0}>[SELECT]</option>
                {groupHeads.map((gh) => (
                  <option key={gh.id} value={gh.id}>
                    {gh.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Classification Name Input */}
          <div className="ah-field-row">
            <label className="ah-label">Classification Name</label>
            <div className="ah-input-wrap">
              <input
                type="text"
                name="classification_name"
                value={formData.classification_name || ""}
                onChange={handleStandardInput("classification_name", 50)}
                disabled={isReadOnly}
                maxLength={50}
                className="ah-input"
                placeholder="Classification Name"
              />
              <span className="ah-badge">{`${(formData.classification_name || "").length}/50`}</span>
            </div>
          </div>

          {/* 6. Accessible Value Checkbox & Active Checkbox */}
          <div className="ah-bottom-row">
            <label className="ah-check-inline">
              <input
                type="checkbox"
                name="accessible_value"
                checked={!!formData.accessible_value}
                onChange={handleCheckbox("accessible_value")}
                disabled={isReadOnly}
              />
              Accessible Value
            </label>

            <label className="ah-check-inline">
              <input
                type="checkbox"
                name="active"
                checked={formData.active !== undefined ? !!formData.active : true}
                onChange={handleCheckbox("active")}
                disabled={isReadOnly}
              />
              Active
            </label>
          </div>
        </div>
      );
    },
    [groupHeads, loadingGroupHeads]
  );

  return (
    <>
      <Tools
        title="Account Head"
        columns={columns}
        apiBase={`${API_ROOT}/account-heads/`}
        extraPayload={{ admin_id: adminId }}
        customForm={renderCustomForm}
        modalWidth="540px"
        onExit={onExit}
      />

      {dialog && (
        <Dialog
          isOpen={dialog.isOpen}
          title={dialog.title}
          message={dialog.message}
          type={dialog.type}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          onConfirm={dialog.onConfirm}
          onCancel={() => setDialog(null)}
        />
      )}
    </>
  );
}
