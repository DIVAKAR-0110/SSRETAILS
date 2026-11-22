// frontend/src/Component/Master/General/Employee/Employee.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import Dialog from "../../../Common/Dialog.jsx";
import "./Employee.css";

const API_ROOT = "http://localhost:8000";

export default function Employee({ adminId = 1, onExit }) {
  // Master lookup states
  const [locations, setLocations] = useState([]);
  const [floors, setFloors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);

  // Dialog state for warnings / rights preview
  const [dialog, setDialog] = useState(null);

  // Load all lookups in parallel
  useEffect(() => {
    let isMounted = true;
    async function loadMasters() {
      try {
        setLoadingLookups(true);
        const [locRes, floorRes, depRes, cityRes, stateRes, countryRes, ugRes] =
          await Promise.all([
            fetch(`${API_ROOT}/locations/`),
            fetch(`${API_ROOT}/floors/`),
            fetch(`${API_ROOT}/departments/`),
            fetch(`${API_ROOT}/cities/`),
            fetch(`${API_ROOT}/states/`),
            fetch(`${API_ROOT}/countries/`),
            fetch(`${API_ROOT}/user-groups/`),
          ]);

        const [locData, floorData, depData, cityData, stateData, countryData, ugData] =
          await Promise.all([
            locRes.json().catch(() => []),
            floorRes.json().catch(() => []),
            depRes.json().catch(() => []),
            cityRes.json().catch(() => []),
            stateRes.json().catch(() => []),
            countryRes.json().catch(() => []),
            ugRes.json().catch(() => []),
          ]);

        if (isMounted) {
          setLocations(Array.isArray(locData) ? locData : []);
          setFloors(Array.isArray(floorData) ? floorData : []);
          setDepartments(Array.isArray(depData) ? depData : []);
          setCities(Array.isArray(cityData) ? cityData : []);
          setStates(Array.isArray(stateData) ? stateData : []);
          setCountries(Array.isArray(countryData) ? countryData : []);
          setUserGroups(Array.isArray(ugData) ? ugData : []);
        }
      } catch (err) {
        console.error("Failed to load employee lookups:", err);
      } finally {
        if (isMounted) setLoadingLookups(false);
      }
    }

    loadMasters();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listing columns for Tools.jsx table view
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
        name: "short_name",
        label: "Short Name",
        maxLength: 25,
        transform: (v) => (v ? v.toString().toUpperCase() : ""),
      },
      {
        name: "location_name",
        label: "Location",
      },
      {
        name: "floor_name",
        label: "Floor",
      },
      {
        name: "department_name",
        label: "Department",
      },
      {
        name: "city_name",
        label: "City",
      },
      {
        name: "mobile",
        label: "Mobile",
      },
      {
        name: "login_user",
        label: "Login User",
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

  // Custom 2-column Form recreating the exact legacy ERP UI from user screenshots
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      // On modal open with existing record, fetch incentive tiers if not loaded yet
      if (formData.id && formData.incentive_details === undefined) {
        fetch(`${API_ROOT}/employees/${formData.id}/incentives/`)
          .then((r) => r.json())
          .then((tiers) => {
            setFormData((prev) => ({
              ...prev,
              incentive_details: Array.isArray(tiers) ? tiers : [],
            }));
          })
          .catch((e) => console.error("Failed to load employee incentives:", e));
      }

      // City auto-fill state & country
      const selectedCity = cities.find(
        (c) => c.id === parseInt(formData.city_code, 10)
      );
      const stateName = selectedCity
        ? selectedCity.state_name ||
          (states.find((s) => s.id === selectedCity.state_id)?.name || "")
        : "";
      const countryName = selectedCity
        ? states.find((s) => s.id === selectedCity.state_id)?.country_name ||
          "INDIA"
        : "";

      // Handlers for inputs
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

      const handleNumericInput = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      };

      const handleCheckbox = (field) => (e) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
      };

      const handleCityChange = (e) => {
        if (isReadOnly) return;
        const cId = parseInt(e.target.value, 10) || 0;
        setFormData((prev) => ({
          ...prev,
          city_code: cId,
        }));
      };

      // DOL Toggle
      const hasDol = !!formData.dol;
      const handleDolToggle = (e) => {
        if (isReadOnly) return;
        const checked = e.target.checked;
        setFormData((prev) => ({
          ...prev,
          dol: checked ? new Date().toISOString().split("T")[0] : null,
        }));
      };

      // Incentive Grid helpers
      const incentiveTiers = formData.incentive_details || [];

      const handleAddTier = () => {
        if (isReadOnly) return;
        const newTier = {
          range_from: 0,
          range_to: 0,
          percentage: 0,
          amount: 0,
        };
        setFormData((prev) => ({
          ...prev,
          incentive_details: [...(prev.incentive_details || []), newTier],
        }));
      };

      const handleRemoveTier = (idx) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          incentive_details: (prev.incentive_details || []).filter(
            (_, i) => i !== idx
          ),
        }));
      };

      const handleTierChange = (idx, field, value) => {
        if (isReadOnly) return;
        setFormData((prev) => {
          const updated = [...(prev.incentive_details || [])];
          updated[idx] = { ...updated[idx], [field]: value };
          return { ...prev, incentive_details: updated };
        });
      };

      const handleRightsClick = () => {
        const group = userGroups.find(
          (g) => g.id === parseInt(formData.user_group_code, 10)
        );
        setDialog({
          isOpen: true,
          title: "User Group Rights",
          message: group
            ? `Security role '${group.name}' assigned with standard permissions.`
            : "Please select a User Group to view permissions.",
          type: "alert",
          confirmText: "OK",
          onConfirm: () => setDialog(null),
        });
      };

      return (
        <div className="emp-container">
          <div className="emp-header-title">Employee Master</div>

          <div className="emp-form-2col">
            {/* ================= LEFT COLUMN ================= */}
            <div className="emp-col">
              {/* Location */}
              <div className="emp-field-row">
                <label className="emp-label">Location</label>
                <div className="emp-input-wrap">
                  <select
                    name="location_code"
                    value={formData.location_code || 0}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        location_code: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    disabled={isReadOnly || loadingLookups}
                    className="emp-select"
                  >
                    <option value={0}>[SELECT]</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Floor */}
              <div className="emp-field-row">
                <label className="emp-label">Floor</label>
                <div className="emp-input-wrap">
                  <select
                    name="floor_code"
                    value={formData.floor_code || 0}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        floor_code: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    disabled={isReadOnly || loadingLookups}
                    className="emp-select"
                  >
                    <option value={0}>[SELECT]</option>
                    {floors.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name (Required, Max 50) */}
              <div className="emp-field-row">
                <label className="emp-label emp-label-req">Name</label>
                <div className="emp-input-wrap">
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleUppercaseInput("name", 50)}
                    disabled={isReadOnly}
                    required
                    maxLength={50}
                    className="emp-input emp-input-upper"
                    placeholder="EMPLOYEE NAME"
                  />
                  <span className="emp-badge">
                    {`${(formData.name || "").length}/50`}
                  </span>
                </div>
              </div>

              {/* Short Name (Max 25) */}
              <div className="emp-field-row">
                <label className="emp-label">Short Name</label>
                <div className="emp-input-wrap">
                  <input
                    type="text"
                    name="short_name"
                    value={formData.short_name || ""}
                    onChange={handleUppercaseInput("short_name", 25)}
                    disabled={isReadOnly}
                    maxLength={25}
                    className="emp-input emp-input-upper"
                    placeholder="SHORT NAME"
                  />
                  <span className="emp-badge">
                    {`${(formData.short_name || "").length}/25`}
                  </span>
                </div>
              </div>

              {/* Print Name (Max 50) */}
              <div className="emp-field-row">
                <label className="emp-label">Print Name</label>
                <div className="emp-input-wrap">
                  <input
                    type="text"
                    name="print_name"
                    value={formData.print_name || ""}
                    onChange={handleUppercaseInput("print_name", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="emp-input emp-input-upper"
                    placeholder="PRINT NAME"
                  />
                  <span className="emp-badge">
                    {`${(formData.print_name || "").length}/50`}
                  </span>
                </div>
              </div>

              {/* Address (Max 400) */}
              <div className="emp-field-row emp-field-row-top">
                <label className="emp-label">Address</label>
                <div className="emp-input-wrap">
                  <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleStandardInput("address", 400)}
                    disabled={isReadOnly}
                    maxLength={400}
                    rows={3}
                    className="emp-textarea"
                    placeholder="Door No, Street, Landmark"
                  />
                  <span className="emp-badge" style={{ bottom: "6px", right: "6px" }}>
                    {`${(formData.address || "").length}/400`}
                  </span>
                </div>
              </div>

              {/* City (Dropdown) */}
              <div className="emp-field-row">
                <label className="emp-label">City</label>
                <div className="emp-input-wrap">
                  <select
                    name="city_code"
                    value={formData.city_code || 0}
                    onChange={handleCityChange}
                    disabled={isReadOnly || loadingLookups}
                    className="emp-select"
                  >
                    <option value={0}>[SELECT]</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* State & Country Auto-filled row */}
              <div className="emp-state-country-row">
                <div className="emp-sub-field">
                  <label className="emp-sub-label">State</label>
                  <input
                    type="text"
                    value={stateName}
                    readOnly
                    className="emp-input emp-input-readonly"
                    placeholder="AUTO FILLED"
                  />
                </div>
                <div className="emp-sub-field">
                  <label className="emp-sub-label">Country</label>
                  <input
                    type="text"
                    value={countryName}
                    readOnly
                    className="emp-input emp-input-readonly"
                    placeholder="AUTO FILLED"
                  />
                </div>
              </div>

              {/* PIN/ZIP Code */}
              <div className="emp-field-row">
                <label className="emp-label">PIN/ZIP Code</label>
                <div className="emp-input-wrap">
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode || ""}
                    onChange={handleStandardInput("pincode", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="emp-input"
                    placeholder="PIN Code"
                  />
                </div>
              </div>

              {/* Phone No */}
              <div className="emp-field-row">
                <label className="emp-label">Phone No.</label>
                <div className="emp-input-wrap">
                  <input
                    type="text"
                    name="phoneno"
                    value={formData.phoneno || ""}
                    onChange={handleStandardInput("phoneno", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="emp-input"
                    placeholder="Phone No"
                  />
                </div>
              </div>

              {/* Mobile No */}
              <div className="emp-field-row">
                <label className="emp-label">Mobile No.</label>
                <div className="emp-input-wrap">
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile || ""}
                    onChange={handleStandardInput("mobile", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="emp-input"
                    placeholder="Mobile No"
                  />
                </div>
              </div>

              {/* Fax No */}
              <div className="emp-field-row">
                <label className="emp-label">Fax No.</label>
                <div className="emp-input-wrap">
                  <input
                    type="text"
                    name="fax"
                    value={formData.fax || ""}
                    onChange={handleStandardInput("fax", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="emp-input"
                    placeholder="Fax No"
                  />
                </div>
              </div>

              {/* Login Checkbox */}
              <label className="emp-login-checkbox-row">
                <input
                  type="checkbox"
                  name="login_user"
                  checked={!!formData.login_user}
                  onChange={handleCheckbox("login_user")}
                  disabled={isReadOnly}
                />
                Login
              </label>

              {/* Login Option Box */}
              <div
                className={`emp-login-box ${
                  !formData.login_user ? "emp-login-box-disabled" : ""
                }`}
              >
                <div className="emp-login-title">Login Option</div>

                <div className="emp-field-row">
                  <label className="emp-label" style={{ width: "90px" }}>
                    User Group
                  </label>
                  <div className="emp-input-wrap">
                    <select
                      name="user_group_code"
                      value={formData.user_group_code || 0}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          user_group_code: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      disabled={isReadOnly || !formData.login_user}
                      className="emp-select"
                    >
                      <option value={0}>[SELECT]</option>
                      {userGroups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="emp-field-row">
                  <label className="emp-label" style={{ width: "90px" }}>
                    Password
                  </label>
                  <div className="emp-input-wrap">
                    <input
                      type="password"
                      name="password"
                      value={formData.password || ""}
                      onChange={handleStandardInput("password", 50)}
                      disabled={isReadOnly || !formData.login_user}
                      maxLength={50}
                      className="emp-input"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="emp-field-row">
                  <label className="emp-label" style={{ width: "90px" }}>
                    Retype Pass
                  </label>
                  <div className="emp-input-wrap">
                    <input
                      type="password"
                      name="retype_password"
                      value={formData.retype_password || formData.password || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          retype_password: e.target.value,
                        }))
                      }
                      disabled={isReadOnly || !formData.login_user}
                      maxLength={50}
                      className="emp-input"
                      placeholder="Retype Password"
                    />
                  </div>
                </div>

                <div className="emp-rights-btn-row">
                  <button
                    type="button"
                    className="emp-rights-btn"
                    onClick={handleRightsClick}
                    disabled={!formData.login_user}
                  >
                    Rights
                  </button>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="emp-col">
              {/* Email Id */}
              <div className="emp-field-row">
                <label className="emp-label">Email Id.</label>
                <div className="emp-input-wrap">
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleStandardInput("email", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="emp-input"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="emp-field-row">
                <label className="emp-label">Website</label>
                <div className="emp-input-wrap">
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleStandardInput("website", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="emp-input"
                    placeholder="www.example.com"
                  />
                </div>
              </div>

              {/* DOB */}
              <div className="emp-field-row">
                <label className="emp-label">DOB</label>
                <div className="emp-input-wrap">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleStandardInput("dob")}
                    disabled={isReadOnly}
                    className="emp-input"
                  />
                </div>
              </div>

              {/* DOJ */}
              <div className="emp-field-row">
                <label className="emp-label">DOJ</label>
                <div className="emp-input-wrap">
                  <input
                    type="date"
                    name="doj"
                    value={formData.doj || ""}
                    onChange={handleStandardInput("doj")}
                    disabled={isReadOnly}
                    className="emp-input"
                  />
                </div>
              </div>

              {/* DOL with Checkbox */}
              <div className="emp-dol-row">
                <label className="emp-label">DOL</label>
                <div className="emp-dol-wrap">
                  <label className="emp-checkbox-inline">
                    <input
                      type="checkbox"
                      checked={hasDol}
                      onChange={handleDolToggle}
                      disabled={isReadOnly}
                    />
                  </label>
                  <input
                    type="date"
                    name="dol"
                    value={formData.dol || ""}
                    onChange={handleStandardInput("dol")}
                    disabled={isReadOnly || !hasDol}
                    className={`emp-input ${!hasDol ? "emp-input-readonly" : ""}`}
                  />
                </div>
              </div>

              {/* PAN */}
              <div className="emp-field-row">
                <label className="emp-label">PAN</label>
                <div className="emp-input-wrap">
                  <input
                    type="text"
                    name="panno"
                    value={formData.panno || ""}
                    onChange={handleUppercaseInput("panno", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="emp-input emp-input-upper"
                    placeholder="PAN NUMBER"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="emp-field-row">
                <label className="emp-label">Department</label>
                <div className="emp-input-wrap">
                  <select
                    name="department_code"
                    value={formData.department_code || 0}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        department_code: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    disabled={isReadOnly || loadingLookups}
                    className="emp-select"
                  >
                    <option value={0}>[SELECT]</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Commission Allowed Row */}
              <div className="emp-commission-row">
                <label className="emp-checkbox-inline">
                  <input
                    type="checkbox"
                    name="commission_allowed"
                    checked={!!formData.commission_allowed}
                    onChange={handleCheckbox("commission_allowed")}
                    disabled={isReadOnly}
                  />
                  Commission Allowed
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="emp-opt-label">Commission (%)</span>
                  <input
                    type="number"
                    step="0.01"
                    name="commission_percent"
                    value={formData.commission_percent || 0}
                    onChange={handleNumericInput("commission_percent")}
                    disabled={isReadOnly || !formData.commission_allowed}
                    className="emp-commission-input"
                  />
                </div>
              </div>

              {/* Sales Based / Qty Based Incentives Row */}
              <div className="emp-incentive-opts-row">
                <label className="emp-checkbox-inline">
                  <input
                    type="checkbox"
                    name="salesman_incentive"
                    checked={!!formData.salesman_incentive}
                    onChange={handleCheckbox("salesman_incentive")}
                    disabled={isReadOnly}
                  />
                  Sales Based
                </label>

                <label className="emp-checkbox-inline">
                  <input
                    type="checkbox"
                    name="incentive_qty_based"
                    checked={!!formData.incentive_qty_based}
                    onChange={handleCheckbox("incentive_qty_based")}
                    disabled={isReadOnly}
                  />
                  Qty Based
                </label>

                <div className="emp-opt-field">
                  <span className="emp-opt-label">Percent</span>
                  <input
                    type="number"
                    step="0.01"
                    name="incentive_percentage"
                    value={formData.incentive_percentage || 0}
                    onChange={handleNumericInput("incentive_percentage")}
                    disabled={isReadOnly}
                    className="emp-opt-input"
                  />
                </div>

                <div className="emp-opt-field">
                  <span className="emp-opt-label">Amount</span>
                  <input
                    type="number"
                    step="0.01"
                    name="incentive_amount"
                    value={formData.incentive_amount || 0}
                    onChange={handleNumericInput("incentive_amount")}
                    disabled={isReadOnly}
                    className="emp-opt-input"
                  />
                </div>
              </div>

              {/* Incentive Details Grid */}
              <div className="emp-incentive-section">
                <div className="emp-incentive-header">
                  <span>INCENTIVE DETAILS</span>
                </div>
                <table className="emp-incentive-table">
                  <thead>
                    <tr>
                      <th style={{ width: "25%" }}>Range From</th>
                      <th style={{ width: "25%" }}>Range To</th>
                      <th style={{ width: "22%" }}>Percentage</th>
                      <th style={{ width: "20%" }}>Amount</th>
                      {!isReadOnly && <th style={{ width: "8%" }}></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {incentiveTiers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={!isReadOnly ? 5 : 4}
                          style={{ padding: "10px", color: "#888" }}
                        >
                          No incentive tiers defined.
                        </td>
                      </tr>
                    ) : (
                      incentiveTiers.map((tier, idx) => (
                        <tr key={idx}>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              value={tier.range_from || 0}
                              onChange={(e) =>
                                handleTierChange(idx, "range_from", e.target.value)
                              }
                              disabled={isReadOnly}
                              className="emp-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              value={tier.range_to || 0}
                              onChange={(e) =>
                                handleTierChange(idx, "range_to", e.target.value)
                              }
                              disabled={isReadOnly}
                              className="emp-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              value={tier.percentage || 0}
                              onChange={(e) =>
                                handleTierChange(idx, "percentage", e.target.value)
                              }
                              disabled={isReadOnly}
                              className="emp-table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              value={tier.amount || 0}
                              onChange={(e) =>
                                handleTierChange(idx, "amount", e.target.value)
                              }
                              disabled={isReadOnly}
                              className="emp-table-input"
                            />
                          </td>
                          {!isReadOnly && (
                            <td>
                              <button
                                type="button"
                                className="emp-row-btn"
                                onClick={() => handleRemoveTier(idx)}
                                title="Remove tier"
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
                {!isReadOnly && (
                  <button
                    type="button"
                    className="emp-add-tier-btn"
                    onClick={handleAddTier}
                  >
                    + Add Tier
                  </button>
                )}
              </div>

              {/* Max Advance */}
              <div className="emp-field-row" style={{ marginTop: "6px" }}>
                <label className="emp-label" style={{ width: "180px" }}>
                  Max. Advance
                </label>
                <div className="emp-input-wrap">
                  <input
                    type="number"
                    step="0.01"
                    name="max_advance"
                    value={formData.max_advance || 0}
                    onChange={handleNumericInput("max_advance")}
                    disabled={isReadOnly}
                    className="emp-input"
                    style={{ textAlign: "right" }}
                  />
                </div>
              </div>

              {/* Sales Commission Target Amount */}
              <div className="emp-field-row">
                <label className="emp-label" style={{ width: "180px" }}>
                  Sales Commission Target Amount
                </label>
                <div className="emp-input-wrap">
                  <input
                    type="number"
                    step="0.01"
                    name="target_amount"
                    value={formData.target_amount || 0}
                    onChange={handleNumericInput("target_amount")}
                    disabled={isReadOnly}
                    className="emp-input"
                    style={{ textAlign: "right" }}
                  />
                </div>
              </div>

              {/* Active Checkbox */}
              <div className="emp-bottom-row">
                <label className="emp-checkbox-inline">
                  <input
                    type="checkbox"
                    name="active"
                    checked={
                      formData.active !== undefined ? !!formData.active : true
                    }
                    onChange={handleCheckbox("active")}
                    disabled={isReadOnly}
                  />
                  Active
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [cities, states, locations, floors, departments, userGroups, loadingLookups]
  );

  return (
    <>
      <Tools
        title="Employee"
        columns={columns}
        apiBase={`${API_ROOT}/employees/`}
        extraPayload={{ admin_id: adminId }}
        customForm={renderCustomForm}
        modalWidth="980px"
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
