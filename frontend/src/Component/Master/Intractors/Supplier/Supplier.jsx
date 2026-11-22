// frontend/src/Component/Master/Intractors/Supplier/Supplier.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./Supplier.css";

const API_ROOT = "http://localhost:8000";

export default function Supplier({ adminId = 1, onExit }) {
  // Lookups state
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [titles, setTitles] = useState([]);
  const [agents, setAgents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [grades, setGrades] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);

  const [activeTab, setActiveTab] = useState("general");

  // Load all lookups in parallel on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [
          locRes, cityRes, stateRes, countryRes, titleRes,
          agentRes, empRes, bankRes, catRes, grpRes, grdRes,
          compRes, itemTypeRes
        ] = await Promise.all([
          fetch(`${API_ROOT}/locations/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/cities/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/states/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/countries/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/titles/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/agents/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/employees/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/banks/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/categories/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/groups/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/grades/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/companies/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/item-types/`).then((r) => r.json()).catch(() => []),
        ]);

        if (isMounted) {
          setLocations(Array.isArray(locRes) ? locRes : []);
          setCities(Array.isArray(cityRes) ? cityRes : []);
          setStates(Array.isArray(stateRes) ? stateRes : []);
          setCountries(Array.isArray(countryRes) ? countryRes : []);
          setTitles(Array.isArray(titleRes) ? titleRes : []);
          setAgents(Array.isArray(agentRes) ? agentRes : []);
          setEmployees(Array.isArray(empRes) ? empRes : []);
          setBanks(Array.isArray(bankRes) ? bankRes : []);
          setCategories(Array.isArray(catRes) ? catRes : []);
          setGroups(Array.isArray(grpRes) ? grpRes : []);
          setGrades(Array.isArray(grdRes) ? grdRes : []);
          setCompanies(Array.isArray(compRes) ? compRes : []);
          setItemTypes(Array.isArray(itemTypeRes) ? itemTypeRes : []);
        }
      } catch (err) {
        console.error("Error loading supplier lookups:", err);
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
        label: "Supplier Name",
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
        name: "gst_no",
        label: "GST No",
        type: "text",
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
        default: true,
      },
    ],
    []
  );

  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      // Selected City to resolve State & Country
      const selectedCity = cities.find(
        (c) => Number(c.id) === Number(formData.city_id)
      );
      const stateName = selectedCity
        ? selectedCity.state_name ||
          (states.find((s) => Number(s.id) === Number(selectedCity.state_id))?.name || "")
        : "";
      const countryName = selectedCity
        ? states.find((s) => Number(s.id) === Number(selectedCity.state_id))?.country_name || "INDIA"
        : "INDIA";

      const handleTextChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: name === "name" || name === "shortname" || name === "print_name" || name === "gst_no" || name === "pan_no" || name === "tan_no"
            ? value.toUpperCase()
            : value,
        }));
      };

      const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value === "" ? "" : Number(value),
        }));
      };

      const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
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
              gender: "MALE",
              designation: "",
              dob: "",
              doa: "",
              address: "",
              city_id: 0,
              phoneno: "",
              extension_no: "",
              mobile: "",
              fax: "",
              email: "",
            },
          ],
        }));
      };

      const handleRemoveContact = (index) => {
        setFormData((prev) => ({
          ...prev,
          contacts: (prev.contacts || []).filter((_, i) => i !== index),
        }));
      };

      const handleContactChange = (index, field, value) => {
        const updated = [...contacts];
        updated[index] = {
          ...updated[index],
          [field]: field === "name" || field === "shortname" ? (value || "").toUpperCase() : value,
        };
        setFormData((prev) => ({
          ...prev,
          contacts: updated,
        }));
      };

      // Company Details handlers
      const selectedCompanies = Array.isArray(formData.companies) ? formData.companies : [];

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
          current.push({ company_id: compId, opening_balance: Number(bal), select: true });
        }
        setFormData((prev) => ({ ...prev, companies: current }));
      };

      // Item Type Details handlers
      const selectedItemTypes = Array.isArray(formData.item_types) ? formData.item_types : [];

      const isItemTypeSelected = (itId) => {
        const found = selectedItemTypes.find(
          (it) => Number(it.item_type_id || it.id) === Number(itId)
        );
        return found ? found.select !== false : false;
      };

      const handleItemTypeToggle = (itId, select) => {
        const current = [...selectedItemTypes];
        const existingIdx = current.findIndex(
          (it) => Number(it.item_type_id || it.id) === Number(itId)
        );
        if (existingIdx >= 0) {
          current[existingIdx].select = select;
        } else {
          current.push({ item_type_id: itId, select });
        }
        setFormData((prev) => ({ ...prev, item_types: current }));
      };

      return (
        <div className="supplier-form-container">
          <div className="supplier-form-tabs">
            <button
              type="button"
              className={`supplier-tab-btn ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              General & Address Details
            </button>
            <button
              type="button"
              className={`supplier-tab-btn ${activeTab === "purchase" ? "active" : ""}`}
              onClick={() => setActiveTab("purchase")}
            >
              Purchase, Payment & Bank
            </button>
            <button
              type="button"
              className={`supplier-tab-btn ${activeTab === "grids" ? "active" : ""}`}
              onClick={() => setActiveTab("grids")}
            >
              Contacts, Company & Item Types
            </button>
          </div>

          {/* TAB 1: General & Address Details */}
          {activeTab === "general" && (
            <div className="supplier-two-col-layout">
              {/* Left Column: Primary & Address */}
              <div>
                <fieldset className="supplier-fieldset">
                  <legend className="supplier-legend">Supplier Information</legend>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label required">Location</label>
                    <select
                      name="location_id"
                      className="supplier-form-select"
                      value={formData.location_id || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
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

                  <div className="supplier-form-row">
                    <label className="supplier-form-label required">Name</label>
                    <div style={{ display: "flex", gap: "6px", flex: 1 }}>
                      <select
                        name="title_id"
                        className="supplier-form-select"
                        style={{ maxWidth: "80px" }}
                        value={formData.title_id || ""}
                        onChange={handleNumberChange}
                        disabled={isReadOnly}
                      >
                        <option value="">[TITLE]</option>
                        {titles.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="name"
                        className="supplier-form-input"
                        value={formData.name || ""}
                        onChange={handleTextChange}
                        disabled={isReadOnly}
                        maxLength={50}
                        required
                        placeholder="ENTER SUPPLIER NAME"
                      />
                    </div>
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label required">Short Name</label>
                    <input
                      type="text"
                      name="shortname"
                      className="supplier-form-input"
                      value={formData.shortname || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={25}
                      required
                      placeholder="ENTER SHORT CODE"
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Print Name</label>
                    <input
                      type="text"
                      name="print_name"
                      className="supplier-form-input"
                      value={formData.print_name || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row" style={{ alignItems: "flex-start" }}>
                    <label className="supplier-form-label">Address</label>
                    <textarea
                      name="address"
                      className="supplier-form-textarea"
                      value={formData.address || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={400}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label required">City</label>
                    <select
                      name="city_id"
                      className="supplier-form-select"
                      value={formData.city_id || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                      required
                    >
                      <option value="">[SELECT CITY]</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">State</label>
                    <input
                      type="text"
                      className="supplier-form-input"
                      value={stateName}
                      disabled
                      placeholder="AUTO FROM CITY"
                    />
                    <label className="supplier-form-label" style={{ width: "70px" }}>Country</label>
                    <input
                      type="text"
                      className="supplier-form-input"
                      value={countryName}
                      disabled
                      placeholder="AUTO FROM STATE"
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">PIN / ZIP Code</label>
                    <input
                      type="text"
                      name="pincode"
                      className="supplier-form-input"
                      value={formData.pincode || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Phone No.</label>
                    <input
                      type="text"
                      name="phoneno"
                      className="supplier-form-input"
                      value={formData.phoneno || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Mobile No.</label>
                    <input
                      type="text"
                      name="mobile"
                      className="supplier-form-input"
                      value={formData.mobile || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Fax No.</label>
                    <input
                      type="text"
                      name="fax"
                      className="supplier-form-input"
                      value={formData.fax || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Email Id.</label>
                    <input
                      type="email"
                      name="email"
                      className="supplier-form-input"
                      value={formData.email || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Web Site</label>
                    <input
                      type="text"
                      name="website"
                      className="supplier-form-input"
                      value={formData.website || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>
                </fieldset>
              </div>

              {/* Right Column: Statutory & Classifications */}
              <div>
                <fieldset className="supplier-fieldset">
                  <legend className="supplier-legend">Statutory & Classifications</legend>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">GST NO</label>
                    <input
                      type="text"
                      name="gst_no"
                      className="supplier-form-input"
                      value={formData.gst_no || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">PAN No.</label>
                    <input
                      type="text"
                      name="pan_no"
                      className="supplier-form-input"
                      value={formData.pan_no || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">TAN No.</label>
                    <input
                      type="text"
                      name="tan_no"
                      className="supplier-form-input"
                      value={formData.tan_no || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">TIN No.</label>
                    <input
                      type="text"
                      name="tin_no"
                      className="supplier-form-input"
                      value={formData.tin_no || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">CST No.</label>
                    <input
                      type="text"
                      name="cst_no"
                      className="supplier-form-input"
                      value={formData.cst_no || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Area Code</label>
                    <input
                      type="text"
                      name="area_code"
                      className="supplier-form-input"
                      value={formData.area_code || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Representative</label>
                    <select
                      name="representative_id"
                      className="supplier-form-select"
                      value={formData.representative_id || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    >
                      <option value="">[SELECT REPRESENTATIVE]</option>
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Category</label>
                    <select
                      name="category_id"
                      className="supplier-form-select"
                      value={formData.category_id || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    >
                      <option value="">[SELECT CATEGORY]</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Group</label>
                    <select
                      name="group_id"
                      className="supplier-form-select"
                      value={formData.group_id || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    >
                      <option value="">[SELECT GROUP]</option>
                      {groups.map((grp) => (
                        <option key={grp.id} value={grp.id}>
                          {grp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Grade</label>
                    <select
                      name="grade_id"
                      className="supplier-form-select"
                      value={formData.grade_id || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    >
                      <option value="">[SELECT GRADE]</option>
                      {grades.map((grd) => (
                        <option key={grd.id} value={grd.id}>
                          {grd.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>

                {/* Agent Setup Sub-Panel */}
                <fieldset className="supplier-fieldset" style={{ marginTop: "12px" }}>
                  <legend className="supplier-legend">Agent Details</legend>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Agent</label>
                    <select
                      name="agent_id"
                      className="supplier-form-select"
                      value={formData.agent_id || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    >
                      <option value="">[SELECT AGENT]</option>
                      {agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Agent Comm (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="agent_commission"
                      className="supplier-form-input"
                      value={formData.agent_commission ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {/* TAB 2: Purchase, Payment & Bank */}
          {activeTab === "purchase" && (
            <div className="supplier-two-col-layout">
              {/* Left Column: Purchase & Payment Terms */}
              <div>
                <fieldset className="supplier-fieldset">
                  <legend className="supplier-legend">Purchase Features</legend>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Discount (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="standard_discount_on_bill"
                      className="supplier-form-input"
                      value={formData.standard_discount_on_bill ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Profit (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="profit"
                      className="supplier-form-input"
                      value={formData.profit ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                </fieldset>

                <fieldset className="supplier-fieldset">
                  <legend className="supplier-legend">Payment Terms</legend>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Cash Discount (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="cash_discount_percent"
                      className="supplier-form-input"
                      value={formData.cash_discount_percent ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Cash Discount Days</label>
                    <input
                      type="number"
                      name="cash_discount_days"
                      className="supplier-form-input"
                      value={formData.cash_discount_days ?? 0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Credit Days</label>
                    <input
                      type="number"
                      name="credit_days"
                      className="supplier-form-input"
                      value={formData.credit_days ?? 0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Credit Limit (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="credit_limit"
                      className="supplier-form-input"
                      value={formData.credit_limit ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Delay Interest (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="interest_on_delay"
                      className="supplier-form-input"
                      value={formData.interest_on_delay ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Early Interest (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="interest_on_early"
                      className="supplier-form-input"
                      value={formData.interest_on_early ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-checkbox-label">
                      <input
                        type="checkbox"
                        name="debit_dd_commission"
                        checked={formData.debit_dd_commission ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      DD Commission
                    </label>
                    <label className="supplier-form-label" style={{ width: "90px" }}>DD Comm (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="dd_commission_percent"
                      className="supplier-form-input"
                      value={formData.dd_commission_percent ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Due Days</label>
                    <input
                      type="number"
                      name="due_days"
                      className="supplier-form-input"
                      value={formData.due_days ?? 0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Bill Discount</label>
                    <input
                      type="number"
                      step="0.01"
                      name="bill_discount"
                      className="supplier-form-input"
                      value={formData.bill_discount ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>
                </fieldset>
              </div>

              {/* Right Column: Bank Details */}
              <div>
                <fieldset className="supplier-fieldset">
                  <legend className="supplier-legend">Bank Details</legend>
                  <div className="supplier-form-row">
                    <label className="supplier-checkbox-label">
                      <input
                        type="checkbox"
                        name="ecs_transfer"
                        checked={formData.ecs_transfer ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      ECS Transfer
                    </label>
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Cheque Name</label>
                    <input
                      type="text"
                      name="cheque_name"
                      className="supplier-form-input"
                      value={formData.cheque_name || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Bank</label>
                    <select
                      name="bank_id"
                      className="supplier-form-select"
                      value={formData.bank_id || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    >
                      <option value="">[SELECT BANK]</option>
                      {banks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Branch</label>
                    <input
                      type="text"
                      name="branch"
                      className="supplier-form-input"
                      value={formData.branch || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">Account No.</label>
                    <input
                      type="text"
                      name="account_no"
                      className="supplier-form-input"
                      value={formData.account_no || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">IFPN No. / IFSC</label>
                    <input
                      type="text"
                      name="ifpn_no"
                      className="supplier-form-input"
                      value={formData.ifpn_no || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>
                  <div className="supplier-form-row">
                    <label className="supplier-form-label">MICR Code</label>
                    <input
                      type="text"
                      name="micr_code"
                      className="supplier-form-input"
                      value={formData.micr_code || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>
                  <div className="supplier-form-row" style={{ marginTop: "14px" }}>
                    <label className="supplier-checkbox-label">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active ?? true}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Active Status
                    </label>
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {/* TAB 3: Contacts, Company & Item Types */}
          {activeTab === "grids" && (
            <div>
              {/* 1. Contact Details */}
              <fieldset className="supplier-fieldset">
                <legend className="supplier-legend">Contact Details</legend>
                {!isReadOnly && (
                  <button
                    type="button"
                    className="supplier-grid-btn"
                    style={{ marginBottom: "6px" }}
                    onClick={handleAddContact}
                  >
                    + Add Contact
                  </button>
                )}
                <div className="supplier-table-wrapper">
                  <table className="supplier-grid-table">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>#</th>
                        <th>Name *</th>
                        <th>Short Name</th>
                        <th>Gender</th>
                        <th>Designation</th>
                        <th>City</th>
                        <th>Phone</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        {!isReadOnly && <th style={{ width: "40px" }}>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan={isReadOnly ? 9 : 10} style={{ textAlign: "center", color: "#888" }}>
                            No contact persons defined.
                          </td>
                        </tr>
                      ) : (
                        contacts.map((c, idx) => (
                          <tr key={idx}>
                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                            <td>
                              <input
                                type="text"
                                className="supplier-inline-input"
                                value={c.name || ""}
                                onChange={(e) => handleContactChange(idx, "name", e.target.value)}
                                disabled={isReadOnly}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="supplier-inline-input"
                                value={c.shortname || ""}
                                onChange={(e) => handleContactChange(idx, "shortname", e.target.value)}
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <select
                                className="supplier-inline-select"
                                value={c.gender || "MALE"}
                                onChange={(e) => handleContactChange(idx, "gender", e.target.value)}
                                disabled={isReadOnly}
                              >
                                <option value="MALE">MALE</option>
                                <option value="FEMALE">FEMALE</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="supplier-inline-input"
                                value={c.designation || ""}
                                onChange={(e) => handleContactChange(idx, "designation", e.target.value)}
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <select
                                className="supplier-inline-select"
                                value={c.city_id || ""}
                                onChange={(e) => handleContactChange(idx, "city_id", e.target.value)}
                                disabled={isReadOnly}
                              >
                                <option value="0">[SELECT]</option>
                                {cities.map((city) => (
                                  <option key={city.id} value={city.id}>
                                    {city.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="supplier-inline-input"
                                value={c.phoneno || ""}
                                onChange={(e) => handleContactChange(idx, "phoneno", e.target.value)}
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="supplier-inline-input"
                                value={c.mobile || ""}
                                onChange={(e) => handleContactChange(idx, "mobile", e.target.value)}
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="supplier-inline-input"
                                value={c.email || ""}
                                onChange={(e) => handleContactChange(idx, "email", e.target.value)}
                                disabled={isReadOnly}
                              />
                            </td>
                            {!isReadOnly && (
                              <td style={{ textAlign: "center" }}>
                                <button
                                  type="button"
                                  className="supplier-grid-btn"
                                  style={{ color: "#cc0000" }}
                                  onClick={() => handleRemoveContact(idx)}
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

              {/* 2. Company Details & Item Type Details */}
              <div className="supplier-two-col-layout" style={{ marginTop: "14px" }}>
                <fieldset className="supplier-fieldset">
                  <legend className="supplier-legend">Company Details</legend>
                  <div className="supplier-table-wrapper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <table className="supplier-grid-table">
                      <thead>
                        <tr>
                          <th style={{ width: "35px" }}>#</th>
                          <th>Company Name</th>
                          <th style={{ width: "120px" }}>Opening Balance</th>
                          <th style={{ width: "50px", textAlign: "center" }}>Select</th>
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
                                  className="supplier-inline-input"
                                  value={bal}
                                  onChange={(e) => handleCompanyBalanceChange(comp.id, e.target.value)}
                                  disabled={isReadOnly || !selected}
                                />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => handleCompanyToggle(comp.id, e.target.checked)}
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

                <fieldset className="supplier-fieldset">
                  <legend className="supplier-legend">Item Type Details</legend>
                  <div className="supplier-table-wrapper" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <table className="supplier-grid-table">
                      <thead>
                        <tr>
                          <th style={{ width: "35px" }}>#</th>
                          <th>Item Type</th>
                          <th style={{ width: "50px", textAlign: "center" }}>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemTypes.map((it, idx) => {
                          const selected = isItemTypeSelected(it.id);
                          return (
                            <tr key={it.id}>
                              <td style={{ textAlign: "center" }}>{idx + 1}</td>
                              <td>{it.name}</td>
                              <td style={{ textAlign: "center" }}>
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => handleItemTypeToggle(it.id, e.target.checked)}
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
            </div>
          )}
        </div>
      );
    },
    [
      activeTab, locations, cities, states, countries, titles, agents,
      employees, banks, categories, groups, grades, companies, itemTypes
    ]
  );

  return (
    <Tools
      title="Supplier Master"
      columns={columns}
      apiBase={`${API_ROOT}/suppliers/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="1180px"
      onExit={onExit}
    />
  );
}
