// frontend/src/Component/Master/Accounts/AccountsGroupHead/AccountsGroupHead.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import Dialog from "../../../Common/Dialog.jsx";
import "./AccountsGroupHead.css";

const API_ROOT = "http://localhost:8000";

const AC_TYPE_OPTIONS = [
  { value: "Trading A/C", label: "Trading A/C" },
  { value: "Profit and Loss A/C", label: "Profit and Loss A/C" },
  { value: "Balance Sheet", label: "Balance Sheet" },
];

const HEAD_TYPE_OPTIONS = [
  { value: 0, label: "[SELECT]" },
  { value: 1, label: "Asset" },
  { value: 2, label: "Liabilities" },
  { value: 3, label: "Income" },
  { value: 4, label: "Expenses" },
];

export default function AccountsGroupHead({ adminId = 1, onExit }) {
  const [superiorGroups, setSuperiorGroups] = useState([]);
  const [accountSides, setAccountSides] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [dialog, setDialog] = useState(null);

  // Load superior group heads & account sides
  const loadLookups = useCallback(async () => {
    try {
      setLoadingLookups(true);
      const [ghRes, sideRes] = await Promise.all([
        fetch(`${API_ROOT}/accounts/group-heads/`),
        fetch(`${API_ROOT}/accounts/sides/`),
      ]);

      const [ghData, sideData] = await Promise.all([
        ghRes.json().catch(() => []),
        sideRes.json().catch(() => []),
      ]);

      setSuperiorGroups(Array.isArray(ghData) ? ghData : []);
      setAccountSides(Array.isArray(sideData) ? sideData : []);
    } catch (err) {
      console.error("Failed to load accounts group head lookups:", err);
    } finally {
      setLoadingLookups(false);
    }
  }, []);

  useEffect(() => {
    loadLookups();
  }, [loadLookups]);

  // Listing Columns
  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Name",
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
        name: "parent_group_name",
        label: "Superior Group Head",
      },
      {
        name: "ac_type",
        label: "A/C Type",
      },
      {
        name: "sort_by",
        label: "Sort By",
        type: "number",
      },
      {
        name: "need_detail_report",
        label: "Detail Report",
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

  // Custom Form matching Image 1
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      const handleUppercaseInput = (field, maxLen) => (e) => {
        const val = e.target.value.toUpperCase();
        if (maxLen && val.length > maxLen) return;
        setFormData((prev) => ({ ...prev, [field]: val }));
      };

      const handleNumericInput = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      };

      const handleCheckbox = (field) => (e) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
      };

      const handleSuperiorGroupChange = (e) => {
        if (isReadOnly) return;
        const code = parseInt(e.target.value, 10) || 0;
        const matched = superiorGroups.find((g) => g.id === code);
        setFormData((prev) => ({
          ...prev,
          group_head_code: code,
          // auto fill ac_type and head_type if superior group has them
          ac_type: matched && matched.ac_type ? matched.ac_type : prev.ac_type || "Trading A/C",
          head_type: matched && matched.head_type ? matched.head_type : prev.head_type || 0,
        }));
      };

      const handleAcTypeChange = (val) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, ac_type: val }));
      };

      return (
        <div className="agh-container">
          <div className="agh-header-title">Account Group Head</div>

          {/* 1. Name */}
          <div className="agh-field-row">
            <label className="agh-label agh-label-req">Name</label>
            <div className="agh-input-wrap">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleUppercaseInput("name", 50)}
                disabled={isReadOnly}
                required
                maxLength={50}
                className="agh-input agh-input-upper"
                placeholder="GROUP HEAD NAME"
              />
              <span className="agh-badge">{`${(formData.name || "").length}/50`}</span>
            </div>
          </div>

          {/* 2. Short Name */}
          <div className="agh-field-row">
            <label className="agh-label agh-label-req">Short Name</label>
            <div className="agh-input-wrap">
              <input
                type="text"
                name="shortname"
                value={formData.shortname || ""}
                onChange={handleUppercaseInput("shortname", 25)}
                disabled={isReadOnly}
                required
                maxLength={25}
                className="agh-input agh-input-upper"
                placeholder="SHORT NAME"
              />
              <span className="agh-badge">{`${(formData.shortname || "").length}/25`}</span>
            </div>
          </div>

          {/* 3. Superior Group Head */}
          <div className="agh-field-row">
            <label className="agh-label">Superior Group Head</label>
            <div className="agh-input-wrap">
              <select
                name="group_head_code"
                value={formData.group_head_code || 0}
                onChange={handleSuperiorGroupChange}
                disabled={isReadOnly || loadingLookups}
                className="agh-select"
              >
                <option value={0}>[SELECT]</option>
                {superiorGroups
                  .filter((g) => !formData.id || g.id !== formData.id)
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* 4. A/C Type * */}
          <div className="agh-field-row" style={{ alignItems: "flex-start" }}>
            <label className="agh-label agh-label-req" style={{ marginTop: "4px" }}>
              A/C Type
            </label>
            <div className="agh-actype-box">
              {AC_TYPE_OPTIONS.map((opt) => (
                <label key={opt.value} className="agh-radio-label">
                  <input
                    type="radio"
                    name="ac_type"
                    value={opt.value}
                    checked={(formData.ac_type || "Trading A/C") === opt.value}
                    onChange={() => handleAcTypeChange(opt.value)}
                    disabled={isReadOnly}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* 5. Head Type * */}
          <div className="agh-field-row">
            <label className="agh-label agh-label-req">Head Type</label>
            <div className="agh-input-wrap">
              <select
                name="head_type"
                value={formData.head_type || 0}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    head_type: parseInt(e.target.value, 10) || 0,
                  }))
                }
                disabled={isReadOnly}
                className="agh-select"
              >
                {HEAD_TYPE_OPTIONS.map((ht) => (
                  <option key={ht.value} value={ht.value}>
                    {ht.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Sort By * */}
          <div className="agh-field-row">
            <label className="agh-label agh-label-req">Sort By</label>
            <div className="agh-input-wrap">
              <input
                type="number"
                step="1"
                name="sort_by"
                value={formData.sort_by !== undefined ? formData.sort_by : 0}
                onChange={handleNumericInput("sort_by")}
                disabled={isReadOnly}
                className="agh-input-stepper"
              />
            </div>
          </div>

          {/* 7. Need Detail Report? */}
          <div className="agh-field-row" style={{ paddingLeft: "140px" }}>
            <label className="agh-check-inline">
              <input
                type="checkbox"
                name="need_detail_report"
                checked={!!formData.need_detail_report}
                onChange={handleCheckbox("need_detail_report")}
                disabled={isReadOnly}
              />
              Need Detail Report?
            </label>
          </div>

          {/* 8. Final Account(Side) */}
          <div className="agh-field-row">
            <label className="agh-label">Final Account(Side)</label>
            <div className="agh-input-wrap">
              <select
                name="account_side"
                value={formData.account_side || 0}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    account_side: parseInt(e.target.value, 10) || 0,
                  }))
                }
                disabled={isReadOnly || loadingLookups}
                className="agh-select"
              >
                <option value={0}>[SELECT]</option>
                {accountSides.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.side}
                  </option>
                ))}
                {accountSides.length === 0 && (
                  <>
                    <option value={1}>Asset / Left (Debit)</option>
                    <option value={2}>Liability / Right (Credit)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* 9. Bottom Row: F5 -> Refresh hint & Active Checkbox */}
          <div className="agh-bottom-row">
            <span className="agh-refresh-hint" onClick={loadLookups} title="Reload lookups">
              F5 -&gt; Refresh
            </span>

            <label className="agh-check-inline">
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
    [superiorGroups, accountSides, loadingLookups, loadLookups]
  );

  return (
    <>
      <Tools
        title="Accounts Group Head"
        columns={columns}
        apiBase={`${API_ROOT}/accounts/group-heads/`}
        extraPayload={{ admin_id: adminId }}
        customForm={renderCustomForm}
        modalWidth="580px"
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
