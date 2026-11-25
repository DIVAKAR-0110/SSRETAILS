import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockAdjustmentNote.css";

const API_BASE = "http://localhost:8000";

export default function StockAdjustmentNote({ adminId, onClose, onExit }) {
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(1);
  const [selectedSection, setSelectedSection] = useState(0);
  const [stockVerified, setStockVerified] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState("2025-08-02");
  const [spinVal, setSpinVal] = useState(0);

  const [barcodeInput, setBarcodeInput] = useState("");
  const [items, setItems] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleClose = onClose || onExit || (() => {});

  useEffect(() => {
    // 1. Fetch Locations
    axios
      .get(`${API_BASE}/locations/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setLocations(data);
        if (data.length > 0) setSelectedLocation(data[0].id || data[0].code || 1);
      })
      .catch((err) => console.error("Error loading locations:", err));

    // 2. Fetch Companies
    axios
      .get(`${API_BASE}/company/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setCompanies(data);
        if (data.length > 0) setSelectedCompany(data[0].id || data[0].code || 1);
      })
      .catch((err) => console.error("Error loading companies:", err));

    // 3. Fetch Next Entry No
    fetchNextEntryNo(1);
  }, []);

  const fetchNextEntryNo = (locCode) => {
    axios
      .get(`${API_BASE}/api/stock-adjustment/next-entry-no/`, {
        params: { location_code: locCode },
      })
      .then((res) => {
        if (res.data?.next_entry_no) setEntryNo(res.data.next_entry_no);
      })
      .catch((err) => console.error("Error fetching entry no:", err));
  };

  const handleAddBarcode = () => {
    if (!barcodeInput.trim()) return;
    axios
      .get(`${API_BASE}/api/stock-adjustment/lookup-barcode/`, {
        params: { barcode: barcodeInput.trim(), location_code: selectedLocation },
      })
      .then((res) => {
        if (res.data?.success && res.data?.item) {
          const it = res.data.item;
          setItems((prev) => [
            ...prev,
            {
              barcode: it.barcode,
              particulars: it.particulars,
              stock_qty: it.stock_qty || 0,
              add_qty: 0,
              less_qty: 0,
              net_rate: it.net_rate || 0,
              sale_rate: it.sale_rate || 0,
              amount: 0,
            },
          ]);
          setBarcodeInput("");
        }
      })
      .catch((err) => console.error("Lookup error:", err));
  };

  const handleQtyChange = (idx, field, val) => {
    const num = parseFloat(val) || 0;
    const updated = [...items];
    updated[idx][field] = num;
    const netRate = updated[idx].net_rate || 0;
    const diff = updated[idx].add_qty - updated[idx].less_qty;
    updated[idx].amount = diff * netRate;
    setItems(updated);
  };

  const totalAdd = items.reduce((acc, it) => acc + (parseFloat(it.add_qty) || 0), 0);
  const totalLess = items.reduce((acc, it) => acc + (parseFloat(it.less_qty) || 0), 0);
  const totalAmount = items.reduce((acc, it) => acc + (parseFloat(it.amount) || 0), 0);

  const handleSave = () => {
    if (items.length === 0) {
      setStatusMsg("Please add at least one item to adjust.");
      return;
    }
    setLoading(true);
    setStatusMsg("");

    const payload = {
      location_code: parseInt(selectedLocation),
      company_code: parseInt(selectedCompany),
      section_code: parseInt(selectedSection) || 0,
      entry_date: entryDate,
      stock_verified: stockVerified,
      remarks: remarks,
      items: items.map((it) => ({
        barcode: it.barcode,
        particulars: it.particulars,
        stock_qty: it.stock_qty,
        add_qty: it.add_qty,
        less_qty: it.less_qty,
        net_rate: it.net_rate,
        sale_rate: it.sale_rate,
        amount: it.amount,
      })),
    };

    axios
      .post(`${API_BASE}/api/stock-adjustment/save-adjustment/`, payload)
      .then((res) => {
        if (res.data?.success) {
          setStatusMsg(res.data.message);
          setItems([]);
          setRemarks("");
          fetchNextEntryNo(selectedLocation);
        } else {
          setStatusMsg(res.data?.message || "Failed to save.");
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
        setStatusMsg("Error saving Stock Adjustment Note.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="san-root">
      <fieldset className="san-fieldset">
        <legend className="san-legend">STOCK AJUSTMENT NOTE</legend>

        <div className="san-form-grid">
          <div className="san-col-left">
            <div className="san-field-row">
              <label>Location</label>
              <select
                className="san-select"
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  fetchNextEntryNo(e.target.value);
                }}
                style={{ flex: 1 }}
              >
                {locations.map((l) => (
                  <option key={l.id || l.code} value={l.id || l.code}>
                    {l.name || l.location_name || `Location ${l.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="san-field-row">
              <label>Company</label>
              <select
                className="san-select"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                style={{ flex: 1 }}
              >
                {companies.map((c) => (
                  <option key={c.id || c.code} value={c.id || c.code}>
                    {c.name || c.company_name || `Company ${c.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="san-field-row">
              <label>Section</label>
              <select
                className="san-select"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{ width: "160px" }}
              >
                <option value="0">[SELECT]</option>
                {sections.map((s) => (
                  <option key={s.id || s.code} value={s.id || s.code}>
                    {s.name || s.section_name}
                  </option>
                ))}
              </select>
              <input
                type="checkbox"
                id="sanStockVerified"
                checked={stockVerified}
                onChange={(e) => setStockVerified(e.target.checked)}
              />
              <label htmlFor="sanStockVerified" style={{ width: "auto", cursor: "pointer" }}>
                Stock Verified
              </label>
            </div>

            <div className="san-field-row">
              <label>File Path</label>
              <input
                type="text"
                className="san-input"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="san-btn" title="Browse File">...</button>
              <button className="san-btn san-btn-load">Load</button>
            </div>
          </div>

          <div className="san-col-right">
            <div className="san-field-row">
              <label style={{ width: "70px" }}>Entry No</label>
              <input
                type="text"
                className="san-input"
                value={entryNo}
                readOnly
                style={{ flex: 1, backgroundColor: "#f0ede6" }}
              />
            </div>

            <div className="san-field-row">
              <label style={{ width: "70px" }}>Entry Date</label>
              <input
                type="date"
                className="san-input"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>

            <div className="san-field-row" style={{ justifyContent: "flex-end", gap: "6px" }}>
              <input
                type="number"
                className="san-input"
                value={spinVal}
                onChange={(e) => setSpinVal(e.target.value)}
                style={{ width: "60px", textAlign: "right" }}
              />
              <button className="san-btn san-btn-submit">Submit</button>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Barcode Quick Entry */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ fontWeight: "600" }}>Barcode:</span>
        <input
          type="text"
          className="san-input"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          placeholder="Scan barcode and hit Enter"
          style={{ width: "200px" }}
          onKeyDown={(e) => e.key === "Enter" && handleAddBarcode()}
        />
        <button className="san-btn" onClick={handleAddBarcode}>+ Add Item</button>
        {statusMsg && (
          <span style={{ color: "#0b6121", fontWeight: "600", marginLeft: "10px" }}>
            {statusMsg}
          </span>
        )}
      </div>

      {/* Main Grid */}
      <div className="san-table-box">
        <table className="san-table">
          <thead>
            <tr>
              <th style={{ width: "35px" }}>▶</th>
              <th style={{ width: "130px" }}>BarCode</th>
              <th>Particulars</th>
              <th style={{ width: "80px", textAlign: "right" }}>Stock Qty</th>
              <th style={{ width: "80px", textAlign: "right" }}>Add Qty</th>
              <th style={{ width: "80px", textAlign: "right" }}>Less Qty</th>
              <th style={{ width: "80px", textAlign: "right" }}>Net Rate</th>
              <th style={{ width: "80px", textAlign: "right" }}>Sale Rate</th>
              <th style={{ width: "90px", textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                  No items added. Scan a barcode above to add adjustment line.
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "center" }}>{idx + 1}</td>
                  <td>{row.barcode}</td>
                  <td>{row.particulars}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.stock_qty).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>
                    <input
                      type="number"
                      className="san-input"
                      value={row.add_qty}
                      onChange={(e) => handleQtyChange(idx, "add_qty", e.target.value)}
                      style={{ width: "65px", textAlign: "right" }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <input
                      type="number"
                      className="san-input"
                      value={row.less_qty}
                      onChange={(e) => handleQtyChange(idx, "less_qty", e.target.value)}
                      style={{ width: "65px", textAlign: "right" }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>{Number(row.net_rate).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.sale_rate).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.amount).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Grid Footer */}
      <div className="san-table-footer">
        <span>Add Qty: <b>{totalAdd.toFixed(2)}</b></span>
        <span>Less Qty: <b>{totalLess.toFixed(2)}</b></span>
        <span>Amount: <b>{totalAmount.toFixed(2)}</b></span>
      </div>

      {/* Remarks Textarea */}
      <div className="san-remarks-box">
        <label>Remarks</label>
        <textarea
          className="san-textarea"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Stock adjustment remarks..."
        />
      </div>

      {/* Action Buttons */}
      <div className="san-footer-actions">
        <button className="san-action-btn san-btn-ok" onClick={handleSave} disabled={loading}>
          💾 OK
        </button>
        <button className="san-action-btn san-btn-close" onClick={handleClose}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}
