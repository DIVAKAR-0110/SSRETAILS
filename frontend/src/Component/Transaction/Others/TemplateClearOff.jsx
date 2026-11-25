import React, { useState } from "react";
import axios from "axios";
import "./TemplateClearOff.css";

const API_BASE = "http://localhost:8000";

export default function TemplateClearOff({ adminId, onClose, onExit }) {
  const [fromDate, setFromDate] = useState("2025-08-02");
  const [toDate, setToDate] = useState("2025-08-02");
  const [includeUncancelled, setIncludeUncancelled] = useState(false);
  const [salesInvoiceCancel, setSalesInvoiceCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = onClose || onExit || (() => {});

  const handleClear = () => {
    if (!window.confirm(`Are you sure you want to clear off templates between ${fromDate} and ${toDate}?`)) {
      return;
    }
    setLoading(true);
    setStatusMsg("");

    const payload = {
      from_date: fromDate,
      to_date: toDate,
      include_uncancelled: includeUncancelled,
      sales_invoice_cancel: salesInvoiceCancel,
    };

    axios
      .post(`${API_BASE}/api/template-clear-off/clear-templates/`, payload)
      .then((res) => {
        if (res.data?.success) {
          setIsSuccess(true);
          setStatusMsg(res.data.message || "Templates cleared successfully.");
        } else {
          setIsSuccess(false);
          setStatusMsg(res.data?.message || "Failed to clear templates.");
        }
      })
      .catch((err) => {
        console.error("Clear error:", err);
        setIsSuccess(false);
        setStatusMsg("Error clearing templates. Check console.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="tco-root">
      <div className="tco-container">
        <fieldset className="tco-fieldset">
          <legend className="tco-legend">Template Clear Off</legend>

          <div className="tco-form-row">
            <label>From Date</label>
            <input
              type="date"
              className="tco-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="tco-form-row">
            <label>To Date</label>
            <input
              type="date"
              className="tco-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="tco-check-row">
            <input
              type="checkbox"
              id="includeUncancelled"
              checked={includeUncancelled}
              onChange={(e) => setIncludeUncancelled(e.target.checked)}
            />
            <label htmlFor="includeUncancelled">Include UnCancelled</label>
          </div>

          <div className="tco-check-row">
            <input
              type="checkbox"
              id="salesInvoiceCancel"
              checked={salesInvoiceCancel}
              onChange={(e) => setSalesInvoiceCancel(e.target.checked)}
            />
            <label htmlFor="salesInvoiceCancel">SalesInvoiceCancel</label>
          </div>

          <div className="tco-btn-row">
            <button className="tco-btn tco-btn-clear" onClick={handleClear} disabled={loading}>
              {loading ? "Clearing..." : "[ Clear ]"}
            </button>
            <button className="tco-btn tco-btn-close" onClick={handleClose}>
              [ Close ]
            </button>
          </div>

          {statusMsg && (
            <div
              className="tco-status-msg"
              style={{ color: isSuccess ? "#0b6121" : "#a81c1c" }}
            >
              {statusMsg}
            </div>
          )}
        </fieldset>
      </div>
    </div>
  );
}
