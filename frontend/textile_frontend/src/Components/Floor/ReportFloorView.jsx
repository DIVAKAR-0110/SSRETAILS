import React, { useMemo, useState } from "react";
import { X, Grid, Table, Download } from "lucide-react";

export default function ReportFloorView({
  data = [],
  onClose,
  theme = "metal",
}) {
  const [mode, setMode] = useState("table");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter(
      (r) =>
        (r.Name || "").toLowerCase().includes(s) ||
        (r.Shortname || "").toLowerCase().includes(s) ||
        String(r.Code).includes(s) ||
        String(r.LocationCode).includes(s)
    );
  }, [data, q]);

  const exportCSV = () => {
    const headers = [
      "Code",
      "LocationCode",
      "LocationName",
      "Name",
      "Shortname",
      "Active",
      "UserID",
      "CreatedDateTime",
    ];
    const rows = filtered.map((r) => [
      r.Code,
      r.LocationCode,
      r.LocationName,
      r.Name,
      r.Shortname,
      r.Active ? "Yes" : "No",
      r.UserID,
      r.CreatedDateTime,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "floor_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`report-overlay theme-${theme}`}>
      <div className="report-container">
        <div className="report-header">
          <h2>Floor Report</h2>
          <div className="report-tools">
            <input
              className="input report-search"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              className="icon-btn"
              onClick={() => setMode(mode === "table" ? "grid" : "table")}
            >
              {mode === "table" ? <Grid /> : <Table />}
            </button>
            <button className="icon-btn" onClick={exportCSV}>
              <Download />
            </button>
            <button className="icon-btn" onClick={() => window.print()}>
              Print
            </button>
            <button className="icon-btn close" onClick={onClose}>
              <X />
            </button>
          </div>
        </div>
        <div className="report-body" style={{ overflowX: "auto" }}>
          {mode === "table" ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>LocationCode</th>
                  <th>LocationName</th>
                  <th>Name</th>
                  <th>Shortname</th>
                  <th>Active</th>
                  <th>UserID</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.Code}>
                    <td>{r.Code}</td>
                    <td>{r.LocationCode}</td>
                    <td>{r.LocationName}</td>
                    <td>{r.Name}</td>
                    <td>{r.Shortname}</td>
                    <td>{r.Active ? "Yes" : "No"}</td>
                    <td>{r.UserID}</td>
                    <td>{r.CreatedDateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="report-grid">
              {filtered.map((r) => (
                <div className="grid-card" key={r.Code}>
                  <div className="grid-card-head">
                    <div className="grid-code">{r.Code}</div>
                    <div className="grid-title">
                      {r.Name || `Floor ${r.Code}`}
                    </div>
                  </div>
                  <div className="grid-body">
                    <div>
                      Location: {r.LocationCode} ({r.LocationName})
                    </div>
                    <div>Short: {r.Shortname}</div>
                    <div>UserID: {r.UserID}</div>
                    <div>Status: {r.Active ? "Active" : "Inactive"}</div>
                    <div>Created: {r.CreatedDateTime}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
