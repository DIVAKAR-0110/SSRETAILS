import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockInward.css";

const API_BASE = "http://localhost:8000";

export default function StockInward({ adminId, onClose, onExit }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(1);
  const [fromLocation, setFromLocation] = useState(0);
  const [inwardType, setInwardType] = useState("Direct");
  const [filePath, setFilePath] = useState("");
  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState("2025-08-02");

  // Particulars Section Filters
  const [fromDate, setFromDate] = useState("2025-08-02");
  const [toDate, setToDate] = useState("2025-08-02");
  const [changeProperty, setChangeProperty] = useState(false);

  const [bills, setBills] = useState([]);
  const [selectedBillNo, setSelectedBillNo] = useState("");
  const [items, setItems] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleClose = onClose || onExit || (() => {});

  useEffect(() => {
    axios
      .get(`${API_BASE}/locations/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setLocations(data);
        if (data.length > 0) setSelectedLocation(data[0].id || data[0].code || 1);
      })
      .catch((err) => console.error("Error loading locations:", err));
  }, []);

  const handleApply = () => {
    setLoading(true);
    setStatusMsg("");
    axios
      .get(`${API_BASE}/api/stock-inward/query-inward-bills/`, {
        params: {
          location_code: selectedLocation,
          from_location_code: fromLocation,
          from_date: fromDate,
          to_date: toDate,
        },
      })
      .then((res) => {
        if (res.data?.success) {
          const list = res.data.bills || [];
          setBills(list);
          if (list.length === 0) setStatusMsg("No pending inward bills found.");
        }
      })
      .catch((err) => {
        console.error("Query error:", err);
        setStatusMsg("Error querying bills.");
      })
      .finally(() => setLoading(false));
  };

  const handleSelectBill = (billNo) => {
    setSelectedBillNo(billNo);
    axios
      .get(`${API_BASE}/api/stock-inward/lookup-bill-details/`, {
        params: { bill_no: billNo },
      })
      .then((res) => {
        if (res.data?.success) {
          setItems(res.data.items || []);
        }
      })
      .catch((err) => console.error("Lookup error:", err));
  };

  const totalQty = items.reduce((acc, it) => acc + (parseFloat(it.qty) || 0), 0);

  const handleSave = () => {
    if (!selectedBillNo) {
      setStatusMsg("Please select a bill from the Particulars table first.");
      return;
    }
    setLoading(true);
    setStatusMsg("");

    const payload = {
      location_code: parseInt(selectedLocation),
      from_location_code: parseInt(fromLocation) || 1,
      inward_type: inwardType,
      entry_date: entryDate,
      stn_bill_nos: [selectedBillNo],
      change_property: changeProperty,
      remarks: remarks,
    };

    axios
      .post(`${API_BASE}/api/stock-inward/save-inward/`, payload)
      .then((res) => {
        if (res.data?.success) {
          setStatusMsg(res.data.message);
          setItems([]);
          setSelectedBillNo("");
          handleApply(); // refresh
        } else {
          setStatusMsg(res.data?.message || "Inward failed.");
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
        setStatusMsg("Error completing inward transfer.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="si-root">
      <fieldset className="si-fieldset">
        <legend className="si-legend">STOCK INWARD ENTRY</legend>

        <div className="si-top-grid">
          <div className="si-top-left">
            <div className="si-field-row">
              <label>Location</label>
              <select
                className="si-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ flex: 1 }}
              >
                {locations.map((l) => (
                  <option key={l.id || l.code} value={l.id || l.code}>
                    {l.name || l.location_name || `Location ${l.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="si-field-row">
              <label>From Location</label>
              <select
                className="si-select"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="0">[SELECT]</option>
                {locations.map((l) => (
                  <option key={l.id || l.code} value={l.id || l.code}>
                    {l.name || l.location_name || `Location ${l.code}`}
                  </option>
                ))}
              </select>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "10px" }}>
                <span style={{ fontWeight: "600" }}>Type</span>
                <input
                  type="radio"
                  id="siDirect"
                  name="siInwardType"
                  value="Direct"
                  checked={inwardType === "Direct"}
                  onChange={() => setInwardType("Direct")}
                />
                <label htmlFor="siDirect" style={{ width: "auto", cursor: "pointer" }}>Direct</label>

                <input
                  type="radio"
                  id="siAccess"
                  name="siInwardType"
                  value="Access"
                  checked={inwardType === "Access"}
                  onChange={() => setInwardType("Access")}
                />
                <label htmlFor="siAccess" style={{ width: "auto", cursor: "pointer" }}>Access</label>
              </div>
            </div>

            {/* If Access is selected, show file path */}
            {inwardType === "Access" && (
              <div className="si-field-row">
                <label>File Path</label>
                <input
                  type="text"
                  className="si-input"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  style={{ flex: 1 }}
                  placeholder="e.g. C:\SSRETAIL\EXPORT\STN_IN.MDB"
                />
                <button className="si-btn">...</button>
              </div>
            )}
          </div>

          <div className="si-top-right">
            <div className="si-field-row">
              <label style={{ width: "70px" }}>Entry No</label>
              <input
                type="text"
                className="si-input"
                value={entryNo}
                onChange={(e) => setEntryNo(e.target.value)}
                style={{ flex: 1 }}
                placeholder="Auto"
              />
            </div>

            <div className="si-field-row">
              <label style={{ width: "70px" }}>Entry Date</label>
              <input
                type="date"
                className="si-input"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Subpanel: Particulars */}
        <fieldset className="si-particulars-box">
          <legend className="si-particulars-legend">Particulars</legend>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: "600" }}>From Date</span>
              <input
                type="date"
                className="si-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: "600" }}>To Date</span>
              <input
                type="date"
                className="si-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <button className="si-btn si-btn-submit" onClick={handleApply}>Apply</button>
          </div>

          {/* Sub Table */}
          <div className="si-subtable-box">
            <table className="si-subtable">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>▼</th>
                  <th>Bill No</th>
                  <th>Bill Date</th>
                  <th style={{ textAlign: "right" }}>Total Qty</th>
                  <th style={{ width: "60px", textAlign: "center" }}>Select</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "#888", padding: "10px" }}>
                      No bills. Click Apply to load inward documents.
                    </td>
                  </tr>
                ) : (
                  bills.map((b, idx) => (
                    <tr key={idx} style={{ backgroundColor: selectedBillNo === b.bill_no ? "#e3eefa" : "inherit" }}>
                      <td style={{ textAlign: "center" }}>{idx + 1}</td>
                      <td>{b.bill_no}</td>
                      <td>{b.bill_date}</td>
                      <td style={{ textAlign: "right" }}>{b.total_qty}</td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedBillNo === b.bill_no}
                          onChange={() => handleSelectBill(b.bill_no)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="checkbox"
                id="siChangeProp"
                checked={changeProperty}
                onChange={(e) => setChangeProperty(e.target.checked)}
              />
              <label htmlFor="siChangeProp" style={{ cursor: "pointer", fontWeight: "600" }}>Change Property</label>
            </div>
            <button className="si-btn si-btn-submit" onClick={handleSave} disabled={loading || !selectedBillNo}>
              Submit
            </button>
          </div>
        </fieldset>
      </fieldset>

      {statusMsg && (
        <div style={{ color: "#0b6121", fontWeight: "600", marginBottom: "4px" }}>
          {statusMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="si-table-box">
        <table className="si-table">
          <thead>
            <tr>
              <th style={{ width: "130px" }}>Barcode</th>
              <th>Particulars</th>
              <th style={{ width: "60px", textAlign: "right" }}>FD %</th>
              <th style={{ width: "70px", textAlign: "right" }}>Mtrs</th>
              <th style={{ width: "70px", textAlign: "right" }}>Qty</th>
              <th style={{ width: "90px", textAlign: "right" }}>Sale Rate</th>
              <th style={{ width: "90px", textAlign: "right" }}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "#888", padding: "30px" }}>
                  Select a bill from the Particulars panel above to display items for inwarding.
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.barcode}</td>
                  <td>{row.particulars}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.fd_percent).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.mtrs).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.qty).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.sale_rate).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.cost).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Total Qty Footer */}
      <div className="si-table-footer">
        <span>Total Qty: <b>{totalQty.toFixed(2)}</b></span>
      </div>

      {/* Remarks */}
      <div className="si-remarks-box">
        <label>Remarks</label>
        <textarea
          className="si-textarea"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Stock inward remarks..."
        />
      </div>

      {/* Action Buttons */}
      <div className="si-footer-actions">
        <button className="si-action-btn si-btn-ok" onClick={handleSave} disabled={loading || items.length === 0}>
          💾 OK
        </button>
        <button className="si-action-btn si-btn-close" onClick={handleClose}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}
