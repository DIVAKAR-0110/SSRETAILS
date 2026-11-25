import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SalesManEdit.css";

const API_BASE = "http://localhost:8000";

export default function SalesManEdit({ adminId, onClose, onExit }) {
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(1);
  const [entryDate, setEntryDate] = useState("2025-08-02");
  const [entryNo, setEntryNo] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleClose = onClose || onExit || (() => {});

  useEffect(() => {
    // Load active locations and employees
    axios
      .get(`${API_BASE}/locations/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setLocations(data);
        if (data.length > 0) setSelectedLocation(data[0].id || data[0].code || 1);
      })
      .catch((err) => console.error("Error loading locations:", err));

    axios
      .get(`${API_BASE}/employees/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setEmployees(data);
      })
      .catch((err) => console.error("Error loading employees:", err));
  }, []);

  const handleLookup = () => {
    if (!entryNo.trim()) {
      setStatusMsg("Please enter Bill / Entry No.");
      return;
    }
    setLoading(true);
    setStatusMsg("");
    axios
      .get(`${API_BASE}/api/salesman-edit/lookup-bill/`, {
        params: {
          location_code: selectedLocation,
          entry_no: entryNo.trim(),
          date: entryDate,
        },
      })
      .then((res) => {
        if (res.data?.success) {
          setItems(res.data.items || []);
          if ((res.data.items || []).length === 0) {
            setStatusMsg(`No items found for Bill No: ${entryNo.trim()}`);
          }
        } else {
          setStatusMsg(res.data?.message || "Failed to lookup bill.");
        }
      })
      .catch((err) => {
        console.error("Lookup error:", err);
        setStatusMsg("Error looking up bill. Check console for details.");
      })
      .finally(() => setLoading(false));
  };

  const handleSalesmanChange = (idx, newCode) => {
    const updated = [...items];
    updated[idx].new_salesman_code = parseInt(newCode) || 0;
    setItems(updated);
  };

  const handleSave = () => {
    if (items.length === 0) {
      setStatusMsg("No items to update.");
      return;
    }
    setLoading(true);
    setStatusMsg("");
    const payload = {
      entry_no: entryNo.trim(),
      items: items.map((it) => ({
        barcode: it.barcode,
        new_salesman_code: it.new_salesman_code,
      })),
    };

    axios
      .post(`${API_BASE}/api/salesman-edit/update-salesman/`, payload)
      .then((res) => {
        if (res.data?.success) {
          setStatusMsg(res.data.message || "Salesman updated successfully!");
          handleLookup(); // refresh list
        } else {
          setStatusMsg(res.data?.message || "Update failed.");
        }
      })
      .catch((err) => {
        console.error("Update error:", err);
        setStatusMsg("Error updating salesman. Check console.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="sme-root">
      {/* Top Filter Bar */}
      <div className="sme-header-box">
        <div className="sme-filter-row">
          <div className="sme-field-item">
            <label>Location</label>
            <select
              className="sme-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ minWidth: "160px" }}
            >
              {locations.map((loc) => (
                <option key={loc.id || loc.code} value={loc.id || loc.code}>
                  {loc.name || loc.location_name || `Location ${loc.code}`}
                </option>
              ))}
            </select>
          </div>

          <div className="sme-field-item">
            <label>Date</label>
            <input
              type="date"
              className="sme-input"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
          </div>

          <div className="sme-field-item">
            <label>Entry No</label>
            <input
              type="text"
              className="sme-input"
              value={entryNo}
              onChange={(e) => setEntryNo(e.target.value)}
              placeholder="e.g. 1"
              style={{ width: "120px" }}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
          </div>

          <button className="sme-submit-btn" onClick={handleLookup} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>

          {statusMsg && (
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#a81c1c", marginLeft: "10px" }}>
              {statusMsg}
            </span>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="sme-table-box">
        <table className="sme-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
              <th style={{ width: "140px" }}>Barcode</th>
              <th>Particulars</th>
              <th style={{ width: "160px" }}>SalesMan</th>
              <th style={{ width: "60px", textAlign: "right" }}>Qty</th>
              <th style={{ width: "90px", textAlign: "right" }}>Amount</th>
              <th style={{ width: "180px" }}>New Sales Man</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="sme-empty">
                  Enter an Entry No and click Submit to display bill line items.
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "center", color: "#666" }}>▶ {idx + 1}</td>
                  <td>{row.barcode}</td>
                  <td>{row.particulars}</td>
                  <td>{row.salesman_name}</td>
                  <td style={{ textAlign: "right" }}>{row.qty}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.amount).toFixed(2)}</td>
                  <td>
                    <select
                      className="sme-select"
                      value={row.new_salesman_code}
                      onChange={(e) => handleSalesmanChange(idx, e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <option value="0">-- Select Salesman --</option>
                      {employees.map((emp) => (
                        <option key={emp.id || emp.code} value={emp.code || emp.id}>
                          {emp.name || emp.employee_name || `Employee #${emp.code}`}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Button Bar */}
      <div className="sme-footer-actions">
        <button className="sme-btn sme-btn-save" onClick={handleSave} disabled={loading || items.length === 0}>
          💾 Ok
        </button>
        <button className="sme-btn sme-btn-close" onClick={handleClose}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}
