import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BranchExport.css";

const API_BASE = "http://localhost:8000";

export default function BranchExport({ adminId, onClose, onExit }) {
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [documentType, setDocumentType] = useState("Purchase Return");
  const [fromDate, setFromDate] = useState("2025-08-02");
  const [toDate, setToDate] = useState("2025-08-02");
  const [selectedLocation, setSelectedLocation] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState(0);

  const [records, setRecords] = useState([]);
  const [selectedBills, setSelectedBills] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [exportFormat, setExportFormat] = useState("Access");
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
        if (data.length > 0) setSelectedLocation(data[0].id || data[0].code || 1);
      })
      .catch((err) => console.error("Error loading locations:", err));

    // 2. Companies
    axios
      .get(`${API_BASE}/company/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setCompanies(data);
        if (data.length > 0) setSelectedCompany(data[0].id || data[0].code || 1);
      })
      .catch((err) => console.error("Error loading companies:", err));

    // 3. Suppliers
    axios
      .get(`${API_BASE}/suppliers/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setSuppliers(data);
      })
      .catch((err) => console.error("Error loading suppliers:", err));
  }, []);

  const handleQuery = () => {
    setLoading(true);
    setStatusMsg("");
    axios
      .get(`${API_BASE}/api/branch-export/query-records/`, {
        params: {
          document_type: documentType,
          location_code: selectedLocation,
          from_date: fromDate,
          to_date: toDate,
          supplier_code: selectedSupplier,
        },
      })
      .then((res) => {
        if (res.data?.success) {
          const list = res.data.records || [];
          setRecords(list);
          setSelectedBills(new Set());
          setSelectAll(false);
          if (list.length === 0) setStatusMsg(`No ${documentType} records found for chosen dates.`);
        }
      })
      .catch((err) => {
        console.error("Query error:", err);
        setStatusMsg("Error querying branch export records.");
      })
      .finally(() => setLoading(false));
  };

  const handleToggleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedBills(new Set(records.map((r) => r.entry_no)));
    } else {
      setSelectedBills(new Set());
    }
  };

  const handleToggleBill = (entryNo) => {
    const next = new Set(selectedBills);
    if (next.has(entryNo)) next.delete(entryNo);
    else next.add(entryNo);
    setSelectedBills(next);
    setSelectAll(next.size === records.length && records.length > 0);
  };

  const handleExport = () => {
    if (selectedBills.size === 0) {
      setStatusMsg("Please select at least one record to export.");
      return;
    }
    setLoading(true);
    setStatusMsg("");

    const payload = {
      document_type: documentType,
      location_code: parseInt(selectedLocation),
      from_date: fromDate,
      to_date: toDate,
      bill_nos: Array.from(selectedBills),
      export_to: exportFormat,
      file_path: filePath,
    };

    axios
      .post(`${API_BASE}/api/branch-export/export-data/`, payload)
      .then((res) => {
        if (res.data?.success) {
          setStatusMsg(res.data.message);
        } else {
          setStatusMsg(res.data?.message || "Export failed.");
        }
      })
      .catch((err) => {
        console.error("Export error:", err);
        setStatusMsg("Error exporting data.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="be-root">
      <fieldset className="be-fieldset">
        <legend className="be-legend">EXPORT</legend>

        <div className="be-form-grid">
          <div className="be-form-row">
            <div className="be-radio-group">
              <input
                type="radio"
                id="beDocPR"
                name="beDocType"
                value="Purchase Return"
                checked={documentType === "Purchase Return"}
                onChange={() => setDocumentType("Purchase Return")}
              />
              <label htmlFor="beDocPR" style={{ cursor: "pointer" }}>Purchase Return</label>

              <input
                type="radio"
                id="beDocSI"
                name="beDocType"
                value="Sales Invoice"
                checked={documentType === "Sales Invoice"}
                onChange={() => setDocumentType("Sales Invoice")}
              />
              <label htmlFor="beDocSI" style={{ cursor: "pointer" }}>Sales Invoice</label>
            </div>

            <div className="be-field-item">
              <label>From Date</label>
              <input
                type="date"
                className="be-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="be-field-item">
              <label>To Date</label>
              <input
                type="date"
                className="be-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          <div className="be-form-row">
            <div className="be-field-item">
              <label>Location</label>
              <select
                className="be-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ width: "160px" }}
              >
                {locations.map((l) => (
                  <option key={l.id || l.code} value={l.id || l.code}>
                    {l.name || l.location_name || `Location ${l.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="be-field-item">
              <label>Company</label>
              <select
                className="be-select"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                style={{ width: "160px" }}
              >
                {companies.map((c) => (
                  <option key={c.id || c.code} value={c.id || c.code}>
                    {c.name || c.company_name || `Company ${c.code}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="be-field-item">
              <label>Supplier</label>
              <select
                className="be-select"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                style={{ width: "160px" }}
              >
                <option value="0">[SELECT]</option>
                {suppliers.map((s) => (
                  <option key={s.id || s.code} value={s.id || s.code}>
                    {s.name || s.supplier_name}
                  </option>
                ))}
              </select>
            </div>

            <button className="be-btn-submit" onClick={handleQuery} disabled={loading}>
              Submit
            </button>

            <div className="be-field-item" style={{ marginLeft: "10px" }}>
              <input
                type="checkbox"
                id="beSelectAll"
                checked={selectAll}
                onChange={(e) => handleToggleSelectAll(e.target.checked)}
              />
              <label htmlFor="beSelectAll" style={{ cursor: "pointer" }}>Select All</label>
            </div>
          </div>
        </div>
      </fieldset>

      {statusMsg && (
        <div style={{ color: "#0b6121", fontWeight: "600", marginBottom: "4px" }}>
          {statusMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="be-table-box">
        <table className="be-table">
          <thead>
            <tr>
              <th style={{ width: "35px" }}>▼</th>
              <th>Supplier</th>
              <th style={{ width: "140px" }}>EntryNo</th>
              <th style={{ width: "120px" }}>Entry Date</th>
              <th style={{ width: "110px", textAlign: "right" }}>Amount</th>
              <th style={{ width: "80px", textAlign: "center" }}>Export</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#888", padding: "30px" }}>
                  No records loaded. Select options above and click Submit.
                </td>
              </tr>
            ) : (
              records.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "center" }}>{idx + 1}</td>
                  <td>{row.supplier}</td>
                  <td>{row.entry_no}</td>
                  <td>{row.entry_date}</td>
                  <td style={{ textAlign: "right" }}>{Number(row.amount).toFixed(2)}</td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedBills.has(row.entry_no)}
                      onChange={() => handleToggleBill(row.entry_no)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar */}
      <div className="be-bottom-bar">
        <div className="be-bottom-left">
          <div className="be-radio-group">
            <span style={{ fontWeight: "600" }}>Export To</span>
            <input
              type="radio"
              id="beFormatAccess"
              name="beExportFormat"
              value="Access"
              checked={exportFormat === "Access"}
              onChange={() => setExportFormat("Access")}
            />
            <label htmlFor="beFormatAccess" style={{ cursor: "pointer" }}>Access</label>

            <input
              type="radio"
              id="beFormatXML"
              name="beExportFormat"
              value="XML"
              checked={exportFormat === "XML"}
              onChange={() => setExportFormat("XML")}
            />
            <label htmlFor="beFormatXML" style={{ cursor: "pointer" }}>XML</label>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
            <span style={{ fontWeight: "600" }}>File Path</span>
            <input
              type="text"
              className="be-input"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              style={{ flex: 1 }}
              placeholder="e.g. C:\SSRETAIL\EXPORT\BRANCH_EXP.MDB"
            />
            <button className="be-action-btn" style={{ minWidth: "30px" }}>...</button>
          </div>
        </div>

        <div className="be-actions">
          <button className="be-action-btn be-btn-export" onClick={handleExport} disabled={loading || selectedBills.size === 0}>
            Export
          </button>
          <button className="be-action-btn be-btn-close" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
