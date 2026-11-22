// frontend/src/Component/Master/Accounts/Naration/Naration.jsx
import React, { useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./Naration.css";

const API_ROOT = "http://localhost:8000";

export default function Naration({ adminId = 1, onExit }) {
  // Listing Columns
  const columns = useMemo(
    () => [
      {
        name: "naration",
        label: "Naration",
        required: true,
        maxLength: 200,
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
      },
    ],
    []
  );

  // Custom Form matching Image 2
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      const handleNarationChange = (e) => {
        const val = e.target.value;
        if (val.length <= 200) {
          setFormData((prev) => ({ ...prev, naration: val }));
        }
      };

      const handleActiveToggle = (e) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, active: e.target.checked }));
      };

      return (
        <div className="nar-container">
          <div className="nar-header-title">Naration</div>

          {/* Naration Input */}
          <div className="nar-field-row">
            <label className="nar-label nar-label-req">Naration</label>
            <div className="nar-input-wrap">
              <input
                type="text"
                name="naration"
                value={formData.naration || ""}
                onChange={handleNarationChange}
                disabled={isReadOnly}
                required
                maxLength={200}
                className="nar-input"
                placeholder="ENTER NARATION"
              />
              <span className="nar-badge">
                {`${(formData.naration || "").length}/200`}
              </span>
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="nar-bottom-row">
            <label className="nar-check-inline">
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
    []
  );

  return (
    <Tools
      title="Naration"
      columns={columns}
      apiBase={`${API_ROOT}/accounts/narations/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="500px"
      onExit={onExit}
    />
  );
}
