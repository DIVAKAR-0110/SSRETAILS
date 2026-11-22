// frontend/src/Component/Master/General/Counter/Counter.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./Counter.css";

const API_ROOT = "http://localhost:8000";

export default function Counter({ adminId = 1, onExit }) {
  const [locations, setLocations] = useState([]);
  const [counterGroups, setCounterGroups] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMasters() {
      try {
        setLoadingMasters(true);
        const [locRes, grpRes] = await Promise.all([
          fetch(`${API_ROOT}/locations/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/counter-groups/`).then((r) => r.json()).catch(() => []),
        ]);

        if (isMounted) {
          setLocations(Array.isArray(locRes) ? locRes : []);
          setCounterGroups(Array.isArray(grpRes) ? grpRes : []);
        }
      } catch (err) {
        console.error("Failed to load Counter lookups:", err);
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
        label: "Counter Name",
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
        name: "counter_group_name",
        label: "Counter Group",
        type: "text",
      },
      {
        name: "counter_order",
        label: "Order",
        type: "number",
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
        <div className="counter-form-container">
          <fieldset className="counter-fieldset">
            <legend className="counter-legend">COUNTER MASTER</legend>

            {/* Location row */}
            <div className="counter-form-row">
              <label className="counter-form-label required">Location</label>
              <select
                name="location_id"
                value={formData.location_id || ""}
                onChange={handleChange}
                disabled={isReadOnly}
                className="counter-form-input"
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
            <div className="counter-form-row">
              <label className="counter-form-label required">Name</label>
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
                className="counter-form-input"
                maxLength={50}
                required
              />
            </div>

            {/* Short Name */}
            <div className="counter-form-row">
              <label className="counter-form-label required">Short Name</label>
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
                className="counter-form-input"
                maxLength={25}
                required
              />
            </div>

            {/* Counter Group */}
            <div className="counter-form-row">
              <label className="counter-form-label">Counter Group</label>
              <select
                name="counter_group_id"
                value={formData.counter_group_id || 0}
                onChange={handleChange}
                disabled={isReadOnly}
                className="counter-form-input"
              >
                <option value="0">[SELECT]</option>
                {counterGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Counter Order */}
            <div className="counter-form-row">
              <label className="counter-form-label">Counter Order</label>
              <input
                type="number"
                name="counter_order"
                value={formData.counter_order !== undefined ? formData.counter_order : 0}
                onChange={handleChange}
                disabled={isReadOnly}
                className="counter-form-input"
                min="0"
                step="1"
              />
            </div>

            {/* Active Checkbox */}
            <div className="counter-checkbox-row">
              <input
                type="checkbox"
                id="counter_active"
                name="active"
                checked={formData.active !== undefined ? !!formData.active : true}
                onChange={(e) =>
                  handleChange({
                    target: { name: "active", value: e.target.checked },
                  })
                }
                disabled={isReadOnly}
              />
              <label htmlFor="counter_active" className="counter-checkbox-label">
                Active
              </label>
            </div>
          </fieldset>
        </div>
      );
    },
    [locations, counterGroups]
  );

  return (
    <Tools
      title="Counter Master"
      columns={columns}
      apiBase={`${API_ROOT}/counters/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="560px"
      onExit={onExit}
    />
  );
}
