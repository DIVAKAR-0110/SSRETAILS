// frontend/src/Component/Master/General/IncomeAndExpense/IncomeAndExpense.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./IncomeAndExpense.css";

const API_ROOT = "http://localhost:8000";

export default function IncomeAndExpense({ adminId = 0, onExit }) {
  const [accountHeads, setAccountHeads] = useState([]);
  const [loadingHeads, setLoadingHeads] = useState(false);

  // Fetch account heads for the AccountHeadCode dropdown
  useEffect(() => {
    let isMounted = true;
    async function loadAccountHeads() {
      try {
        setLoadingHeads(true);
        const res = await fetch(`${API_ROOT}/account-heads/`);
        if (!res.ok) throw new Error("Failed to load account heads");
        const data = await res.json();
        if (isMounted) {
          setAccountHeads(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load account heads:", err);
      } finally {
        if (isMounted) setLoadingHeads(false);
      }
    }
    loadAccountHeads();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listing columns for Tools
  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Name",
        required: true,
        transform: (v) => (v ? v.toString().toUpperCase() : ""),
      },
      {
        name: "shortname",
        label: "Short Name",
        required: true,
        transform: (v) => (v ? v.toString().toUpperCase() : ""),
      },
      {
        name: "account_head_name",
        label: "Account Head Name",
      },
      {
        name: "account_post",
        label: "Account Post",
        type: "boolean",
      },
      {
        name: "head_type",
        label: "Advance",
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

  // Custom Form recreating the exact legacy .NET ERP layout from screenshot
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      const handleNameChange = (e) => {
        const val = e.target.value.toUpperCase();
        if (val.length <= 50) {
          setFormData((prev) => ({ ...prev, name: val }));
        }
      };

      const handleShortnameChange = (e) => {
        const val = e.target.value.toUpperCase();
        if (val.length <= 25) {
          setFormData((prev) => ({ ...prev, shortname: val }));
        }
      };

      const handleHeadNameChange = (e) => {
        const val = e.target.value;
        if (val.length <= 100) {
          setFormData((prev) => ({ ...prev, account_head_name: val }));
        }
      };

      const handleAccountPostToggle = (e) => {
        if (isReadOnly) return;
        const checked = e.target.checked;
        setFormData((prev) => ({
          ...prev,
          account_post: checked,
          account_head_code: checked ? prev.account_head_code || 0 : 0,
        }));
      };

      const handleAccountHeadSelect = (e) => {
        if (isReadOnly) return;
        const selectedCode = parseInt(e.target.value, 10) || 0;
        const matched = accountHeads.find((h) => h.id === selectedCode);
        setFormData((prev) => ({
          ...prev,
          account_head_code: selectedCode,
          account_head_name: matched ? matched.name : prev.account_head_name || "",
        }));
      };

      const handleAdvanceToggle = (e) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, head_type: e.target.checked }));
      };

      const handleActiveToggle = (e) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, active: e.target.checked }));
      };

      return (
        <div className="inc-exp-container">
          <div className="inc-exp-header-title">Income and Expense</div>

          {/* 1. Name Input */}
          <div className="inc-exp-field-row">
            <label className="inc-exp-label">Name</label>
            <div className="inc-exp-input-wrap">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleNameChange}
                disabled={isReadOnly}
                required
                maxLength={50}
                className="inc-exp-input inc-exp-input-upper"
                placeholder="INCOME / EXPENSE NAME"
              />
              <span className="inc-exp-badge">{`${(formData.name || "").length}/50`}</span>
            </div>
          </div>

          {/* 2. Short Name Input */}
          <div className="inc-exp-field-row">
            <label className="inc-exp-label">Short Name</label>
            <div className="inc-exp-input-wrap">
              <input
                type="text"
                name="shortname"
                value={formData.shortname || ""}
                onChange={handleShortnameChange}
                disabled={isReadOnly}
                required
                maxLength={25}
                className="inc-exp-input inc-exp-input-upper"
                placeholder="SHORT NAME"
              />
              <span className="inc-exp-badge">{`${(formData.shortname || "").length}/25`}</span>
            </div>
          </div>

          {/* 3. Account HeadName Input */}
          <div className="inc-exp-field-row">
            <label className="inc-exp-label">Account HeadName</label>
            <div className="inc-exp-input-wrap">
              <input
                type="text"
                name="account_head_name"
                value={formData.account_head_name || ""}
                onChange={handleHeadNameChange}
                disabled={isReadOnly}
                maxLength={100}
                className="inc-exp-input"
                placeholder="Account Head Name"
              />
              <span className="inc-exp-badge">{`${(formData.account_head_name || "").length}/100`}</span>
            </div>
          </div>

          {/* 4. AccountPost Checkbox + AccountHeadCode Dropdown */}
          <div className="inc-exp-post-row">
            <label className="inc-exp-check-label">
              <input
                type="checkbox"
                name="account_post"
                checked={!!formData.account_post}
                onChange={handleAccountPostToggle}
                disabled={isReadOnly}
              />
              AccountPost
            </label>

            <div className="inc-exp-dropdown-wrap">
              <label className="inc-exp-dropdown-label">AccountHeadCode</label>
              <select
                name="account_head_code"
                value={formData.account_head_code || 0}
                onChange={handleAccountHeadSelect}
                disabled={isReadOnly || !formData.account_post || loadingHeads}
                className="inc-exp-select"
              >
                <option value={0}>[SELECT]</option>
                {accountHeads.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Advance Checkbox (HeadType) + Active Checkbox */}
          <div className="inc-exp-bottom-checks">
            <label className="inc-exp-check-label">
              <input
                type="checkbox"
                name="head_type"
                checked={!!formData.head_type}
                onChange={handleAdvanceToggle}
                disabled={isReadOnly}
              />
              Advance
            </label>

            <label className="inc-exp-check-label">
              <input
                type="checkbox"
                name="active"
                checked={formData.active !== undefined ? !!formData.active : true}
                onChange={handleActiveToggle}
                disabled={isReadOnly}
              />
              Active
            </label>
          </div>
        </div>
      );
    },
    [accountHeads, loadingHeads]
  );

  return (
    <Tools
      title="Income and Expense"
      columns={columns}
      apiBase={`${API_ROOT}/income-expenses/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="540px"
      onExit={onExit}
    />
  );
}
