import React, { useMemo, useState } from "react";
import { X, Grid, Table, Download } from "lucide-react";

export default function ReportSupplierView({
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
        (r.name || "").toLowerCase().includes(s) ||
        (r.short_name || "").toLowerCase().includes(s) ||
        String(r.code).includes(s)
    );
  }, [data, q]);

  const exportCSV = () => {
    const headers = [
      "Code",
      "Title",
      "Name",
      "Short",
      "PrintName",
      "City",
      "Location",
      "Group",
      "Grade",
      "Category",
      "Mobile",
      "CreditDays",
      "CreditLimit",
      "StdDiscBill",
      "Agent",
      "Active",
      "User",
      "Created",
    ];
    const rows = filtered.map((r) => [
      r.code,
      r.title_name,
      r.name,
      r.short_name,
      r.print_name,
      r.city_name,
      r.location_name,
      r.group_name,
      r.grade_name,
      r.category_name,
      r.mobile,
      r.credit_days,
      r.credit_limit,
      r.standard_discount_on_bill,
      r.agent_code,
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
    a.download = "supplier_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`report-overlay theme-${theme}`}>
      <div className="report-container">
        <div className="report-header">
          <h2>Supplier Report</h2>
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
                  <th>Title</th>
                  <th>Name</th>
                  <th>Short</th>
                  <th>PrintName</th>
                  <th>City</th>
                  <th>Location</th>
                  <th>Group</th>
                  <th>Grade</th>
                  <th>Category</th>
                  <th>Mobile</th>
                  <th>CreditDays</th>
                  <th>CreditLimit</th>
                  <th>StdDiscBill</th>
                  <th>Agent</th>
                  <th>Active</th>
                  <th>User</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.code}>
                    <td>{r.code}</td>
                    <td>{r.title_name}</td>
                    <td>{r.name}</td>
                    <td>{r.short_name}</td>
                    <td>{r.print_name}</td>
                    <td>{r.city_name}</td>
                    <td>{r.location_name}</td>
                    <td>{r.group_name}</td>
                    <td>{r.grade_name}</td>
                    <td>{r.category_name}</td>
                    <td>{r.mobile}</td>
                    <td>{r.credit_days}</td>
                    <td>{r.credit_limit}</td>
                    <td>{r.standard_discount_on_bill}</td>
                    <td>{r.agent_code}</td>
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
                    <div className="grid-title">{r.name}</div>
                  </div>
                  <div className="grid-body">
                    <div>Title: {r.title_name}</div>
                    <div>Short: {r.short_name}</div>
                    <div>Print: {r.print_name}</div>
                    <div>
                      City/Loc: {r.city_name} / {r.location_name}
                    </div>
                    <div>
                      Group/Grade/Cat: {r.group_name} / {r.grade_name} /{" "}
                      {r.category_name}
                    </div>
                    <div>Mobile: {r.mobile}</div>
                    <div>
                      Credit: {r.credit_days} days / {r.credit_limit}
                    </div>
                    <div>Std Disc: {r.standard_discount_on_bill}</div>
                    <div>Agent: {r.agent_code}</div>
                    <div>Status: {r.active ? "Active" : "Inactive"}</div>
                    <div>User: {r.user}</div>
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
