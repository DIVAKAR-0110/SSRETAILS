// frontend/src/Component/Master/Accounts/TransactionHead/TransactionHead.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Tools from "../../../Tools";
import Dialog from "../../../Common/Dialog.jsx";
import "./TransactionHead.css";

const API_ROOT = "http://localhost:8000";

export default function TransactionHead({ adminId = 1, onExit }) {
  const [groupHeads, setGroupHeads] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [agents, setAgents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [showAgentPopup, setShowAgentPopup] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const agentRef = useRef(null);

  // Close agent popup on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (agentRef.current && !agentRef.current.contains(e.target)) {
        setShowAgentPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Parallel fetch of all required lookups
  useEffect(() => {
    let isMounted = true;
    async function loadLookups() {
      try {
        setLoadingLookups(true);
        const [ghRes, cityRes, stateRes, countryRes, agentRes, compRes] =
          await Promise.all([
            fetch(`${API_ROOT}/accounts/group-heads/`),
            fetch(`${API_ROOT}/cities/`),
            fetch(`${API_ROOT}/states/`),
            fetch(`${API_ROOT}/countries/`),
            fetch(`${API_ROOT}/accounts/agents/`),
            fetch(`${API_ROOT}/companies/`),
          ]);

        const [ghData, cityData, stateData, countryData, agentData, compData] =
          await Promise.all([
            ghRes.json().catch(() => []),
            cityRes.json().catch(() => []),
            stateRes.json().catch(() => []),
            countryRes.json().catch(() => []),
            agentRes.json().catch(() => []),
            compRes.json().catch(() => []),
          ]);

        if (isMounted) {
          setGroupHeads(Array.isArray(ghData) ? ghData : []);
          setCities(Array.isArray(cityData) ? cityData : []);
          setStates(Array.isArray(stateData) ? stateData : []);
          setCountries(Array.isArray(countryData) ? countryData : []);
          setAgents(Array.isArray(agentData) ? agentData : []);
          setCompanies(Array.isArray(compData) ? compData : []);
        }
      } catch (err) {
        console.error("Failed to load TransactionHead lookups:", err);
      } finally {
        if (isMounted) setLoadingLookups(false);
      }
    }

    loadLookups();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listing Columns for Tools.jsx
  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Transaction Head",
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
        name: "group_head_name",
        label: "Superior Group Head",
      },
      {
        name: "ac_type",
        label: "A/C Type",
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
      },
    ],
    []
  );

  // Custom 2-Column Form matching Images 3 & 4
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      // Selected City details
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

      // Selected Agent
      const selectedAgent = agents.find(
        (a) => a.id === parseInt(formData.agent_code, 10)
      );
      const agentDisplayText = selectedAgent
        ? `${selectedAgent.name} - ${selectedAgent.city_name || ""}`
        : "[SELECT]";

      // Filtered agents for popup search
      const filteredAgents = agents.filter(
        (a) =>
          !agentSearch ||
          a.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
          (a.city_name && a.city_name.toLowerCase().includes(agentSearch.toLowerCase()))
      );

      // Company details rows
      const companyDetails = formData.company_details || {};

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

      const handleGroupHeadChange = (e) => {
        if (isReadOnly) return;
        const code = parseInt(e.target.value, 10) || 0;
        const matched = groupHeads.find((g) => g.id === code);
        setFormData((prev) => ({
          ...prev,
          group_head_code: code,
          ac_type: matched && matched.ac_type ? matched.ac_type : "Trading A/C",
          head_type: matched && matched.head_type ? matched.head_type : 0,
        }));
      };

      const handleCityChange = (e) => {
        if (isReadOnly) return;
        const cId = parseInt(e.target.value, 10) || 0;
        setFormData((prev) => ({ ...prev, city_id: cId }));
      };

      const handleAgentSelect = (agent) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          agent_code: agent.id,
          agent_name: agent.name,
        }));
        setShowAgentPopup(false);
      };

      const handleCompanySelectToggle = (compId) => {
        if (isReadOnly) return;
        setFormData((prev) => {
          const cur = { ...(prev.company_details || {}) };
          cur[compId] = {
            ...(cur[compId] || {}),
            selected: !cur[compId]?.selected,
            opening_balance: cur[compId]?.opening_balance || "0.00",
          };
          return { ...prev, company_details: cur };
        });
      };

      const handleOpeningBalanceChange = (compId, val) => {
        if (isReadOnly) return;
        setFormData((prev) => {
          const cur = { ...(prev.company_details || {}) };
          cur[compId] = {
            ...(cur[compId] || {}),
            selected: true,
            opening_balance: val,
          };
          return { ...prev, company_details: cur };
        });
      };

      const formatDateForInput = (val) => {
        if (!val) return "";
        try {
          return val.includes("T") ? val.split("T")[0] : val.substring(0, 10);
        } catch {
          return "";
        }
      };

      return (
        <div className="th-container">
          <div className="th-header-title">Transaction Head</div>

          <div className="th-form-2col">
            {/* ================= LEFT COLUMN ================= */}
            <div className="th-col">
              {/* Transaction Head */}
              <div className="th-field-row">
                <label className="th-label th-label-req">Transaction Head</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleUppercaseInput("name", 50)}
                    disabled={isReadOnly}
                    required
                    maxLength={50}
                    className="th-input th-input-upper"
                    placeholder="TRANSACTION HEAD NAME"
                  />
                  <span className="th-badge">{`${(formData.name || "").length}/50`}</span>
                </div>
              </div>

              {/* Short Name */}
              <div className="th-field-row">
                <label className="th-label th-label-req">Short Name</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="shortname"
                    value={formData.shortname || ""}
                    onChange={handleUppercaseInput("shortname", 25)}
                    disabled={isReadOnly}
                    required
                    maxLength={25}
                    className="th-input th-input-upper"
                    placeholder="SHORT NAME"
                  />
                  <span className="th-badge">{`${(formData.shortname || "").length}/25`}</span>
                </div>
              </div>

              {/* Print Head Name */}
              <div className="th-field-row">
                <label className="th-label">Print Head Name</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="print_head_name"
                    value={formData.print_head_name || ""}
                    onChange={handleUppercaseInput("print_head_name", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input th-input-upper"
                    placeholder="PRINT HEAD NAME"
                  />
                  <span className="th-badge">{`${(formData.print_head_name || "").length}/50`}</span>
                </div>
              </div>

              {/* Superior Group Head */}
              <div className="th-field-row">
                <label className="th-label">Superior Group Head</label>
                <div className="th-input-wrap">
                  <select
                    name="group_head_code"
                    value={formData.group_head_code || 0}
                    onChange={handleGroupHeadChange}
                    disabled={isReadOnly || loadingLookups}
                    className="th-select"
                  >
                    <option value={0}>[SELECT]</option>
                    {groupHeads.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transaction A/C Type (Radio Group, Disabled) */}
              <div className="th-field-row">
                <label className="th-label">Transaction A/C Type</label>
                <div className="th-radio-group th-input-readonly">
                  <label className="th-radio-label">
                    <input
                      type="radio"
                      name="trans_ac_type"
                      checked={(formData.ac_type || "Trading A/C").includes("Trading")}
                      readOnly
                      disabled
                    />
                    Trading A/C
                  </label>
                  <label className="th-radio-label">
                    <input
                      type="radio"
                      name="trans_ac_type"
                      checked={(formData.ac_type || "").includes("Profit") || (formData.ac_type || "") === "P/L"}
                      readOnly
                      disabled
                    />
                    P/L
                  </label>
                  <label className="th-radio-label">
                    <input
                      type="radio"
                      name="trans_ac_type"
                      checked={(formData.ac_type || "").includes("Balance") || (formData.ac_type || "") === "BSheet"}
                      readOnly
                      disabled
                    />
                    B Sheet
                  </label>
                </div>
              </div>

              {/* Head Type (Disabled) */}
              <div className="th-field-row">
                <label className="th-label">Head Type</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    value={
                      formData.head_type === 1
                        ? "Asset"
                        : formData.head_type === 2
                        ? "Liabilities"
                        : formData.head_type === 3
                        ? "Income"
                        : formData.head_type === 4
                        ? "Expenses"
                        : ""
                    }
                    readOnly
                    disabled
                    className="th-input th-input-readonly"
                    placeholder="Auto derived from Group Head"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="th-field-row th-field-row-top">
                <label className="th-label">Address</label>
                <div className="th-input-wrap">
                  <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleStandardInput("address", 400)}
                    disabled={isReadOnly}
                    maxLength={400}
                    rows={3}
                    className="th-textarea"
                    placeholder="Address details"
                  />
                  <span className="th-badge" style={{ bottom: "6px", right: "6px" }}>
                    {`${(formData.address || "").length}/400`}
                  </span>
                </div>
              </div>

              {/* City */}
              <div className="th-field-row">
                <label className="th-label">City</label>
                <div className="th-input-wrap">
                  <select
                    name="city_id"
                    value={formData.city_id || 0}
                    onChange={handleCityChange}
                    disabled={isReadOnly || loadingLookups}
                    className="th-select"
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

              {/* State & Country Auto-filled */}
              <div className="th-state-country-row">
                <div className="th-sub-field">
                  <label className="th-sub-label">State</label>
                  <input
                    type="text"
                    value={stateName}
                    readOnly
                    className="th-input th-input-readonly"
                    placeholder="AUTO FILLED"
                  />
                </div>
                <div className="th-sub-field">
                  <label className="th-sub-label">Country</label>
                  <input
                    type="text"
                    value={countryName}
                    readOnly
                    className="th-input th-input-readonly"
                    placeholder="AUTO FILLED"
                  />
                </div>
              </div>

              {/* PIN/ZIP Code */}
              <div className="th-field-row">
                <label className="th-label">PIN/ZIP Code</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode || ""}
                    onChange={handleStandardInput("pincode", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input"
                    placeholder="PIN Code"
                  />
                </div>
              </div>

              {/* Phone No */}
              <div className="th-field-row">
                <label className="th-label">Phone No.</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="phoneno"
                    value={formData.phoneno || ""}
                    onChange={handleStandardInput("phoneno", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input"
                    placeholder="Phone No"
                  />
                </div>
              </div>

              {/* Mobile No */}
              <div className="th-field-row">
                <label className="th-label">Mobile No.</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile || ""}
                    onChange={handleStandardInput("mobile", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input"
                    placeholder="Mobile No"
                  />
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="th-col">
              {/* Fax No */}
              <div className="th-field-row">
                <label className="th-label">Fax No.</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="fax"
                    value={formData.fax || ""}
                    onChange={handleStandardInput("fax", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input"
                    placeholder="Fax No"
                  />
                </div>
              </div>

              {/* Email Id */}
              <div className="th-field-row">
                <label className="th-label">Email Id.</label>
                <div className="th-input-wrap">
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleStandardInput("email", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Web Site */}
              <div className="th-field-row">
                <label className="th-label">Web Site</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleStandardInput("website", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input"
                    placeholder="www.example.com"
                  />
                </div>
              </div>

              {/* Agent with Popup Grid Search (Image 4) */}
              <div className="th-field-row">
                <label className="th-label">Agent</label>
                <div className="th-agent-wrap" ref={agentRef}>
                  <div
                    className="th-select"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    onClick={() => !isReadOnly && setShowAgentPopup(!showAgentPopup)}
                  >
                    <span>{agentDisplayText}</span>
                    <span style={{ fontSize: "0.7rem", color: "#888" }}>▼</span>
                  </div>

                  {/* Popup Grid matching Image 4 */}
                  {showAgentPopup && (
                    <div className="th-agent-popup">
                      <div style={{ padding: "4px 6px", background: "#fbf9f5", borderBottom: "1px solid #d4c7b5" }}>
                        <input
                          type="text"
                          placeholder="Search Agent Name or City..."
                          value={agentSearch}
                          onChange={(e) => setAgentSearch(e.target.value)}
                          className="th-input"
                          style={{ height: "24px", fontSize: "0.78rem" }}
                          autoFocus
                        />
                      </div>
                      <table className="th-agent-table">
                        <thead>
                          <tr>
                            <th>AGENT NAME</th>
                            <th>CITY NAME</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAgents.length === 0 ? (
                            <tr>
                              <td colSpan={2} style={{ textAlign: "center", color: "#888", padding: "8px" }}>
                                No agents found
                              </td>
                            </tr>
                          ) : (
                            filteredAgents.map((ag) => (
                              <tr key={ag.id} onClick={() => handleAgentSelect(ag)}>
                                <td style={{ fontWeight: 600 }}>{ag.name}</td>
                                <td>{ag.city_name || "—"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Regular Discount */}
              <div className="th-field-row">
                <label className="th-label">Regular Discount</label>
                <div className="th-input-wrap">
                  <input
                    type="number"
                    step="0.01"
                    name="regular_discount"
                    value={formData.regular_discount || 0}
                    onChange={handleNumericInput("regular_discount")}
                    disabled={isReadOnly}
                    className="th-input"
                    style={{ textAlign: "right" }}
                  />
                </div>
              </div>

              {/* PAN */}
              <div className="th-field-row">
                <label className="th-label">PAN</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="panno"
                    value={formData.panno || ""}
                    onChange={handleUppercaseInput("panno", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input th-input-upper"
                    placeholder="PAN NUMBER"
                  />
                </div>
              </div>

              {/* TIN */}
              <div className="th-field-row">
                <label className="th-label">TIN</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="tinno"
                    value={formData.tinno || ""}
                    onChange={handleStandardInput("tinno", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input"
                    placeholder="TIN Number"
                  />
                </div>
              </div>

              {/* TIN Date */}
              <div className="th-field-row">
                <label className="th-label">TIN Date</label>
                <div className="th-input-wrap">
                  <input
                    type="date"
                    name="tindate"
                    value={formatDateForInput(formData.tindate)}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, tindate: e.target.value || null }))
                    }
                    disabled={isReadOnly}
                    className="th-input"
                  />
                </div>
              </div>

              {/* CST No */}
              <div className="th-field-row">
                <label className="th-label">CST No</label>
                <div className="th-input-wrap">
                  <input
                    type="text"
                    name="cstno"
                    value={formData.cstno || ""}
                    onChange={handleStandardInput("cstno", 50)}
                    disabled={isReadOnly}
                    maxLength={50}
                    className="th-input"
                    placeholder="CST Number"
                  />
                </div>
              </div>

              {/* CST Date */}
              <div className="th-field-row">
                <label className="th-label">CST Date</label>
                <div className="th-input-wrap">
                  <input
                    type="date"
                    name="cstdate"
                    value={formatDateForInput(formData.cstdate)}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, cstdate: e.target.value || null }))
                    }
                    disabled={isReadOnly}
                    className="th-input"
                  />
                </div>
              </div>

              {/* Interest */}
              <div className="th-field-row">
                <label className="th-label">Interest</label>
                <div className="th-input-wrap">
                  <input
                    type="number"
                    step="0.01"
                    name="interest"
                    value={formData.interest !== undefined ? formData.interest : "0.00"}
                    onChange={handleNumericInput("interest")}
                    disabled={isReadOnly}
                    className="th-input-number"
                  />
                </div>
              </div>

              {/* TDS(%) & ProfitLoss(%) */}
              <div className="th-multi-row">
                <div className="th-inline-field">
                  <span className="th-inline-label">TDS(%)</span>
                  <input
                    type="number"
                    step="0.01"
                    name="tds_percent"
                    value={formData.tds_percent !== undefined ? formData.tds_percent : "0.00"}
                    onChange={handleNumericInput("tds_percent")}
                    disabled={isReadOnly}
                    className="th-input-number"
                  />
                </div>
                <div className="th-inline-field">
                  <span className="th-inline-label">ProfitLoss(%)</span>
                  <input
                    type="number"
                    step="0.01"
                    name="profit_loss_percent"
                    value={formData.profit_loss_percent !== undefined ? formData.profit_loss_percent : "0.00"}
                    onChange={handleNumericInput("profit_loss_percent")}
                    disabled={isReadOnly}
                    className="th-input-number"
                  />
                </div>
              </div>

              {/* Is Default Bank & DD COMM (%) */}
              <div className="th-multi-row" style={{ marginTop: "2px" }}>
                <label className="th-checkbox-inline">
                  <input
                    type="checkbox"
                    name="is_default_bank"
                    checked={!!formData.is_default_bank}
                    onChange={handleCheckbox("is_default_bank")}
                    disabled={isReadOnly}
                  />
                  Is Default Bank
                </label>
                <div className="th-inline-field">
                  <span className="th-inline-label">DD COMM (%)</span>
                  <input
                    type="number"
                    step="0.01"
                    name="dd_comm"
                    value={formData.dd_comm !== undefined ? formData.dd_comm : "0.00"}
                    onChange={handleNumericInput("dd_comm")}
                    disabled={isReadOnly}
                    className="th-input-number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= COMPANY DETAILS TABLE ================= */}
          <div className="th-company-section">
            <div className="th-company-header">Company Details</div>
            <table className="th-company-table">
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>#</th>
                  <th style={{ textAlign: "left", paddingLeft: "10px" }}>Company</th>
                  <th style={{ width: "200px" }}>Opening Balance</th>
                  <th style={{ width: "80px" }}>Select</th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ color: "#888", padding: "10px" }}>
                      No companies loaded.
                    </td>
                  </tr>
                ) : (
                  companies.map((comp, idx) => {
                    const compState = companyDetails[comp.id] || {};
                    const isSelected = !!compState.selected;
                    const opBal = compState.opening_balance !== undefined ? compState.opening_balance : "0.00";
                    return (
                      <tr key={comp.id}>
                        <td>{idx + 1}</td>
                        <td style={{ textAlign: "left", paddingLeft: "10px", fontWeight: 600 }}>
                          {comp.name}
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={opBal}
                            onChange={(e) => handleOpeningBalanceChange(comp.id, e.target.value)}
                            disabled={isReadOnly}
                            className="th-input-number"
                            style={{ maxWidth: "160px", margin: "0 auto" }}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCompanySelectToggle(comp.id)}
                            disabled={isReadOnly}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    },
    [groupHeads, cities, states, agents, companies, loadingLookups, showAgentPopup, agentSearch]
  );

  return (
    <>
      <Tools
        title="Transaction Head"
        columns={columns}
        apiBase={`${API_ROOT}/accounts/transaction-heads/`}
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
