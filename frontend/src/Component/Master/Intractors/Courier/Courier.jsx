// frontend/src/Component/Master/Intractors/Courier/Courier.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./Courier.css";

const API_ROOT = "http://localhost:8000";

const CHARGE_TYPES = [
  { value: 0, label: "[SELECT]" },
  { value: 1, label: "PER KG" },
  { value: 2, label: "PER BUNDLE" },
  { value: 3, label: "OTHERS" },
];

const PAY_TYPES = [
  { value: 0, label: "[SELECT]" },
  { value: 1, label: "TO PAY" },
  { value: 2, label: "PAID" },
  { value: 3, label: "TBB" },
];

export default function Courier({ adminId = 1, onExit }) {
  const [locations, setLocations] = useState([]);
  const [titles, setTitles] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [banks, setBanks] = useState([]);

  // Load lookups on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [locRes, titleRes, cityRes, stateRes, countryRes, bankRes] =
          await Promise.all([
            fetch(`${API_ROOT}/locations/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/titles/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/cities/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/states/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/countries/`).then((r) => r.json()).catch(() => []),
            fetch(`${API_ROOT}/banks/`).then((r) => r.json()).catch(() => []),
          ]);

        if (isMounted) {
          setLocations(Array.isArray(locRes) ? locRes : []);
          setTitles(Array.isArray(titleRes) ? titleRes : []);
          setCities(Array.isArray(cityRes) ? cityRes : []);
          setStates(Array.isArray(stateRes) ? stateRes : []);
          setCountries(Array.isArray(countryRes) ? countryRes : []);
          setBanks(Array.isArray(bankRes) ? bankRes : []);
        }
      } catch (err) {
        console.error("Error loading courier lookups:", err);
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
        label: "Courier Name",
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

      return (
        <div className="courier-form-container">
          <fieldset className="courier-fieldset">
            <legend className="courier-legend">Courier Master</legend>

            <div className="courier-two-col-layout">
              {/* Column 1 */}
              <div>
                <div className="courier-form-row">
                  <label className="courier-form-label">Location</label>
                  <select
                    className="courier-form-input"
                    value={formData.location_id || 0}
                    onChange={(e) =>
                      handleChange("location_id", Number(e.target.value))
                    }
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

                <div className="courier-form-row">
                  <label className="courier-form-label required">Name</label>
                  <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                    <select
                      style={{ width: "70px" }}
                      className="courier-form-input"
                      value={formData.title_id || 0}
                      onChange={(e) =>
                        handleChange("title_id", Number(e.target.value))
                      }
                      disabled={isReadOnly}
                    >
                      <option value={0}>[SEL]</option>
                      {titles.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="courier-form-input"
                      value={formData.name || ""}
                      onChange={(e) => handleTextUpper("name", e.target.value, 50)}
                      maxLength={50}
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label required">Short Name</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.shortname || ""}
                    onChange={(e) => handleTextUpper("shortname", e.target.value, 25)}
                    maxLength={25}
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Print Name</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.print_name || ""}
                    onChange={(e) => handleChange("print_name", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Address</label>
                  <textarea
                    className="courier-form-textarea"
                    value={formData.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    maxLength={400}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">City</label>
                  <select
                    className="courier-form-input"
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

                <div className="courier-form-row">
                  <label className="courier-form-label">State</label>
                  <input
                    type="text"
                    className="courier-form-input readonly"
                    value={formData.state_name || ""}
                    readOnly
                    disabled
                  />
                  <label className="courier-form-label" style={{ width: "50px" }}>
                    Country
                  </label>
                  <input
                    type="text"
                    className="courier-form-input readonly"
                    value={formData.country_name || "INDIA"}
                    readOnly
                    disabled
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">PIN/ZIP Code</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.pincode || ""}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Phone No.</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.phoneno || ""}
                    onChange={(e) => handleChange("phoneno", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Mobile No.</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.mobile || ""}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Fax No.</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.fax || ""}
                    onChange={(e) => handleChange("fax", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Email Id.</label>
                  <input
                    type="email"
                    className="courier-form-input"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Website</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">TIN</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.tin_no || ""}
                    onChange={(e) => handleChange("tin_no", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">TIN Date</label>
                  <input
                    type="date"
                    className="courier-form-input"
                    value={
                      formData.tin_date ? formData.tin_date.substring(0, 10) : ""
                    }
                    onChange={(e) => handleChange("tin_date", e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row" style={{ marginTop: "6px" }}>
                  <label className="courier-form-label"></label>
                  <label className="courier-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.active !== false}
                      onChange={(e) => handleChange("active", e.target.checked)}
                      disabled={isReadOnly}
                    />
                    Active
                  </label>
                </div>
              </div>

              {/* Column 2 */}
              <div>
                <div className="courier-form-row">
                  <label className="courier-form-label">CST No.</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.cst_no || ""}
                    onChange={(e) => handleChange("cst_no", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">CST Date</label>
                  <input
                    type="date"
                    className="courier-form-input"
                    value={
                      formData.cst_date ? formData.cst_date.substring(0, 10) : ""
                    }
                    onChange={(e) => handleChange("cst_date", e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Area Code</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.area_code || ""}
                    onChange={(e) => handleChange("area_code", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">PAN</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.pan_no || ""}
                    onChange={(e) => handleTextUpper("pan_no", e.target.value, 50)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">TAN</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.tan_no || ""}
                    onChange={(e) => handleTextUpper("tan_no", e.target.value, 50)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Service Tax No.</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.service_tax_no || ""}
                    onChange={(e) => handleChange("service_tax_no", e.target.value)}
                    maxLength={50}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Charge Type</label>
                  <select
                    className="courier-form-input"
                    value={formData.charge_type ?? 0}
                    onChange={(e) =>
                      handleChange("charge_type", Number(e.target.value))
                    }
                    disabled={isReadOnly}
                  >
                    {CHARGE_TYPES.map((ct) => (
                      <option key={ct.value} value={ct.value}>
                        {ct.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Pay Type</label>
                  <select
                    className="courier-form-input"
                    value={formData.pay_type ?? 0}
                    onChange={(e) =>
                      handleChange("pay_type", Number(e.target.value))
                    }
                    disabled={isReadOnly}
                  >
                    {PAY_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Discount (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="courier-form-input"
                    value={formData.discount_percent ?? 0}
                    onChange={(e) =>
                      handleChange("discount_percent", parseFloat(e.target.value) || 0)
                    }
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Discount Amt.</label>
                  <input
                    type="number"
                    step="0.01"
                    className="courier-form-input"
                    value={formData.discount_amount ?? 0}
                    onChange={(e) =>
                      handleChange("discount_amount", parseFloat(e.target.value) || 0)
                    }
                    disabled={isReadOnly}
                  />
                </div>

                <div className="courier-form-row">
                  <label className="courier-form-label">Account Head</label>
                  <input
                    type="text"
                    className="courier-form-input"
                    value={formData.acc_head_name || ""}
                    onChange={(e) => handleChange("acc_head_name", e.target.value)}
                    maxLength={100}
                    disabled={isReadOnly}
                  />
                </div>

                {/* BANK DETAILS */}
                <fieldset className="courier-fieldset" style={{ marginTop: "10px" }}>
                  <legend className="courier-legend">Bank Details</legend>

                  <div className="courier-form-row">
                    <label className="courier-form-label"></label>
                    <label className="courier-checkbox-label">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.ecs_transfer)}
                        onChange={(e) =>
                          handleChange("ecs_transfer", e.target.checked)
                        }
                        disabled={isReadOnly}
                      />
                      ECS Transfer
                    </label>
                  </div>

                  <div className="courier-form-row">
                    <label className="courier-form-label">Cheque Name</label>
                    <input
                      type="text"
                      className="courier-form-input"
                      value={formData.cheque_name || ""}
                      onChange={(e) => handleChange("cheque_name", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="courier-form-row">
                    <label className="courier-form-label">Bank</label>
                    <select
                      className="courier-form-input"
                      value={formData.bank_id || 0}
                      onChange={(e) =>
                        handleChange("bank_id", Number(e.target.value))
                      }
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

                  <div className="courier-form-row">
                    <label className="courier-form-label">Branch</label>
                    <input
                      type="text"
                      className="courier-form-input"
                      value={formData.branch || ""}
                      onChange={(e) => handleChange("branch", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                    <label className="courier-form-label" style={{ width: "80px" }}>
                      Account No.
                    </label>
                    <input
                      type="text"
                      className="courier-form-input"
                      value={formData.account_no || ""}
                      onChange={(e) => handleChange("account_no", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="courier-form-row">
                    <label className="courier-form-label">IFPN No.</label>
                    <input
                      type="text"
                      className="courier-form-input"
                      value={formData.ifpn_no || ""}
                      onChange={(e) => handleChange("ifpn_no", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                    <label className="courier-form-label" style={{ width: "80px" }}>
                      MICR Code
                    </label>
                    <input
                      type="text"
                      className="courier-form-input"
                      value={formData.micr_code || ""}
                      onChange={(e) => handleChange("micr_code", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>
                </fieldset>
              </div>
            </div>
          </fieldset>

          {/* CONTACT DETAILS GRID */}
          <fieldset className="courier-fieldset">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <legend className="courier-legend">Contact Details</legend>
              {!isReadOnly && (
                <button
                  type="button"
                  className="courier-grid-action-btn"
                  onClick={handleAddContact}
                >
                  + Add Contact Row
                </button>
              )}
            </div>

            <div className="courier-grid-table-container">
              <table className="courier-grid-table">
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
                            className="courier-grid-input"
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
                            className="courier-grid-input"
                            value={c.shortname || ""}
                            onChange={(e) =>
                              handleContactChange(idx, "shortname", e.target.value)
                            }
                            disabled={isReadOnly}
                          />
                        </td>
                        <td>
                          <select
                            className="courier-grid-input"
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
                            className="courier-grid-input"
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
                            className="courier-grid-input"
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
                            className="courier-grid-input"
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
                            className="courier-grid-input"
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
                            className="courier-grid-input"
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
                            className="courier-grid-input"
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
                              className="courier-grid-action-btn"
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
        </div>
      );
    },
    [locations, titles, cities, states, countries, banks]
  );

  return (
    <Tools
      title="Courier Master"
      columns={columns}
      apiBase={`${API_ROOT}/couriers/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="1050px"
      onExit={onExit}
    />
  );
}
