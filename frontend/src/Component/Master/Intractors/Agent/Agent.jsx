// frontend/src/Component/Master/Intractors/Agent/Agent.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./Agent.css";

const API_ROOT = "http://localhost:8000";

export default function Agent({ adminId = 1, onExit }) {
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [banks, setBanks] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [activeTab, setActiveTab] = useState("general");

  // Load lookups on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [locRes, cityRes, stateRes, countryRes, bankRes, compRes] =
          await Promise.all([
            fetch(`${API_ROOT}/locations/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/cities/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/states/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/countries/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/banks/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/companies/`).then((r) => r.json()).catch(() => []),
          ]);

        if (isMounted) {
          setLocations(Array.isArray(locRes) ? locRes : []);
          setCities(Array.isArray(cityRes) ? cityRes : []);
          setStates(Array.isArray(stateRes) ? stateRes : []);
          setCountries(Array.isArray(countryRes) ? countryRes : []);
          setBanks(Array.isArray(bankRes) ? bankRes : []);
          setCompanies(Array.isArray(compRes) ? compRes : []);
        }
      } catch (err) {
        console.error("Error loading agent lookups:", err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Agent Name",
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
        name: "commission_percent",
        label: "Comm (%)",
        type: "number",
      },
      {
        name: "city_name",
        label: "City",
        type: "text",
      },
      {
        name: "phoneno",
        label: "Phone",
        type: "text",
      },
      {
        name: "mobile",
        label: "Mobile",
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
    ({ formData, setFormData, isReadOnly }) => {
      const handleChange = (field, value) => {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      };

      const handleTextUpper = (field, value, maxLen) => {
        const val = (value || "").toUpperCase().slice(0, maxLen);
        handleChange(field, val);
      };

      const handleCityChange = (cityId) => {
        const cId = Number(cityId);
        const cityObj = cities.find((c) => c.id === cId);
        if (cityObj) {
          const stateObj = states.find((s) => s.id === cityObj.state_id);
          const countryObj = stateObj
            ? countries.find((cnt) => cnt.id === stateObj.country_id)
            : null;

          setFormData((prev) => ({
            ...prev,
            city_id: cId,
            city_name: cityObj.name,
            state_name: stateObj ? stateObj.name : "",
            country_name: countryObj ? countryObj.name : "INDIA",
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            city_id: cId,
            city_name: "",
            state_name: "",
            country_name: "INDIA",
          }));
        }
      };

      // Contact Details handlers
      const contacts = Array.isArray(formData.contacts) ? formData.contacts : [];

      const handleAddContact = () => {
        setFormData((prev) => ({
          ...prev,
          contacts: [
            ...(prev.contacts || []),
            {
              name: "",
              shortname: "",
              gender: "M",
              designation: "",
              dob: "",
              doa: "",
              address: "",
              city_id: 0,
              phoneno: "",
              mobile: "",
              email: "",
            },
          ],
        }));
      };

      const handleRemoveContact = (index) => {
        const updated = contacts.filter((_, idx) => idx !== index);
        setFormData((prev) => ({
          ...prev,
          contacts: updated,
        }));
      };

      const handleContactChange = (index, field, value) => {
        const updated = [...contacts];
        updated[index] = {
          ...updated[index],
          [field]:
            field === "name" || field === "shortname"
              ? (value || "").toUpperCase()
              : value,
        };
        setFormData((prev) => ({
          ...prev,
          contacts: updated,
        }));
      };

      // Company Details handlers
      const selectedCompanies = Array.isArray(formData.companies)
        ? formData.companies
        : [];

      const isCompanySelected = (compId) => {
        const found = selectedCompanies.find(
          (c) => Number(c.company_id || c.id) === Number(compId)
        );
        return found ? found.select !== false : false;
      };

      const getCompanyOpeningBalance = (compId) => {
        const found = selectedCompanies.find(
          (c) => Number(c.company_id || c.id) === Number(compId)
        );
        return found ? found.opening_balance : 0.00;
      };

      const handleCompanyToggle = (compId, select) => {
        const current = [...selectedCompanies];
        const existingIdx = current.findIndex(
          (c) => Number(c.company_id || c.id) === Number(compId)
        );
        if (existingIdx >= 0) {
          current[existingIdx].select = select;
        } else {
          current.push({ company_id: compId, opening_balance: 0.00, select });
        }
        setFormData((prev) => ({ ...prev, companies: current }));
      };

      const handleCompanyBalanceChange = (compId, bal) => {
        const current = [...selectedCompanies];
        const existingIdx = current.findIndex(
          (c) => Number(c.company_id || c.id) === Number(compId)
        );
        if (existingIdx >= 0) {
          current[existingIdx].opening_balance = Number(bal);
        } else {
          current.push({
            company_id: compId,
            opening_balance: Number(bal),
            select: true,
          });
        }
        setFormData((prev) => ({ ...prev, companies: current }));
      };

      return (
        <div className="agent-form-container">
          <div className="agent-form-tabs">
            <button
              type="button"
              className={`agent-tab-btn ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              Agent Profile & Bank Details
            </button>
            <button
              type="button"
              className={`agent-tab-btn ${activeTab === "grids" ? "active" : ""}`}
              onClick={() => setActiveTab("grids")}
            >
              Contacts & Company Details
            </button>
          </div>

          {activeTab === "general" && (
            <div className="agent-two-col-layout">
              {/* Column 1 */}
              <div>
                <fieldset className="agent-fieldset">
                  <legend className="agent-legend">Profile & Address</legend>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Location</label>
                    <select
                      className="agent-form-input"
                      value={formData.location_id || 0}
                      onChange={(e) => handleChange("location_id", Number(e.target.value))}
                      disabled={isReadOnly}
                    >
                      <option value={0}>[SELECT LOCATION]</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label required">Name</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.name || ""}
                      onChange={(e) => handleTextUpper("name", e.target.value, 50)}
                      maxLength={50}
                      required
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label required">Short Name</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.shortname || ""}
                      onChange={(e) => handleTextUpper("shortname", e.target.value, 25)}
                      maxLength={25}
                      required
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Address</label>
                    <textarea
                      className="agent-form-textarea"
                      value={formData.address || ""}
                      onChange={(e) => handleChange("address", e.target.value)}
                      maxLength={400}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">City</label>
                    <select
                      className="agent-form-input"
                      value={formData.city_id || 0}
                      onChange={(e) => handleCityChange(e.target.value)}
                      disabled={isReadOnly}
                    >
                      <option value={0}>[SELECT CITY]</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">State</label>
                    <input
                      type="text"
                      className="agent-form-input readonly"
                      value={formData.state_name || ""}
                      readOnly
                      disabled
                    />
                    <label className="agent-form-label" style={{ width: "60px" }}>
                      Country
                    </label>
                    <input
                      type="text"
                      className="agent-form-input readonly"
                      value={formData.country_name || "INDIA"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">PIN/ZIP Code</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.pincode || ""}
                      onChange={(e) => handleChange("pincode", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Phone No.</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.phoneno || ""}
                      onChange={(e) => handleChange("phoneno", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Mobile No.</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.mobile || ""}
                      onChange={(e) => handleChange("mobile", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Fax No.</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.fax || ""}
                      onChange={(e) => handleChange("fax", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Email Id.</label>
                    <input
                      type="email"
                      className="agent-form-input"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Web Site</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">TIN</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.tin_no || ""}
                      onChange={(e) => handleChange("tin_no", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">TIN Date</label>
                    <input
                      type="date"
                      className="agent-form-input"
                      value={
                        formData.tin_date ? formData.tin_date.substring(0, 10) : ""
                      }
                      onChange={(e) => handleChange("tin_date", e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>
                </fieldset>
              </div>

              {/* Column 2 */}
              <div>
                <fieldset className="agent-fieldset">
                  <legend className="agent-legend">Statutory & Commercials</legend>

                  <div className="agent-form-row">
                    <label className="agent-form-label">CST No.</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.cst_no || ""}
                      onChange={(e) => handleChange("cst_no", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">CST Date</label>
                    <input
                      type="date"
                      className="agent-form-input"
                      value={
                        formData.cst_date ? formData.cst_date.substring(0, 10) : ""
                      }
                      onChange={(e) => handleChange("cst_date", e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Area Code</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.area_code || ""}
                      onChange={(e) => handleChange("area_code", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">PAN</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.pan_no || ""}
                      onChange={(e) => handleTextUpper("pan_no", e.target.value, 50)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">TAN</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.tan_no || ""}
                      onChange={(e) => handleTextUpper("tan_no", e.target.value, 50)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Service Tax No.</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.service_tax_no || ""}
                      onChange={(e) => handleChange("service_tax_no", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Commission (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="agent-form-input"
                      value={formData.commission_percent ?? 0}
                      onChange={(e) =>
                        handleChange("commission_percent", parseFloat(e.target.value) || 0)
                      }
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Account Head</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.acc_head_name || ""}
                      onChange={(e) => handleChange("acc_head_name", e.target.value)}
                      maxLength={100}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label"></label>
                    <label className="agent-checkbox-label">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.sales)}
                        onChange={(e) => handleChange("sales", e.target.checked)}
                        disabled={isReadOnly}
                      />
                      Sales
                    </label>
                  </div>
                </fieldset>

                <fieldset className="agent-fieldset">
                  <legend className="agent-legend">Bank Details</legend>

                  <div className="agent-form-row">
                    <label className="agent-form-label"></label>
                    <label className="agent-checkbox-label">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.ecs_transfer)}
                        onChange={(e) => handleChange("ecs_transfer", e.target.checked)}
                        disabled={isReadOnly}
                      />
                      ECS Transfer
                    </label>
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Cheque Name</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.cheque_name || ""}
                      onChange={(e) => handleChange("cheque_name", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Bank</label>
                    <select
                      className="agent-form-input"
                      value={formData.bank_id || 0}
                      onChange={(e) => handleChange("bank_id", Number(e.target.value))}
                      disabled={isReadOnly}
                    >
                      <option value={0}>[SELECT BANK]</option>
                      {banks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">Branch</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.branch || ""}
                      onChange={(e) => handleChange("branch", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                    <label className="agent-form-label" style={{ width: "80px" }}>
                      Account No.
                    </label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.account_no || ""}
                      onChange={(e) => handleChange("account_no", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row">
                    <label className="agent-form-label">IFPN No.</label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.ifpn_no || ""}
                      onChange={(e) => handleChange("ifpn_no", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                    <label className="agent-form-label" style={{ width: "80px" }}>
                      MICR Code
                    </label>
                    <input
                      type="text"
                      className="agent-form-input"
                      value={formData.micr_code || ""}
                      onChange={(e) => handleChange("micr_code", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="agent-form-row" style={{ marginTop: "10px" }}>
                    <label className="agent-form-label"></label>
                    <label className="agent-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.active !== false}
                        onChange={(e) => handleChange("active", e.target.checked)}
                        disabled={isReadOnly}
                      />
                      Active
                    </label>
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {activeTab === "grids" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* CONTACT DETAILS */}
              <fieldset className="agent-fieldset">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <legend className="agent-legend">Contact Details</legend>
                  {!isReadOnly && (
                    <button
                      type="button"
                      className="agent-grid-action-btn"
                      onClick={handleAddContact}
                    >
                      + Add Contact Row
                    </button>
                  )}
                </div>

                <div className="agent-grid-table-container">
                  <table className="agent-grid-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>#</th>
                        <th style={{ minWidth: "140px" }}>Name</th>
                        <th style={{ minWidth: "100px" }}>Short Name</th>
                        <th style={{ width: "70px" }}>Gender</th>
                        <th style={{ minWidth: "110px" }}>Designation</th>
                        <th style={{ width: "110px" }}>DOB</th>
                        <th style={{ width: "110px" }}>DOA</th>
                        <th style={{ minWidth: "150px" }}>Address</th>
                        <th style={{ minWidth: "100px" }}>Mobile</th>
                        <th style={{ minWidth: "120px" }}>Email</th>
                        {!isReadOnly && <th style={{ width: "50px" }}>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={isReadOnly ? 10 : 11}
                            style={{ textAlign: "center", color: "#888", padding: "10px" }}
                          >
                            No contact records added.
                          </td>
                        </tr>
                      ) : (
                        contacts.map((c, idx) => (
                          <tr key={idx}>
                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                            <td>
                              <input
                                type="text"
                                className="agent-grid-input"
                                value={c.name || ""}
                                onChange={(e) =>
                                  handleContactChange(idx, "name", e.target.value)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="agent-grid-input"
                                value={c.shortname || ""}
                                onChange={(e) =>
                                  handleContactChange(idx, "shortname", e.target.value)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <select
                                className="agent-grid-input"
                                value={c.gender || "M"}
                                onChange={(e) =>
                                  handleContactChange(idx, "gender", e.target.value)
                                }
                                disabled={isReadOnly}
                              >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="agent-grid-input"
                                value={c.designation || ""}
                                onChange={(e) =>
                                  handleContactChange(idx, "designation", e.target.value)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                className="agent-grid-input"
                                value={c.dob ? c.dob.substring(0, 10) : ""}
                                onChange={(e) =>
                                  handleContactChange(idx, "dob", e.target.value)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                className="agent-grid-input"
                                value={c.doa ? c.doa.substring(0, 10) : ""}
                                onChange={(e) =>
                                  handleContactChange(idx, "doa", e.target.value)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="agent-grid-input"
                                value={c.address || ""}
                                onChange={(e) =>
                                  handleContactChange(idx, "address", e.target.value)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="agent-grid-input"
                                value={c.mobile || ""}
                                onChange={(e) =>
                                  handleContactChange(idx, "mobile", e.target.value)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <input
                                type="email"
                                className="agent-grid-input"
                                value={c.email || ""}
                                onChange={(e) =>
                                  handleContactChange(idx, "email", e.target.value)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                            {!isReadOnly && (
                              <td style={{ textAlign: "center" }}>
                                <button
                                  type="button"
                                  className="agent-grid-action-btn"
                                  onClick={() => handleRemoveContact(idx)}
                                  title="Remove Contact"
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
              </fieldset>

              {/* COMPANY DETAILS */}
              <fieldset className="agent-fieldset">
                <legend className="agent-legend">Company Details</legend>
                <div className="agent-grid-table-container">
                  <table className="agent-grid-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>#</th>
                        <th>Company</th>
                        <th style={{ width: "160px" }}>Opening Balance</th>
                        <th style={{ width: "80px", textAlign: "center" }}>Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((comp, idx) => {
                        const selected = isCompanySelected(comp.id);
                        const bal = getCompanyOpeningBalance(comp.id);
                        return (
                          <tr key={comp.id}>
                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                            <td>{comp.name}</td>
                            <td>
                              <input
                                type="number"
                                step="0.01"
                                className="agent-grid-input"
                                value={bal}
                                onChange={(e) =>
                                  handleCompanyBalanceChange(comp.id, e.target.value)
                                }
                                disabled={!selected || isReadOnly}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={(e) =>
                                  handleCompanyToggle(comp.id, e.target.checked)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </fieldset>
            </div>
          )}
        </div>
      );
    },
    [activeTab, locations, cities, states, countries, banks, companies]
  );

  return (
    <Tools
      title="Agent Master"
      columns={columns}
      apiBase={`${API_ROOT}/agents/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="1050px"
      onExit={onExit}
    />
  );
}
