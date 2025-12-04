import React, { useMemo, useState } from "react";
import { X, Grid, Table, Download } from "lucide-react";

export default function ReportStarView({
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
        (r.starname || "").toLowerCase().includes(s) ||
        String(r.code).includes(s)
    );
  }, [data, q]);

  const exportCSV = () => {
    const headers = [
      "Code",
      "StarName",
      "StarValue",
      "Active",
      "UserID",
      "CreatedDateTime",
    ];
    const rows = filtered.map((r) => [
      r.code,
      r.starname,
      r.starvalue,
      r.active ? "Yes" : "No",
      r.user,
      r.created_datetime,
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
    a.download = "star_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`report-overlay theme-${theme}`}>
      <div className="report-container">
        <div className="report-header">
          <h2>Star Report</h2>
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
                  <th>Star Name</th>
                  <th>Star Value</th>
                  <th>Active</th>
                  <th>UserID</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.code}>
                    <td>{r.code}</td>
                    <td>{r.starname}</td>
                    <td>{r.starvalue}</td>
                    <td>{r.active ? "Yes" : "No"}</td>
                    <td>{r.user}</td>
                    <td>{r.created_datetime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="report-grid">
              {filtered.map((r) => (
                <div className="grid-card" key={r.code}>
                  <div className="grid-card-head">
                    <div className="grid-code">{r.code}</div>
                    <div className="grid-title">{r.starname}</div>
                  </div>
                  <div className="grid-body">
                    <div>Value: {r.starvalue}</div>
                    <div>UserID: {r.user}</div>
                    <div>Status: {r.active ? "Active" : "Inactive"}</div>
                    <div>Created: {r.created_datetime}</div>
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
