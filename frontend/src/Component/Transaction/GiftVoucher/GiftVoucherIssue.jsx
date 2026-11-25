// frontend/src/Component/Transaction/GiftVoucher/GiftVoucherIssue.jsx
import React, { useState, useEffect } from "react";
import "./GiftVoucherIssue.css";

const GiftVoucherIssue = ({ onClose, onExit }) => {
  // Master Dropdown Options
  const [locations, setLocations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [denominationsList, setDenominationsList] = useState([]);

  // Form State
  const [locationCode, setLocationCode] = useState(1);
  const [customerCode, setCustomerCode] = useState(0);
  const [voucherType, setVoucherType] = useState("Fixed"); // "Fixed" | "Variable"
  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [postedBy, setPostedBy] = useState(1);

  // Denomination Detail Rows
  const [denominationRows, setDenominationRows] = useState([
    { id: 1, denomination: "", prefix: "GV", fromNo: "", toNo: "", days: 30, amount: 0 },
  ]);
  const [activeDenomIdx, setActiveDenomIdx] = useState(0);

  // Summary State
  const [discountPer, setDiscountPer] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Settlement Detail Rows (CASH, CARD, CHEQUE)
  const [settlementRows, setSettlementRows] = useState([
    { id: 1, payType: "CASH", amount: 0, referenceNo: "", date: "", bank: "" },
    { id: 2, payType: "CARD", amount: 0, referenceNo: "", date: "", bank: "" },
    { id: 3, payType: "CHEQUE", amount: 0, referenceNo: "", date: "", bank: "" },
  ]);

  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Fetch Master Data
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        // Locations
        const locRes = await fetch("/locations/");
        if (locRes.ok) {
          const locData = await locRes.json();
          const list = Array.isArray(locData) ? locData : locData.results || [];
          setLocations(list);
          if (list.length > 0) setLocationCode(list[0].code || 1);
        }

        // Customers
        const custRes = await fetch("/customers/");
        if (custRes.ok) {
          const custData = await custRes.json();
          const list = Array.isArray(custData) ? custData : custData.results || [];
          setCustomers(list);
        }

        // Employees
        const empRes = await fetch("/employees/");
        if (empRes.ok) {
          const empData = await empRes.json();
          const list = Array.isArray(empData) ? empData : empData.results || [];
          setEmployees(list);
          if (list.length > 0) setPostedBy(list[0].id || 1);
        }

        // Denominations
        const denomRes = await fetch("/api/gift-voucher-issue/master-denominations/");
        if (denomRes.ok) {
          const denomData = await denomRes.json();
          setDenominationsList(Array.isArray(denomData) ? denomData : []);
        }
      } catch (err) {
        console.error("Master data fetch failed:", err);
      }
    };
    fetchMasters();
  }, []);

  // 2. Fetch Next Entry No
  useEffect(() => {
    const fetchNextEntryNo = async () => {
      try {
        const res = await fetch(`/api/gift-voucher-issue/next-entry-no/?location_code=${locationCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.next_entry_no) setEntryNo(data.next_entry_no);
        }
      } catch (err) {
        console.error("Failed to load next entry no:", err);
      }
    };
    fetchNextEntryNo();
  }, [locationCode]);

  // Handle Denomination Row changes
  const handleDenomChange = (index, field, value) => {
    const updated = [...denominationRows];
    updated[index][field] = value;

    // Recalculate amount if fromNo, toNo, or denomination changed
    const fromN = parseInt(updated[index].fromNo, 10);
    const toN = parseInt(updated[index].toNo, 10);
    const denomN = parseFloat(updated[index].denomination) || 0;

    if (!isNaN(fromN) && !isNaN(toN) && toN >= fromN && denomN > 0) {
      const count = toN - fromN + 1;
      updated[index].amount = count * denomN;
    }
    setDenominationRows(updated);
  };

  const addDenominationRow = () => {
    setDenominationRows([
      ...denominationRows,
      {
        id: denominationRows.length + 1,
        denomination: "",
        prefix: "GV",
        fromNo: "",
        toNo: "",
        days: 30,
        amount: 0,
      },
    ]);
  };

  // Calculations
  const totalDenominationAmount = denominationRows.reduce(
    (sum, r) => sum + (parseFloat(r.amount) || 0),
    0
  );

  const handleDiscountPerChange = (val) => {
    const p = parseFloat(val) || 0;
    setDiscountPer(p);
    setDiscountAmount((totalDenominationAmount * p) / 100);
  };

  const handleDiscountAmountChange = (val) => {
    const a = parseFloat(val) || 0;
    setDiscountAmount(a);
    if (totalDenominationAmount > 0) {
      setDiscountPer((a / totalDenominationAmount) * 100);
    }
  };

  const netAmount = Math.max(0, totalDenominationAmount - (parseFloat(discountAmount) || 0));

  // Settlement changes
  const handleSettlementChange = (index, field, value) => {
    const updated = [...settlementRows];
    updated[index][field] = value;
    setSettlementRows(updated);
  };

  const totalSettlementAmount = settlementRows.reduce(
    (sum, r) => sum + (parseFloat(r.amount) || 0),
    0
  );

  const balance = netAmount - totalSettlementAmount;

  // Auto-populate Cash settlement if not set
  useEffect(() => {
    if (settlementRows[0].amount === 0 && totalSettlementAmount === 0 && netAmount > 0) {
      const updated = [...settlementRows];
      updated[0].amount = netAmount;
      setSettlementRows(updated);
    }
  }, [netAmount]);

  // Submit Handler
  const handleOk = async () => {
    if (!customerCode || customerCode === "0") {
      alert("Please select a Customer.");
      return;
    }
    if (totalDenominationAmount <= 0) {
      alert("Please add at least one valid Denomination with Amount > 0.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        location_code: parseInt(locationCode, 10),
        customer_code: parseInt(customerCode, 10),
        voucher_type: voucherType,
        entry_date: entryDate,
        posted_by: parseInt(postedBy, 10) || 1,
        disc_per: parseFloat(discountPer) || 0,
        disc_amount: parseFloat(discountAmount) || 0,
        amount: totalDenominationAmount,
        net_amount: netAmount,
        remarks: remarks,
        denominations: denominationRows.map((r) => ({
          denomination: String(r.denomination || ""),
          prefix: r.prefix || "GV",
          from_no: String(r.fromNo || ""),
          to_no: String(r.toNo || ""),
          days: parseInt(r.days, 10) || 30,
          amount: parseFloat(r.amount) || 0,
        })),
        settlements: settlementRows.map((s) => ({
          pay_type: s.payType,
          amount: parseFloat(s.amount) || 0,
          reference_no: s.referenceNo || "",
          bank_code: 0,
        })),
      };

      const res = await fetch("/api/gift-voucher-issue/issue-voucher/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || `Gift voucher issue saved successfully! (Entry No: ${data.entry_no})`);
        // Reset form
        setDenominationRows([
          { id: 1, denomination: "", prefix: "GV", fromNo: "", toNo: "", days: 30, amount: 0 },
        ]);
        setDiscountPer(0);
        setDiscountAmount(0);
        setRemarks("");
        // Reload next entry no
        const nextRes = await fetch(`/api/gift-voucher-issue/next-entry-no/?location_code=${locationCode}`);
        if (nextRes.ok) {
          const nextData = await nextRes.json();
          if (nextData.next_entry_no) setEntryNo(nextData.next_entry_no);
        }
      } else {
        alert(data.message || "Failed to issue gift vouchers.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error saving gift voucher issue.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else if (onExit) onExit();
  };

  return (
    <div className="gvi-container">
      {/* Outer Fieldset: GIFT VOUCHER ISSUE */}
      <fieldset className="gvi-outer-fieldset">
        <legend className="gvi-legend">GIFT VOUCHER ISSUE</legend>

        {/* Top Header Grid */}
        <div className="gvi-header-grid">
          {/* Left Column */}
          <div className="gvi-header-col">
            <div className="gvi-row">
              <span className="gvi-label">Location</span>
              <select
                className="gvi-select"
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

            <div className="gvi-row">
              <span className="gvi-label">Customer</span>
              <select
                className="gvi-select"
                value={customerCode}
                onChange={(e) => setCustomerCode(e.target.value)}
              >
                <option value="0">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || `Customer #${c.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="gvi-row">
              <span className="gvi-label">Voucher Type</span>
              <div className="gvi-radio-group">
                <label className="gvi-radio-label">
                  <input
                    type="radio"
                    name="voucherType"
                    value="Fixed"
                    checked={voucherType === "Fixed"}
                    onChange={() => setVoucherType("Fixed")}
                  />
                  <span>Fixed</span>
                </label>
                <label className="gvi-radio-label">
                  <input
                    type="radio"
                    name="voucherType"
                    value="Variable"
                    checked={voucherType === "Variable"}
                    onChange={() => setVoucherType("Variable")}
                  />
                  <span>Variable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="gvi-header-col">
            <div className="gvi-row">
              <span className="gvi-label">EntryNo</span>
              <input type="text" className="gvi-input" value={entryNo} readOnly />
            </div>

            <div className="gvi-row">
              <span className="gvi-label">EntryDate</span>
              <input
                type="date"
                className="gvi-input"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>

            <div className="gvi-row">
              <span className="gvi-label">Posted by</span>
              <select
                className="gvi-select"
                value={postedBy}
                onChange={(e) => setPostedBy(e.target.value)}
              >
                <option value="">[SELECT]</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name || emp.employee_name || `Employee #${emp.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Denomination Detail Section */}
        <fieldset className="gvi-section-fieldset">
          <legend className="gvi-section-legend">DENOMINATION DETAIL</legend>

          <div className="gvi-table-wrap">
            <table className="gvi-table">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}></th>
                  <th>Denomination</th>
                  <th>Prefix</th>
                  <th>From No.</th>
                  <th>To No.</th>
                  <th>Days</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {denominationRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={idx === activeDenomIdx ? "active-row" : ""}
                    onClick={() => setActiveDenomIdx(idx)}
                  >
                    <td className="gvi-row-idx">
                      {idx === activeDenomIdx ? "▸" : ""} {idx + 1}
                    </td>
                    <td>
                      <input
                        type="text"
                        className="gvi-table-input"
                        value={row.denomination}
                        onChange={(e) => handleDenomChange(idx, "denomination", e.target.value)}
                        placeholder="e.g. 500"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="gvi-table-input"
                        value={row.prefix}
                        onChange={(e) => handleDenomChange(idx, "prefix", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="gvi-table-input"
                        value={row.fromNo}
                        onChange={(e) => handleDenomChange(idx, "fromNo", e.target.value)}
                        placeholder="1"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="gvi-table-input"
                        value={row.toNo}
                        onChange={(e) => handleDenomChange(idx, "toNo", e.target.value)}
                        placeholder="10"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="gvi-table-input text-right"
                        value={row.days}
                        onChange={(e) => handleDenomChange(idx, "days", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="gvi-table-input text-right"
                        value={row.amount}
                        onChange={(e) => handleDenomChange(idx, "amount", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="gvi-table-footer">
            <div className="gvi-footer-box">{totalDenominationAmount.toFixed(2)}</div>
          </div>
        </fieldset>

        {/* Summary Row */}
        <div className="gvi-summary-row">
          <div className="gvi-summary-box">
            <div className="gvi-summary-item">
              <span>Discount Per</span>
              <input
                type="number"
                className="gvi-summary-input"
                value={discountPer}
                onChange={(e) => handleDiscountPerChange(e.target.value)}
              />
            </div>
            <div className="gvi-summary-item">
              <span>Discount Amount</span>
              <input
                type="number"
                className="gvi-summary-input"
                value={discountAmount}
                onChange={(e) => handleDiscountAmountChange(e.target.value)}
              />
            </div>
            <div className="gvi-summary-item">
              <span>Net Amount</span>
              <input
                type="text"
                className="gvi-summary-input"
                value={netAmount.toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Settlement Detail Section */}
        <fieldset className="gvi-section-fieldset">
          <legend className="gvi-section-legend">SETTLEMENT DETAIL</legend>

          <div className="gvi-table-wrap">
            <table className="gvi-table">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}></th>
                  <th>PayType</th>
                  <th>Amount</th>
                  <th>Reference No</th>
                  <th>Date</th>
                  <th>Bank</th>
                </tr>
              </thead>
              <tbody>
                {settlementRows.map((row, idx) => (
                  <tr key={row.id}>
                    <td className="gvi-row-idx">{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{row.payType}</td>
                    <td>
                      <input
                        type="number"
                        className="gvi-table-input text-right"
                        value={row.amount}
                        onChange={(e) => handleSettlementChange(idx, "amount", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="gvi-table-input"
                        value={row.referenceNo}
                        onChange={(e) => handleSettlementChange(idx, "referenceNo", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="gvi-table-input"
                        value={row.date}
                        onChange={(e) => handleSettlementChange(idx, "date", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="gvi-table-input"
                        value={row.bank}
                        onChange={(e) => handleSettlementChange(idx, "bank", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="gvi-table-footer">
            <div className="gvi-footer-box">{totalSettlementAmount.toFixed(2)}</div>
          </div>
        </fieldset>

        {/* Bottom Controls: Remarks & Balance */}
        <div className="gvi-bottom-controls">
          <div className="gvi-remarks-wrap">
            <span className="gvi-label">Remarks</span>
            <input
              type="text"
              className="gvi-input"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
            />
          </div>

          <div className="gvi-balance-wrap">
            <span className="gvi-label" style={{ width: "auto" }}>
              Balance
            </span>
            <input
              type="text"
              className="gvi-summary-input"
              value={balance.toFixed(2)}
              readOnly
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="gvi-actions">
          <button
            type="button"
            className="gvi-btn gvi-btn-ok"
            onClick={handleOk}
            disabled={loading}
          >
            💾 OK
          </button>
          <button
            type="button"
            className="gvi-btn gvi-btn-close"
            onClick={handleClose}
            disabled={loading}
          >
            ✖ Close
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default GiftVoucherIssue;
