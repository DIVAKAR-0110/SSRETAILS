// frontend/src/Component/Transaction/Others/DayBook.jsx
import React, { useState, useEffect } from "react";
import "./DayBook.css";

const DayBook = ({ onClose, onExit }) => {
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [counters, setCounters] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [expenseHeads, setExpenseHeads] = useState([]);

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [locationCode, setLocationCode] = useState(1);
  const [companyCode, setCompanyCode] = useState(1);
  const [counterCode, setCounterCode] = useState(0);

  const [items, setItems] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0.0);
  const [totalCredit, setTotalCredit] = useState(0.0);
  const [closingBalance, setClosingBalance] = useState(0.0);
  const [loading, setLoading] = useState(false);

  // Load master data
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [locRes, compRes, cntRes, empRes, incRes] = await Promise.all([
          fetch("/locations/"),
          fetch("/companies/"),
          fetch("/counters/"),
          fetch("/employees/"),
          fetch("/income-expenses/"),
        ]);

        if (locRes.ok) {
          const d = await locRes.json();
          const l = Array.isArray(d) ? d : d.results || [];
          setLocations(l);
          if (l.length > 0) setLocationCode(l[0].code || l[0].id || 1);
        }
        if (compRes.ok) {
          const d = await compRes.json();
          const l = Array.isArray(d) ? d : d.results || [];
          setCompanies(l);
          if (l.length > 0) setCompanyCode(l[0].code || l[0].id || 1);
        }
        if (cntRes.ok) {
          const d = await cntRes.json();
          setCounters(Array.isArray(d) ? d : d.results || []);
        }
        if (empRes.ok) {
          const d = await empRes.json();
          setEmployees(Array.isArray(d) ? d : d.results || []);
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

  // Submit / Query Daybook handler
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const url = `/api/day-book/query-daybook/?date=${date}&location_code=${locationCode}&company_code=${companyCode}&counter_code=${counterCode}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItems(data.items || []);
          setTotalDebit(data.total_debit || 0.0);
          setTotalCredit(data.total_credit || 0.0);
          setClosingBalance(data.closing_balance || 0.0);
        }
      }
    } catch (err) {
      console.error("Daybook query error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else if (onExit) onExit();
  };

  return (
    <div className="daybook-container">
      <fieldset className="daybook-fieldset">
        <legend className="daybook-legend">CASH BALANCE</legend>

        <div className="daybook-header-grid">
          {/* Left Column */}
          <div className="daybook-col">
            <div className="daybook-row">
              <span className="daybook-label">Date</span>
              <input
                type="date"
                className="daybook-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="daybook-row">
              <span className="daybook-label">Company</span>
              <select
                className="daybook-select"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
              >
                {companies.map((c) => (
                  <option key={c.code || c.id} value={c.code || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="daybook-row">
              <span className="daybook-label">Counter</span>
              <select
                className="daybook-select"
                value={counterCode}
                onChange={(e) => setCounterCode(e.target.value)}
              >
                <option value="0">-- All Counters --</option>
                {counters.map((cnt) => (
                  <option key={cnt.id || cnt.code} value={cnt.id || cnt.code}>
                    {cnt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="daybook-col">
            <div className="daybook-row">
              <span className="daybook-label">Location</span>
              <select
                className="daybook-select"
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

            <div className="daybook-row" style={{ marginTop: "4px" }}>
              <button
                type="button"
                className="daybook-btn-submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                Submit
              </button>
              <span className="daybook-label" style={{ marginLeft: "12px", width: "auto" }}>
                Debit/Credit
              </span>
              <input
                type="text"
                className="daybook-input"
                style={{ textAlign: "right", maxWidth: "120px" }}
                value={closingBalance.toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </div>
      </fieldset>

      {/* Details Table */}
      <div className="daybook-section-title">DETAILS</div>
      <div className="daybook-table-wrap">
        <table className="daybook-table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}></th>
              <th>Expences/Income</th>
              <th>Particulars</th>
              <th>Emloyee</th>
              <th style={{ width: "110px" }}>Debit</th>
              <th style={{ width: "110px" }}>Credit</th>
              <th style={{ width: "40px" }}>Print</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-records">
                  Click 'Submit' to query cash balance and expenses.
                </td>
              </tr>
            ) : (
              items.map((it, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "center", background: "#f7f4ed" }}>▸ {idx + 1}</td>
                  <td>{it.expense_name}</td>
                  <td>{it.particulars}</td>
                  <td>{it.employee_name}</td>
                  <td className="text-right">{it.debit > 0 ? it.debit.toFixed(2) : ""}</td>
                  <td className="text-right">{it.credit > 0 ? it.credit.toFixed(2) : ""}</td>
                  <td className="text-center">
                    <input type="checkbox" checked={it.printed} readOnly />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Total */}
      <div className="daybook-table-footer">
        <div className="daybook-footer-box">{totalDebit.toFixed(2)}</div>
        <div className="daybook-footer-box">{totalCredit.toFixed(2)}</div>
      </div>

      {/* Closing Balance & Action Buttons */}
      <div className="daybook-bottom">
        <div className="daybook-closing-wrap">
          <span className="daybook-label" style={{ width: "auto", fontWeight: 700 }}>
            Closing Balance
          </span>
          <input
            type="text"
            className="daybook-input"
            style={{ width: "110px", textAlign: "right", fontWeight: 700 }}
            value={closingBalance.toFixed(2)}
            readOnly
          />
        </div>
        <button type="button" className="daybook-btn daybook-btn-ok" onClick={handleClose}>
          💾 OK
        </button>
        <button type="button" className="daybook-btn daybook-btn-close" onClick={handleClose}>
          ✖ Close
        </button>
      </div>
    </div>
  );
};

export default DayBook;
