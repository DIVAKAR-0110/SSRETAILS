// frontend/src/Component/Master/Tally/GroupHead/GroupHead.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import Dialog from "../../../Common/Dialog.jsx";
import "./GroupHead.css";

const API_ROOT = "http://localhost:8000";

const TYPE_OPTIONS = [
  { value: "A", label: "Asset" },
  { value: "L", label: "Liabilities" },
  { value: "I", label: "Income" },
  { value: "E", label: "Expenses" },
];

export default function GroupHead({ adminId = 1, onExit }) {
  const [parentGroups, setParentGroups] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [dialog, setDialog] = useState(null);

  // Load active group heads for parent dropdown
  const loadParentGroups = useCallback(async () => {
    try {
      setLoadingParents(true);
      const res = await fetch(`${API_ROOT}/group-heads/`);
      if (!res.ok) throw new Error("Failed to load group heads");
      const data = await res.json();
      setParentGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load group heads:", err);
    } finally {
      setLoadingParents(false);
    }
  }, []);

  useEffect(() => {
    loadParentGroups();
  }, [loadParentGroups]);

  // Table Listing Columns
  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Group Head Name",
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
        name: "is_primary",
        label: "Primary",
        type: "boolean",
      },
      {
        name: "type_name",
        label: "Type",
      },
      {
        name: "parent_group_name",
        label: "Group Head",
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
      },
    ],
    []
  );

  // Custom Form recreating the exact legacy ERP UI from user screenshots 1 & 2
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";
      const isPrimary = !!formData.is_primary;

      const handleUppercaseInput = (field, maxLen) => (e) => {
        const val = e.target.value.toUpperCase();
        if (maxLen && val.length > maxLen) return;
        setFormData((prev) => ({ ...prev, [field]: val }));
      };

      const handlePrimaryToggle = (e) => {
        if (isReadOnly) return;
        const checked = e.target.checked;
        setFormData((prev) => ({
          ...prev,
          is_primary: checked,
          // When primary is checked, group_head_code must be 0; type default to "A" if empty
          group_head_code: checked ? 0 : prev.group_head_code || 0,
          type: checked ? prev.type || "A" : null,
        }));
      };

      const handleTypeChange = (typeVal) => {
        if (isReadOnly || !isPrimary) return;
        setFormData((prev) => ({ ...prev, type: typeVal }));
      };

      const handleParentChange = (e) => {
        if (isReadOnly || isPrimary) return;
        const code = parseInt(e.target.value, 10) || 0;
        setFormData((prev) => ({ ...prev, group_head_code: code }));
      };

      return (
        <div className="gh-container">
          <div className="gh-header-title">Group Head Master</div>

          {/* 1. Name Input */}
          <div className="gh-field-row">
            <label className="gh-label gh-label-req">Name</label>
            <div className="gh-input-wrap">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleUppercaseInput("name", 50)}
                disabled={isReadOnly}
                required
                maxLength={50}
                className="gh-input gh-input-upper"
                placeholder="GROUP HEAD NAME"
              />
              <span className="gh-badge">{`${(formData.name || "").length}/50`}</span>
            </div>
          </div>

          {/* 2. Short Name Input */}
          <div className="gh-field-row">
            <label className="gh-label gh-label-req">Short Name</label>
            <div className="gh-input-wrap">
              <input
                type="text"
                name="shortname"
                value={formData.shortname || ""}
                onChange={handleUppercaseInput("shortname", 25)}
                disabled={isReadOnly}
                required
                maxLength={25}
                className="gh-input gh-input-upper"
                placeholder="SHORT NAME"
              />
              <span className="gh-badge">{`${(formData.shortname || "").length}/25`}</span>
            </div>
          </div>

          {/* 3. Classification Box: Primary + Group Head Dropdown + Type Radios */}
          <div className="gh-class-box">
            {/* Row 1: Primary Checkbox & Group Head Dropdown */}
            <div className="gh-class-row">
              <label className="gh-check-inline">
                <input
                  type="checkbox"
                  name="is_primary"
                  checked={isPrimary}
                  onChange={handlePrimaryToggle}
                  disabled={isReadOnly}
                />
                Primary
              </label>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <span className="gh-label" style={{ width: "75px" }}>Group Head</span>
                <select
                  name="group_head_code"
                  value={isPrimary ? 0 : formData.group_head_code || 0}
                  onChange={handleParentChange}
                  disabled={isReadOnly || isPrimary || loadingParents}
                  className={`gh-select ${isPrimary ? "gh-disabled" : ""}`}
                >
                  <option value={0}>[SELECT]</option>
                  {parentGroups
                    .filter((g) => !formData.id || g.id !== formData.id)
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Row 2: Type Radio Buttons (Asset, Liabilities, Income, Expenses) */}
            <div className="gh-type-row">
              <span className="gh-type-label">Type</span>
              <div className={`gh-radios-wrap ${!isPrimary ? "gh-disabled" : ""}`}>
                {TYPE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="gh-radio-label">
                    <input
                      type="radio"
                      name="group_type"
                      value={opt.value}
                      checked={isPrimary && formData.type === opt.value}
                      onChange={() => handleTypeChange(opt.value)}
                      disabled={isReadOnly || !isPrimary}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Active Checkbox */}
          <div className="gh-bottom-row">
            <label className="gh-check-inline">
              <input
                type="checkbox"
                name="active"
                checked={formData.active !== undefined ? !!formData.active : true}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, active: e.target.checked }))
                }
                disabled={isReadOnly}
              />
              Active
            </label>
          </div>
        </div>
      );
    },
    [parentGroups, loadingParents]
  );

  return (
    <>
      <Tools
        title="Group Head"
        columns={columns}
        apiBase={`${API_ROOT}/group-heads/`}
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
