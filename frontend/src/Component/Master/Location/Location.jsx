// frontend/src/Component/Master/Location/Location.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../Tools";
import Dialog from "../../Common/Dialog.jsx";
import "./Location.css";

const API_ROOT = "http://localhost:8000";

export default function Location({ adminId = 1, onExit }) {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [showServerDetails, setShowServerDetails] = useState(false);
  const [dialog, setDialog] = useState(null);

  // Parallel fetch of location lookups
  useEffect(() => {
    let isMounted = true;
    async function loadLookups() {
      try {
        setLoadingLookups(true);
        const [cityRes, stateRes, countryRes] = await Promise.all([
          fetch(`${API_ROOT}/cities/`),
          fetch(`${API_ROOT}/states/`),
          fetch(`${API_ROOT}/countries/`),
        ]);

        const [cityData, stateData, countryData] = await Promise.all([
          cityRes.json().catch(() => []),
          stateRes.json().catch(() => []),
          countryRes.json().catch(() => []),
        ]);

        if (isMounted) {
          setCities(Array.isArray(cityData) ? cityData : []);
          setStates(Array.isArray(stateData) ? stateData : []);
          setCountries(Array.isArray(countryData) ? countryData : []);
        }
      } catch (err) {
        console.error("Failed to load location lookups:", err);
      } finally {
        if (isMounted) setLoadingLookups(false);
      }
    }

    loadLookups();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listing columns for Tools.jsx table view
  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Location Name",
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
        name: "address",
        label: "Address",
        maxLength: 400,
      },
      {
        name: "city_name",
        label: "City",
      },
      {
        name: "state_name",
        label: "State",
      },
      {
        name: "country_name",
        label: "Country",
      },
      {
        name: "phoneno",
        label: "Phone No.",
      },
      {
        name: "mobile",
        label: "Mobile No.",
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
      },
    ],
    []
  );

  // Custom 2-Column Form matching exact legacy ERP layout from screenshots
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      // Auto-fill State and Country from selected city
      const selectedCity = cities.find(
        (c) => c.id === parseInt(formData.city_id, 10)
      );
      const stateName = selectedCity
        ? selectedCity.state_name ||
          (states.find((s) => s.id === selectedCity.state_id)?.name || "")
        : "";
      const countryName = selectedCity
        ? states.find((s) => s.id === selectedCity.state_id)?.country_name ||
          "INDIA"
        : "";

      // Helper input handlers
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

      const handleCityChange = (e) => {
        if (isReadOnly) return;
        const cId = parseInt(e.target.value, 10) || 0;
        setFormData((prev) => ({
          ...prev,
          city_id: cId,
        }));
      };

      // Format date for HTML date input (YYYY-MM-DD)
      const formatDateForInput = (val) => {
        if (!val) return "";
        try {
          return val.includes("T") ? val.split("T")[0] : val.substring(0, 10);
        } catch {
          return "";
        }
      };

      return (
        <div className="loc-container">
          <div className="loc-header-title">Location Master</div>

          <div className="loc-form-2col">
            {/* ================= LEFT COLUMN ================= */}
            <div className="loc-col">
              {/* Name (Required, Max 50) */}
              <div className="loc-field-row">
                <label className="loc-label loc-label-req">Name</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleUppercaseInput("name", 50)}
                    disabled={isReadOnly}
                    required
                    maxLength={50}
                    className="loc-input loc-input-upper"
                    placeholder="LOCATION NAME"
                  />
                  <span className="loc-badge">
                    {`${(formData.name || "").length}/50`}
                  </span>
                </div>
              </div>

              {/* Short Name (Required, Max 25) */}
              <div className="loc-field-row">
                <label className="loc-label loc-label-req">Short Name</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="shortname"
                    value={formData.shortname || ""}
                    onChange={handleUppercaseInput("shortname", 25)}
                    disabled={isReadOnly}
                    required
                    maxLength={25}
                    className="loc-input loc-input-upper"
                    placeholder="SHORT NAME"
                  />
                  <span className="loc-badge">
                    {`${(formData.shortname || "").length}/25`}
                  </span>
                </div>
              </div>

              {/* Address (Max 400, multi-line) */}
              <div className="loc-field-row loc-field-row-top">
                <label className="loc-label">Address</label>
                <div className="loc-input-wrap">
                  <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleStandardInput("address", 400)}
                    disabled={isReadOnly}
                    maxLength={400}
                    rows={3}
                    className="loc-textarea"
                    placeholder="Door No, Street, Area"
                  />
                  <span className="loc-badge" style={{ bottom: "6px", right: "6px" }}>
                    {`${(formData.address || "").length}/400`}
                  </span>
                </div>
              </div>

              {/* City (Dropdown) */}
              <div className="loc-field-row">
                <label className="loc-label">City</label>
                <div className="loc-input-wrap">
                  <select
                    name="city_id"
                    value={formData.city_id || 0}
                    onChange={handleCityChange}
                    disabled={isReadOnly || loadingLookups}
                    className="loc-select"
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
              <div className="loc-state-country-row">
                <div className="loc-sub-field">
                  <label className="loc-sub-label">State</label>
                  <input
                    type="text"
                    value={stateName}
                    readOnly
                    className="loc-input loc-input-readonly"
                    placeholder="AUTO FILLED"
                  />
                </div>
                <div className="loc-sub-field">
                  <label className="loc-sub-label">Country</label>
                  <input
                    type="text"
                    value={countryName}
                    readOnly
                    className="loc-input loc-input-readonly"
                    placeholder="AUTO FILLED"
                  />
                </div>
              </div>

              {/* PIN/ZIP Code */}
              <div className="loc-field-row">
                <label className="loc-label">PIN/ZIP Code</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="pinid"
                    value={formData.pinid || ""}
                    onChange={handleStandardInput("pinid", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="loc-input"
                    placeholder="PIN Code"
                  />
                </div>
              </div>

              {/* Phone No */}
              <div className="loc-field-row">
                <label className="loc-label">Phone No.</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="phoneno"
                    value={formData.phoneno || ""}
                    onChange={handleStandardInput("phoneno", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="loc-input"
                    placeholder="Phone No."
                  />
                </div>
              </div>

              {/* Mobile No */}
              <div className="loc-field-row">
                <label className="loc-label">Mobile No.</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile || ""}
                    onChange={handleStandardInput("mobile", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="loc-input"
                    placeholder="Mobile No."
                  />
                </div>
              </div>

              {/* Fax No */}
              <div className="loc-field-row">
                <label className="loc-label">Fax No.</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="fax"
                    value={formData.fax || ""}
                    onChange={handleStandardInput("fax", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="loc-input"
                    placeholder="Fax No."
                  />
                </div>
              </div>

              {/* Email Id */}
              <div className="loc-field-row">
                <label className="loc-label">Email Id.</label>
                <div className="loc-input-wrap">
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleStandardInput("email", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="loc-input"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="loc-field-row">
                <label className="loc-label">Website</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleStandardInput("website", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="loc-input"
                    placeholder="www.example.com"
                  />
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="loc-col">
              {/* TIN */}
              <div className="loc-field-row">
                <label className="loc-label">TIN</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="tinno"
                    value={formData.tinno || ""}
                    onChange={handleStandardInput("tinno", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="loc-input"
                    placeholder="TIN Number"
                  />
                </div>
              </div>

              {/* TIN Date */}
              <div className="loc-field-row">
                <label className="loc-label">TIN Date</label>
                <div className="loc-input-wrap">
                  <input
                    type="date"
                    name="tindate"
                    value={formatDateForInput(formData.tindate)}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        tindate: e.target.value || null,
                      }))
                    }
                    disabled={isReadOnly}
                    className="loc-input"
                  />
                </div>
              </div>

              {/* CST No */}
              <div className="loc-field-row">
                <label className="loc-label">CST No.</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="cstno"
                    value={formData.cstno || ""}
                    onChange={handleStandardInput("cstno", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="loc-input"
                    placeholder="CST Number"
                  />
                </div>
              </div>

              {/* CST Date */}
              <div className="loc-field-row">
                <label className="loc-label">CST Date</label>
                <div className="loc-input-wrap">
                  <input
                    type="date"
                    name="cstdate"
                    value={formatDateForInput(formData.cstdate)}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        cstdate: e.target.value || null,
                      }))
                    }
                    disabled={isReadOnly}
                    className="loc-input"
                  />
                </div>
              </div>

              {/* Area Code */}
              <div className="loc-field-row">
                <label className="loc-label">Area Code</label>
                <div className="loc-input-wrap">
                  <input
                    type="text"
                    name="areaid"
                    value={formData.areaid || ""}
                    onChange={handleStandardInput("areaid", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="loc-input"
                    placeholder="Area Code"
                  />
                </div>
              </div>

              {/* Server Options Checkboxes */}
              <div className="loc-server-options-row">
                <label className="loc-checkbox-inline">
                  <input
                    type="checkbox"
                    checked={showServerDetails}
                    onChange={(e) => setShowServerDetails(e.target.checked)}
                    disabled={isReadOnly}
                  />
                  Server Details
                </label>

                <label className="loc-checkbox-inline">
                  <input
                    type="checkbox"
                    name="mainserver"
                    checked={!!formData.mainserver}
                    onChange={handleCheckbox("mainserver")}
                    disabled={isReadOnly}
                  />
                  Main Server
                </label>
              </div>

              {/* Server Details Panel (smoothly displayed when checkbox active) */}
              {showServerDetails && (
                <div className="loc-server-box">
                  <div className="loc-server-box-title">Database Server Configuration</div>

                  <div className="loc-field-row">
                    <label className="loc-label" style={{ width: "90px" }}>Server Name</label>
                    <div className="loc-input-wrap">
                      <input
                        type="text"
                        name="servername"
                        value={formData.servername || ""}
                        onChange={handleStandardInput("servername", 50)}
                        disabled={isReadOnly}
                        maxLength={50}
                        className="loc-input"
                        placeholder="SERVER\INSTANCE"
                      />
                    </div>
                  </div>

                  <div className="loc-field-row">
                    <label className="loc-label" style={{ width: "90px" }}>Server UID</label>
                    <div className="loc-input-wrap">
                      <input
                        type="text"
                        name="serveruid"
                        value={formData.serveruid || ""}
                        onChange={handleStandardInput("serveruid", 25)}
                        disabled={isReadOnly}
                        maxLength={25}
                        className="loc-input"
                        placeholder="sa"
                      />
                    </div>
                  </div>

                  <div className="loc-field-row">
                    <label className="loc-label" style={{ width: "90px" }}>DB Name</label>
                    <div className="loc-input-wrap">
                      <input
                        type="text"
                        name="dbname"
                        value={formData.dbname || ""}
                        onChange={handleStandardInput("dbname", 50)}
                        disabled={isReadOnly}
                        maxLength={50}
                        className="loc-input"
                        placeholder="GANESHSSRETAIL"
                      />
                    </div>
                  </div>

                  <div className="loc-field-row">
                    <label className="loc-label" style={{ width: "90px" }}>Server Pwd</label>
                    <div className="loc-input-wrap">
                      <input
                        type="password"
                        name="serverpwd"
                        value={formData.serverpwd || ""}
                        onChange={handleStandardInput("serverpwd", 25)}
                        disabled={isReadOnly}
                        maxLength={25}
                        className="loc-input"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="loc-field-row">
                    <label className="loc-label" style={{ width: "90px" }}>IP Address</label>
                    <div className="loc-input-wrap">
                      <input
                        type="text"
                        name="ipaddress"
                        value={formData.ipaddress || ""}
                        onChange={handleStandardInput("ipaddress", 25)}
                        disabled={isReadOnly}
                        maxLength={25}
                        className="loc-input"
                        placeholder="192.168.1.100"
                      />
                    </div>
                  </div>

                  <div className="loc-field-row">
                    <label className="loc-label" style={{ width: "90px" }}>Protocol</label>
                    <div className="loc-input-wrap">
                      <input
                        type="text"
                        name="protocol"
                        value={formData.protocol || "TCP/IP"}
                        onChange={handleStandardInput("protocol", 25)}
                        disabled={isReadOnly}
                        maxLength={25}
                        className="loc-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Active Checkbox */}
              <div className="loc-bottom-row">
                <label className="loc-checkbox-inline">
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
          </div>
        </div>
      );
    },
    [cities, states, loadingLookups, showServerDetails]
  );

  return (
    <>
      <Tools
        title="Location"
        columns={columns}
        apiBase={`${API_ROOT}/locations/`}
        extraPayload={{ admin_id: adminId }}
        customForm={renderCustomForm}
        modalWidth="960px"
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
