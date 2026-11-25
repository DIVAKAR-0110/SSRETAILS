// frontend/src/Component/Transaction/LR/LRIssue.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LRIssue.css";

const API_ROOT = "http://localhost:8000";

export default function LRIssue({ adminId = 1, onExit }) {
  // Dropdown Lookups
  const [locations, setLocations] = useState([]);
  const [transports, setTransports] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Filter & Header States
  const [locationId, setLocationId] = useState(1);
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [transportId, setTransportId] = useState("");
  const [transportAddress, setTransportAddress] = useState("");
  const [filterLRNo, setFilterLRNo] = useState("");
  const [filterEntryNo, setFilterEntryNo] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");

  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Candidates & Selection
  const [candidates, setCandidates] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [issueToCode, setIssueToCode] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Initial Data Fetching
  useEffect(() => {
    fetchLookups();
    fetchNextEntryNo(1);
  }, []);

  const fetchLookups = async () => {
    try {
      const [locRes, trRes, supRes, empRes] = await Promise.all([
        axios.get(`${API_ROOT}/locations/`),
        axios.get(`${API_ROOT}/transports/`),
        axios.get(`${API_ROOT}/suppliers/`),
        axios.get(`${API_ROOT}/employees/`),
      ]);
      setLocations(Array.isArray(locRes.data) ? locRes.data : locRes.data.results || []);
      setTransports(Array.isArray(trRes.data) ? trRes.data : trRes.data.results || []);
      setSuppliers(Array.isArray(supRes.data) ? supRes.data : supRes.data.results || []);
      const emps = Array.isArray(empRes.data) ? empRes.data : empRes.data.results || [];
      setEmployees(emps);
      if (emps.length > 0) {
        setIssueToCode(emps[0].employee_id || emps[0].id || "");
      }
    } catch (err) {
      console.error("Error loading lookups:", err);
    }
  };

  const fetchNextEntryNo = async (locId) => {
    try {
      const res = await axios.get(`${API_ROOT}/lr-issue/next-entry-no/?location_id=${locId || 1}`);
      setEntryNo(res.data.next_entry_no || "");
    } catch (err) {
      console.error("Error fetching next entry no:", err);
    }
  };

  const handleLocationChange = (val) => {
    const locId = Number(val);
    setLocationId(locId);
    fetchNextEntryNo(locId);
  };

  const handleTransportChange = (val) => {
    setTransportId(val);
    const found = transports.find((t) => String(t.transport_id || t.id) === String(val));
    setTransportAddress(found ? (found.address || found.address1 || "") : "");
  };

  const handleSupplierChange = (val) => {
    setSupplierId(val);
    const found = suppliers.find((s) => String(s.supplier_id || s.id) === String(val));
    setSupplierAddress(found ? (found.address || found.address1 || "") : "");
  };

  // Submit search query
  const handleSubmitFilter = async () => {
    setLoading(true);
    setStatusMsg("");
    try {
      const params = new URLSearchParams();
      if (locationId) params.append("location_id", locationId);
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      if (transportId) params.append("transport_id", transportId);
      if (supplierId) params.append("supplier_id", supplierId);
      if (filterLRNo) params.append("lr_no", filterLRNo);
      if (filterEntryNo) params.append("entry_no", filterEntryNo);

      const res = await axios.get(`${API_ROOT}/lr-issue/pending-lrs/?${params.toString()}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setCandidates(
        data.map((item, idx) => ({
          ...item,
          keyId: idx,
          selected: false,
        }))
      );
      setSelectedAll(false);
      if (data.length === 0) {
        setStatusMsg("No pending LRs found matching criteria.");
      }
    } catch (err) {
      console.error("Filter error:", err);
      setStatusMsg("Failed to fetch pending LRs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedAll(checked);
    setCandidates((prev) => prev.map((c) => ({ ...c, selected: checked })));
  };

  const handleRowSelectToggle = (idx) => {
    setCandidates((prev) => {
      const updated = [...prev];
      updated[idx].selected = !updated[idx].selected;
      setSelectedAll(updated.every((r) => r.selected));
      return updated;
    });
  };

  // Save LR Issue
  const handleSave = async () => {
    const selectedRows = candidates.filter((c) => c.selected);
    if (selectedRows.length === 0) {
      alert("Please select at least one LR to Issue.");
      return;
    }
    if (!issueToCode) {
      alert("Please select an Employee in 'Issue To'.");
      return;
    }

    const payload = {
      location_id: locationId,
      issue_date: entryDate,
      issued_to_code: issueToCode,
      remarks: remarks || "",
      created_by: adminId,
      issue_details: selectedRows.map((r, i) => ({
        order_id: i + 1,
        entry_id: r.entry_id,
        location_id: locationId,
        lr_no: r.lr_no,
        lr_date: r.lr_date,
        transport_id: r.transport_id,
        supplier_id: r.supplier_id,
        no_of_bundles: r.bundles || 1,
        is_received: false,
        received_bundles: 0,
        balance_bundles: r.bundles || 1,
        is_paid: false,
      })),
    };

    try {
      setLoading(true);
      await axios.post(`${API_ROOT}/lr-issue/`, payload);
      alert("LR Issue saved successfully!");
      // Reset candidates and refresh next entry no
      setCandidates([]);
      setSelectedAll(false);
      setRemarks("");
      fetchNextEntryNo(locationId);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving LR Issue: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lr-issue-container">
      <fieldset className="lr-issue-fieldset">
        <legend className="lr-issue-legend">LR ISSUE</legend>

        {/* TOP FILTER & HEADER SECTION */}
        <div className="lr-issue-top-grid">
          {/* Col 1 */}
          <div className="lr-issue-col">
            <div className="lr-form-row">
              <label className="lr-label">Location</label>
              <select
                className="lr-select"
                value={locationId}
                onChange={(e) => handleLocationChange(e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc.location_id || loc.id} value={loc.location_id || loc.id}>
                    {loc.location_name || loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lr-form-row lr-date-range-row">
              <label className="lr-label">From Date</label>
              <input
                type="date"
                className="lr-input lr-date-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label className="lr-label-inline">To Date</label>
              <input
                type="date"
                className="lr-input lr-date-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="lr-form-row">
              <label className="lr-label">Transport Name</label>
              <select
                className="lr-select"
                value={transportId}
                onChange={(e) => handleTransportChange(e.target.value)}
              >
                <option value="">-- ALL / SELECT --</option>
                {transports.map((tr) => (
                  <option key={tr.transport_id || tr.id} value={tr.transport_id || tr.id}>
                    {tr.transport_name || tr.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lr-form-row">
              <label className="lr-label">Address</label>
              <textarea
                className="lr-textarea lr-address-box"
                readOnly
                value={transportAddress}
                rows={2}
              />
            </div>
          </div>

          {/* Col 2 */}
          <div className="lr-issue-col">
            <div className="lr-form-row">
              <label className="lr-label">LR No.</label>
              <input
                type="text"
                className="lr-input"
                value={filterLRNo}
                onChange={(e) => setFilterLRNo(e.target.value)}
                placeholder="Search LR No..."
              />
            </div>

            <div className="lr-form-row">
              <label className="lr-label">LR EntryNo</label>
              <input
                type="text"
                className="lr-input"
                value={filterEntryNo}
                onChange={(e) => setFilterEntryNo(e.target.value)}
                placeholder="Search Entry No..."
              />
            </div>

            <div className="lr-form-row">
              <label className="lr-label">Supplier Name</label>
              <select
                className="lr-select"
                value={supplierId}
                onChange={(e) => handleSupplierChange(e.target.value)}
              >
                <option value="">-- ALL / SELECT --</option>
                {suppliers.map((s) => (
                  <option key={s.supplier_id || s.id} value={s.supplier_id || s.id}>
                    {s.supplier_name || s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lr-form-row">
              <label className="lr-label">Address</label>
              <textarea
                className="lr-textarea lr-address-box"
                readOnly
                value={supplierAddress}
                rows={2}
              />
            </div>
          </div>

          {/* Col 3: Actions & Readonly metadata */}
          <div className="lr-issue-col lr-issue-col-actions">
            <div className="lr-form-row">
              <label className="lr-label">Entry No.</label>
              <input
                type="text"
                className="lr-input lr-readonly-field"
                readOnly
                value={entryNo}
              />
            </div>

            <div className="lr-form-row">
              <label className="lr-label">Entry Date</label>
              <input
                type="date"
                className="lr-input lr-date-input"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>

            <div className="lr-submit-bar">
              <button
                type="button"
                className="lr-win-btn lr-submit-btn"
                onClick={handleSubmitFilter}
                disabled={loading}
              >
                {loading ? "Searching..." : "Submit"}
              </button>
              <label className="lr-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                Select All
              </label>
            </div>
            {statusMsg && <div className="lr-status-note">{statusMsg}</div>}
          </div>
        </div>

        {/* ISSUE DETAILS GRID */}
        <div className="lr-grid-section-title">Issue Details</div>
        <div className="lr-grid-table-container">
          <table className="lr-win-table">
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Entry No.</th>
                <th style={{ width: "85px" }}>Entry Date</th>
                <th style={{ width: "130px" }}>Transport</th>
                <th style={{ width: "95px" }}>Booked From</th>
                <th style={{ width: "95px" }}>Booked To</th>
                <th style={{ width: "160px" }}>Supplier</th>
                <th style={{ width: "100px" }}>LR No.</th>
                <th style={{ width: "85px" }}>LR Date</th>
                <th style={{ width: "65px", textAlign: "right" }}>Bundles</th>
                <th style={{ width: "70px" }}>Time</th>
                <th style={{ width: "50px", textAlign: "center" }}>Select</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={11} className="lr-empty-cell">
                    Click 'Submit' to search for unissued LRs.
                  </td>
                </tr>
              ) : (
                candidates.map((c, idx) => (
                  <tr
                    key={c.keyId}
                    className={c.selected ? "lr-row-selected" : ""}
                    onClick={() => handleRowSelectToggle(idx)}
                  >
                    <td>{c.entry_no}</td>
                    <td>{c.entry_date}</td>
                    <td>{c.transport_name}</td>
                    <td>{c.booked_from}</td>
                    <td>{c.booked_to}</td>
                    <td>{c.supplier_name}</td>
                    <td>{c.lr_no}</td>
                    <td>{c.lr_date}</td>
                    <td style={{ textAlign: "right" }}>{c.bundles}</td>
                    <td>{c.entry_time}</td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={c.selected || false}
                        onChange={() => handleRowSelectToggle(idx)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM METADATA & ACTIONS */}
        <div className="lr-issue-bottom-section">
          <div className="lr-form-row lr-issue-to-row">
            <label className="lr-label" style={{ width: "75px" }}>Issue To</label>
            <select
              className="lr-select"
              style={{ maxWidth: "300px" }}
              value={issueToCode}
              onChange={(e) => setIssueToCode(e.target.value)}
            >
              <option value="">-- SELECT EMPLOYEE --</option>
              {employees.map((emp) => (
                <option key={emp.employee_id || emp.id} value={emp.employee_id || emp.id}>
                  {emp.employee_name || emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="lr-form-row">
            <label className="lr-label" style={{ width: "75px" }}>Remarks</label>
            <textarea
              className="lr-textarea lr-issue-remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="lr-footer-action-bar">
          <button
            type="button"
            className="lr-win-btn lr-btn-ok"
            onClick={handleSave}
            disabled={loading}
          >
            💾 OK
          </button>
          <button
            type="button"
            className="lr-win-btn lr-btn-close"
            onClick={onExit}
          >
            ❌ Close
          </button>
        </div>
      </fieldset>
    </div>
  );
}
