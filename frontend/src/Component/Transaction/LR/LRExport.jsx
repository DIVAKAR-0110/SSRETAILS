// frontend/src/Component/Transaction/LR/LRExport.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LRExport.css";

const API_ROOT = "http://localhost:8000";

export default function LRExport({ adminId = 1, onExit }) {
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [locationId, setLocationId] = useState(1);
  const [toLocationId, setToLocationId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [manifests, setManifests] = useState([]);
  const [exportType, setExportType] = useState("direct"); // "direct" | "access"
  const [filePath, setFilePath] = useState("C:\\SSRetails\\Export\\LR_Transfer.mdb");

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [viewDetailsModal, setViewDetailsModal] = useState(null);

  useEffect(() => {
    fetchLookups();
  }, []);

  const fetchLookups = async () => {
    try {
      const [locRes, compRes] = await Promise.all([
        axios.get(`${API_ROOT}/locations/`),
        axios.get(`${API_ROOT}/companies/`),
      ]);
      setLocations(Array.isArray(locRes.data) ? locRes.data : locRes.data.results || []);
      setCompanies(Array.isArray(compRes.data) ? compRes.data : compRes.data.results || []);
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
      if (toLocationId) params.append("to_location_id", toLocationId);
      if (companyId) params.append("company_id", companyId);
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);

      const res = await axios.get(`${API_ROOT}/lr-export/pending-transfers/?${params.toString()}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setManifests(
        data.map((m, idx) => ({
          ...m,
          keyId: idx,
          selected: false,
        }))
      );
      if (data.length === 0) {
        setStatusMsg("No transfer manifests found for export.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setStatusMsg("Failed to query transfers.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectRow = (idx) => {
    setManifests((prev) => {
      const copy = [...prev];
      copy[idx].selected = !copy[idx].selected;
      return copy;
    });
  };

  const handleExport = async () => {
    const selected = manifests.filter((m) => m.selected);
    if (selected.length === 0) {
      alert("Please select at least one manifest to export.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_ROOT}/lr-export/export-manifests/`, {
        transfer_ids: selected.map((s) => s.entry_id),
        export_type: exportType,
        file_path: exportType === "access" ? filePath : null,
      });

      alert(res.data.message || "Export completed successfully!");
      handleSubmit();
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lr-export-container">
      <fieldset className="lr-export-fieldset">
        <legend className="lr-export-legend">LR Export</legend>

        {/* HEADER FILTERS */}
        <div className="lr-export-header-grid">
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
              <label className="lr-lbl">To Location</label>
              <select
                className="lr-sel"
                value={toLocationId}
                onChange={(e) => setToLocationId(e.target.value)}
              >
                <option value="">[SELECT]</option>
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
                className="lr-sel"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
              >
                <option value="">[SELECT]</option>
                {companies.map((c) => (
                  <option key={c.company_id || c.id} value={c.company_id || c.id}>
                    {c.company_name || c.name}
                  </option>
                ))}
              </select>
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

        {/* MANIFESTS GRID */}
        <div className="lr-grid-container lr-export-grid">
          <table className="lr-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>ENTRYNO</th>
                <th style={{ width: "25%" }}>ENTRYDATE</th>
                <th style={{ width: "25%", textAlign: "right" }}>NOOFBUNDLES</th>
                <th style={{ width: "15%", textAlign: "center" }}>SELECT</th>
                <th style={{ width: "15%", textAlign: "center" }}>VIEW</th>
              </tr>
            </thead>
            <tbody>
              {manifests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="lr-empty">
                    No records to display.
                  </td>
                </tr>
              ) : (
                manifests.map((m, idx) => (
                  <tr key={m.keyId} className={m.selected ? "lr-sel-row" : ""}>
                    <td>{m.entry_no}</td>
                    <td>{m.entry_date}</td>
                    <td style={{ textAlign: "right" }}>{m.bundles}</td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={m.selected || false}
                        onChange={() => toggleSelectRow(idx)}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className="lr-view-link"
                        onClick={() => setViewDetailsModal(m)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* EXPORT OPTIONS BOX */}
        <div className="lr-export-options-box">
          <div className="lr-radio-row">
            <label className="lr-radio-lbl">
              <input
                type="radio"
                name="exportType"
                value="direct"
                checked={exportType === "direct"}
                onChange={() => setExportType("direct")}
              />
              Direct
            </label>
          </div>
          <div className="lr-radio-row lr-access-row">
            <label className="lr-radio-lbl">
              <input
                type="radio"
                name="exportType"
                value="access"
                checked={exportType === "access"}
                onChange={() => setExportType("access")}
              />
              Export To Access
            </label>
            {exportType === "access" && (
              <div className="lr-filepath-wrap">
                <label className="lr-file-lbl">FilePath</label>
                <input
                  type="text"
                  className="lr-inp lr-filepath-inp"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                />
                <button
                  type="button"
                  className="lr-browse-btn"
                  onClick={() => {
                    const p = prompt("Enter full file path:", filePath);
                    if (p) setFilePath(p);
                  }}
                >
                  ...
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="lr-export-footer">
          <button
            type="button"
            className="lr-btn lr-btn-export"
            onClick={handleExport}
            disabled={loading}
          >
            Export
          </button>
          <button
            type="button"
            className="lr-btn lr-btn-close"
            onClick={onExit}
          >
            Close
          </button>
        </div>

        {/* VIEW DETAILS MODAL */}
        {viewDetailsModal && (
          <div className="lr-modal-overlay">
            <div className="lr-modal-dialog">
              <div className="lr-modal-header">
                <span>Manifest Details - {viewDetailsModal.entry_no}</span>
                <button
                  type="button"
                  className="lr-modal-close"
                  onClick={() => setViewDetailsModal(null)}
                >
                  ✕
                </button>
              </div>
              <div className="lr-modal-body">
                <p><strong>Date:</strong> {viewDetailsModal.entry_date}</p>
                <p><strong>From Location:</strong> {viewDetailsModal.from_location_name}</p>
                <p><strong>To Location:</strong> {viewDetailsModal.to_location_name}</p>
                <p><strong>Bundles:</strong> {viewDetailsModal.bundles}</p>
              </div>
              <div className="lr-modal-footer">
                <button
                  type="button"
                  className="lr-btn"
                  onClick={() => setViewDetailsModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </fieldset>
    </div>
  );
}
