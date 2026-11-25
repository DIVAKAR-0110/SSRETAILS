import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManualStockTransfer.css";

const API_BASE = "http://localhost:8000";

export default function ManualStockTransfer({ adminId, onClose, onExit }) {
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  const [fromLocation, setFromLocation] = useState(1);
  const [toLocation, setToLocation] = useState(0);
  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState("2025-08-02");

  const [items, setItems] = useState([
    { product_code: 1, qty: 1, mtrs: 0, rate: 0, remarks: "" },
  ]);
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
        if (data.length > 0) {
          setFromLocation(data[0].id || data[0].code || 1);
          if (data.length > 1) setToLocation(data[1].id || data[1].code || 0);
        }
      })
      .catch((err) => console.error("Error loading locations:", err));

    // 2. Fetch Products
    axios
      .get(`${API_BASE}/product/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setProducts(data);
      })
      .catch((err) => console.error("Error loading products:", err));

    fetchNextEntryNo(1);
  }, []);

  const fetchNextEntryNo = (fromLoc) => {
    axios
      .get(`${API_BASE}/api/manual-stock-transfer/next-entry-no/`, {
        params: { from_location_code: fromLoc },
      })
      .then((res) => {
        if (res.data?.next_entry_no) setEntryNo(res.data.next_entry_no);
      })
      .catch((err) => console.error("Error fetching entry no:", err));
  };

  const handleRowChange = (idx, field, val) => {
    const updated = [...items];
    updated[idx][field] = val;
    setItems(updated);
  };

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      { product_code: products[0]?.id || 1, qty: 1, mtrs: 0, rate: 0, remarks: "" },
    ]);
  };

  const handleRemoveRow = (idx) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (items.length === 0) {
      setStatusMsg("Please add at least one line item.");
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
      entry_date: entryDate,
      items: items.map((it) => ({
        product_code: parseInt(it.product_code) || 1,
        qty: parseFloat(it.qty) || 1,
        mtrs: parseFloat(it.mtrs) || 0,
        rate: parseFloat(it.rate) || 0,
        remarks: it.remarks || "",
      })),
    };

    axios
      .post(`${API_BASE}/api/manual-stock-transfer/save-manual-stn/`, payload)
      .then((res) => {
        if (res.data?.success) {
          setStatusMsg(res.data.message);
          setItems([{ product_code: 1, qty: 1, mtrs: 0, rate: 0, remarks: "" }]);
          fetchNextEntryNo(fromLocation);
        } else {
          setStatusMsg(res.data?.message || "Failed to save.");
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
        setStatusMsg("Error saving Manual Stock Transfer.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mst-root">
      <fieldset className="mst-fieldset">
        <legend className="mst-legend">MANUAL STOCK TRANSFER ENTRY</legend>

        <div className="mst-form-grid">
          <div className="mst-col-left">
            <div className="mst-field-row">
              <label>From Location</label>
              <select
                className="mst-select"
                value={fromLocation}
                onChange={(e) => {
                  setFromLocation(e.target.value);
                  fetchNextEntryNo(e.target.value);
                }}
                style={{ width: "240px" }}
              >
                {locations.map((l) => (
                  <option key={l.id || l.code} value={l.id || l.code}>
                    {l.name || l.location_name || `Location ${l.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="mst-field-row">
              <label>To Location</label>
              <select
                className="mst-select"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                style={{ width: "240px" }}
              >
                <option value="0">[SELECT]</option>
                {locations.map((l) => (
                  <option key={l.id || l.code} value={l.id || l.code}>
                    {l.name || l.location_name || `Location ${l.code}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mst-col-right">
            <div className="mst-field-row">
              <label style={{ width: "70px" }}>Entry No</label>
              <input
                type="text"
                className="mst-input"
                value={entryNo}
                readOnly
                style={{ flex: 1, backgroundColor: "#f0ede6" }}
              />
            </div>

            <div className="mst-field-row">
              <label style={{ width: "70px" }}>Entry Date</label>
              <input
                type="date"
                className="mst-input"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>
      </fieldset>

      {/* Row Controls */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
        <button className="mst-action-btn" onClick={handleAddRow}>+ Add Row</button>
        {statusMsg && (
          <span style={{ color: "#0b6121", fontWeight: "600", marginLeft: "10px" }}>
            {statusMsg}
          </span>
        )}
      </div>

      {/* Main Grid */}
      <div className="mst-table-box">
        <table className="mst-table">
          <thead>
            <tr>
              <th style={{ width: "35px" }}>▶</th>
              <th style={{ width: "260px" }}>Product</th>
              <th style={{ width: "100px", textAlign: "right" }}>Qty</th>
              <th style={{ width: "100px", textAlign: "right" }}>Mtrs</th>
              <th style={{ width: "110px", textAlign: "right" }}>Rate</th>
              <th>Remarks</th>
              <th style={{ width: "50px", textAlign: "center" }}>Act</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "center" }}>{idx + 1}</td>
                <td>
                  <select
                    className="mst-select"
                    value={row.product_code}
                    onChange={(e) => handleRowChange(idx, "product_code", e.target.value)}
                    style={{ width: "100%" }}
                  >
                    {products.length === 0 ? (
                      <option value="1">Standard Product #1</option>
                    ) : (
                      products.map((p) => (
                        <option key={p.id || p.code} value={p.id || p.code}>
                          {p.name || p.product_name || `Product ${p.code}`}
                        </option>
                      ))
                    )}
                  </select>
                </td>
                <td style={{ textAlign: "right" }}>
                  <input
                    type="number"
                    className="mst-input"
                    value={row.qty}
                    onChange={(e) => handleRowChange(idx, "qty", e.target.value)}
                    style={{ width: "85px", textAlign: "right" }}
                  />
                </td>
                <td style={{ textAlign: "right" }}>
                  <input
                    type="number"
                    className="mst-input"
                    value={row.mtrs}
                    onChange={(e) => handleRowChange(idx, "mtrs", e.target.value)}
                    style={{ width: "85px", textAlign: "right" }}
                  />
                </td>
                <td style={{ textAlign: "right" }}>
                  <input
                    type="number"
                    className="mst-input"
                    value={row.rate}
                    onChange={(e) => handleRowChange(idx, "rate", e.target.value)}
                    style={{ width: "95px", textAlign: "right" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="mst-input"
                    value={row.remarks}
                    onChange={(e) => handleRowChange(idx, "remarks", e.target.value)}
                    style={{ width: "100%" }}
                    placeholder="Line remarks"
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => handleRemoveRow(idx)}
                    style={{ cursor: "pointer", border: "none", background: "none", color: "#a81c1c" }}
                    title="Delete row"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Action Buttons */}
      <div className="mst-footer-actions">
        <button className="mst-action-btn mst-btn-ok" onClick={handleSave} disabled={loading}>
          💾 OK
        </button>
        <button className="mst-action-btn mst-btn-close" onClick={handleClose}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}
