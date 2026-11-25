import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockExport.css";

const API_BASE = "http://localhost:8000";

export default function StockExport({ adminId, onClose, onExit }) {
  const [locations, setLocations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [fromLocation, setFromLocation] = useState(1);
  const [toLocation, setToLocation] = useState(0);
  const [fromDate, setFromDate] = useState("2025-08-02");
  const [toDate, setToDate] = useState("2025-08-02");
  const [selectedSupplier, setSelectedSupplier] = useState(0);

  const [selectAll, setSelectAll] = useState(false);
  const [bills, setBills] = useState([]);
  const [selectedBillIds, setSelectedBillIds] = useState(new Set());

  const [exportType, setExportType] = useState("Direct");
  const [filePath, setFilePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleClose = onClose || onExit || (() => {});

  useEffect(() => {
    // 1. Locations
    axios
      .get(`${API_BASE}/locations/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setLocations(data);
        if (data.length > 0) setFromLocation(data[0].id || data[0].code || 1);
      })
      .catch((err) => console.error("Error loading locations:", err));

    // 2. Suppliers
    axios
      .get(`${API_BASE}/suppliers/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setSuppliers(data);
      })
      .catch((err) => console.error("Error loading suppliers:", err));
  }, []);

  const handleQueryBills = () => {
    setLoading(true);
    setStatusMsg("");
    axios
      .get(`${API_BASE}/api/stock-export/query-stn-bills/`, {
        params: {
          from_location_code: fromLocation,
          to_location_code: toLocation,
          from_date: fromDate,
          to_date: toDate,
        },
      })
      .then((res) => {
        if (res.data?.success) {
          const list = res.data.bills || [];
          setBills(list);
          setSelectedBillIds(new Set());
          setSelectAll(false);
          if (list.length === 0) setStatusMsg("No bills found for the selected filters.");
        }
      })
      .catch((err) => {
        console.error("Query error:", err);
        setStatusMsg("Error querying bills.");
      })
      .finally(() => setLoading(false));
  };

  const handleToggleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedBillIds(new Set(bills.map((b) => b.entry_id)));
    } else {
      setSelectedBillIds(new Set());
    }
  };

  const handleToggleBill = (entryId) => {
    const next = new Set(selectedBillIds);
    if (next.has(entryId)) next.delete(entryId);
    else next.add(entryId);
    setSelectedBillIds(next);
    setSelectAll(next.size === bills.length && bills.length > 0);
  };

  const handleExport = () => {
    if (selectedBillIds.size === 0) {
      setStatusMsg("Please select at least one bill to export.");
      return;
    }
    setLoading(true);
    setStatusMsg("");

    const payload = {
      from_location_code: parseInt(fromLocation),
      to_location_code: parseInt(toLocation) || 0,
      stn_entry_ids: Array.from(selectedBillIds),
      export_type: exportType,
      file_path: filePath,
    };

    axios
      .post(`${API_BASE}/api/stock-export/do-export/`, payload)
      .then((res) => {
        if (res.data?.success) {
          setStatusMsg(res.data.message);
          handleQueryBills(); // refresh
        } else {
          setStatusMsg(res.data?.message || "Export failed.");
        }
      })
      .catch((err) => {
        console.error("Export error:", err);
        setStatusMsg("Error executing export.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="se-root">
      <fieldset className="se-fieldset">
        <legend className="se-legend">EXPORT</legend>

        <div className="se-form-grid">
          <div className="se-form-row">
            <div className="se-field-item">
              <label>From Location</label>
              <select
                className="se-select"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                style={{ width: "160px" }}
              >
                {locations.map((l) => (
                  <option key={l.id || l.code} value={l.id || l.code}>
                    {l.name || l.location_name || `Location ${l.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="se-field-item">
              <label>From Date</label>
              <input
                type="date"
                className="se-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="se-field-item">
              <label>Supplier</label>
              <select
                className="se-select"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="0">[SELECT]</option>
                {suppliers.map((s) => (
                  <option key={s.id || s.code} value={s.id || s.code}>
                    {s.name || s.supplier_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="se-form-row">
            <div className="se-field-item">
              <label>To Location</label>
              <select
                className="se-select"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                style={{ width: "160px" }}
              >
                <option value="0">[SELECT]</option>
                {locations.map((l) => (
                  <option key={l.id || l.code} value={l.id || l.code}>
                    {l.name || l.location_name || `Location ${l.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="se-field-item">
              <label>To Date</label>
              <input
                type="date"
                className="se-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <button className="se-btn-submit" onClick={handleQueryBills} disabled={loading}>
              Submit
            </button>

            <div className="se-field-item" style={{ marginLeft: "14px" }}>
              <input
                type="checkbox"
                id="seSelectAll"
                checked={selectAll}
                onChange={(e) => handleToggleSelectAll(e.target.checked)}
              />
              <label htmlFor="seSelectAll" style={{ cursor: "pointer" }}>Select All</label>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="se-section-label">BILL DETAILS</div>

      {statusMsg && (
        <div style={{ color: "#0b6121", fontWeight: "600", marginBottom: "4px" }}>
          {statusMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="se-table-box">
        <table className="se-table">
          <thead>
            <tr>
              <th style={{ width: "35px" }}>▼</th>
              <th style={{ width: "220px" }}>Company</th>
              <th style={{ width: "140px" }}>Bill No</th>
              <th style={{ width: "120px" }}>Bill Date</th>
              <th style={{ width: "80px", textAlign: "right" }}>Qty</th>
              <th style={{ width: "80px", textAlign: "center" }}>Transfer</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#888", padding: "30px" }}>
                  No bills loaded. Select date range and click Submit.
                </td>
              </tr>
            ) : (
              bills.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "center" }}>{idx + 1}</td>
                  <td>{row.company}</td>
                  <td>{row.bill_no}</td>
                  <td>{row.bill_date}</td>
                  <td style={{ textAlign: "right" }}>{row.qty}</td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedBillIds.has(row.entry_id)}
                      onChange={() => handleToggleBill(row.entry_id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar */}
      <div className="se-bottom-bar">
        <div className="se-bottom-left">
          <div className="se-radio-group">
            <span style={{ fontWeight: "600" }}>Type:</span>
            <input
              type="radio"
              id="seTypeAccess"
              name="seExportType"
              value="Export To Access"
              checked={exportType === "Export To Access"}
              onChange={() => setExportType("Export To Access")}
            />
            <label htmlFor="seTypeAccess" style={{ cursor: "pointer" }}>Export To Access</label>

            <input
              type="radio"
              id="seTypeDirect"
              name="seExportType"
              value="Direct"
              checked={exportType === "Direct"}
              onChange={() => setExportType("Direct")}
            />
            <label htmlFor="seTypeDirect" style={{ cursor: "pointer" }}>Direct Transfer</label>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
            <span style={{ fontWeight: "600" }}>File Path</span>
            <input
              type="text"
              className="se-input"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              style={{ flex: 1 }}
              placeholder="e.g. C:\SSRETAIL\EXPORT\STN_OUT.MDB"
            />
            <button className="se-action-btn" style={{ minWidth: "30px" }}>...</button>
          </div>
        </div>

        <div className="se-actions">
          <button className="se-action-btn se-btn-export" onClick={handleExport} disabled={loading || selectedBillIds.size === 0}>
            Export
          </button>
          <button className="se-action-btn se-btn-close" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
