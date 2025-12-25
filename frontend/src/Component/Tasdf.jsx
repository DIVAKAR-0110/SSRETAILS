// src/components/Tools.jsx
import { useEffect, useState, useMemo } from "react";
import "./Tools.css";

export default function Tools({
  title,
  columns,
  apiBase,
  onExit,
  extraPayload,
}) {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState(null); // "add" | "edit"
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const selectedRow = rows.find((r) => r.id === selectedId);

  useEffect(() => {
    fetchData();
  }, [apiBase]);

  async function fetchData() {
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch(apiBase);
      const data = await res.json();
      setRows(data);
    } catch (err) {
      setMessage("Failed to load records.");
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
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
  }

  function openEdit() {
    if (!selectedRow) return;
    setMode("edit");
    setFormData({ ...selectedRow });
  }

  async function handleDelete() {
    if (!selectedRow) return;
    if (!window.confirm("Delete selected record?")) return;
    try {
      setLoading(true);
      setMessage("");
      await fetch(`${apiBase}${selectedRow.id}/`, {
        method: "DELETE",
      });
      setSelectedId(null);
      fetchData();
    } catch (err) {
      setMessage("Failed to delete record.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { type, checked, value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      [name]: value.toUpperCase(),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mode) return;
    try {
      setLoading(true);
      setMessage("");

      const method = mode === "add" ? "POST" : "PUT";
      const url =
        mode === "add" ? apiBase : `${apiBase}${formData.id || selectedId}/`;

      const payload = {};
      columns.forEach((c) => {
        payload[c.name] = formData[c.name];
      });
      if (mode === "add" && extraPayload) {
        Object.assign(payload, extraPayload);
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.detail || "Failed to save record.");
      } else {
        setMode(null);
        setFormData({});
        fetchData();
      }
    } catch (err) {
      setMessage("Failed to save record.");
    } finally {
      setLoading(false);
    }
  }

  // Field rendering helper
  function renderFieldControl(c) {
    if (c.type === "boolean") {
      return (
        <label className="tools-checkbox">
          <input
            type="checkbox"
            name={c.name}
            checked={!!formData[c.name]}
            onChange={handleChange}
          />
          <span>{c.label || "Active"}</span>
        </label>
      );
    }
    if (c.type === "select") {
      let options = c.options || [];
      // Filter state options by selected country (for City module)
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
          disabled={c.disableWhileLoading}
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
    const inputType = c.type === "number" ? "number" : "text";
    return (
      <input
        type={inputType}
        name={c.name}
        value={formData[c.name] ?? ""}
        onChange={handleChange}
        required={c.required}
        step={c.type === "number" ? c.step || "any" : undefined}
        placeholder={c.placeholder}
      />
    );
  }

  function handleExport() {
    const csvHeader = columns.map((c) => c.label).join(",");
    const csvRows = rows.map((r) =>
      columns
        .map((c) => {
          let v = r[c.name];
          if (typeof v === "boolean") v = v ? "Yes" : "No";
          if (v === null || v === undefined) v = "";
          return `"${String(v).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    if (!rows.length) return;
    const printWindow = window.open("", "_blank", "width=900,height=600");
    if (!printWindow) return;

    const titleText = title || "Report";
    const tableHead = `
      <tr>
        <th style="text-align:left;padding:4px 8px;">#</th>
        ${columns
          .map(
            (c) =>
              `<th style="text-align:left;padding:4px 8px;">${c.label}</th>`
          )
          .join("")}
        <th style="text-align:left;padding:4px 8px;">Created at</th>
      </tr>
    `;

    const tableBody = rows
      .map((row, idx) => {
        const cells = columns
          .map((c) => {
            let v;
            if (c.type === "boolean") {
              v = row[c.name] ? "Yes" : "No";
            } else if (c.type === "select") {
              const opt = (c.options || []).find(
                (o) => o.value === row[c.name]
              );
              v = opt ? opt.label : row[c.name];
            } else {
              v = row[c.name];
            }
            if (v === null || v === undefined) v = "";
            return `<td style="padding:4px 8px;border-top:1px solid #ddd;">${String(
              v
            )}</td>`;
          })
          .join("");

        const created = row.created_at
          ? new Date(row.created_at).toLocaleString()
          : "";

        return `
          <tr>
            <td style="padding:4px 8px;border-top:1px solid #ddd;">${
              idx + 1
            }</td>
            ${cells}
            <td style="padding:4px 8px;border-top:1px solid #ddd;">${created}</td>
          </tr>
        `;
      })
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${titleText}</title>
          <style>
            body { font-family: system-ui, sans-serif; margin: 16px; color: #111827; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            .subtitle { font-size: 12px; color: #6b7280; margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th { border-bottom: 1px solid #111827; }
            @media print { body { margin: 8mm; } }
          </style>
        </head>
        <body>
          <h1>${titleText}</h1>
          <div class="subtitle">Printed on ${new Date().toLocaleString()}</div>
          <table>
            <thead>${tableHead}</thead>
            <tbody>${tableBody}</tbody>
          </table>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
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

  return (
    <div className="tools-page">
      <div className="tools-card">
        <header className="tools-header">
          <div>
            <h1>{title}</h1>
            <p>Maintain master data with Add, Edit, Delete and reports.</p>
          </div>
          <button
            className="tools-exit-btn"
            onClick={onExit || (() => window.history.back())}
          >
            Exit
          </button>
        </header>

        {message && <div className="tools-message">{message}</div>}

        <div className="tools-top-row">
          <div className="tools-toolbar">
            <button onClick={openAdd}>Add</button>
            <button onClick={openEdit} disabled={!selectedRow}>
              Edit
            </button>
            <button onClick={handleDelete} disabled={!selectedRow}>
              Delete
            </button>
            <button onClick={handleExport} disabled={!rows.length}>
              Report (CSV)
            </button>
            <button onClick={handlePrint} disabled={!rows.length}>
              Print
            </button>
            <button onClick={fetchData}>View / Refresh</button>
          </div>
          <input
            className="tools-search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tools-table-wrapper">
          {loading ? (
            <p className="tools-loading">Loading...</p>
          ) : filteredRows.length === 0 ? (
            <p className="tools-empty">No records found.</p>
          ) : (
            <table className="tools-table">
              <thead>
                <tr>
                  <th>#</th>
                  {columns.map((c) => (
                    <th key={c.name}>{c.label}</th>
                  ))}
                  <th>Created at</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={
                      row.id === selectedId
                        ? "tools-row tools-row--selected"
                        : "tools-row"
                    }
                    onClick={() =>
                      setSelectedId(row.id === selectedId ? null : row.id)
                    }
                  >
                    <td>{idx + 1}</td>
                    {columns.map((c) => {
                      let v;
                      if (c.type === "boolean") {
                        v = row[c.name] ? "Yes" : "No";
                      } else if (c.type === "select") {
                        const opt = (c.options || []).find(
                          (o) => o.value === row[c.name]
                        );
                        v = opt ? opt.label : row[c.name];
                      } else {
                        v = row[c.name];
                      }
                      return <td key={c.name}>{v}</td>;
                    })}
                    <td>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString()
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {mode && (
          <div className="tools-modal-backdrop">
            <div className="tools-modal">
              <div className="tools-modal-header">
                <h2>{mode === "add" ? "Add" : "Edit"} record</h2>
                <button
                  className="tools-modal-close"
                  onClick={() => setMode(null)}
                >
                  ✕
                </button>
              </div>
              <form className="tools-form" onSubmit={handleSubmit}>
                <div className="tools-form-grid">
                  {columns.map((c) => (
                    <div className="tools-field" key={c.name}>
                      <label>{c.label}</label>
                      {renderFieldControl(c)}
                    </div>
                  ))}
                </div>
                <div className="tools-form-actions">
                  <button
                    type="button"
                    className="tools-btn-secondary"
                    onClick={() => setMode(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tools-btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
