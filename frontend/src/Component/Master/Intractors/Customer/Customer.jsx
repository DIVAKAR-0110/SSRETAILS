// frontend/src/Component/Master/Intractors/Customer/Customer.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./Customer.css";

const API_ROOT = "http://localhost:8000";

export default function Customer({ adminId = 1, onExit }) {
  const [locations, setLocations] = useState([]);
  const [titles, setTitles] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [religions, setReligions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [grades, setGrades] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [activeTab, setActiveTab] = useState("general");

  // Load lookups on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [
          locRes,
          titleRes,
          cityRes,
          stateRes,
          countryRes,
          occRes,
          relRes,
          catRes,
          grpRes,
          grdRes,
          compRes,
        ] = await Promise.all([
          fetch(`${API_ROOT}/locations/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/titles/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/cities/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/states/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/countries/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/occupations/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/religions/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/categories/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/groups/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/grades/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/companies/`).then((r) => r.json()).catch(() => []),
        ]);

        if (isMounted) {
          setLocations(Array.isArray(locRes) ? locRes : []);
          setTitles(Array.isArray(titleRes) ? titleRes : []);
          setCities(Array.isArray(cityRes) ? cityRes : []);
          setStates(Array.isArray(stateRes) ? stateRes : []);
          setCountries(Array.isArray(countryRes) ? countryRes : []);
          setOccupations(Array.isArray(occRes) ? occRes : []);
          setReligions(Array.isArray(relRes) ? relRes : []);
          setCategories(Array.isArray(catRes) ? catRes : []);
          setGroups(Array.isArray(grpRes) ? grpRes : []);
          setGrades(Array.isArray(grdRes) ? grdRes : []);
          setCompanies(Array.isArray(compRes) ? compRes : []);
        }
      } catch (err) {
        console.error("Error loading customer lookups:", err);
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
        label: "Customer Name",
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
        name: "cr_limit",
        label: "Credit Limit",
        type: "number",
      },
      {
        name: "discount_percent",
        label: "Discount (%)",
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

      const isCompanyChecked = Boolean(formData.is_company);

      return (
        <div className="cust-form-container">
          <div className="cust-form-tabs">
            <button
              type="button"
              className={`cust-tab-btn ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              Customer Profile, Address & Taxes
            </button>
            <button
              type="button"
              className={`cust-tab-btn ${activeTab === "grids" ? "active" : ""}`}
              onClick={() => setActiveTab("grids")}
            >
              Contacts & Company Details
            </button>
          </div>

          {activeTab === "general" && (
            <div className="cust-two-col-layout">
              {/* Column 1 */}
              <div>
                <fieldset className="cust-fieldset">
                  <legend className="cust-legend">Profile & Address</legend>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Location</label>
                    <select
                      className="cust-form-input"
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

                  <div className="cust-form-row">
                    <label className="cust-form-label required">Name</label>
                    <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                      <select
                        style={{ width: "70px" }}
                        className="cust-form-input"
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
                        className="cust-form-input"
                        value={formData.name || ""}
                        onChange={(e) => handleTextUpper("name", e.target.value, 50)}
                        maxLength={50}
                        required
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label required">Short Name</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.shortname || ""}
                      onChange={(e) => handleTextUpper("shortname", e.target.value, 25)}
                      maxLength={25}
                      required
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Address</label>
                    <textarea
                      className="cust-form-textarea"
                      value={formData.address || ""}
                      onChange={(e) => handleChange("address", e.target.value)}
                      maxLength={400}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">City</label>
                    <select
                      className="cust-form-input"
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

                  <div className="cust-form-row">
                    <label className="cust-form-label">State</label>
                    <input
                      type="text"
                      className="cust-form-input readonly"
                      value={formData.state_name || ""}
                      readOnly
                      disabled
                    />
                    <label className="cust-form-label" style={{ width: "50px" }}>
                      Country
                    </label>
                    <input
                      type="text"
                      className="cust-form-input readonly"
                      value={formData.country_name || "INDIA"}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">PIN/ZIP Code</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.pincode || ""}
                      onChange={(e) => handleChange("pincode", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Phone No.</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.phoneno || ""}
                      onChange={(e) => handleChange("phoneno", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Mobile No.</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.mobile || ""}
                      onChange={(e) => handleChange("mobile", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Fax No.</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.fax || ""}
                      onChange={(e) => handleChange("fax", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Email Id.</label>
                    <input
                      type="email"
                      className="cust-form-input"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Web Site</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>
                </fieldset>

                {/* Company Tax Info */}
                <fieldset className="cust-fieldset">
                  <legend className="cust-legend">Company Tax Info</legend>

                  <div className="cust-form-row">
                    <label className="cust-form-label"></label>
                    <label className="cust-checkbox-label">
                      <input
                        type="checkbox"
                        checked={isCompanyChecked}
                        onChange={(e) => handleChange("is_company", e.target.checked)}
                        disabled={isReadOnly}
                      />
                      Company?
                    </label>
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">TIN</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.tin_no || ""}
                      onChange={(e) => handleChange("tin_no", e.target.value)}
                      maxLength={50}
                      disabled={!isCompanyChecked || isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">TIN Date</label>
                    <input
                      type="date"
                      className="cust-form-input"
                      value={
                        formData.tin_date ? formData.tin_date.substring(0, 10) : ""
                      }
                      onChange={(e) => handleChange("tin_date", e.target.value)}
                      disabled={!isCompanyChecked || isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">CST No.</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.cst_no || ""}
                      onChange={(e) => handleChange("cst_no", e.target.value)}
                      maxLength={50}
                      disabled={!isCompanyChecked || isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">CST Date</label>
                    <input
                      type="date"
                      className="cust-form-input"
                      value={
                        formData.cst_date ? formData.cst_date.substring(0, 10) : ""
                      }
                      onChange={(e) => handleChange("cst_date", e.target.value)}
                      disabled={!isCompanyChecked || isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Area Code</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.area_code || ""}
                      onChange={(e) => handleChange("area_code", e.target.value)}
                      maxLength={50}
                      disabled={!isCompanyChecked || isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">GST No.</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.gst_no || ""}
                      onChange={(e) => handleTextUpper("gst_no", e.target.value, 50)}
                      maxLength={50}
                      disabled={!isCompanyChecked || isReadOnly}
                    />
                  </div>
                </fieldset>
              </div>

              {/* Column 2 */}
              <div>
                <fieldset className="cust-fieldset">
                  <legend className="cust-legend">Tax Details</legend>
                  <div className="cust-form-row">
                    <label className="cust-form-label">PAN</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.pan_no || ""}
                      onChange={(e) => handleTextUpper("pan_no", e.target.value, 50)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">TAN</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.tan_no || ""}
                      onChange={(e) => handleTextUpper("tan_no", e.target.value, 50)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>
                </fieldset>

                <fieldset className="cust-fieldset">
                  <legend className="cust-legend">Promotions & Credit</legend>

                  <div className="cust-form-row">
                    <label className="cust-form-label"></label>
                    <label className="cust-checkbox-label">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.allow_promotion_mailers)}
                        onChange={(e) =>
                          handleChange("allow_promotion_mailers", e.target.checked)
                        }
                        disabled={isReadOnly}
                      />
                      Allow Promotion Mailers
                    </label>
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label"></label>
                    <label className="cust-checkbox-label">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.allow_promotion_sms)}
                        onChange={(e) =>
                          handleChange("allow_promotion_sms", e.target.checked)
                        }
                        disabled={isReadOnly}
                      />
                      Allow Promotion SMS
                    </label>
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label"></label>
                    <label className="cust-checkbox-label">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.allow_promotion_email)}
                        onChange={(e) =>
                          handleChange("allow_promotion_email", e.target.checked)
                        }
                        disabled={isReadOnly}
                      />
                      Allow Promotion Emails
                    </label>
                  </div>

                  <div className="cust-form-row" style={{ marginTop: "6px" }}>
                    <label className="cust-form-label"></label>
                    <label className="cust-checkbox-label">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.credit_allowed)}
                        onChange={(e) =>
                          handleChange("credit_allowed", e.target.checked)
                        }
                        disabled={isReadOnly}
                      />
                      Allow Credit
                    </label>
                    <label className="cust-form-label" style={{ width: "80px" }}>
                      Credit Limit
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="cust-form-input"
                      value={formData.cr_limit ?? 0}
                      onChange={(e) =>
                        handleChange("cr_limit", parseFloat(e.target.value) || 0)
                      }
                      disabled={!formData.credit_allowed || isReadOnly}
                    />
                  </div>
                </fieldset>

                <fieldset className="cust-fieldset">
                  <legend className="cust-legend">Personal Information</legend>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Occupation</label>
                    <select
                      className="cust-form-input"
                      value={formData.occupation_id || 0}
                      onChange={(e) =>
                        handleChange("occupation_id", Number(e.target.value))
                      }
                      disabled={isReadOnly}
                    >
                      <option value={0}>[SELECT OCCUPATION]</option>
                      {occupations.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Religion</label>
                    <select
                      className="cust-form-input"
                      value={formData.religion_id || 0}
                      onChange={(e) =>
                        handleChange("religion_id", Number(e.target.value))
                      }
                      disabled={isReadOnly}
                    >
                      <option value={0}>[SELECT RELIGION]</option>
                      {religions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">DOB</label>
                    <input
                      type="date"
                      className="cust-form-input"
                      value={formData.dob ? formData.dob.substring(0, 10) : ""}
                      onChange={(e) => handleChange("dob", e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">DOA</label>
                    <input
                      type="date"
                      className="cust-form-input"
                      value={formData.doa ? formData.doa.substring(0, 10) : ""}
                      onChange={(e) => handleChange("doa", e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Loyalty Card No</label>
                    <input
                      type="text"
                      className="cust-form-input"
                      value={formData.loyalty_card_no || ""}
                      onChange={(e) => handleChange("loyalty_card_no", e.target.value)}
                      maxLength={50}
                      disabled={isReadOnly}
                    />
                  </div>
                </fieldset>

                <fieldset className="cust-fieldset">
                  <legend className="cust-legend">Classifications & Terms</legend>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Category</label>
                    <select
                      className="cust-form-input"
                      value={formData.category_id || 0}
                      onChange={(e) =>
                        handleChange("category_id", Number(e.target.value))
                      }
                      disabled={isReadOnly}
                    >
                      <option value={0}>[SELECT CATEGORY]</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Group</label>
                    <select
                      className="cust-form-input"
                      value={formData.group_id || 0}
                      onChange={(e) =>
                        handleChange("group_id", Number(e.target.value))
                      }
                      disabled={isReadOnly}
                    >
                      <option value={0}>[SELECT GROUP]</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Grade</label>
                    <select
                      className="cust-form-input"
                      value={formData.grade_id || 0}
                      onChange={(e) =>
                        handleChange("grade_id", Number(e.target.value))
                      }
                      disabled={isReadOnly}
                    >
                      <option value={0}>[SELECT GRADE]</option>
                      {grades.map((gr) => (
                        <option key={gr.id} value={gr.id}>
                          {gr.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Discount (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="cust-form-input"
                      value={formData.discount_percent ?? 0}
                      onChange={(e) =>
                        handleChange("discount_percent", parseFloat(e.target.value) || 0)
                      }
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row">
                    <label className="cust-form-label">Due Days</label>
                    <input
                      type="number"
                      className="cust-form-input"
                      value={formData.due_days ?? 0}
                      onChange={(e) =>
                        handleChange("due_days", parseInt(e.target.value, 10) || 0)
                      }
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="cust-form-row" style={{ marginTop: "6px" }}>
                    <label className="cust-form-label"></label>
                    <label className="cust-checkbox-label">
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
              <fieldset className="cust-fieldset">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <legend className="cust-legend">Contact Details</legend>
                  {!isReadOnly && (
                    <button
                      type="button"
                      className="cust-grid-action-btn"
                      onClick={handleAddContact}
                    >
                      + Add Contact Row
                    </button>
                  )}
                </div>

                <div className="cust-grid-table-container">
                  <table className="cust-grid-table">
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
                                className="cust-grid-input"
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
                                className="cust-grid-input"
                                value={c.shortname || ""}
                                onChange={(e) =>
                                  handleContactChange(idx, "shortname", e.target.value)
                                }
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <select
                                className="cust-grid-input"
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
                                className="cust-grid-input"
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
                                className="cust-grid-input"
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
                                className="cust-grid-input"
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
                                className="cust-grid-input"
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
                                className="cust-grid-input"
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
                                className="cust-grid-input"
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
                                  className="cust-grid-action-btn"
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
              <fieldset className="cust-fieldset">
                <legend className="cust-legend">Company Details</legend>
                <div className="cust-grid-table-container">
                  <table className="cust-grid-table">
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
                                className="cust-grid-input"
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
    [
      activeTab,
      locations,
      titles,
      cities,
      states,
      countries,
      occupations,
      religions,
      categories,
      groups,
      grades,
      companies,
    ]
  );

  return (
    <Tools
      title="Customer Master"
      columns={columns}
      apiBase={`${API_ROOT}/customers/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="1100px"
      onExit={onExit}
    />
  );
}
