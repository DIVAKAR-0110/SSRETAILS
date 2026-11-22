// frontend/src/Component/Master/General/CounterGroup1/CounterGroup1.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./CounterGroup1.css";

const API_ROOT = "http://localhost:8000";

export default function CounterGroup1({ adminId = 1, onExit }) {
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadLocations() {
      try {
        setLoadingLocations(true);
        const res = await fetch(`${API_ROOT}/locations/`);
        const data = await res.json();
        if (isMounted) {
          setLocations(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load locations for Counter Group", err);
      } finally {
        if (isMounted) setLoadingLocations(false);
      }
    }
    loadLocations();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Counter Group Name",
        type: "text",
        required: true,
        maxLength: 50,
      },
      {
        name: "shortname",
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
        name: "active",
        label: "Active",
        type: "boolean",
      },
    ],
    []
  );

  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      return (
        <div className="cg-form-container">
          <fieldset className="cg-fieldset">
            <legend className="cg-legend">COUNTER GROUP MASTER</legend>

            {/* Location row */}
            <div className="cg-form-row">
              <label className="cg-form-label required">Location</label>
              <select
                name="location_id"
                value={formData.location_id || ""}
                onChange={handleChange}
                disabled={isReadOnly}
                className="cg-form-input"
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

            {/* Name */}
            <div className="cg-form-row">
              <label className="cg-form-label required">Name</label>
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
                className="cg-form-input"
                maxLength={50}
                required
              />
            </div>

            {/* Short Name */}
            <div className="cg-form-row">
              <label className="cg-form-label required">Short Name</label>
              <input
                type="text"
                name="shortname"
                value={formData.shortname || ""}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "shortname",
                      value: e.target.value.toUpperCase(),
                    },
                  })
                }
                disabled={isReadOnly}
                className="cg-form-input"
                maxLength={25}
                required
              />
            </div>

            {/* Active Checkbox */}
            <div className="cg-checkbox-row">
              <input
                type="checkbox"
                id="cg_active"
                name="active"
                checked={formData.active !== undefined ? !!formData.active : true}
                onChange={(e) =>
                  handleChange({
                    target: { name: "active", value: e.target.checked },
                  })
                }
                disabled={isReadOnly}
              />
              <label htmlFor="cg_active" className="cg-checkbox-label">
                Active
              </label>
            </div>
          </fieldset>
        </div>
      );
    },
    [locations]
  );

  return (
    <Tools
      title="Counter Group Master"
      columns={columns}
      apiBase={`${API_ROOT}/counter-groups/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="560px"
      onExit={onExit}
    />
  );
}
