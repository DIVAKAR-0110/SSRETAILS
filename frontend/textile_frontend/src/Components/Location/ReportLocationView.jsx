import React, { useMemo, useState } from "react";
import { X, Grid, Table, Download } from "lucide-react";

export default function ReportLocationView({
  data = [],
  onClose,
  theme = "metal",
}) {
  const [mode, setMode] = useState("table");
  const [q, setQ] = useState("");

  // Filter by many text fields (name, city, state, country, code, phone, etc.)
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter(
      (r) =>
        (r.Name || "").toLowerCase().includes(s) ||
        (r.ShortName || "").toLowerCase().includes(s) ||
        (r.City?.Name || "").toLowerCase().includes(s) ||
        (r.StateName || "").toLowerCase().includes(s) ||
        (r.CountryName || "").toLowerCase().includes(s) ||
        (r.Pincode || "").toLowerCase().includes(s) ||
        (r.Phoneno || "").toLowerCase().includes(s) ||
        String(r.Code).includes(s)
    );
  }, [data, q]);

  const exportCSV = () => {
    const headers = [
      "Code",
      "Name",
      "ShortName",
      "Address",
      "City",
      "State",
      "Country",
      "Pincode",
      "Phoneno",
      "Mobile",
      "Fax",
      "Email",
      "WebSite",
      "TinNo",
      "TinDate",
      "CstNo",
      "CstDate",
      "AreaCode",
      "Active",
      "UserID",
      "CreatedDateTime",
      "ServerName",
      "ServerUID",
      "DbName",
      "ServerPwd",
      "ServerMode",
      "Protocol",
      "MainServer",
      "AccDbName",
      "IPAddress",
      "UploadData",
    ];
    const rows = filtered.map((r) => [
      r.Code,
      r.Name,
      r.ShortName,
      r.Address,
      r.City?.Name || "",
      r.StateName || "",
      r.CountryName || "",
      r.Pincode,
      r.Phoneno,
      r.Mobile,
      r.Fax,
      r.Email,
      r.WebSite,
      r.TinNo,
      r.TinDate,
      r.CstNo,
      r.CstDate,
      r.AreaCode,
      r.Active ? "Yes" : "No",
      r.UserID,
      r.CreatedDateTime,
      r.ServerName,
      r.ServerUID,
      r.DbName,
      r.ServerPwd,
      r.ServerMode,
      r.Protocol,
      r.MainServer ? "Yes" : "No",
      r.AccDbName,
      r.IPAddress,
      r.UploadData ? "Yes" : "No",
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
    a.download = "location_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`report-overlay theme-${theme}`}>
      <div className="report-container">
        <div className="report-header">
          <h2>Location Report</h2>
          <div className="report-tools">
            <input
              className="input report-search"
              placeholder="Search name / city / state / code..."
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
                  <th>Name</th>
                  <th>Short</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Pincode</th>
                  <th>Phone</th>
                  <th>Mobile</th>
                  <th>Fax</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th>TIN No</th>
                  <th>TIN Date</th>
                  <th>CST No</th>
                  <th>CST Date</th>
                  <th>Area Code</th>
                  <th>Server</th>
                  <th>DbName</th>
                  <th>Mode</th>
                  <th>Protocol</th>
                  <th>Main</th>
                  <th>AccDb</th>
                  <th>IP</th>
                  <th>Upload</th>
                  <th>Active</th>
                  <th>UserID</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.Code}>
                    <td>{r.Code}</td>
                    <td>{r.Name}</td>
                    <td>{r.ShortName}</td>
                    <td>{r.Address}</td>
                    <td>{r.City?.Name}</td>
                    <td>{r.StateName}</td>
                    <td>{r.CountryName}</td>
                    <td>{r.Pincode}</td>
                    <td>{r.Phoneno}</td>
                    <td>{r.Mobile}</td>
                    <td>{r.Fax}</td>
                    <td>{r.Email}</td>
                    <td>{r.WebSite}</td>
                    <td>{r.TinNo}</td>
                    <td>{r.TinDate}</td>
                    <td>{r.CstNo}</td>
                    <td>{r.CstDate}</td>
                    <td>{r.AreaCode}</td>
                    <td>{r.ServerName}</td>
                    <td>{r.DbName}</td>
                    <td>{r.ServerMode}</td>
                    <td>{r.Protocol}</td>
                    <td>{r.MainServer ? "Yes" : "No"}</td>
                    <td>{r.AccDbName}</td>
                    <td>{r.IPAddress}</td>
                    <td>{r.UploadData ? "Yes" : "No"}</td>
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
                    <div className="grid-title">{r.Name}</div>
                  </div>
                  <div className="grid-body">
                    <div>Short: {r.ShortName}</div>
                    <div>Address: {r.Address}</div>
                    <div>City: {r.City?.Name}</div>
                    <div>State: {r.StateName}</div>
                    <div>Country: {r.CountryName}</div>
                    <div>Pincode: {r.Pincode}</div>
                    <div>Phone: {r.Phoneno}</div>
                    <div>Mobile: {r.Mobile}</div>
                    <div>Email: {r.Email}</div>
                    <div>
                      TIN: {r.TinNo} ({r.TinDate})
                    </div>
                    <div>
                      CST: {r.CstNo} ({r.CstDate})
                    </div>
                    <div>Area: {r.AreaCode}</div>
                    <div>Server: {r.ServerName}</div>
                    <div>DB: {r.DbName}</div>
                    <div>
                      Mode / Protocol: {r.ServerMode} / {r.Protocol}
                    </div>
                    <div>Main: {r.MainServer ? "Yes" : "No"}</div>
                    <div>AccDb: {r.AccDbName}</div>
                    <div>IP: {r.IPAddress}</div>
                    <div>Upload: {r.UploadData ? "Yes" : "No"}</div>
                    <div>Status: {r.Active ? "Active" : "Inactive"}</div>
                    <div>UserID: {r.UserID}</div>
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
