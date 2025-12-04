import React, { useMemo, useState } from "react";
import { X, Grid, Table, Download, Printer } from "lucide-react";

export default function ReportOccupationView({
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
        (r.ShortName || "").toLowerCase().includes(s) ||
        String(r.Code).includes(s)
    );
  }, [data, q]);

  const exportCSV = () => {
    const headers = [
      "Code",
      "Name",
      "Short Name",
      "Active",
      "UserID",
      "Created",
    ];
    const rows = filtered.map((r) => [
      r.Code,
      r.Name,
      r.ShortName,
      r.active ? "Yes" : "No",
      r.UserID,
      r.CreatedDateTime,
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
    a.download = `occupation_report_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className={`report-overlay theme-${theme}`}>
      <div className="report-container">
        <div className="report-header">
          <h2>
            Occupation Report ({filtered.length} of {data.length})
          </h2>
          <div className="report-tools">
            <input
              className="input report-search"
              placeholder="Search in report..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              className="icon-btn"
              onClick={() => setMode(mode === "table" ? "grid" : "table")}
              title={mode === "table" ? "Grid View" : "Table View"}
            >
              {mode === "table" ? <Grid size={20} /> : <Table size={20} />}
            </button>
            <button className="icon-btn" onClick={exportCSV} title="Export CSV">
              <Download size={20} />
            </button>
            <button className="icon-btn" onClick={printReport} title="Print">
              <Printer size={20} />
            </button>
            <button className="icon-btn close" onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="report-body">
          {mode === "table" ? (
            <div className="report-table-wrap">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Short Name</th>
                    <th>Active</th>
                    <th>User ID</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.Code}>
                      <td>{r.Code}</td>
                      <td>{r.Name}</td>
                      <td>{r.ShortName}</td>
                      <td>
                        <span
                          className={`status ${
                            r.active ? "active" : "inactive"
                          }`}
                        >
                          {r.active ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>{r.UserID}</td>
                      <td>
                        {r.CreatedDateTime
                          ? new Date(r.CreatedDateTime).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="no-data">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="report-grid">
              {filtered.map((r) => (
                <div className="grid-card" key={r.Code}>
                  <div className="grid-card-head">
                    <div className="grid-code">#{r.Code}</div>
                    <div className="grid-name">{r.Name}</div>
                  </div>
                  <div className="grid-body">
                    <div>Short: {r.ShortName}</div>
                    <div>Status: {r.active ? "Active" : "Inactive"}</div>
                    <div>User: {r.UserID}</div>
                    <div className="small">
                      Created:{" "}
                      {r.CreatedDateTime
                        ? new Date(r.CreatedDateTime).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="no-data-grid">No records found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media print {
          .report-overlay {
            background: white !important;
          }
          .report-container {
            max-width: 100%;
          }
          .icon-btn {
            display: none !important;
          }
          .report-tools {
            display: none !important;
          }
          .report-header h2 {
            page-break-after: avoid;
          }
          .status.active {
            color: green;
            font-weight: bold;
          }
          .status.inactive {
            color: red;
            font-weight: bold;
          }
        }
      `}</style>
    </div>
  );
}
