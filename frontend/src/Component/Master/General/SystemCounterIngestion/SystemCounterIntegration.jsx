// frontend/src/Component/Master/General/SystemCounterIngestion/SystemCounterIntegration.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./SystemCounterIntegration.css";

const API_ROOT = "http://localhost:8000";

export default function SystemCounterIntegration({ adminId = 1, onExit }) {
  const [locations, setLocations] = useState([]);
  const [counters, setCounters] = useState([]);
  const [systems, setSystems] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMasters() {
      try {
        setLoadingMasters(true);
        const [locRes, countRes, sysRes] = await Promise.all([
          fetch(`${API_ROOT}/locations/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/counters/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/system-mas/`).then((r) => r.json()).catch(() => []),
        ]);

        if (isMounted) {
          setLocations(Array.isArray(locRes) ? locRes : []);
          setCounters(Array.isArray(countRes) ? countRes : []);
          setSystems(Array.isArray(sysRes) ? sysRes : []);
        }
      } catch (err) {
        console.error("Failed to load System Counter Integration lookups:", err);
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
        name: "location_name",
        label: "Location",
        type: "text",
      },
      {
        name: "counter_name",
        label: "Counter",
        type: "text",
      },
      {
        name: "counter_type",
        label: "Counter Type",
        type: "text",
      },
      {
        name: "systems_display",
        label: "Integrated Systems",
        type: "text",
      },
    ],
    []
  );

  // Pre-process rows for Tools so systems are displayed nicely in table
  const transformRowData = useCallback((row) => {
    const sysNames = (row.systems || [])
      .map((s) => s.system_name || `Sys #${s.system_id}`)
      .filter(Boolean)
      .join(", ");
    return {
      ...row,
      systems_display: sysNames || "None",
    };
  }, []);

  const handleAddSystemRow = useCallback((setFormData) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.systems) ? [...prev.systems] : [];
      return {
        ...prev,
        systems: [...currentList, { system_id: "" }],
      };
    });
  }, []);

  const handleRemoveSystemRow = useCallback((setFormData, index) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.systems) ? [...prev.systems] : [];
      currentList.splice(index, 1);
      return {
        ...prev,
        systems: currentList,
      };
    });
  }, []);

  const handleSystemRowChange = useCallback((setFormData, index, systemId) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.systems) ? [...prev.systems] : [];
      currentList[index] = {
        ...currentList[index],
        system_id: parseInt(systemId, 10) || "",
      };
      return {
        ...prev,
        systems: currentList,
      };
    });
  }, []);

  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";
      const systemRows = Array.isArray(formData.systems) ? formData.systems : [];

      // Filter counters by location if location selected
      const filteredCounters = formData.location_id
        ? counters.filter((c) => String(c.location_id) === String(formData.location_id))
        : counters;

      return (
        <div className="sci-form-container">
          <fieldset className="sci-fieldset">
            <legend className="sci-legend">SYSTEM - COUNTER INTEGRATION</legend>

            {/* Location row */}
            <div className="sci-form-row">
              <label className="sci-form-label required">Location</label>
              <select
                name="location_id"
                value={formData.location_id || ""}
                onChange={handleChange}
                disabled={isReadOnly}
                className="sci-form-input"
                required
              >
                <option value="">[SELECT LOCATION]</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Radio Group for Counter Type */}
            <div className="sci-radio-group">
              <label className="sci-radio-item">
                <input
                  type="radio"
                  name="counter_type"
                  value="SALES"
                  checked={!formData.counter_type || formData.counter_type === "SALES"}
                  onChange={() =>
                    handleChange({
                      target: { name: "counter_type", value: "SALES" },
                    })
                  }
                  disabled={isReadOnly}
                />
                Sales Counter
              </label>

              <label className="sci-radio-item">
                <input
                  type="radio"
                  name="counter_type"
                  value="SETTLEMENT"
                  checked={formData.counter_type === "SETTLEMENT"}
                  onChange={() =>
                    handleChange({
                      target: { name: "counter_type", value: "SETTLEMENT" },
                    })
                  }
                  disabled={isReadOnly}
                />
                Settlement Counter
              </label>
            </div>

            {/* Counter row */}
            <div className="sci-form-row">
              <label className="sci-form-label required">Counter</label>
              <select
                name="counter_id"
                value={formData.counter_id || ""}
                onChange={handleChange}
                disabled={isReadOnly}
                className="sci-form-input"
                required
              >
                <option value="">[SELECT COUNTER]</option>
                {filteredCounters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Integrated Systems Sub-grid */}
            <div className="sci-table-wrapper">
              <table className="sci-subgrid">
                <thead>
                  <tr>
                    <th style={{ width: "40px", textAlign: "center" }}>#</th>
                    <th>System Name</th>
                    {!isReadOnly && <th style={{ width: "60px", textAlign: "center" }}>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {systemRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isReadOnly ? 2 : 3}
                        style={{ textAlign: "center", color: "#888", padding: "10px" }}
                      >
                        No systems added yet. Click &quot;+ Add System Row&quot; below.
                      </td>
                    </tr>
                  ) : (
                    systemRows.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>
                          {idx + 1}
                        </td>
                        <td>
                          <select
                            value={row.system_id || ""}
                            onChange={(e) =>
                              handleSystemRowChange(setFormData, idx, e.target.value)
                            }
                            disabled={isReadOnly}
                            className="sci-form-input"
                            style={{ width: "100%", maxWidth: "100%" }}
                          >
                            <option value="">[SELECT SYSTEM]</option>
                            {systems.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.short_name || s.id})
                              </option>
                            ))}
                          </select>
                        </td>
                        {!isReadOnly && (
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              className="sci-btn-remove"
                              onClick={() => handleRemoveSystemRow(setFormData, idx)}
                              title="Remove System"
                            >
                              ✕
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!isReadOnly && (
              <button
                type="button"
                className="sci-btn-add"
                onClick={() => handleAddSystemRow(setFormData)}
              >
                + Add System Row
              </button>
            )}
          </fieldset>
        </div>
      );
    },
    [
      locations,
      counters,
      systems,
      handleAddSystemRow,
      handleRemoveSystemRow,
      handleSystemRowChange,
    ]
  );

  return (
    <Tools
      title="System Counter Integration"
      columns={columns}
      apiBase={`${API_ROOT}/system-counter-integrations/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      dataTransformer={transformRowData}
      modalWidth="640px"
      onExit={onExit}
    />
  );
}
