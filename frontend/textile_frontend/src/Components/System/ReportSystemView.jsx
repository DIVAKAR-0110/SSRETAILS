import React, { useMemo, useState } from "react";
import { X, Grid, Table, Download } from "lucide-react";

export default function ReportSystemView({
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
        String(r.Code).includes(s) ||
        String(r.LocationCode).includes(s)
    );
  }, [data, q]);

  const exportCSV = () => {
    const headers = [
      "Code",
      "LocationCode",
      "Name",
      "ShortName",
      "MACID",
      "PrintFunctionCode",
      "GroupBillPrefix",
      "Seperator",
      "NoLength",
      "LastNo",
      "Active",
      "UserID",
      "CreatedDateTime",
      "FloorCode",
      "ReturnSystem",
      "SettlementPrintFunctionCode",
      "SysRefNo",
      "AllowScheme",
      "PRINTERPORTCODE",
    ];
    const rows = filtered.map((r) => [
      r.Code,
      r.LocationCode,
      r.Name,
      r.ShortName,
      r.MACID,
      r.PrintFunctionCode,
      r.GroupBillPrefix,
      r.Seperator,
      r.NoLength,
      r.LastNo,
      r.Active ? "Yes" : "No",
      r.UserID,
      r.CreatedDateTime,
      r.FloorCode,
      r.ReturnSystem,
      r.SettlementPrintFunctionCode,
      r.SysRefNo,
      r.AllowScheme ? "Yes" : "No",
      r.PRINTERPORTCODE,
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
    a.download = "system_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`report-overlay theme-${theme}`}>
      <div className="report-container">
        <div className="report-header">
          <h2>System Report</h2>
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
                  <th>Name</th>
                  <th>Short</th>
                  <th>MACID</th>
                  <th>PrintFunc</th>
                  <th>GroupPrefix</th>
                  <th>Sep</th>
                  <th>NoLen</th>
                  <th>LastNo</th>
                  <th>Floor</th>
                  <th>ReturnSys</th>
                  <th>SettlePrint</th>
                  <th>SysRefNo</th>
                  <th>AllowScheme</th>
                  <th>PrinterPort</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.Code}>
                    <td>{r.Code}</td>
                    <td>{r.LocationCode}</td>
                    <td>{r.Name}</td>
                    <td>{r.ShortName}</td>
                    <td>{r.MACID}</td>
                    <td>{r.PrintFunctionCode}</td>
                    <td>{r.GroupBillPrefix}</td>
                    <td>{r.Seperator}</td>
                    <td>{r.NoLength}</td>
                    <td>{r.LastNo}</td>
                    <td>{r.FloorCode}</td>
                    <td>{r.ReturnSystem}</td>
                    <td>{r.SettlementPrintFunctionCode}</td>
                    <td>{r.SysRefNo}</td>
                    <td>{r.AllowScheme ? "Yes" : "No"}</td>
                    <td>{r.PRINTERPORTCODE}</td>
                    <td>{r.Active ? "Yes" : "No"}</td>
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
                    <div className="grid-title">{r.Name}</div>
                  </div>
                  <div className="grid-body">
                    <div>Location: {r.LocationCode}</div>
                    <div>Short: {r.ShortName}</div>
                    <div>MACID: {r.MACID}</div>
                    <div>PrintFunc: {r.PrintFunctionCode}</div>
                    <div>
                      NoLen / LastNo: {r.NoLength} / {r.LastNo}
                    </div>
                    <div>Floor: {r.FloorCode}</div>
                    <div>ReturnSys: {r.ReturnSystem}</div>
                    <div>SettlePrint: {r.SettlementPrintFunctionCode}</div>
                    <div>SysRefNo: {r.SysRefNo}</div>
                    <div>PrinterPort: {r.PRINTERPORTCODE}</div>
                    <div>AllowScheme: {r.AllowScheme ? "Yes" : "No"}</div>
                    <div>Status: {r.Active ? "Active" : "Inactive"}</div>
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
