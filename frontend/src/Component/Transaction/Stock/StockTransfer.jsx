import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockTransfer.css";

const API_BASE = "http://localhost:8000";

export default function StockTransfer({ adminId, onClose, onExit }) {
  const [locations, setLocations] = useState([]);
  const [fromLocation, setFromLocation] = useState(1);
  const [toLocation, setToLocation] = useState(0);
  const [loadFrom, setLoadFrom] = useState("");
  const [transferType, setTransferType] = useState("Barcode");
  const [filePath, setFilePath] = useState("");
  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState("2025-08-02");

  const [barcodeInput, setBarcodeInput] = useState("");
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
        if (data.length > 0) {
          setFromLocation(data[0].id || data[0].code || 1);
          if (data.length > 1) setToLocation(data[1].id || data[1].code || 0);
        }
      })
      .catch((err) => console.error("Error loading locations:", err));

    fetchNextEntryNo(1);
  }, []);

  const fetchNextEntryNo = (fromLoc) => {
    axios
      .get(`${API_BASE}/api/stock-transfer/next-entry-no/`, {
        params: { from_location_code: fromLoc },
      })
      .then((res) => {
        if (res.data?.next_entry_no) setEntryNo(res.data.next_entry_no);
      })
      .catch((err) => console.error("Error fetching entry no:", err));
  };

  const handleAddItem = () => {
    if (!barcodeInput.trim()) return;
    axios
      .get(`${API_BASE}/api/stock-transfer/lookup-item/`, {
        params: { barcode: barcodeInput.trim(), from_location_code: fromLocation },
      })
      .then((res) => {
        if (res.data?.success && res.data?.item) {
          const it = res.data.item;
          setItems((prev) => [
            ...prev,
            {
              barcode: it.barcode,
              particulars: it.particulars,
              fd_percent: 0,
              mtrs: 0,
              qty: 1,
              sale_rate: it.sale_rate || 0,
              cost: it.cost || 0,
              amount: it.sale_rate || 0,
              stock_qty: it.stock_qty || 0,
            },
          ]);
          setBarcodeInput("");
        }
      })
      .catch((err) => console.error("Error looking up item:", err));
  };

  const handleQtyChange = (idx, val) => {
    const q = parseFloat(val) || 0;
    const updated = [...items];
    updated[idx].qty = q;
    updated[idx].amount = q * (updated[idx].sale_rate || 0);
    setItems(updated);
  };

  const totalQty = items.reduce((acc, it) => acc + (parseFloat(it.qty) || 0), 0);

  const handleSave = () => {
    if (items.length === 0) {
      setStatusMsg("Please add at least one transfer item.");
      return;
    }
    if (parseInt(fromLocation) === parseInt(toLocation)) {
      setStatusMsg("From and To locations cannot be the same.");
      return;
    }
    setLoading(true);
    setStatusMsg("");

    const payload = {
      from_location_code: parseInt(fromLocation),
      to_location_code: parseInt(toLocation),
      selection_type: transferType,
      entry_date: entryDate,
      remarks: remarks,
      items: items.map((it) => ({
        barcode: it.barcode,
        particulars: it.particulars,
        fd_percent: it.fd_percent,
        mtrs: it.mtrs,
        qty: it.qty,
        sale_rate: it.sale_rate,
        cost: it.cost,
        amount: it.amount,
        stock_qty: it.stock_qty,
      })),
    };

    axios
      .post(`${API_BASE}/api/stock-transfer/save-transfer/`, payload)
      .then((res) => {
        if (res.data?.success) {
          setStatusMsg(res.data.message);
          setItems([]);
          setRemarks("");
          fetchNextEntryNo(fromLocation);
        } else {
          setStatusMsg(res.data?.message || "Failed to save.");
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
        setStatusMsg("Error saving Stock Transfer.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="st-root">
      <fieldset className="st-fieldset">
        <legend className="st-legend">STOCK TRANSFER ENTRY</legend>

        <div className="st-form-grid">
          <div className="st-col-left">
            <div className="st-field-row">
              <label>From Location</label>
              <select
                className="st-select"
                value={fromLocation}
                onChange={(e) => {
                  setFromLocation(e.target.value);
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

              <label style={{ width: "70px", marginLeft: "10px" }}>To Location</label>
              <select
                className="st-select"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="0">[SELECT]</option>
                {locations.map((l) => (
                  <option key={l.id || l.code} value={l.id || l.code}>
                    {l.name || l.location_name || `Location ${l.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="st-field-row">
              <label>Load From</label>
              <select
                className="st-select"
                value={loadFrom}
                onChange={(e) => setLoadFrom(e.target.value)}
                style={{ width: "160px" }}
              >
                <option value="">[SELECT]</option>
              </select>
              <button className="st-btn" style={{ color: "#0b6121" }}>Load</button>

              <div className="st-radio-group" style={{ marginLeft: "14px" }}>
                <span style={{ fontWeight: "600" }}>Type</span>
                <input
                  type="radio"
                  id="stBarcode"
                  name="stType"
                  value="Barcode"
                  checked={transferType === "Barcode"}
                  onChange={() => setTransferType("Barcode")}
                />
                <label htmlFor="stBarcode" style={{ width: "auto", cursor: "pointer" }}>Barcode</label>

                <input
                  type="radio"
                  id="stEntryNo"
                  name="stType"
                  value="EntryNo"
                  checked={transferType === "EntryNo"}
                  onChange={() => setTransferType("EntryNo")}
                />
                <label htmlFor="stEntryNo" style={{ width: "auto", cursor: "pointer" }}>EntryNo</label>
              </div>
            </div>

            <div className="st-field-row">
              <label>Path</label>
              <input
                type="text"
                className="st-input"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="st-btn">...</button>
            </div>
          </div>

          <div className="st-col-right">
            <div className="st-field-row">
              <label style={{ width: "70px" }}>Entry No</label>
              <input
                type="text"
                className="st-input"
                value={entryNo}
                readOnly
                style={{ flex: 1, backgroundColor: "#f0ede6" }}
              />
            </div>

            <div className="st-field-row">
              <label style={{ width: "70px" }}>Entry Date</label>
              <input
                type="date"
                className="st-input"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>

            <div className="st-field-row" style={{ justifyContent: "flex-end" }}>
              <button className="st-btn st-btn-submit" onClick={handleSave}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Barcode Quick Entry */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ fontWeight: "600" }}>Barcode:</span>
        <input
          type="text"
          className="st-input"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          placeholder="Scan barcode and hit Enter"
          style={{ width: "200px" }}
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
        />
        <button className="st-btn" onClick={handleAddItem}>+ Add Item</button>
        {statusMsg && (
          <span style={{ color: "#0b6121", fontWeight: "600", marginLeft: "10px" }}>
            {statusMsg}
          </span>
        )}
      </div>

      {/* Main Grid */}
      <div className="st-table-box">
        <table className="st-table">
          <thead>
            <tr>
              <th style={{ width: "35px" }}>▶</th>
              <th style={{ width: "130px" }}>Barcode</th>
              <th>Particulars</th>
              <th style={{ width: "60px", textAlign: "right" }}>FD %</th>
              <th style={{ width: "70px", textAlign: "right" }}>Mtrs</th>
              <th style={{ width: "70px", textAlign: "right" }}>Qty</th>
              <th style={{ width: "80px", textAlign: "right" }}>Sale Rate</th>
              <th style={{ width: "80px", textAlign: "right" }}>Cost</th>
              <th style={{ width: "90px", textAlign: "right" }}>Amount</th>
              <th style={{ width: "80px", textAlign: "right" }}>StockQty</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                  No transfer items. Scan a barcode above or select entry items.
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "center" }}>{idx + 1}</td>
                  <td>{row.barcode}</td>
                  <td>{row.particulars}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.fd_percent).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.mtrs).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>
                    <input
                      type="number"
                      className="st-input"
                      value={row.qty}
                      onChange={(e) => handleQtyChange(idx, e.target.value)}
                      style={{ width: "60px", textAlign: "right" }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>{Number(row.sale_rate).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.cost).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.amount).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.stock_qty).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Grid Footer */}
      <div className="st-table-footer">
        <span>Total Qty: <b>{totalQty.toFixed(2)}</b></span>
      </div>

      {/* Remarks */}
      <div className="st-remarks-box">
        <label>Remarks</label>
        <textarea
          className="st-textarea"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Stock transfer remarks..."
        />
      </div>

      {/* Bottom Action Buttons */}
      <div className="st-footer-actions">
        <button className="st-action-btn st-btn-ok" onClick={handleSave} disabled={loading}>
          💾 OK
        </button>
        <button className="st-action-btn st-btn-close" onClick={handleClose}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}
