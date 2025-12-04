import React, { useMemo, useState } from "react";
import { X, Grid, Table, Download } from "lucide-react";

export default function ReportTaxTypeView({
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
      "ShortName",
      "EntryType",
      "TaxPercent",
      "TaxOn",
      "Include",
      "isDiscount",
      "AllowSales",
      "AllowPurchase",
      "AccHeadName",
      "AccountPost",
      "AccountHeadCode",
      "AccountSalesHeadCode",
      "SSPurAccHeadCode",
      "SSSalAccHeadCode",
      "TaxAmtCalType",
      "AllowTaxAmtCal",
      "CommodityCode",
      "Section",
      "LocalCategory",
      "OtherCategory",
      "ImportCategory",
      "Category",
      "Active",
      "CreatedDateTime",
      "UserID",
    ];
    const rows = filtered.map((r) => [
      r.Code,
      r.Name,
      r.ShortName,
      r.EntryType,
      r.TaxPercent,
      r.TaxOn,
      r.Include ? "Yes" : "No",
      r.isDiscount ? "Yes" : "No",
      r.AllowSales ? "Yes" : "No",
      r.AllowPurchase ? "Yes" : "No",
      r.AccHeadName,
      r.AccountPost ? "Yes" : "No",
      r.AccountHeadCode,
      r.AccountSalesHeadCode,
      r.SSPurAccHeadCode,
      r.SSSalAccHeadCode,
      r.TaxAmtCalType,
      r.AllowTaxAmtCal ? "Yes" : "No",
      r.CommodityCode,
      r.Section,
      r.LocalCategory,
      r.OtherCategory,
      r.ImportCategory,
      r.Category,
      r.Active ? "Yes" : "No",
      r.CreatedDateTime,
      r.UserID,
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
    a.download = "taxtype_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`report-overlay theme-${theme}`}>
      <div className="report-container">
        <div className="report-header">
          <h2>Tax Type Report</h2>
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
                  <th>Name</th>
                  <th>Short Name</th>
                  <th>EntryType</th>
                  <th>Tax %</th>
                  <th>Tax On</th>
                  <th>Include</th>
                  <th>Discount</th>
                  <th>AllowSales</th>
                  <th>AllowPurchase</th>
                  <th>AccHeadName</th>
                  <th>AccountPost</th>
                  <th>CommodityCode</th>
                  <th>Category</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.Code}>
                    <td>{r.Code}</td>
                    <td>{r.Name}</td>
                    <td>{r.ShortName}</td>
                    <td>{r.EntryType}</td>
                    <td>{r.TaxPercent}</td>
                    <td>{r.TaxOn}</td>
                    <td>{r.Include ? "Yes" : "No"}</td>
                    <td>{r.isDiscount ? "Yes" : "No"}</td>
                    <td>{r.AllowSales ? "Yes" : "No"}</td>
                    <td>{r.AllowPurchase ? "Yes" : "No"}</td>
                    <td>{r.AccHeadName}</td>
                    <td>{r.AccountPost ? "Yes" : "No"}</td>
                    <td>{r.CommodityCode}</td>
                    <td>{r.Category}</td>
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
                    <div>Short: {r.ShortName}</div>
                    <div>Tax %: {r.TaxPercent}</div>
                    <div>Tax On: {r.TaxOn}</div>
                    <div>Include: {r.Include ? "Yes" : "No"}</div>
                    <div>Discount: {r.isDiscount ? "Yes" : "No"}</div>
                    <div>Sales: {r.AllowSales ? "Yes" : "No"}</div>
                    <div>Purchase: {r.AllowPurchase ? "Yes" : "No"}</div>
                    <div>Acc Head: {r.AccHeadName}</div>
                    <div>Commodity: {r.CommodityCode}</div>
                    <div>Category: {r.Category}</div>
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
