// frontend/src/Component/Transaction/Others/CashDrawerDenomination.jsx
import React, { useState, useEffect } from "react";
import "./CashDrawerDenomination.css";

const CashDrawerDenomination = ({ onClose, onExit }) => {
  const [locations, setLocations] = useState([]);
  const [expenseHeads, setExpenseHeads] = useState([]);

  const [locationCode, setLocationCode] = useState(1);
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [expenseHead, setExpenseHead] = useState("");
  const [basedOn, setBasedOn] = useState("Counter"); // "System" | "Counter"
  const [postedBy, setPostedBy] = useState("SUPERUSER");

  const [counterDetails, setCounterDetails] = useState([
    { id: 1, particulars: "Net Total", ground: 0.0, total: 0.0 },
    { id: 2, particulars: "Expenses", ground: 0.0, total: 0.0 },
  ]);

  const [loading, setLoading] = useState(false);

  // Load masters
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [locRes, incRes] = await Promise.all([
          fetch("/locations/"),
          fetch("/income-expenses/"),
        ]);
        if (locRes.ok) {
          const d = await locRes.json();
          const l = Array.isArray(d) ? d : d.results || [];
          setLocations(l);
          if (l.length > 0) setLocationCode(l[0].code || l[0].id || 1);
        }
        if (incRes.ok) {
          const d = await incRes.json();
          setExpenseHeads(Array.isArray(d) ? d : d.results || []);
        }
      } catch (err) {
        console.error("Master data error:", err);
      }
    };
    fetchMasters();
  }, []);

  // Load details handler
  const handleLoad = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/cash-drawer-denomination/load-counter-details/?location_code=${locationCode}&date=${entryDate}&based_on=${basedOn}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.details) {
          setCounterDetails(data.details);
        }
      }
    } catch (err) {
      console.error("Load denomination error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else if (onExit) onExit();
  };

  return (
    <div className="cdd-container">
      {/* Top Ribbon Toolbar */}
      <div className="cdd-toolbar">
        <button type="button" className="cdd-tb-btn" onClick={handleLoad}>
          ➕ Add &#123;F2&#125;
        </button>
        <button type="button" className="cdd-tb-btn" onClick={handleLoad}>
          ✏️ Edit &#123;F3&#125;
        </button>
        <button type="button" className="cdd-tb-btn" onClick={handleClose}>
          ❌ Cancel &#123;F6&#125;
        </button>
        <button type="button" className="cdd-tb-btn" onClick={handleLoad}>
          👁️ View &#123;F7&#125;
        </button>
        <button type="button" className="cdd-tb-btn" onClick={handleClose}>
          🚪 Exit &#123;Ctrl+F4&#125;
        </button>
      </div>

      {/* Header Fieldset */}
      <fieldset className="cdd-fieldset">
        <legend className="cdd-legend">DENOMINATION</legend>

        <div className="cdd-header-row">
          <div className="cdd-item" style={{ flex: 1.2 }}>
            <span className="cdd-label">Location</span>
            <select
              className="cdd-select"
              style={{ width: "100%" }}
              value={locationCode}
              onChange={(e) => setLocationCode(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc.code || loc.id} value={loc.code || loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="cdd-item" style={{ flex: 1.6 }}>
            <span className="cdd-label">IncomeOrExpenseHead</span>
            <select
              className="cdd-select"
              style={{ width: "100%" }}
              value={expenseHead}
              onChange={(e) => setExpenseHead(e.target.value)}
            >
              <option value="">[SELECT]</option>
              {expenseHeads.map((h) => (
                <option key={h.code || h.id} value={h.code || h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div className="cdd-item" style={{ flex: 1 }}>
            <span className="cdd-label">Posted By</span>
            <input type="text" className="cdd-input" value={postedBy} readOnly />
          </div>
        </div>

        <div className="cdd-header-row">
          <div className="cdd-item">
            <span className="cdd-label">Entry Date</span>
            <input
              type="date"
              className="cdd-input"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
            <button type="button" className="cdd-btn" onClick={handleLoad} disabled={loading}>
              Load
            </button>
          </div>

          <div className="cdd-item" style={{ marginLeft: "12px" }}>
            <span className="cdd-label">Based On</span>
            <div className="cdd-radio-group">
              <label className="cdd-radio-label">
                <input
                  type="radio"
                  name="basedOn"
                  value="System"
                  checked={basedOn === "System"}
                  onChange={() => setBasedOn("System")}
                />
                <span>System</span>
              </label>
              <label className="cdd-radio-label">
                <input
                  type="radio"
                  name="basedOn"
                  value="Counter"
                  checked={basedOn === "Counter"}
                  onChange={() => setBasedOn("Counter")}
                />
                <span>Counter</span>
              </label>
            </div>
          </div>

          <div className="cdd-item" style={{ marginLeft: "auto", gap: "8px" }}>
            <button type="button" className="cdd-btn" onClick={() => alert("Export to Excel triggered.")}>
              Export to XL
            </button>
            <button type="button" className="cdd-btn" onClick={() => window.print()}>
              Print View
            </button>
          </div>
        </div>
      </fieldset>

      {/* Counter Details Grid */}
      <div className="cdd-section-title">Counter Details</div>
      <div className="cdd-table-wrap">
        <table className="cdd-table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}></th>
              <th>Particulars</th>
              <th>GROUND</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {counterDetails.map((row, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "center", background: "#f7f4ed" }}>▸ {idx + 1}</td>
                <td style={{ fontWeight: 600 }}>{row.particulars}</td>
                <td className="text-right">{(row.ground || 0).toFixed(2)}</td>
                <td className="text-right">{(row.total || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar */}
      <div className="cdd-bottom">
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#332d24" }}>
          Current Loggin Counter
        </span>
        <div className="cdd-actions">
          <button type="button" className="cdd-btn" onClick={handleClose}>
            💾 OK
          </button>
          <button type="button" className="cdd-btn" onClick={handleClose}>
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashDrawerDenomination;
