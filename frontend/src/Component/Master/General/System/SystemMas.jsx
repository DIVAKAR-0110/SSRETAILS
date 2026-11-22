// frontend/src/Component/Master/General/System/SystemMas.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./SystemMas.css";

const API_ROOT = "http://localhost:8000";

const ALLOW_QTY_TYPE_OPTIONS = [
  { value: 0, label: "+/-" },
  { value: 1, label: "+" },
  { value: 2, label: "-" },
];

export default function SystemMas({ adminId = 1, onExit }) {
  const [locations, setLocations] = useState([]);
  const [floors, setFloors] = useState([]);
  const [printFunctions, setPrintFunctions] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMasters() {
      try {
        setLoadingMasters(true);
        const [locRes, floorRes, pfRes] = await Promise.all([
          fetch(`${API_ROOT}/locations/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/floors/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/print-functions/`).then((r) => r.json()).catch(() => []),
        ]);

        if (isMounted) {
          setLocations(Array.isArray(locRes) ? locRes : []);
          setFloors(Array.isArray(floorRes) ? floorRes : []);
          setPrintFunctions(Array.isArray(pfRes) ? pfRes : []);
        }
      } catch (err) {
        console.error("Failed to load System Master lookups:", err);
      } finally {
        if (isMounted) setLoadingMasters(false);
      }
    }
    loadMasters();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "System Name",
        type: "text",
        required: true,
        maxLength: 50,
      },
      {
        name: "short_name",
        label: "Short Name",
        type: "text",
        required: true,
        maxLength: 25,
      },
      {
        name: "location_name",
        label: "Location",
        type: "text",
      },
      {
        name: "floor_name",
        label: "Floor",
        type: "text",
      },
      {
        name: "mac_id",
        label: "MAC-ID",
        type: "text",
      },
      {
        name: "group_bill_prefix",
        label: "Bill Prefix",
        type: "text",
      },
      {
        name: "print_function_name",
        label: "Print Selection",
        type: "text",
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
      },
    ],
    []
  );

  const generateMacId = useCallback((setFormData) => {
    // Generate or format a simulated 12-character hex MAC address matching Screenshot 1 format (e.g. C9DD9CFDC138)
    const hex = "0123456789ABCDEF";
    let mac = "";
    for (let i = 0; i < 12; i++) {
      mac += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    setFormData((prev) => ({ ...prev, mac_id: mac }));
  }, []);

  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      return (
        <div className="system-form-container">
          <fieldset className="system-fieldset">
            <legend className="system-legend">SYSTEM MASTER</legend>

            {/* Location row + Get MAC-ID button */}
            <div className="system-form-row">
              <label className="system-form-label required">Location</label>
              <select
                name="location_id"
                value={formData.location_id || ""}
                onChange={handleChange}
                disabled={isReadOnly}
                className="system-form-input"
                required
              >
                <option value="">[SELECT LOCATION]</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              {!isReadOnly && (
                <button
                  type="button"
                  className="system-mac-btn"
                  onClick={() => generateMacId(setFormData)}
                >
                  Get MAC-ID
                </button>
              )}
            </div>

            {/* Floor row */}
            <div className="system-form-row">
              <label className="system-form-label">Floor</label>
              <select
                name="floor_id"
                value={formData.floor_id || 0}
                onChange={handleChange}
                disabled={isReadOnly}
                className="system-form-input"
              >
                <option value="0">[SELECT]</option>
                {floors.map((fl) => (
                  <option key={fl.id} value={fl.id}>
                    {fl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className="system-form-row">
              <label className="system-form-label required">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={(e) =>
                  handleChange({
                    target: { name: "name", value: e.target.value.toUpperCase() },
                  })
                }
                disabled={isReadOnly}
                className="system-form-input"
                maxLength={50}
                required
              />
            </div>

            {/* Short Name */}
            <div className="system-form-row">
              <label className="system-form-label required">Short Name</label>
              <input
                type="text"
                name="short_name"
                value={formData.short_name || ""}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "short_name",
                      value: e.target.value.toUpperCase(),
                    },
                  })
                }
                disabled={isReadOnly}
                className="system-form-input"
                maxLength={25}
                required
              />
            </div>

            {/* MAC-ID */}
            <div className="system-form-row">
              <label className="system-form-label">MAC-ID</label>
              <input
                type="text"
                name="mac_id"
                value={formData.mac_id || ""}
                onChange={handleChange}
                disabled={isReadOnly}
                className="system-form-input"
                maxLength={50}
              />
            </div>

            {/* Group Bill Prefix */}
            <div className="system-form-row">
              <label className="system-form-label">Group Bill Prefix</label>
              <input
                type="text"
                name="group_bill_prefix"
                value={formData.group_bill_prefix || ""}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "group_bill_prefix",
                      value: e.target.value.toUpperCase(),
                    },
                  })
                }
                disabled={isReadOnly}
                className="system-form-input"
                maxLength={10}
              />
            </div>

            {/* Print Bill Selection */}
            <div className="system-form-row">
              <label className="system-form-label">Print Bill Selection</label>
              <select
                name="print_function_code"
                value={formData.print_function_code || 0}
                onChange={handleChange}
                disabled={isReadOnly}
                className="system-form-input"
              >
                <option value="0">[SELECT]</option>
                {printFunctions.map((pf) => (
                  <option key={pf.id} value={pf.id}>
                    {pf.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cashier Bill Selection */}
            <div className="system-form-row">
              <label className="system-form-label">Cashier Bill Selection</label>
              <select
                name="settlement_print_function_code"
                value={formData.settlement_print_function_code || 0}
                onChange={handleChange}
                disabled={isReadOnly}
                className="system-form-input"
              >
                <option value="0">[SELECT]</option>
                {printFunctions.map((pf) => (
                  <option key={pf.id} value={pf.id}>
                    {pf.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Allow Qty Type */}
            <div className="system-form-row">
              <label className="system-form-label">Allow Qty Type</label>
              <select
                name="return_system"
                value={formData.return_system !== undefined ? formData.return_system : 0}
                onChange={handleChange}
                disabled={isReadOnly}
                className="system-form-input"
              >
                {ALLOW_QTY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ref No */}
            <div className="system-form-row">
              <label className="system-form-label">Ref No</label>
              <input
                type="text"
                name="sys_ref_no"
                value={formData.sys_ref_no || ""}
                onChange={handleChange}
                disabled={isReadOnly}
                className="system-form-input"
                maxLength={10}
              />
            </div>

            {/* Active Checkbox */}
            <div className="system-checkbox-row">
              <input
                type="checkbox"
                id="sys_active"
                name="active"
                checked={formData.active !== undefined ? !!formData.active : true}
                onChange={(e) =>
                  handleChange({
                    target: { name: "active", value: e.target.checked },
                  })
                }
                disabled={isReadOnly}
              />
              <label htmlFor="sys_active" className="system-checkbox-label">
                Active
              </label>
            </div>
          </fieldset>
        </div>
      );
    },
    [locations, floors, printFunctions, generateMacId]
  );

  return (
    <Tools
      title="System Master"
      columns={columns}
      apiBase={`${API_ROOT}/system-mas/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="620px"
      onExit={onExit}
    />
  );
}
