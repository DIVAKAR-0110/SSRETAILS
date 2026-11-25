// frontend/src/Component/Transaction/LR/LRReceipt.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LRReceipt.css";

const API_ROOT = "http://localhost:8000";

export default function LRReceipt({ adminId = 1, onExit }) {
  // Dropdown Lookups
  const [locations, setLocations] = useState([]);
  const [transports, setTransports] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Header State
  const [locationId, setLocationId] = useState(1);
  const [receiptType, setReceiptType] = useState("LR Issue");
  const [transportId, setTransportId] = useState("");
  const [transportAddress, setTransportAddress] = useState("");
  const [transportLRNo, setTransportLRNo] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [receiptDate, setReceiptDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [issueNoFilter, setIssueNoFilter] = useState("");
  const [lrNoFilter, setLrNoFilter] = useState("");
  const [issuedTo, setIssuedTo] = useState("");

  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [supplierId, setSupplierId] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");

  const [filterPaid, setFilterPaid] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Grid 1: LR Receipt Details
  const [details, setDetails] = useState([]);

  // Grid 2: Add / Less Details
  const [addLessRows, setAddLessRows] = useState([
    {
      id: 1,
      particulars: "Freight",
      type: "+",
      percentage: "0.00",
      amount_on: "0.00",
      amount: "0.00",
      round_off: "0.00",
      net_amount: "0.00",
    },
  ]);

  // Initial Fetch
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
      setEmployees(Array.isArray(empRes.data) ? empRes.data : empRes.data.results || []);
    } catch (err) {
      console.error("Lookups load failed:", err);
    }
  };

  const fetchNextEntryNo = async (locId) => {
    try {
      const res = await axios.get(`${API_ROOT}/lr-receipt/next-entry-no/?location_id=${locId || 1}`);
      setEntryNo(res.data.next_entry_no || "");
      if (!receiptNo) {
        setReceiptNo("RCP-" + (res.data.next_entry_no || "0001"));
      }
    } catch (err) {
      console.error("Next entry error:", err);
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

  // Submit Query to fetch candidates
  const handleSubmitFilter = async () => {
    setLoading(true);
    setStatusMsg("");
    try {
      const params = new URLSearchParams();
      if (locationId) params.append("location_id", locationId);
      if (transportId) params.append("transport_id", transportId);
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      if (issueNoFilter) params.append("issue_no", issueNoFilter);
      if (lrNoFilter) params.append("lr_no", lrNoFilter);

      const res = await axios.get(`${API_ROOT}/lr-receipt/pending-issues/?${params.toString()}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setDetails(
        data.map((item, idx) => ({
          ...item,
          keyId: idx,
          receive_bundles: item.balance_bundles || item.bundles || 0,
          charged_weight: "0.00",
          paid_amount: "0.00",
          receipt_select: false,
          is_paid: filterPaid,
          return_select: false,
        }))
      );
      setSelectAll(false);
      if (data.length === 0) {
        setStatusMsg("No pending LR Issues found.");
      }
    } catch (err) {
      console.error("Filter error:", err);
      setStatusMsg("Failed to fetch pending issues.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setDetails((prev) =>
      prev.map((d) => ({ ...d, receipt_select: checked }))
    );
  };

  const updateDetailField = (idx, field, value) => {
    setDetails((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      if (field === "receipt_select") {
        setSelectAll(copy.every((r) => r.receipt_select));
      }
      return copy;
    });
  };

  // Add / Less Row Management
  const addAddLessRow = () => {
    setAddLessRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        particulars: "Hamali",
        type: "+",
        percentage: "0.00",
        amount_on: "0.00",
        amount: "0.00",
        round_off: "0.00",
        net_amount: "0.00",
      },
    ]);
  };

  const updateAddLessField = (idx, field, value) => {
    setAddLessRows((prev) => {
      const copy = [...prev];
      const r = { ...copy[idx], [field]: value };
      const pct = parseFloat(r.percentage) || 0;
      const base = parseFloat(r.amount_on) || 0;
      let amt = parseFloat(r.amount) || 0;
      if (pct > 0 && (field === "percentage" || field === "amount_on")) {
        amt = (base * pct) / 100;
        r.amount = amt.toFixed(2);
      }
      const round = parseFloat(r.round_off) || 0;
      r.net_amount = (amt + round).toFixed(2);
      copy[idx] = r;
      return copy;
    });
  };

  // Calculations for summary sidebar
  const sumBundles = details.reduce(
    (acc, cur) => acc + (cur.receipt_select ? Number(cur.receive_bundles) || 0 : 0),
    0
  );
  const sumChargedWeight = details.reduce(
    (acc, cur) => acc + (cur.receipt_select ? parseFloat(cur.charged_weight) || 0 : 0),
    0
  );

  // Issue Reverse Action
  const handleIssueReverse = async () => {
    const selected = details.filter((d) => d.receipt_select);
    if (selected.length === 0) {
      alert("Please select rows to reverse.");
      return;
    }
    if (!window.confirm(`Reverse ${selected.length} issue(s)?`)) return;

    try {
      setLoading(true);
      await axios.post(`${API_ROOT}/lr-receipt/issue-reverse/`, {
        issue_order_ids: selected.map((s) => s.lr_issue_order_id),
      });
      alert("Issues reversed successfully!");
      handleSubmitFilter();
    } catch (err) {
      alert("Error reversing issues: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Save LR Receipt
  const handleSave = async () => {
    const selected = details.filter((d) => d.receipt_select);
    if (selected.length === 0) {
      alert("Please select at least one row in Receipt Select.");
      return;
    }
    if (!receiptNo) {
      alert("Receipt No. is required.");
      return;
    }

    const payload = {
      location_id: locationId,
      receipt_no: receiptNo,
      receipt_date: receiptDate,
      transport_id: transportId || null,
      remarks: remarks || "",
      created_by: adminId,
      details: selected.map((d, i) => ({
        order_id: i + 1,
        entry_id: d.lr_issue_entry_id,
        location_id: locationId,
        lr_no: d.lr_no,
        lr_date: d.lr_date,
        transport_id: d.transport_id,
        received_bundles: Number(d.receive_bundles) || 0,
        balance_bundles: Math.max(0, (d.balance_bundles || 0) - (Number(d.receive_bundles) || 0)),
        charged_weight: parseFloat(d.charged_weight) || 0,
        is_paid: d.is_paid || false,
        paid_amount: parseFloat(d.paid_amount) || 0,
        lr_issue_entry_id: d.lr_issue_entry_id,
        lr_issue_order_id: d.lr_issue_order_id,
      })),
      add_less: addLessRows.map((al, i) => ({
        order_id: i + 1,
        charge_name: al.particulars,
        charge_type: al.type,
        percentage: parseFloat(al.percentage) || 0,
        amount_on: parseFloat(al.amount_on) || 0,
        amount: parseFloat(al.amount) || 0,
        round_off: parseFloat(al.round_off) || 0,
        net_amount: parseFloat(al.net_amount) || 0,
      })),
    };

    try {
      setLoading(true);
      await axios.post(`${API_ROOT}/lr-receipt/`, payload);
      alert("LR Receipt saved successfully!");
      setDetails([]);
      setSelectAll(false);
      setRemarks("");
      fetchNextEntryNo(locationId);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving LR Receipt: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lr-receipt-container">
      <fieldset className="lr-receipt-fieldset">
        <legend className="lr-receipt-legend">LR RECEIPT</legend>

        {/* HEADER FORM */}
        <div className="lr-receipt-header-grid">
          {/* Col 1 */}
          <div className="lr-col">
            <div className="lr-row">
              <label className="lr-lbl">Location</label>
              <select
                className="lr-sel"
                value={locationId}
                onChange={(e) => handleLocationChange(e.target.value)}
              >
                {locations.map((l) => (
                  <option key={l.location_id || l.id} value={l.location_id || l.id}>
                    {l.location_name || l.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="lr-row">
              <label className="lr-lbl">Transport Name</label>
              <select
                className="lr-sel"
                value={transportId}
                onChange={(e) => handleTransportChange(e.target.value)}
              >
                <option value="">-- ALL / SELECT --</option>
                {transports.map((t) => (
                  <option key={t.transport_id || t.id} value={t.transport_id || t.id}>
                    {t.transport_name || t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="lr-row">
              <label className="lr-lbl">Address</label>
              <textarea
                className="lr-txt lr-addr-box"
                readOnly
                value={transportAddress}
                rows={2}
              />
            </div>
            <div className="lr-row">
              <label className="lr-lbl">Transport LR No</label>
              <input
                type="text"
                className="lr-inp"
                value={transportLRNo}
                onChange={(e) => setTransportLRNo(e.target.value)}
              />
            </div>
            <div className="lr-row">
              <label className="lr-lbl">Receipt No</label>
              <input
                type="text"
                className="lr-inp"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
              />
            </div>
            <div className="lr-row">
              <label className="lr-lbl">Receipt Date</label>
              <input
                type="date"
                className="lr-inp lr-date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
              />
            </div>
          </div>

          {/* Col 2 */}
          <div className="lr-col">
            <div className="lr-row">
              <label className="lr-lbl">Type</label>
              <select
                className="lr-sel"
                value={receiptType}
                onChange={(e) => setReceiptType(e.target.value)}
              >
                <option value="LR Issue">LR Issue</option>
                <option value="Direct">Direct</option>
              </select>
            </div>
            <div className="lr-row lr-inline-dates">
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
              <label className="lr-lbl">Issue No.</label>
              <input
                type="text"
                className="lr-inp"
                value={issueNoFilter}
                onChange={(e) => setIssueNoFilter(e.target.value)}
              />
            </div>
            <div className="lr-row">
              <label className="lr-lbl">LR No.</label>
              <input
                type="text"
                className="lr-inp"
                value={lrNoFilter}
                onChange={(e) => setLrNoFilter(e.target.value)}
              />
            </div>
            <div className="lr-row">
              <label className="lr-lbl">Issued To</label>
              <select
                className="lr-sel"
                value={issuedTo}
                onChange={(e) => setIssuedTo(e.target.value)}
              >
                <option value="">-- ALL / SELECT --</option>
                {employees.map((e) => (
                  <option key={e.employee_id || e.id} value={e.employee_id || e.id}>
                    {e.employee_name || e.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Col 3 */}
          <div className="lr-col">
            <div className="lr-row">
              <label className="lr-lbl">Entry No.</label>
              <input
                type="text"
                className="lr-inp lr-ro"
                readOnly
                value={entryNo}
              />
            </div>
            <div className="lr-row">
              <label className="lr-lbl">Entry Date</label>
              <input
                type="date"
                className="lr-inp lr-date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>
            <div className="lr-row">
              <label className="lr-lbl">Supplier Name</label>
              <select
                className="lr-sel"
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
            <div className="lr-row">
              <label className="lr-lbl">Address</label>
              <textarea
                className="lr-txt lr-addr-box"
                readOnly
                value={supplierAddress}
                rows={2}
              />
            </div>
            <div className="lr-actions-row">
              <button
                type="button"
                className="lr-btn lr-btn-submit"
                onClick={handleSubmitFilter}
                disabled={loading}
              >
                {loading ? "Searching..." : "Submit"}
              </button>
              <label className="lr-chk-lbl">
                <input
                  type="checkbox"
                  checked={filterPaid}
                  onChange={(e) => setFilterPaid(e.target.checked)}
                />
                Paid
              </label>
              <label className="lr-chk-lbl">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                Select All
              </label>
            </div>
            {statusMsg && <div className="lr-status-note">{statusMsg}</div>}
          </div>
        </div>

        {/* GRID 1: LR RECEIPT DETAILS */}
        <div className="lr-grid-label">LR RECEIPT DETAILS</div>
        <div className="lr-grid-container lr-receipt-details-grid">
          <table className="lr-table">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>Entry No</th>
                <th style={{ width: "75px" }}>Entry Date</th>
                <th style={{ width: "110px" }}>Transport</th>
                <th style={{ width: "90px" }}>LR No</th>
                <th style={{ width: "75px" }}>LR Date</th>
                <th style={{ width: "65px", textAlign: "right" }}>No. of Bundles</th>
                <th style={{ width: "60px", textAlign: "right" }}>Recvd Bundles</th>
                <th style={{ width: "60px", textAlign: "right" }}>Balance Bundles</th>
                <th style={{ width: "65px", textAlign: "right" }}>Receive Bundles</th>
                <th style={{ width: "70px", textAlign: "right" }}>Charged Weight</th>
                <th style={{ width: "70px", textAlign: "right" }}>Paid Amount</th>
                <th style={{ width: "65px", textAlign: "center" }}>Receipt Select</th>
                <th style={{ width: "45px", textAlign: "center" }}>Paid</th>
                <th style={{ width: "60px", textAlign: "center" }}>Return Select</th>
                <th style={{ width: "100px" }}>LRISSUEENTRYORDERID</th>
                <th style={{ width: "100px" }}>LRISSUEENTRYID</th>
              </tr>
            </thead>
            <tbody>
              {details.length === 0 ? (
                <tr>
                  <td colSpan={16} className="lr-empty">
                    Click 'Submit' to query pending issues.
                  </td>
                </tr>
              ) : (
                details.map((d, idx) => (
                  <tr key={d.keyId} className={d.receipt_select ? "lr-sel-row" : ""}>
                    <td>{d.entry_no}</td>
                    <td>{d.entry_date}</td>
                    <td>{d.transport_name}</td>
                    <td>{d.lr_no}</td>
                    <td>{d.lr_date}</td>
                    <td style={{ textAlign: "right" }}>{d.bundles}</td>
                    <td style={{ textAlign: "right" }}>{d.received_bundles}</td>
                    <td style={{ textAlign: "right" }}>{d.balance_bundles}</td>
                    <td>
                      <input
                        type="number"
                        className="lr-cell-input"
                        value={d.receive_bundles}
                        onChange={(e) => updateDetailField(idx, "receive_bundles", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="lr-cell-input"
                        value={d.charged_weight}
                        onChange={(e) => updateDetailField(idx, "charged_weight", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="lr-cell-input"
                        value={d.paid_amount}
                        onChange={(e) => updateDetailField(idx, "paid_amount", e.target.value)}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={d.receipt_select || false}
                        onChange={(e) => updateDetailField(idx, "receipt_select", e.target.checked)}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={d.is_paid || false}
                        onChange={(e) => updateDetailField(idx, "is_paid", e.target.checked)}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={d.return_select || false}
                        onChange={(e) => updateDetailField(idx, "return_select", e.target.checked)}
                      />
                    </td>
                    <td>{d.lr_issue_order_id}</td>
                    <td>{d.lr_issue_entry_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM SECTION: ADD/LESS & SUMMARY */}
        <div className="lr-bottom-split-section">
          {/* Left: Add/Less Details */}
          <div className="lr-add-less-panel">
            <div className="lr-panel-header">
              <span className="lr-grid-label">ADD / LESS DETAILS</span>
              <button type="button" className="lr-sub-btn" onClick={addAddLessRow}>
                + Add Charge
              </button>
            </div>
            <div className="lr-grid-container lr-addless-grid">
              <table className="lr-table">
                <thead>
                  <tr>
                    <th style={{ width: "25px" }}>#</th>
                    <th style={{ width: "110px" }}>Particulars</th>
                    <th style={{ width: "40px" }}>Type</th>
                    <th style={{ width: "55px", textAlign: "right" }}>(%)</th>
                    <th style={{ width: "70px", textAlign: "right" }}>Amount On</th>
                    <th style={{ width: "70px", textAlign: "right" }}>Amount</th>
                    <th style={{ width: "60px", textAlign: "right" }}>Round Off</th>
                    <th style={{ width: "75px", textAlign: "right" }}>Net Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {addLessRows.map((al, idx) => (
                    <tr key={al.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <select
                          className="lr-cell-select"
                          value={al.particulars}
                          onChange={(e) => updateAddLessField(idx, "particulars", e.target.value)}
                        >
                          <option value="Freight">Freight</option>
                          <option value="Hamali">Hamali</option>
                          <option value="LRU Charge">LRU Charge</option>
                          <option value="Service Tax">Service Tax</option>
                          <option value="Other Charges">Other Charges</option>
                          <option value="Discount">Discount</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className="lr-cell-select"
                          value={al.type}
                          onChange={(e) => updateAddLessField(idx, "type", e.target.value)}
                        >
                          <option value="+">+</option>
                          <option value="-">-</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="lr-cell-input"
                          value={al.percentage}
                          onChange={(e) => updateAddLessField(idx, "percentage", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="lr-cell-input"
                          value={al.amount_on}
                          onChange={(e) => updateAddLessField(idx, "amount_on", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="lr-cell-input"
                          value={al.amount}
                          onChange={(e) => updateAddLessField(idx, "amount", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="lr-cell-input"
                          value={al.round_off}
                          onChange={(e) => updateAddLessField(idx, "round_off", e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>
                        {al.net_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Summary Panel */}
          <div className="lr-summary-sidebar">
            <div className="lr-summary-row">
              <label>Sum of Bundles</label>
              <input type="text" className="lr-inp lr-ro" readOnly value={sumBundles} />
            </div>
            <div className="lr-summary-row">
              <label>Sum of Charged Weight</label>
              <input
                type="text"
                className="lr-inp lr-ro"
                readOnly
                value={sumChargedWeight.toFixed(2)}
              />
            </div>
            <div className="lr-summary-row">
              <label>Service Tax Name</label>
              <input type="text" className="lr-inp" placeholder="GST / Service Tax" />
            </div>
            <div className="lr-summary-row">
              <label>Service Tax Amount</label>
              <input type="text" className="lr-inp" defaultValue="0" />
            </div>
          </div>
        </div>

        {/* REMARKS & ACTIONS FOOTER */}
        <div className="lr-receipt-footer">
          <div className="lr-remarks-line">
            <label className="lr-lbl">Remarks</label>
            <input
              type="text"
              className="lr-inp"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <div className="lr-footer-buttons">
            <button
              type="button"
              className="lr-btn lr-btn-reverse"
              onClick={handleIssueReverse}
              disabled={loading}
            >
              Issue Reverse
            </button>
            <button
              type="button"
              className="lr-btn lr-btn-ok"
              onClick={handleSave}
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
