// src/Component/Tools.jsx
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Dialog from "./Common/Dialog.jsx";
import "./Tools.css";

export default function Tools({
  title,
  columns,
  apiBase,
  endpoint,
  onExit,
  extraPayload,
  showTabHeader = false,
  customForm,
  modalWidth,
}) {
  const resolvedApiBase =
    apiBase ||
    (endpoint
      ? endpoint.startsWith("http")
        ? endpoint
        : `http://localhost:8000/${endpoint.replace(/^\/|\/$/g, "")}/`
      : "");

  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState(null); // "add" | "edit" | "view"
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [dialog, setDialog] = useState(null);
  const reportDropdownRef = useRef(null);

  const selectedRow = rows.find((r) => r.id === selectedId);

  const fetchData = useCallback(async () => {
    if (!resolvedApiBase) return;
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch(resolvedApiBase);
      if (!res.ok) throw new Error("Server returned " + res.status);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && selectedId === null) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load records from " + resolvedApiBase);
    } finally {
      setLoading(false);
    }
  }, [resolvedApiBase, selectedId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAdd = useCallback(() => {
    setMode("add");
    const init = {};
    columns.forEach((c) => {
      if (c.type === "boolean" || c.name === "active") {
        init[c.name] = true;
      } else {
        init[c.name] = "";
      }
    });
    setFormData(init);
  }, [columns]);

  const openEdit = useCallback(() => {
    if (!selectedRow) return;
    setMode("edit");
    setFormData({ ...selectedRow });
  }, [selectedRow]);

  const openView = useCallback(() => {
    if (!selectedRow) return;
    setMode("view");
    setFormData({ ...selectedRow });
  }, [selectedRow]);

  const executeDelete = useCallback(
    async (recordToDelete) => {
      setDialog(null);
      if (!recordToDelete) return;
      try {
        setLoading(true);
        setMessage("");
        const res = await fetch(`${resolvedApiBase}${recordToDelete.id}/`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        setSelectedId(null);
        fetchData();
      } catch (err) {
        setDialog({
          isOpen: true,
          title: "Delete Failed",
          message: "Failed to delete record. It may be referenced by other transactions.",
          type: "alert",
          confirmText: "OK",
          onConfirm: () => setDialog(null),
          onCancel: () => setDialog(null),
        });
      } finally {
        setLoading(false);
      }
    },
    [resolvedApiBase, fetchData]
  );

  const handleDelete = useCallback(() => {
    if (!selectedRow) return;
    const identifier = selectedRow.name || selectedRow.shortname || selectedRow.id;
    setDialog({
      isOpen: true,
      title: "Confirm Delete",
      message: `Delete record: ${identifier}?`,
      type: "danger",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => executeDelete(selectedRow),
      onCancel: () => setDialog(null),
    });
  }, [selectedRow, executeDelete]);

  // Close report dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        reportDropdownRef.current &&
        !reportDropdownRef.current.contains(e.target)
      ) {
        setShowReportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Keyboard Shortcuts (F2, F3, F6, F5, F7, F8, Ctrl+F4 / Esc)
  useEffect(() => {
    function handleKeyDown(e) {
      const isCloseKey =
        e.key === "Escape" ||
        ((e.ctrlKey || e.metaKey) && (e.key === "F4" || e.keyCode === 115));

      // 1. If an Add / Edit / View dialog box is open, close the dialog box
      if (mode) {
        if (isCloseKey) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setMode(null);
        }
        return;
      }

      // 2. Main Table View Shortcuts
      if (e.key === "F2") {
        e.preventDefault();
        openAdd();
      } else if (e.key === "F3") {
        e.preventDefault();
        openEdit();
      } else if (e.key === "F5") {
        e.preventDefault();
        fetchData();
      } else if (e.key === "F6") {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "F7") {
        e.preventDefault();
        openView();
      } else if (e.key === "F8") {
        e.preventDefault();
        setShowReportMenu((prev) => !prev);
      } else if (isCloseKey) {
        // Close current viewing tab
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (onExit) {
          onExit();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [mode, openAdd, openEdit, openView, handleDelete, fetchData, onExit]);

  function handleChange(e) {
    const { type, checked, value, name } = e.target;
    const col = columns.find((c) => c.name === name);

    let finalVal = value;
    if (type === "checkbox") {
      finalVal = checked;
    } else if (type === "number" || type === "date" || type === "datetime-local") {
      finalVal = value;
    } else {
      finalVal = value.toUpperCase();
      // Enforce max_length directly in frontend input handler
      if (col && col.maxLength && finalVal.length > col.maxLength) {
        finalVal = finalVal.slice(0, col.maxLength);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalVal,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mode || mode === "view") return;
    try {
      setLoading(true);
      setMessage("");

      const method = mode === "add" ? "POST" : "PUT";
      const url =
        mode === "add"
          ? resolvedApiBase
          : `${resolvedApiBase}${formData.id || selectedId}/`;

      const payload = customForm ? { ...formData } : {};
      if (!customForm) {
        columns.forEach((c) => {
          payload[c.name] = formData[c.name];
        });
      }
      if (mode === "add" && extraPayload) {
        Object.assign(payload, extraPayload);
      }

      // Frontend data type and constraint validation
      for (const col of columns) {
        const val = payload[col.name];
        if (col.required && (val === undefined || val === null || String(val).trim() === "")) {
          setMessage(`${col.label} is required.`);
          setLoading(false);
          return;
        }
        if (col.maxLength && val && String(val).length > col.maxLength) {
          setMessage(`${col.label} cannot exceed ${col.maxLength} characters.`);
          setLoading(false);
          return;
        }
        if (col.type === "number" && val !== undefined && val !== null && val !== "") {
          const num = Number(val);
          if (isNaN(num)) {
            setMessage(`${col.label} must be a valid number.`);
            setLoading(false);
            return;
          }
          if (col.min !== undefined && num < Number(col.min)) {
            setMessage(`${col.label} cannot be less than ${col.min}.`);
            setLoading(false);
            return;
          }
          if (col.max !== undefined && num > Number(col.max)) {
            setMessage(`${col.label} cannot exceed ${col.max}.`);
            setLoading(false);
            return;
          }
        }
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        let errText = "Failed to save record.";
        if (data.detail) {
          errText = data.detail;
        } else if (typeof data === "object" && Object.keys(data).length > 0) {
          errText = Object.entries(data)
            .map(([k, v]) => `${k.toUpperCase()}: ${Array.isArray(v) ? v.join(" ") : v}`)
            .join(" | ");
        }
        setMessage(errText);
      } else {
        setMode(null);
        setFormData({});
        setMessage("");
        fetchData();
      }
    } catch (err) {
      setMessage("Failed to save record.");
    } finally {
      setLoading(false);
    }
  }

  function renderFieldControl(c) {
    const disabled = mode === "view";

    if (c.type === "boolean") {
      return (
        <label className="erp-form-checkbox">
          <input
            type="checkbox"
            name={c.name}
            checked={!!formData[c.name]}
            onChange={handleChange}
            disabled={disabled}
          />
          <span>{c.label || "Active"}</span>
        </label>
      );
    }

    if (c.type === "select") {
      let options = c.options || [];
      if (c.name === "state_id" && formData.country_id) {
        options = options.filter(
          (opt) => String(opt.country_id) === String(formData.country_id)
        );
      }
      return (
        <select
          name={c.name}
          value={formData[c.name] ?? ""}
          onChange={handleChange}
          required={c.required}
          disabled={disabled || c.disableWhileLoading}
          className="erp-input"
        >
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (c.type === "date" || c.type === "datetime") {
      return (
        <input
          type={c.type === "date" ? "date" : "datetime-local"}
          name={c.name}
          value={formData[c.name] ?? ""}
          onChange={handleChange}
          required={c.required}
          disabled={disabled}
          className="erp-input"
        >
        </input>
      );
    }

    const inputType = c.type === "number" ? "number" : "text";
    const inputElement = (
      <input
        type={inputType}
        name={c.name}
        value={formData[c.name] ?? ""}
        onChange={handleChange}
        required={c.required}
        disabled={disabled}
        maxLength={c.maxLength}
        minLength={c.minLength}
        min={c.type === "number" ? c.min : undefined}
        max={c.type === "number" ? c.max : undefined}
        step={c.type === "number" ? c.step || "any" : undefined}
        placeholder={c.placeholder || ""}
        className={`erp-input ${c.suffix ? "with-suffix" : ""}`}
      />
    );

    if (c.suffix) {
      return (
        <div className="erp-input-suffix-wrapper">
          {inputElement}
          <span className="erp-input-suffix">{c.suffix}</span>
        </div>
      );
    }

    return inputElement;
  }

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      columns.some((c) => {
        const v = row[c.name];
        if (v === null || v === undefined) return false;
        if (typeof v === "boolean") return (v ? "yes" : "no").includes(q);
        return String(v).toLowerCase().includes(q);
      })
    );
  }, [rows, columns, search]);

  // 1. HTML View Export (Printable Web Document & Download)
  const exportHTML = useCallback(() => {
    setShowReportMenu(false);
    const dataToExport = filteredRows.length > 0 ? filteredRows : rows;
    if (!dataToExport.length) return;

    const printDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const headerHtml = columns
      .map(
        (c) =>
          `<th style="background:#744e36;color:#ffffff;padding:8px 10px;font-size:12px;text-align:${c.type === "number" ? "right" : "left"
          };border:1px solid #5a3b27;text-transform:uppercase;">${c.label}</th>`
      )
      .join("");

    const rowsHtml = dataToExport
      .map((row, idx) => {
        const bg = idx % 2 === 0 ? "#ffffff" : "#fdfbf7";
        const cells = columns
          .map((c) => {
            let val = row[c.name];
            if (typeof val === "boolean") val = val ? "YES" : "NO";
            if (val === null || val === undefined) val = "-";
            return `<td style="padding:6px 10px;font-size:12px;color:#222;border:1px solid #e2d9cd;text-align:${c.type === "number" ? "right" : "left"
              };">${String(val)}</td>`;
          })
          .join("");
        return `<tr style="background:${bg};"><td style="padding:6px 8px;font-size:11px;color:#777;border:1px solid #e2d9cd;text-align:center;">${idx + 1
          }</td>${cells}</tr>`;
      })
      .join("");

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - Report View</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 24px;
      color: #333;
      background: #faf8f5;
    }
    .report-card {
      background: #fff;
      padding: 24px;
      border: 1px solid #c9bdae;
      border-radius: 6px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      max-width: 1100px;
      margin: 0 auto;
    }
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #744e36;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .report-title h1 {
      margin: 0;
      color: #513220;
      font-size: 22px;
      letter-spacing: 1px;
    }
    .report-title p {
      margin: 4px 0 0;
      color: #744e36;
      font-size: 14px;
      font-weight: 600;
    }
    .report-meta {
      text-align: right;
      font-size: 12px;
      color: #666;
      line-height: 1.5;
    }
    .actions-bar {
      margin-bottom: 16px;
      display: flex;
      gap: 10px;
    }
    .btn {
      padding: 6px 14px;
      background: linear-gradient(180deg, #ffe08a 0%, #f4be52 100%);
      border: 1px solid #b88628;
      border-radius: 3px;
      font-size: 12px;
      font-weight: bold;
      color: #422606;
      cursor: pointer;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .report-footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #c9bdae;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #777;
    }
    @media print {
      body { background: #fff; margin: 0; }
      .actions-bar { display: none; }
      .report-card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="report-card">
    <div class="actions-bar">
      <button class="btn" onclick="window.print()">🖨️ Print Report</button>
      <button class="btn" onclick="downloadHtmlFile()">💾 Download HTML File</button>
    </div>
    <div class="report-header">
      <div class="report-title">
        <h1>SSRETAIL - GANESH TEXTILES</h1>
        <p>${title} Listing Report</p>
      </div>
      <div class="report-meta">
        <div><strong>Date:</strong> ${printDate}</div>
        <div><strong>Database:</strong> GANESHSSRETAIL</div>
        <div><strong>Total Records:</strong> ${dataToExport.length}</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="background:#744e36;color:#ffffff;padding:8px 8px;font-size:12px;text-align:center;border:1px solid #5a3b27;width:40px;">#</th>
          ${headerHtml}
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
    <div class="report-footer">
      <div>Ganesh Textiles Retail ERP Suite v2.0</div>
      <div>Confidential • Internal Business Document</div>
    </div>
  </div>
  <script>
    function downloadHtmlFile() {
      const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '${title.replace(/\\s+/g, "_")}_Report.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_Report.html`;
    a.click();
    window.open(url, "_blank");
  }, [filteredRows, rows, columns, title]);

  // 2. Grid View Export (CSV Table)
  const exportGrid = useCallback(() => {
    setShowReportMenu(false);
    const dataToExport = filteredRows.length > 0 ? filteredRows : rows;
    if (!dataToExport.length) return;

    const csvHeader = ["#", ...columns.map((c) => c.label.toUpperCase())].join(",");
    const csvRows = dataToExport.map((r, idx) => {
      const cells = columns.map((c) => {
        let v = r[c.name];
        if (typeof v === "boolean") v = v ? "YES" : "NO";
        if (v === null || v === undefined) v = "";
        return `"${String(v).replace(/"/g, '""')}"`;
      });
      return [idx + 1, ...cells].join(",");
    });

    const csv = [csvHeader, ...csvRows].join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_Grid_Report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredRows, rows, columns, title]);

  // 3. Excel View Export (.xls Spreadsheet with formatting)
  const exportExcel = useCallback(() => {
    setShowReportMenu(false);
    const dataToExport = filteredRows.length > 0 ? filteredRows : rows;
    if (!dataToExport.length) return;

    const printDate = new Date().toLocaleString("en-IN");

    const tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<!--[if gte mso 9]>
<xml>
 <x:ExcelWorkbook>
  <x:ExcelWorksheets>
   <x:ExcelWorksheet>
    <x:Name>${title.slice(0, 31)}</x:Name>
    <x:WorksheetOptions>
     <x:DisplayGridlines/>
    </x:WorksheetOptions>
   </x:ExcelWorksheet>
  </x:ExcelWorksheets>
 </x:ExcelWorkbook>
</xml>
<![endif]-->
<style>
  td, th { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; }
  .title { font-size: 14pt; font-weight: bold; color: #513220; }
  .sub { font-size: 10pt; color: #744e36; }
  .hdr { background-color: #744E36; color: #FFFFFF; font-weight: bold; border: 0.5pt solid #5A3B27; }
  .cell { border: 0.5pt solid #C9BDAE; }
  .cell-alt { background-color: #FDFBF7; border: 0.5pt solid #C9BDAE; }
</style>
</head>
<body>
<table>
  <tr><td colspan="${columns.length + 1}" class="title">SSRETAIL - GANESH TEXTILES</td></tr>
  <tr><td colspan="${columns.length + 1}" class="sub">${title} Listing Report • Exported: ${printDate}</td></tr>
  <tr><td colspan="${columns.length + 1}"></td></tr>
  <tr>
    <th class="hdr" style="width:50px;">#</th>
    ${columns.map((c) => `<th class="hdr">${c.label.toUpperCase()}</th>`).join("")}
  </tr>
  ${dataToExport
        .map(
          (r, idx) => `
  <tr>
    <td class="${idx % 2 === 0 ? "cell" : "cell-alt"}" style="text-align:center;">${idx + 1}</td>
    ${columns
              .map((c) => {
                let v = r[c.name];
                if (typeof v === "boolean") v = v ? "YES" : "NO";
                if (v === null || v === undefined) v = "";
                return `<td class="${idx % 2 === 0 ? "cell" : "cell-alt"}">${String(v)}</td>`;
              })
              .join("")}
  </tr>`
        )
        .join("")}
</table>
</body>
</html>`;

    const blob = new Blob([tableHtml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_Excel_Report.xls`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredRows, rows, columns, title]);

  return (
    <div className="erp-window">
      {/* 1. Tab Bar on top (only if standalone or explicitly requested) */}
      {showTabHeader && (
        <div className="erp-tab-bar">
          <div className="erp-tab active">
            <span>{title} Listing</span>
            <button
              className="erp-tab-close"
              onClick={onExit || (() => window.history.back())}
              title="Close (Ctrl+F4)"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 2. Classic ERP Toolbar */}
      <div className="erp-toolbar">
        <button className="erp-tb-btn" onClick={openAdd} title="Add (F2)">
          <span className="erp-tb-icon tb-add">⭐</span>
          <span className="erp-tb-label">Add</span>
        </button>

        <button
          className="erp-tb-btn"
          onClick={openEdit}
          disabled={!selectedRow}
          title="Edit (F3)"
        >
          <span className="erp-tb-icon tb-edit">💾</span>
          <span className="erp-tb-label">Edit</span>
        </button>

        <button
          className="erp-tb-btn"
          onClick={handleDelete}
          disabled={!selectedRow}
          title="Delete (F6)"
        >
          <span className="erp-tb-icon tb-del">❌</span>
          <span className="erp-tb-label">Delete</span>
        </button>

        <button
          className="erp-tb-btn"
          onClick={openView}
          disabled={!selectedRow}
          title="View (F7)"
        >
          <span className="erp-tb-icon tb-view">👁️</span>
          <span className="erp-tb-label">View</span>
        </button>

        {/* Report dropdown with 3 export options: HTML View, Grid View, Excel View */}
        <div className="erp-tb-dropdown-wrap" ref={reportDropdownRef}>
          <button
            type="button"
            className={`erp-tb-btn ${showReportMenu ? "active" : ""}`}
            onClick={() => setShowReportMenu((prev) => !prev)}
            disabled={!rows.length}
            title="Report Options (F8)"
          >
            <span className="erp-tb-icon tb-report">📋</span>
            <span className="erp-tb-label">Report ▾</span>
          </button>

          {showReportMenu && (
            <div className="erp-report-dropdown">
              <div className="erp-report-header">Download / View Format</div>
              <button
                type="button"
                className="erp-report-item"
                onClick={exportHTML}
              >
                <span className="erp-report-icon">🌐</span>
                <div className="erp-report-item-text">
                  <strong>HTML View</strong>
                  <span>Formatted printable document (.html)</span>
                </div>
              </button>
              <button
                type="button"
                className="erp-report-item"
                onClick={exportGrid}
              >
                <span className="erp-report-icon">🗂️</span>
                <div className="erp-report-item-text">
                  <strong>Grid View</strong>
                  <span>Data grid records (.csv)</span>
                </div>
              </button>
              <button
                type="button"
                className="erp-report-item"
                onClick={exportExcel}
              >
                <span className="erp-report-icon">📊</span>
                <div className="erp-report-item-text">
                  <strong>Excel View</strong>
                  <span>Microsoft Excel spreadsheet (.xls)</span>
                </div>
              </button>
            </div>
          )}
        </div>

        <button
          className="erp-tb-btn"
          onClick={fetchData}
          title="Refresh (F5)"
        >
          <span className="erp-tb-icon tb-refresh">🔄</span>
          <span className="erp-tb-label">Refresh</span>
        </button>

        <button
          className="erp-tb-btn"
          onClick={onExit || (() => window.history.back())}
          title="Exit (Ctrl+F4)"
        >
          <span className="erp-tb-icon tb-exit">🚪</span>
          <span className="erp-tb-label">Exit</span>
        </button>
      </div>

      {/* 3. Feedback Message */}
      {message && <div className="erp-status-msg">{message}</div>}

      {/* 4. Table Group / Search Row */}
      <div className="erp-grid-header-row">
        <span className="erp-group-hint">Drag a column header here to group by that column</span>
        <div className="erp-search-box">
          <input
            type="text"
            placeholder="Search in records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 5. Main Data Grid */}
      <div className="erp-grid-wrapper">
        {loading ? (
          <div className="erp-grid-state">Loading records...</div>
        ) : filteredRows.length === 0 ? (
          <div className="erp-grid-state">No records found.</div>
        ) : (
          <table className="erp-grid">
            <thead>
              <tr>
                <th className="th-indicator"></th>
                <th className="th-num">#</th>
                {columns.map((c) => (
                  <th key={c.name} className="th-data">
                    {c.label.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, idx) => {
                const isSelected = row.id === selectedId;
                return (
                  <tr
                    key={row.id}
                    className={`erp-row ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedId(row.id)}
                    onDoubleClick={openEdit}
                  >
                    <td className="td-indicator">{isSelected ? "▶" : ""}</td>
                    <td className="td-num">{idx + 1}</td>
                    {columns.map((c) => {
                      let val = row[c.name];

                      if (c.type === "boolean" || c.name === "active") {
                        return (
                          <td key={c.name} className="td-center">
                            <input
                              type="checkbox"
                              checked={!!val}
                              readOnly
                              tabIndex={-1}
                              className="erp-grid-checkbox"
                            />
                          </td>
                        );
                      }

                      if (c.type === "select") {
                        const opt = (c.options || []).find((o) => o.value === val);
                        val = opt ? opt.label : val;
                      }

                      return <td key={c.name}>{val ?? ""}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 6. Classic ERP Bottom Status Bar */}
      <footer className="erp-footer-bar">
        <div className="erp-shortcuts">
          <span className="erp-info-icon">ℹ️</span>
          <span>Shortcut Keys =&gt; {'{F2->Add}'} {'{F3->Edit}'} {'{F6->Delete}'} {'{F5->Refresh}'} {'{F7->View}'} {'{F8->Report}'} {'{Ctrl+F4 / Esc -> Close}'}</span>
        </div>
        <button
          className="erp-footer-close-btn"
          onClick={onExit || (() => window.history.back())}
        >
          Close
        </button>
      </footer>

      {/* Modal for Add / Edit / View */}
      {mode && (
        <div className="erp-modal-overlay">
          <div className={`erp-modal-window ${modalWidth ? `modal-${modalWidth}` : ""}`}>
            <div className="erp-modal-header">
              <span>{mode.toUpperCase()} RECORD - {title.toUpperCase()}</span>
              <button
                className="erp-modal-close"
                onClick={() => setMode(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="erp-modal-form">
              <div className="erp-modal-body">
                {customForm ? (
                  customForm({
                    formData,
                    setFormData,
                    handleChange,
                    mode,
                    loading,
                    columns,
                    renderFieldControl,
                  })
                ) : (
                  <div className="erp-form-grid">
                    {columns.map((c) => (
                      <div className="erp-form-group" key={c.name}>
                        <div className="erp-form-label-row">
                          <label>{c.label} {c.required && <span className="req">*</span>}</label>
                          {c.maxLength && (
                            <span className="erp-char-limit-badge">
                              {(formData[c.name] || "").length} / {c.maxLength}
                            </span>
                          )}
                        </div>
                        {renderFieldControl(c)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="erp-modal-footer">
                {message && <div className="erp-modal-error-text">{message}</div>}
                <div className="erp-modal-actions">
                  <button
                    type="button"
                    className="erp-btn erp-btn-secondary"
                    onClick={() => setMode(null)}
                  >
                    {mode === "view" ? "Close" : "Cancel"}
                  </button>
                  {mode !== "view" && (
                    <button
                      type="submit"
                      className="erp-btn erp-btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable ERP Dialog Box */}
      {dialog && (
        <Dialog
          isOpen={dialog.isOpen}
          title={dialog.title}
          message={dialog.message}
          type={dialog.type}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          onConfirm={dialog.onConfirm}
          onCancel={dialog.onCancel}
        />
      )}
    </div>
  );
}
