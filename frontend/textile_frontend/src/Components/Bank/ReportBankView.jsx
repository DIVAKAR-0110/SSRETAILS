import React, { useMemo, useState } from "react";
import { X, Grid, Table, Download } from "lucide-react";
export default function ReportBankView({
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
        String(r.Code).includes(s)
    );
  }, [data, q]);
  const exportCSV = () => {
    const headers = [
      "Code",
      "Name",
      "Short Name",
      "Card Service Charge",
      "Active",
      "Created DateTime",
      "Altered DateTime",
    ];
    const rows = filtered.map((r) => [
      r.Code,
      r.Name,
      r.Shortname,
      r.CardServiceCharge,
      r.Active ? "Yes" : "No",
      r.CreatedDateTime,
      r.AlterdDateTime ?? "",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bank_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className={`report-overlay theme-${theme}`}>
      <div className="report-container">
        <div className="report-header">
          <h2>Bank Report</h2>
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
        <div className="report-body">
          {mode === "table" ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Short Name</th>
                  <th>Card Service Charge</th>
                  <th>Active</th>
                  <th>Created</th>
                  <th>Altered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.Code}>
                    <td>{r.Code}</td>
                    <td>{r.Name}</td>
                    <td>{r.Shortname}</td>
                    <td>{r.CardServiceCharge}</td>
                    <td>{r.Active ? "Yes" : "No"}</td>
                    <td>{r.CreatedDateTime}</td>
                    <td>{r.AlterdDateTime ?? ""}</td>
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
                    <div className="grid-name">{r.Name}</div>
                  </div>
                  <div className="grid-body">
                    <div>Short: {r.Shortname}</div>
                    <div>Charge: {r.CardServiceCharge}</div>
                    <div>Status: {r.Active ? "Active" : "Inactive"}</div>
                    <div className="small">Created: {r.CreatedDateTime}</div>
                    <div className="small">
                      Altered: {r.AlterdDateTime ?? ""}
                    </div>
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
