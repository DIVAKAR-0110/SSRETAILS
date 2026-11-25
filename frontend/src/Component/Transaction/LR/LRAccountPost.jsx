// frontend/src/Component/Transaction/LR/LRAccountPost.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LRAccountPost.css";

const API_ROOT = "http://localhost:8000";

export default function LRAccountPost({ adminId = 1, onExit }) {
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [transports, setTransports] = useState([]);

  const [locationId, setLocationId] = useState(1);
  const [companyId, setCompanyId] = useState(1);
  const [transportId, setTransportId] = useState("");
  const [selectAllHeader, setSelectAllHeader] = useState(false);
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [lrNo, setLrNo] = useState("");

  const [invoices, setInvoices] = useState([]);
  const [masterExportCheck, setMasterExportCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetchLookups();
  }, []);

  const fetchLookups = async () => {
    try {
      const [locRes, compRes, trRes] = await Promise.all([
        axios.get(`${API_ROOT}/locations/`),
        axios.get(`${API_ROOT}/companies/`),
        axios.get(`${API_ROOT}/transports/`),
      ]);
      setLocations(Array.isArray(locRes.data) ? locRes.data : locRes.data.results || []);
      setCompanies(Array.isArray(compRes.data) ? compRes.data : compRes.data.results || []);
      setTransports(Array.isArray(trRes.data) ? trRes.data : trRes.data.results || []);
    } catch (err) {
      console.error("Lookup error:", err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatusMsg("");
    try {
      const params = new URLSearchParams();
      if (locationId) params.append("location_id", locationId);
      if (companyId) params.append("company_id", companyId);
      if (transportId) params.append("transport_id", transportId);
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      if (lrNo) params.append("lr_no", lrNo);

      const res = await axios.get(`${API_ROOT}/lr-account-post/pending-invoices/?${params.toString()}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setInvoices(
        data.map((inv, idx) => ({
          ...inv,
          keyId: idx,
          selected: false,
        }))
      );
      setSelectAllHeader(false);
      if (data.length === 0) {
        setStatusMsg("No unposted invoices found.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setStatusMsg("Failed to query unposted invoices.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllToggle = (checked) => {
    setSelectAllHeader(checked);
    setInvoices((prev) => prev.map((inv) => ({ ...inv, selected: checked })));
  };

  const handleRowSelect = (idx) => {
    setInvoices((prev) => {
      const copy = [...prev];
      copy[idx].selected = !copy[idx].selected;
      setSelectAllHeader(copy.every((r) => r.selected));
      return copy;
    });
  };

  const handlePostAccounts = async (isMasterExport = false) => {
    const selected = invoices.filter((inv) => inv.selected);
    if (selected.length === 0) {
      alert("Please select at least one invoice to post.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_ROOT}/lr-account-post/post-to-accounts/`, {
        invoice_details: selected.map((s) => ({
          entry_id: s.entry_id,
          order_id: s.order_id,
        })),
        master_export: isMasterExport || masterExportCheck,
      });

      alert(res.data.message || "Posted to accounts successfully!");
      handleSubmit();
    } catch (err) {
      console.error("Post accounts error:", err);
      alert("Account posting failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lr-accpost-container">
      <fieldset className="lr-accpost-fieldset">
        <legend className="lr-accpost-legend">LR Accounts Post</legend>

        {/* TOP FILTER SECTION */}
        <div className="lr-accpost-header-grid">
          {/* Left Column */}
          <div className="lr-col">
            <div className="lr-row">
              <label className="lr-lbl">Location</label>
              <select
                className="lr-sel lr-ro"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              >
                {locations.map((l) => (
                  <option key={l.location_id || l.id} value={l.location_id || l.id}>
                    {l.location_name || l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lr-row">
              <label className="lr-lbl">Company</label>
              <select
                className="lr-sel lr-ro"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
              >
                {companies.map((c) => (
                  <option key={c.company_id || c.id} value={c.company_id || c.id}>
                    {c.company_name || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lr-row">
              <label className="lr-lbl">Transport</label>
              <select
                className="lr-sel"
                value={transportId}
                onChange={(e) => setTransportId(e.target.value)}
              >
                <option value="">[SELECT]</option>
                {transports.map((t) => (
                  <option key={t.transport_id || t.id} value={t.transport_id || t.id}>
                    {t.transport_name || t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lr-row lr-select-all-row">
              <label className="lr-chk-lbl">
                <input
                  type="checkbox"
                  checked={selectAllHeader}
                  onChange={(e) => handleSelectAllToggle(e.target.checked)}
                />
                SELECT ALL
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="lr-col">
            <div className="lr-row">
              <label className="lr-lbl">From Date</label>
              <input
                type="date"
                className="lr-inp lr-date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="lr-row">
              <label className="lr-lbl">To Date</label>
              <input
                type="date"
                className="lr-inp lr-date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="lr-row">
              <label className="lr-lbl">LR No</label>
              <input
                type="text"
                className="lr-inp"
                value={lrNo}
                onChange={(e) => setLrNo(e.target.value)}
              />
            </div>

            <div className="lr-row lr-submit-wrap">
              <button
                type="button"
                className="lr-btn lr-btn-submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Searching..." : "Submit"}
              </button>
            </div>
          </div>
        </div>

        {statusMsg && <div className="lr-status-note">{statusMsg}</div>}

        {/* INVOICES GRID */}
        <div className="lr-grid-container lr-accpost-grid">
          <table className="lr-table">
            <thead>
              <tr>
                <th style={{ width: "12%" }}>EntryNo</th>
                <th style={{ width: "12%" }}>EntryDate</th>
                <th style={{ width: "26%" }}>Supplier</th>
                <th style={{ width: "14%" }}>Invoice Date</th>
                <th style={{ width: "14%" }}>InvoiceNo</th>
                <th style={{ width: "12%", textAlign: "right" }}>Bundles</th>
                <th style={{ width: "10%", textAlign: "center" }}>Select</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="lr-empty">
                    No records to display.
                  </td>
                </tr>
              ) : (
                invoices.map((inv, idx) => (
                  <tr key={inv.keyId} className={inv.selected ? "lr-sel-row" : ""}>
                    <td>{inv.entry_no}</td>
                    <td>{inv.entry_date}</td>
                    <td>{inv.supplier_name}</td>
                    <td>{inv.invoice_date}</td>
                    <td>{inv.invoice_no}</td>
                    <td style={{ textAlign: "right" }}>{inv.bundles}</td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={inv.selected || false}
                        onChange={() => handleRowSelect(idx)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="lr-accpost-footer">
          <div className="lr-master-export-group">
            <label className="lr-chk-lbl">
              <input
                type="checkbox"
                checked={masterExportCheck}
                onChange={(e) => setMasterExportCheck(e.target.checked)}
              />
              Master Export
            </label>
            <button
              type="button"
              className="lr-btn lr-btn-masterexport"
              onClick={() => handlePostAccounts(true)}
              disabled={loading}
            >
              MasterExport
            </button>
          </div>

          <div className="lr-footer-buttons">
            <button
              type="button"
              className="lr-btn lr-btn-ok"
              onClick={() => handlePostAccounts(false)}
              disabled={loading}
            >
              💾 OK
            </button>
            <button
              type="button"
              className="lr-btn lr-btn-close"
              onClick={onExit}
            >
              ❌ Close
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
