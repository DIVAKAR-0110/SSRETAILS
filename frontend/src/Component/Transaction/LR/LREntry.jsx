// frontend/src/Component/Transaction/LR/LREntry.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LREntry.css";

const API_ROOT = "http://localhost:8000";

export default function LREntry({ adminId = 1, onExit }) {
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState("invoice"); // "invoice" | "lr" | "remarks"

  // Dropdown Lookups State
  const [locations, setLocations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transports, setTransports] = useState([]);
  const [cities, setCities] = useState([]);
  const [transferModes, setTransferModes] = useState([]);
  const [lrEntryTypes, setLrEntryTypes] = useState([]);
  const [lrChargeModes, setLrChargeModes] = useState([]);

  // Header State
  const [locationId, setLocationId] = useState(1);
  const [companyName] = useState("SRI GANESHAA SILKS");
  const [companyId] = useState(1);
  const [lrTypeId, setLrTypeId] = useState(1);
  const [agentId, setAgentId] = useState(0);
  const [agentAddress, setAgentAddress] = useState("");
  const [entryNo, setEntryNo] = useState("");
  const [entryId, setEntryId] = useState("");
  const [entryDate, setEntryDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [actualWeight, setActualWeight] = useState("0.00");
  const [chargedWeight, setChargedWeight] = useState("0.00");
  const [noOfBundles, setNoOfBundles] = useState("0");

  // Tab 1: Invoices State
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      supplier_id: "",
      city_name: "",
      invoice_no: "",
      invoice_date: new Date().toISOString().split("T")[0],
      amount: "0.00",
      supplier_bundle_no: "",
      bundles: "0",
    },
  ]);
  const [selectedInvoiceRow, setSelectedInvoiceRow] = useState(0);

  // Tab 2: LR Details State
  const [lrDetails, setLrDetails] = useState([
    {
      id: 1,
      transport_id: "",
      from_city_id: "",
      to_city_id: "",
      transfer_mode_id: "",
      lr_no: "",
      lr_date: new Date().toISOString().split("T")[0],
      is_primary: true,
      is_paid: false,
      paid_by: "",
      lr_amount: "0.00",
      freight_charge_mode_id: 0,
      freight_charge_per_mode: "0.00",
      freight_charge: "0.00",
      lu_charge_mode_id: 0,
      lu_charge_per_mode: "0.00",
      lu_charge: "0.00",
      other_charge_amount: "0.00",
      total: "0.00",
    },
  ]);
  const [selectedLrRow, setSelectedLrRow] = useState(0);

  // Tab 3: Remarks State
  const [remarks, setRemarks] = useState("");

  // Loading & Saving Status
  const [saving, setSaving] = useState(false);

  // Initial Load of Lookups & Next Entry No
  useEffect(() => {
    loadLookups();
    fetchNextEntryNo();
  }, []);

  const loadLookups = async () => {
    try {
      const [
        locRes,
        agRes,
        supRes,
        trRes,
        cityRes,
        modeRes,
        typeRes,
        chargeRes,
      ] = await Promise.allSettled([
        axios.get(`${API_ROOT}/locations/`),
        axios.get(`${API_ROOT}/agents/`),
        axios.get(`${API_ROOT}/suppliers/`),
        axios.get(`${API_ROOT}/transports/`),
        axios.get(`${API_ROOT}/cities/`),
        axios.get(`${API_ROOT}/transfer-modes/`),
        axios.get(`${API_ROOT}/lr-entry-types/`),
        axios.get(`${API_ROOT}/lr-charge-modes/`),
      ]);

      if (locRes.status === "fulfilled") {
        const data = locRes.value.data.results || locRes.value.data || [];
        setLocations(data);
        if (data.length > 0) setLocationId(data[0].id || data[0].code || 1);
      }
      if (agRes.status === "fulfilled") setAgents(agRes.value.data.results || agRes.value.data || []);
      if (supRes.status === "fulfilled") setSuppliers(supRes.value.data.results || supRes.value.data || []);
      if (trRes.status === "fulfilled") setTransports(trRes.value.data.results || trRes.value.data || []);
      if (cityRes.status === "fulfilled") setCities(cityRes.value.data.results || cityRes.value.data || []);
      if (modeRes.status === "fulfilled") setTransferModes(modeRes.value.data.results || modeRes.value.data || []);
      if (typeRes.status === "fulfilled") setLrEntryTypes(typeRes.value.data.results || typeRes.value.data || []);
      if (chargeRes.status === "fulfilled") setLrChargeModes(chargeRes.value.data.results || chargeRes.value.data || []);
    } catch (err) {
      console.error("Error loading lookups:", err);
    }
  };

  const fetchNextEntryNo = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/lr-entry/next-entry-no/`);
      if (res.data) {
        setEntryNo(res.data.entry_no || "");
        setEntryId(res.data.entry_id || "");
      }
    } catch {
      const today = new Date();
      const code = `LR${today.getFullYear().toString().slice(2)}${String(today.getMonth() + 1).padStart(2, "0")}0001`;
      setEntryNo(code);
      setEntryId(`ID-${code}`);
    }
  };

  // Agent Selection Change -> Autofill Address
  const handleAgentChange = (e) => {
    const aid = Number(e.target.value);
    setAgentId(aid);
    const found = agents.find((a) => (a.id || a.code) === aid);
    if (found) {
      setAgentAddress(found.address || "");
    } else {
      setAgentAddress("");
    }
  };

  // -------------------------------------------------------------
  // Invoice Grid Row Operations
  // -------------------------------------------------------------
  const handleInvoiceChange = (index, field, value) => {
    const updated = [...invoices];
    updated[index][field] = value;

    // Autofill City when Supplier is chosen
    if (field === "supplier_id") {
      const sid = Number(value);
      const sup = suppliers.find((s) => (s.id || s.code) === sid);
      if (sup) {
        let cName = sup.city_name || "";
        if (!cName && sup.city_id) {
          const cObj = cities.find((c) => (c.id || c.code) === sup.city_id);
          cName = cObj ? cObj.name : "";
        }
        updated[index]["city_name"] = cName;
      } else {
        updated[index]["city_name"] = "";
      }
    }

    setInvoices(updated);
  };

  const addInvoiceRow = () => {
    setInvoices((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        supplier_id: "",
        city_name: "",
        invoice_no: "",
        invoice_date: entryDate,
        amount: "0.00",
        supplier_bundle_no: "",
        bundles: "0",
      },
    ]);
    setSelectedInvoiceRow(invoices.length);
  };

  const removeInvoiceRow = (index) => {
    if (invoices.length <= 1) return;
    setInvoices((prev) => prev.filter((_, idx) => idx !== index));
    if (selectedInvoiceRow >= invoices.length - 1) {
      setSelectedInvoiceRow(Math.max(0, invoices.length - 2));
    }
  };

  // -------------------------------------------------------------
  // LR Details Grid Row Operations
  // -------------------------------------------------------------
  const handleLrDetailChange = (index, field, value) => {
    const updated = [...lrDetails];
    updated[index][field] = value;

    // Recalculate line total
    const lrAmt = parseFloat(updated[index].lr_amount || 0);
    const frAmt = parseFloat(updated[index].freight_charge || 0);
    const luAmt = parseFloat(updated[index].lu_charge || 0);
    const othAmt = parseFloat(updated[index].other_charge_amount || 0);
    updated[index].total = (lrAmt + frAmt + luAmt + othAmt).toFixed(2);

    setLrDetails(updated);
  };

  const addLrDetailRow = () => {
    setLrDetails((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        transport_id: "",
        from_city_id: "",
        to_city_id: "",
        transfer_mode_id: "",
        lr_no: "",
        lr_date: entryDate,
        is_primary: false,
        is_paid: false,
        paid_by: "",
        lr_amount: "0.00",
        freight_charge_mode_id: 0,
        freight_charge_per_mode: "0.00",
        freight_charge: "0.00",
        lu_charge_mode_id: 0,
        lu_charge_per_mode: "0.00",
        lu_charge: "0.00",
        other_charge_amount: "0.00",
        total: "0.00",
      },
    ]);
    setSelectedLrRow(lrDetails.length);
  };

  const removeLrDetailRow = (index) => {
    if (lrDetails.length <= 1) return;
    setLrDetails((prev) => prev.filter((_, idx) => idx !== index));
    if (selectedLrRow >= lrDetails.length - 1) {
      setSelectedLrRow(Math.max(0, lrDetails.length - 2));
    }
  };

  // Calculate Totals for Invoices
  const totalInvoiceAmount = invoices
    .reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0)
    .toFixed(2);

  const totalInvoiceBundles = invoices
    .reduce((acc, row) => acc + (parseInt(row.bundles) || 0), 0)
    .toString();

  // Save LR Entry (OK Click)
  const handleSave = async () => {
    if (!entryNo) {
      alert("Entry No. is required.");
      return;
    }

    const payload = {
      entry_id: entryId || `ID-${entryNo}`,
      entry_no: entryNo,
      entry_date: entryDate,
      location_id: Number(locationId),
      company_id: Number(companyId),
      lr_entry_type_id: Number(lrTypeId) || 1,
      agent_id: Number(agentId) || 0,
      actual_weight: parseFloat(actualWeight) || 0,
      charged_weight: parseFloat(chargedWeight) || 0,
      total_bundles: parseInt(noOfBundles) || 0,
      total_invoice_amount: parseFloat(totalInvoiceAmount) || 0,
      remarks: remarks || "",
      user_id: adminId,
      invoices: invoices
        .filter((i) => i.supplier_id || i.invoice_no)
        .map((i, idx) => ({
          entry_order_id: idx + 1,
          supplier_id: Number(i.supplier_id),
          invoice_no: (i.invoice_no || "").trim().toUpperCase(),
          invoice_date: i.invoice_date || entryDate,
          amount: parseFloat(i.amount) || 0,
          bundles: parseInt(i.bundles) || 0,
          supplier_bundle_no: i.supplier_bundle_no || "",
        })),
      lr_details: lrDetails
        .filter((l) => l.transport_id || l.lr_no)
        .map((l, idx) => ({
          entry_order_id: idx + 1,
          transport_id: Number(l.transport_id) || 0,
          from_city_id: Number(l.from_city_id) || 0,
          to_city_id: Number(l.to_city_id) || 0,
          transfer_mode_id: Number(l.transfer_mode_id) || 0,
          lr_no: (l.lr_no || "").trim().toUpperCase(),
          lr_date: l.lr_date || entryDate,
          is_primary: Boolean(l.is_primary),
          is_paid: Boolean(l.is_paid),
          paid_by: l.paid_by || "",
          lr_amount: parseFloat(l.lr_amount) || 0,
          freight_charge_mode_id: Number(l.freight_charge_mode_id) || 0,
          freight_charge_per_mode: parseFloat(l.freight_charge_per_mode) || 0,
          freight_charge: parseFloat(l.freight_charge) || 0,
          lu_charge_mode_id: Number(l.lu_charge_mode_id) || 0,
          lu_charge_per_mode: parseFloat(l.lu_charge_per_mode) || 0,
          lu_charge: parseFloat(l.lu_charge) || 0,
          other_charge_amount: parseFloat(l.other_charge_amount) || 0,
          total: parseFloat(l.total) || 0,
        })),
    };

    setSaving(true);
    try {
      const res = await axios.post(`${API_ROOT}/lr-entry/`, payload);
      alert(`LR Entry ${res.data.entry_no || entryNo} saved successfully!`);
      // Reset & fetch next entry no
      fetchNextEntryNo();
      setInvoices([
        {
          id: 1,
          supplier_id: "",
          city_name: "",
          invoice_no: "",
          invoice_date: entryDate,
          amount: "0.00",
          supplier_bundle_no: "",
          bundles: "0",
        },
      ]);
      setRemarks("");
    } catch (err) {
      console.error("Save error:", err);
      const errMsg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        err.message;
      alert(`Failed to save LR Entry: ${errMsg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lr-entry-container">
      <fieldset className="lr-main-fieldset">
        <legend className="lr-main-legend">LR ENTRY</legend>

        {/* Header Section (2-Column Layout matching Images 1, 2, 3) */}
        <div className="lr-header-section">
          {/* Left Column */}
          <div className="lr-header-col-left">
            <div className="lr-form-row">
              <label>Location</label>
              <select
                className="lr-select"
                value={locationId}
                onChange={(e) => setLocationId(Number(e.target.value))}
              >
                {locations.map((loc) => (
                  <option key={loc.id || loc.code} value={loc.id || loc.code}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lr-form-row">
              <label>Company</label>
              <input
                type="text"
                className="lr-input"
                value={companyName}
                disabled
              />
            </div>

            <div className="lr-form-row">
              <label>LR Type</label>
              <select
                className="lr-select"
                value={lrTypeId}
                onChange={(e) => setLrTypeId(Number(e.target.value))}
              >
                {lrEntryTypes.length > 0 ? (
                  lrEntryTypes.map((t) => (
                    <option key={t.code || t.id} value={t.code || t.id}>
                      {t.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value={1}>Purchase</option>
                    <option value={2}>Sales</option>
                    <option value={3}>Stock Transfer</option>
                    <option value={4}>Other</option>
                  </>
                )}
              </select>
            </div>

            <div className="lr-form-row">
              <label>Agent Name</label>
              <select
                className="lr-select"
                value={agentId}
                onChange={handleAgentChange}
              >
                <option value={0}>[SELECT]</option>
                {agents.map((ag) => (
                  <option key={ag.id || ag.code} value={ag.id || ag.code}>
                    {ag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lr-form-row" style={{ alignItems: "flex-start" }}>
              <label style={{ marginTop: "3px" }}>Address</label>
              <textarea
                className="lr-textarea"
                rows={2}
                value={agentAddress}
                onChange={(e) => setAgentAddress(e.target.value)}
                placeholder="Agent address auto-populates here"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lr-header-col-right">
            <div className="lr-form-row">
              <label>Entry No.</label>
              <input
                type="text"
                className="lr-input"
                value={entryNo}
                onChange={(e) => setEntryNo(e.target.value.toUpperCase())}
                placeholder="Auto-generated"
              />
            </div>

            <div className="lr-form-row">
              <label>Entry Date</label>
              <input
                type="date"
                className="lr-input"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>

            <div className="lr-form-row">
              <label>Actual Weight</label>
              <input
                type="number"
                step="0.01"
                className="lr-input lr-number-input"
                value={actualWeight}
                onChange={(e) => setActualWeight(e.target.value)}
              />
            </div>

            <div className="lr-form-row">
              <label>Charged Weight</label>
              <input
                type="number"
                step="0.01"
                className="lr-input lr-number-input"
                value={chargedWeight}
                onChange={(e) => setChargedWeight(e.target.value)}
              />
            </div>

            <div className="lr-form-row">
              <label>No.of Bundles</label>
              <input
                type="number"
                step="1"
                className="lr-input lr-number-input"
                value={noOfBundles}
                onChange={(e) => setNoOfBundles(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tab Strip Navigation */}
        <div className="lr-tabs-header">
          <button
            type="button"
            className={`lr-tab-btn ${activeTab === "invoice" ? "active" : ""}`}
            onClick={() => setActiveTab("invoice")}
          >
            Invoice 1
          </button>
          <button
            type="button"
            className={`lr-tab-btn ${activeTab === "lr" ? "active" : ""}`}
            onClick={() => setActiveTab("lr")}
          >
            LR 2
          </button>
          <button
            type="button"
            className={`lr-tab-btn ${activeTab === "remarks" ? "active" : ""}`}
            onClick={() => setActiveTab("remarks")}
          >
            Remarks 3
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="lr-tabs-content">
          {/* TAB 1: INVOICE 1 */}
          {activeTab === "invoice" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div className="lr-grid-container">
                <table className="lr-grid-table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}></th>
                      <th style={{ minWidth: "150px" }}>Supplier</th>
                      <th style={{ minWidth: "130px" }}>City Name</th>
                      <th style={{ minWidth: "120px" }}>InvoiceNo</th>
                      <th style={{ minWidth: "100px" }}>Invoice Date</th>
                      <th style={{ minWidth: "90px" }}>Amount</th>
                      <th style={{ minWidth: "120px" }}>Supplier Bundle No</th>
                      <th style={{ minWidth: "90px" }}>No Of Bundles</th>
                      <th style={{ width: "80px" }}>Item Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((row, idx) => {
                      const isSelected = selectedInvoiceRow === idx;
                      return (
                        <tr
                          key={idx}
                          className={isSelected ? "selected" : ""}
                          onClick={() => setSelectedInvoiceRow(idx)}
                        >
                          <td className="lr-row-selector">{isSelected ? "▶" : idx + 1}</td>
                          <td>
                            <select
                              className="lr-cell-select"
                              value={row.supplier_id}
                              onChange={(e) => handleInvoiceChange(idx, "supplier_id", e.target.value)}
                            >
                              <option value="">[SELECT]</option>
                              {suppliers.map((s) => (
                                <option key={s.id || s.code} value={s.id || s.code}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="lr-cell-input"
                              value={row.city_name}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="lr-cell-input"
                              value={row.invoice_no}
                              onChange={(e) => handleInvoiceChange(idx, "invoice_no", e.target.value.toUpperCase())}
                              placeholder="Inv #"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="lr-cell-input"
                              value={row.invoice_date}
                              onChange={(e) => handleInvoiceChange(idx, "invoice_date", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="lr-cell-input lr-cell-num"
                              value={row.amount}
                              onChange={(e) => handleInvoiceChange(idx, "amount", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="lr-cell-input"
                              value={row.supplier_bundle_no}
                              onChange={(e) => handleInvoiceChange(idx, "supplier_bundle_no", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="1"
                              className="lr-cell-input lr-cell-num"
                              value={row.bundles}
                              onChange={(e) => handleInvoiceChange(idx, "bundles", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              className="lr-btn-ellipsis"
                              title="Link Item Particulars"
                              onClick={() => alert(`Item Link modal for Invoice ${row.invoice_no || idx + 1}`)}
                            >
                              ...
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grid Toolbar & Summary Totals */}
              <div className="lr-grid-toolbar">
                <button type="button" className="lr-grid-btn" onClick={addInvoiceRow}>
                  + Add Row
                </button>
                <button
                  type="button"
                  className="lr-grid-btn"
                  onClick={() => removeInvoiceRow(selectedInvoiceRow)}
                  disabled={invoices.length <= 1}
                >
                  - Delete Row
                </button>
              </div>

              <div className="lr-totals-bar">
                <div className="lr-total-item">
                  <span>Total Amount:</span>
                  <span className="lr-total-val">{totalInvoiceAmount}</span>
                </div>
                <div className="lr-total-item">
                  <span>Total Bundles:</span>
                  <span className="lr-total-val">{totalInvoiceBundles}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LR 2 */}
          {activeTab === "lr" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div className="lr-grid-container">
                <table className="lr-grid-table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}></th>
                      <th style={{ minWidth: "130px" }}>Transport</th>
                      <th style={{ minWidth: "100px" }}>From City</th>
                      <th style={{ minWidth: "100px" }}>To City</th>
                      <th style={{ minWidth: "90px" }}>Mode</th>
                      <th style={{ minWidth: "100px" }}>LR No.</th>
                      <th style={{ minWidth: "100px" }}>LR Date</th>
                      <th style={{ width: "50px" }}>Primary</th>
                      <th style={{ width: "50px" }}>Paid</th>
                      <th style={{ minWidth: "80px" }}>Paid By</th>
                      <th style={{ minWidth: "80px" }}>LR Amount</th>
                      <th style={{ minWidth: "110px" }}>Freight Charge Mode</th>
                      <th style={{ minWidth: "80px" }}>Freight Charge</th>
                      <th style={{ minWidth: "90px" }}>Freight Charge Amount</th>
                      <th style={{ minWidth: "110px" }}>LRU Charge Mode</th>
                      <th style={{ minWidth: "80px" }}>LRU Charge</th>
                      <th style={{ minWidth: "90px" }}>LRU Charge Amount</th>
                      <th style={{ width: "80px" }}>Other Charge</th>
                      <th style={{ minWidth: "90px" }}>Other Charges Total</th>
                      <th style={{ minWidth: "90px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lrDetails.map((row, idx) => {
                      const isSelected = selectedLrRow === idx;
                      return (
                        <tr
                          key={idx}
                          className={isSelected ? "selected" : ""}
                          onClick={() => setSelectedLrRow(idx)}
                        >
                          <td className="lr-row-selector">{isSelected ? "▶" : idx + 1}</td>
                          <td>
                            <select
                              className="lr-cell-select"
                              value={row.transport_id}
                              onChange={(e) => handleLrDetailChange(idx, "transport_id", e.target.value)}
                            >
                              <option value="">[SELECT]</option>
                              {transports.map((t) => (
                                <option key={t.id || t.code} value={t.id || t.code}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              className="lr-cell-select"
                              value={row.from_city_id}
                              onChange={(e) => handleLrDetailChange(idx, "from_city_id", e.target.value)}
                            >
                              <option value="">[SELECT]</option>
                              {cities.map((c) => (
                                <option key={c.id || c.code} value={c.id || c.code}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              className="lr-cell-select"
                              value={row.to_city_id}
                              onChange={(e) => handleLrDetailChange(idx, "to_city_id", e.target.value)}
                            >
                              <option value="">[SELECT]</option>
                              {cities.map((c) => (
                                <option key={c.id || c.code} value={c.id || c.code}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              className="lr-cell-select"
                              value={row.transfer_mode_id}
                              onChange={(e) => handleLrDetailChange(idx, "transfer_mode_id", e.target.value)}
                            >
                              <option value="">[SELECT]</option>
                              {transferModes.map((m) => (
                                <option key={m.id || m.code} value={m.id || m.code}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="lr-cell-input"
                              value={row.lr_no}
                              onChange={(e) => handleLrDetailChange(idx, "lr_no", e.target.value.toUpperCase())}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="lr-cell-input"
                              value={row.lr_date}
                              onChange={(e) => handleLrDetailChange(idx, "lr_date", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={row.is_primary}
                              onChange={(e) => handleLrDetailChange(idx, "is_primary", e.target.checked)}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={row.is_paid}
                              onChange={(e) => handleLrDetailChange(idx, "is_paid", e.target.checked)}
                            />
                          </td>
                          <td>
                            <select
                              className="lr-cell-select"
                              value={row.paid_by}
                              onChange={(e) => handleLrDetailChange(idx, "paid_by", e.target.value)}
                            >
                              <option value="">[SELECT]</option>
                              <option value="Consignor">Consignor</option>
                              <option value="Consignee">Consignee</option>
                              <option value="Direct">Direct</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="lr-cell-input lr-cell-num"
                              value={row.lr_amount}
                              onChange={(e) => handleLrDetailChange(idx, "lr_amount", e.target.value)}
                            />
                          </td>
                          <td>
                            <select
                              className="lr-cell-select"
                              value={row.freight_charge_mode_id}
                              onChange={(e) => handleLrDetailChange(idx, "freight_charge_mode_id", e.target.value)}
                            >
                              <option value={0}>[SELECT]</option>
                              {lrChargeModes.map((m) => (
                                <option key={m.code || m.id} value={m.code || m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="lr-cell-input lr-cell-num"
                              value={row.freight_charge_per_mode}
                              onChange={(e) => handleLrDetailChange(idx, "freight_charge_per_mode", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="lr-cell-input lr-cell-num"
                              value={row.freight_charge}
                              onChange={(e) => handleLrDetailChange(idx, "freight_charge", e.target.value)}
                            />
                          </td>
                          <td>
                            <select
                              className="lr-cell-select"
                              value={row.lu_charge_mode_id}
                              onChange={(e) => handleLrDetailChange(idx, "lu_charge_mode_id", e.target.value)}
                            >
                              <option value={0}>[SELECT]</option>
                              {lrChargeModes.map((m) => (
                                <option key={m.code || m.id} value={m.code || m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="lr-cell-input lr-cell-num"
                              value={row.lu_charge_per_mode}
                              onChange={(e) => handleLrDetailChange(idx, "lu_charge_per_mode", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="lr-cell-input lr-cell-num"
                              value={row.lu_charge}
                              onChange={(e) => handleLrDetailChange(idx, "lu_charge", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              className="lr-btn-ellipsis"
                              title="Other Charges Breakdown"
                              onClick={() => alert("Other Charges Breakdown Modal")}
                            >
                              ...
                            </button>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="lr-cell-input lr-cell-num"
                              value={row.other_charge_amount}
                              onChange={(e) => handleLrDetailChange(idx, "other_charge_amount", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="lr-cell-input lr-cell-num"
                              value={row.total}
                              disabled
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grid Toolbar & Total */}
              <div className="lr-grid-toolbar">
                <button type="button" className="lr-grid-btn" onClick={addLrDetailRow}>
                  + Add Row
                </button>
                <button
                  type="button"
                  className="lr-grid-btn"
                  onClick={() => removeLrDetailRow(selectedLrRow)}
                  disabled={lrDetails.length <= 1}
                >
                  - Delete Row
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REMARKS 3 */}
          {activeTab === "remarks" && (
            <div className="lr-remarks-container">
              <textarea
                className="lr-remarks-textarea"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks, consignee notes, package conditions or transport instructions here..."
              />
            </div>
          )}
        </div>
      </fieldset>

      {/* Footer Bottom Actions Bar (Matching Images 1, 2, 3) */}
      <div className="lr-footer-actions">
        <button
          type="button"
          className="lr-action-btn ok-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <span>💾</span> {saving ? "Saving..." : "OK"}
        </button>
        <button
          type="button"
          className="lr-action-btn close-btn"
          onClick={() => {
            if (onExit) onExit();
          }}
        >
          <span>❌</span> Close
        </button>
      </div>
    </div>
  );
}
