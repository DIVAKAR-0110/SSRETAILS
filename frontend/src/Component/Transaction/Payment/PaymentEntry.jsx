// frontend/src/Component/Transaction/Payment/PaymentEntry.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PaymentEntry.css";

const API_ROOT = "http://localhost:8000";

export default function PaymentEntry({ adminId = 1, onExit }) {
  // Lookups
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [banks, setBanks] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]);

  // Top Filter States
  const [locationId, setLocationId] = useState(1);
  const [companyId, setCompanyId] = useState(1);
  const [supplierId, setSupplierId] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [incDate, setIncDate] = useState(true);
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Main Grid: Credit / Debit Bills
  const [bills, setBills] = useState([]);

  // Bottom Sub-tabs: "payment_detail" | "advance" | "add_less"
  const [bottomTab, setBottomTab] = useState("payment_detail");

  // Tab 1: Payment Detail
  const [payModeType, setPayModeType] = useState("CS"); // "CS" (CASH), "CQ" (CHEQUE), "UP" (UPI)
  const [paymentModes, setPaymentModes] = useState([
    {
      id: 1,
      bank_id: 1,
      set_no: "",
      dd_or_cheque_no: "",
      dd_or_cheque_date: new Date().toISOString().split("T")[0],
      payable_at: 1,
      amount: "0.00",
    },
  ]);

  // Tab 2: Advance
  const [advances, setAdvances] = useState([]);

  // Tab 3: Add / Less Details
  const [addLessDetails, setAddLessDetails] = useState([
    {
      id: 1,
      particulars: "Discount",
      type: "-",
      percent: "0.00",
      amount_on: "0.00",
      amount: "0.00",
      round_off: "0.00",
      net_amount: "0.00",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Initial Fetch
  useEffect(() => {
    fetchLookups();
    fetchNextEntryNo(1);
  }, []);

  const fetchLookups = async () => {
    try {
      const [locRes, compRes, supRes, empRes, bankRes, taxRes] = await Promise.all([
        axios.get(`${API_ROOT}/locations/`),
        axios.get(`${API_ROOT}/companies/`),
        axios.get(`${API_ROOT}/suppliers/`),
        axios.get(`${API_ROOT}/employees/`),
        axios.get(`${API_ROOT}/banks/`),
        axios.get(`${API_ROOT}/tax-types/`),
      ]);
      setLocations(Array.isArray(locRes.data) ? locRes.data : locRes.data.results || []);
      setCompanies(Array.isArray(compRes.data) ? compRes.data : compRes.data.results || []);
      setSuppliers(Array.isArray(supRes.data) ? supRes.data : supRes.data.results || []);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : empRes.data.results || []);
      setBanks(Array.isArray(bankRes.data) ? bankRes.data : bankRes.data.results || []);
      setTaxTypes(Array.isArray(taxRes.data) ? taxRes.data : taxRes.data.results || []);
    } catch (err) {
      console.error("Lookups load failed:", err);
    }
  };

  const fetchNextEntryNo = async (locId) => {
    try {
      const res = await axios.get(`${API_ROOT}/payment-entry/next-entry-no/?location_id=${locId || 1}`);
      setEntryNo(res.data.next_entry_no || "");
    } catch (err) {
      console.error("Next entry no error:", err);
    }
  };

  // Submit Query to fetch outstanding bills and advances
  const handleSubmitQuery = async () => {
    if (!supplierId) {
      alert("Please select a Supplier first.");
      return;
    }
    setLoading(true);
    setStatusMsg("");
    try {
      const params = new URLSearchParams();
      if (locationId) params.append("location_id", locationId);
      if (companyId) params.append("company_id", companyId);
      if (supplierId) params.append("supplier_id", supplierId);
      if (incDate) {
        params.append("inc_date", "true");
        if (fromDate) params.append("from_date", fromDate);
        if (toDate) params.append("to_date", toDate);
      }

      const [billsRes, advRes] = await Promise.all([
        axios.get(`${API_ROOT}/payment-entry/pending-bills/?${params.toString()}`),
        axios.get(`${API_ROOT}/payment-entry/pending-advances/?${params.toString()}`),
      ]);

      const billData = Array.isArray(billsRes.data) ? billsRes.data : [];
      setBills(
        billData.map((b, idx) => ({
          ...b,
          keyId: idx,
          paid_amount: b.paid_amount || b.balance || 0,
          closed: b.closed || false,
        }))
      );

      const advData = Array.isArray(advRes.data) ? advRes.data : [];
      setAdvances(
        advData.map((a, idx) => ({
          ...a,
          keyId: idx,
          closed: false,
        }))
      );

      if (billData.length === 0) {
        setStatusMsg("No outstanding bills found for this supplier.");
      }
    } catch (err) {
      console.error("Query bills error:", err);
      setStatusMsg("Failed to query bills.");
    } finally {
      setLoading(false);
    }
  };

  // Update Bill Row
  const updateBillField = (idx, field, val) => {
    setBills((prev) => {
      const copy = [...prev];
      const r = { ...copy[idx], [field]: val };
      const paid = parseFloat(r.paid_amount) || 0;
      const cd = parseFloat(r.cd_amount) || 0;
      const disc = parseFloat(r.disc_amount) || 0;
      const interest = parseFloat(r.interest_amount) || 0;
      r.net_amount = (paid - cd - disc + (r.delay_or_early ? interest : -interest)).toFixed(2);
      copy[idx] = r;
      return copy;
    });
  };

  // Payment Modes Row Management
  const addPaymentModeRow = () => {
    setPaymentModes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        bank_id: banks[0]?.bank_id || 1,
        set_no: "",
        dd_or_cheque_no: "",
        dd_or_cheque_date: new Date().toISOString().split("T")[0],
        payable_at: 1,
        amount: "0.00",
      },
    ]);
  };

  const updatePaymentMode = (idx, field, val) => {
    setPaymentModes((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  // Advance Row Toggle
  const toggleAdvanceRow = (idx) => {
    setAdvances((prev) => {
      const copy = [...prev];
      copy[idx].closed = !copy[idx].closed;
      return copy;
    });
  };

  // Add / Less Details Management
  const addAddLessRow = () => {
    setAddLessDetails((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        particulars: "Discount",
        type: "-",
        percent: "0.00",
        amount_on: "0.00",
        amount: "0.00",
        round_off: "0.00",
        net_amount: "0.00",
      },
    ]);
  };

  const updateAddLessField = (idx, field, val) => {
    setAddLessDetails((prev) => {
      const copy = [...prev];
      const r = { ...copy[idx], [field]: val };
      const pct = parseFloat(r.percent) || 0;
      const base = parseFloat(r.amount_on) || 0;
      let amt = parseFloat(r.amount) || 0;
      if (pct > 0 && (field === "percent" || field === "amount_on")) {
        amt = (base * pct) / 100;
        r.amount = amt.toFixed(2);
      }
      const round = parseFloat(r.round_off) || 0;
      r.net_amount = (amt + round).toFixed(2);
      copy[idx] = r;
      return copy;
    });
  };

  // Calculations for Summary Panel
  const subTotal = bills.reduce((sum, b) => sum + (parseFloat(b.paid_amount) || 0), 0);
  const lessDisc = bills.reduce(
    (sum, b) => sum + (parseFloat(b.cd_amount) || 0) + (parseFloat(b.disc_amount) || 0),
    0
  );
  const lessCredit = bills.reduce(
    (sum, b) => sum + (b.credit ? parseFloat(b.credit) || 0 : 0),
    0
  );
  const lessAdvance = advances.reduce(
    (sum, a) => sum + (a.closed ? parseFloat(a.amount) || 0 : 0),
    0
  );
  const lessInterest = bills.reduce(
    (sum, b) => sum + (!b.delay_or_early ? parseFloat(b.interest_amount) || 0 : 0),
    0
  );
  const totalAddLess = addLessDetails.reduce((sum, al) => {
    const amt = parseFloat(al.net_amount) || 0;
    return al.type === "-" ? sum - amt : sum + amt;
  }, 0);

  const grandNetAmount = (
    subTotal - lessDisc - lessAdvance - lessInterest + totalAddLess
  ).toFixed(2);

  // Save Payment Entry
  const handleSave = async () => {
    if (!supplierId) {
      alert("Please select a Supplier.");
      return;
    }
    const selectedBills = bills.filter((b) => parseFloat(b.paid_amount) > 0 || b.closed);
    if (selectedBills.length === 0 && paymentModes.every((m) => parseFloat(m.amount) === 0)) {
      alert("Please enter a payment amount or select bills to settle.");
      return;
    }

    const payload = {
      location_id: locationId,
      company_id: companyId,
      supplier_id: supplierId,
      entry_date: entryDate,
      posted_by: postedBy || 0,
      pay_mode_type: payModeType,
      advance_amount: lessAdvance,
      add_less_amount: totalAddLess,
      tax_amount: 0.0,
      paid_amount: grandNetAmount,
      created_by: adminId,
      payment_details: selectedBills.map((b, i) => ({
        entry_id: b.entry_id,
        entry_no: b.entry_no,
        entry_date: b.entry_date,
        entry_order_id: i + 1,
        inv_no: b.inv_no,
        inv_date: b.inv_date,
        inv_amount: parseFloat(b.inv_amount) || 0,
        paid_amount: parseFloat(b.paid_amount) || 0,
        balance: parseFloat(b.balance) || 0,
        cd_percentage: parseFloat(b.cd_percentage) || 0,
        cd_amount: parseFloat(b.cd_amount) || 0,
        agent_id: parseInt(b.agent_id) || 0,
        agent_per: parseFloat(b.agent_per) || 0,
        agent_amount: parseFloat(b.agent_amount) || 0,
        disc_per: parseFloat(b.disc_per) || 0,
        disc_amount: parseFloat(b.disc_amount) || 0,
        delay_or_early: b.delay_or_early || false,
        interest_per: parseFloat(b.interest_per) || 0,
        interest_amount: parseFloat(b.interest_amount) || 0,
        net_amount: parseFloat(b.net_amount) || 0,
        entry_type: b.entry_type || "PU",
        closed: b.closed || false,
        credit: parseFloat(b.credit) || 0,
      })),
      payment_modes: paymentModes.map((m, i) => ({
        entry_order_id: i + 1,
        pay_mode_type: payModeType,
        bank_id: parseInt(m.bank_id) || 0,
        set_no: m.set_no || "",
        payable_at: parseInt(m.payable_at) || 1,
        dd_or_cheque_no: m.dd_or_cheque_no || "",
        dd_or_cheque_date: m.dd_or_cheque_date,
        amount: parseFloat(m.amount) || grandNetAmount,
      })),
      payment_taxes: addLessDetails.map((t, i) => ({
        entry_order_id: i + 1,
        entry_type: "PY",
        tax_type_code: 1,
        add_or_less_type: t.type === "+",
        tax_on_amount: parseFloat(t.amount_on) || 0,
        tax_percent: parseFloat(t.percent) || 0,
        amount: parseFloat(t.amount) || 0,
        round_off: parseFloat(t.round_off) || 0,
        net_amount: parseFloat(t.net_amount) || 0,
      })),
    };

    try {
      setLoading(true);
      const res = await axios.post(`${API_ROOT}/payment-entry/`, payload);
      alert(`Payment Entry ${res.data.entry_no || entryNo} saved successfully!`);
      // Reset form
      setBills([]);
      setAdvances([]);
      fetchNextEntryNo(locationId);
    } catch (err) {
      console.error("Save payment error:", err);
      alert("Error saving Payment Entry: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pay-container">
      <fieldset className="pay-fieldset">
        <legend className="pay-legend">PAYMENT ENTRY</legend>

        {/* TOP FILTER & HEADER SECTION */}
        <div className="pay-top-grid">
          {/* Col 1 */}
          <div className="pay-col">
            <div className="pay-row">
              <label className="pay-lbl">Location</label>
              <select
                className="pay-sel"
                value={locationId}
                onChange={(e) => {
                  const lId = Number(e.target.value);
                  setLocationId(lId);
                  fetchNextEntryNo(lId);
                }}
              >
                {locations.map((loc) => (
                  <option key={loc.location_id || loc.id} value={loc.location_id || loc.id}>
                    {loc.location_name || loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pay-row">
              <label className="pay-lbl">Company</label>
              <select
                className="pay-sel"
                value={companyId}
                onChange={(e) => setCompanyId(Number(e.target.value))}
              >
                <option value="">[SELECT]</option>
                {companies.map((c) => (
                  <option key={c.company_id || c.id} value={c.company_id || c.id}>
                    {c.company_name || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pay-row pay-date-range-row">
              <label className="pay-chk-lbl">
                <input
                  type="checkbox"
                  checked={incDate}
                  onChange={(e) => setIncDate(e.target.checked)}
                />
                Inc
              </label>
              <label className="pay-lbl-inline">From Date</label>
              <input
                type="date"
                className="pay-inp pay-date-inp"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                disabled={!incDate}
              />
            </div>
          </div>

          {/* Col 2 */}
          <div className="pay-col">
            <div className="pay-row">
              <label className="pay-lbl">Supplier</label>
              <select
                className="pay-sel"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">[SELECT]</option>
                {suppliers.map((s) => (
                  <option key={s.supplier_id || s.id} value={s.supplier_id || s.id}>
                    {s.supplier_name || s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pay-row">
              <label className="pay-lbl">Posted By</label>
              <select
                className="pay-sel"
                value={postedBy}
                onChange={(e) => setPostedBy(e.target.value)}
              >
                <option value="">[SELECT]</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id || emp.id} value={emp.employee_id || emp.id}>
                    {emp.employee_name || emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pay-row">
              <label className="pay-lbl">To Date</label>
              <input
                type="date"
                className="pay-inp pay-date-inp"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                disabled={!incDate}
              />
            </div>
          </div>

          {/* Col 3 */}
          <div className="pay-col pay-col-submit">
            <div className="pay-row">
              <label className="pay-lbl">Entry No</label>
              <input
                type="text"
                className="pay-inp pay-ro"
                readOnly
                value={entryNo}
              />
            </div>

            <div className="pay-row">
              <label className="pay-lbl">Entry Date</label>
              <input
                type="date"
                className="pay-inp pay-date-inp"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>

            <div className="pay-submit-wrap">
              <button
                type="button"
                className="pay-btn pay-btn-submit"
                onClick={handleSubmitQuery}
                disabled={loading}
              >
                {loading ? "Searching..." : "Submit"}
              </button>
            </div>
          </div>
        </div>

        {statusMsg && <div className="pay-status-note">{statusMsg}</div>}

        {/* MIDDLE GRID: CREDIT / DEBIT */}
        <div className="pay-grid-header-label">CREDIT / DEBIT</div>
        <div className="pay-grid-wrap pay-credit-debit-grid">
          <table className="pay-table">
            <thead>
              <tr>
                <th style={{ width: "25px" }}>#</th>
                <th style={{ width: "70px" }}>EntryNo</th>
                <th style={{ width: "70px" }}>EntryDate</th>
                <th style={{ width: "75px" }}>InvoiceNo</th>
                <th style={{ width: "70px" }}>InvoiceDate</th>
                <th style={{ width: "65px", textAlign: "right" }}>InvAmount</th>
                <th style={{ width: "65px", textAlign: "right" }}>PaidAmount</th>
                <th style={{ width: "55px", textAlign: "right" }}>Credit</th>
                <th style={{ width: "55px", textAlign: "right" }}>Debit</th>
                <th style={{ width: "60px", textAlign: "right" }}>Balance</th>
                <th style={{ width: "45px", textAlign: "center" }}>Closed</th>
                <th style={{ width: "65px", textAlign: "right" }}>NetAmount</th>
                <th style={{ width: "50px" }}>EntryType</th>
                <th style={{ width: "50px", textAlign: "right" }}>CD (%)</th>
                <th style={{ width: "55px", textAlign: "right" }}>CD Amount</th>
                <th style={{ width: "65px" }}>Agent</th>
                <th style={{ width: "50px", textAlign: "right" }}>Agent %</th>
                <th style={{ width: "55px", textAlign: "right" }}>Agent Amt</th>
                <th style={{ width: "50px", textAlign: "right" }}>Disc %</th>
                <th style={{ width: "55px", textAlign: "right" }}>Disc Amt</th>
                <th style={{ width: "50px", textAlign: "center" }}>Delay/Early</th>
                <th style={{ width: "50px", textAlign: "right" }}>Interes...</th>
                <th style={{ width: "55px", textAlign: "right" }}>Interest...</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={23} className="pay-empty">
                    Click 'Submit' to query outstanding bills for the selected supplier.
                  </td>
                </tr>
              ) : (
                bills.map((b, idx) => (
                  <tr key={b.keyId}>
                    <td>{idx + 1}</td>
                    <td>{b.entry_no}</td>
                    <td>{b.entry_date}</td>
                    <td>{b.inv_no}</td>
                    <td>{b.inv_date}</td>
                    <td style={{ textAlign: "right" }}>{b.inv_amount}</td>
                    <td>
                      <input
                        type="number"
                        className="pay-cell-input"
                        value={b.paid_amount}
                        onChange={(e) => updateBillField(idx, "paid_amount", e.target.value)}
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>{b.credit}</td>
                    <td style={{ textAlign: "right" }}>{b.debit}</td>
                    <td style={{ textAlign: "right" }}>{b.balance}</td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={b.closed || false}
                        onChange={(e) => updateBillField(idx, "closed", e.target.checked)}
                      />
                    </td>
                    <td style={{ textAlign: "right", fontWeight: "600" }}>{b.net_amount}</td>
                    <td>{b.entry_type}</td>
                    <td>
                      <input
                        type="number"
                        className="pay-cell-input"
                        value={b.cd_percentage}
                        onChange={(e) => updateBillField(idx, "cd_percentage", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="pay-cell-input"
                        value={b.cd_amount}
                        onChange={(e) => updateBillField(idx, "cd_amount", e.target.value)}
                      />
                    </td>
                    <td>{b.agent_id || "-"}</td>
                    <td style={{ textAlign: "right" }}>{b.agent_per}</td>
                    <td style={{ textAlign: "right" }}>{b.agent_amount}</td>
                    <td>
                      <input
                        type="number"
                        className="pay-cell-input"
                        value={b.disc_per}
                        onChange={(e) => updateBillField(idx, "disc_per", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="pay-cell-input"
                        value={b.disc_amount}
                        onChange={(e) => updateBillField(idx, "disc_amount", e.target.value)}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={b.delay_or_early || false}
                        onChange={(e) => updateBillField(idx, "delay_or_early", e.target.checked)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="pay-cell-input"
                        value={b.interest_per}
                        onChange={(e) => updateBillField(idx, "interest_per", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="pay-cell-input"
                        value={b.interest_amount}
                        onChange={(e) => updateBillField(idx, "interest_amount", e.target.value)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM SPLIT SECTION */}
        <div className="pay-bottom-split">
          {/* Left Side: 3 Sub-Tabs */}
          <div className="pay-subtab-container">
            <div className="pay-subtab-strip">
              <button
                type="button"
                className={`pay-subtab-btn ${bottomTab === "add_less" ? "active" : ""}`}
                onClick={() => setBottomTab("add_less")}
              >
                Add / Less
              </button>
              <button
                type="button"
                className={`pay-subtab-btn ${bottomTab === "advance" ? "active" : ""}`}
                onClick={() => setBottomTab("advance")}
              >
                Advance
              </button>
              <button
                type="button"
                className={`pay-subtab-btn ${bottomTab === "payment_detail" ? "active" : ""}`}
                onClick={() => setBottomTab("payment_detail")}
              >
                Payment Detail
              </button>
            </div>

            {/* Sub-Tab 1: Payment Detail */}
            {bottomTab === "payment_detail" && (
              <div className="pay-subtab-content">
                <div className="pay-radio-mode-row">
                  <label className="pay-radio-lbl">
                    <input
                      type="radio"
                      name="payMode"
                      value="CS"
                      checked={payModeType === "CS"}
                      onChange={() => setPayModeType("CS")}
                    />
                    CASH
                  </label>
                  <label className="pay-radio-lbl">
                    <input
                      type="radio"
                      name="payMode"
                      value="CQ"
                      checked={payModeType === "CQ"}
                      onChange={() => setPayModeType("CQ")}
                    />
                    CHEQUE
                  </label>
                  <label className="pay-radio-lbl">
                    <input
                      type="radio"
                      name="payMode"
                      value="UP"
                      checked={payModeType === "UP"}
                      onChange={() => setPayModeType("UP")}
                    />
                    UPI
                  </label>
                  <button type="button" className="pay-sub-btn" onClick={addPaymentModeRow}>
                    + Add Mode
                  </button>
                </div>

                <div className="pay-grid-wrap pay-mode-grid">
                  <table className="pay-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>#</th>
                        <th style={{ width: "130px" }}>Bank</th>
                        <th style={{ width: "80px" }}>SetNo</th>
                        <th style={{ width: "90px" }}>ChequeNo</th>
                        <th style={{ width: "95px" }}>Cheque Date</th>
                        <th style={{ width: "90px" }}>PayAt</th>
                        <th style={{ width: "85px", textAlign: "right" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentModes.map((pm, idx) => (
                        <tr key={pm.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <select
                              className="pay-cell-select"
                              value={pm.bank_id}
                              onChange={(e) => updatePaymentMode(idx, "bank_id", e.target.value)}
                            >
                              {banks.map((b) => (
                                <option key={b.bank_id || b.id} value={b.bank_id || b.id}>
                                  {b.bank_name || b.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="pay-cell-input"
                              value={pm.set_no}
                              onChange={(e) => updatePaymentMode(idx, "set_no", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="pay-cell-input"
                              value={pm.dd_or_cheque_no}
                              onChange={(e) => updatePaymentMode(idx, "dd_or_cheque_no", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="pay-cell-input"
                              value={pm.dd_or_cheque_date}
                              onChange={(e) => updatePaymentMode(idx, "dd_or_cheque_date", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="pay-cell-input"
                              value={pm.payable_at}
                              onChange={(e) => updatePaymentMode(idx, "payable_at", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="pay-cell-input"
                              value={pm.amount}
                              onChange={(e) => updatePaymentMode(idx, "amount", e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Advance */}
            {bottomTab === "advance" && (
              <div className="pay-subtab-content">
                <div className="pay-grid-wrap pay-advance-grid">
                  <table className="pay-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>#</th>
                        <th style={{ width: "120px" }}>Entry No</th>
                        <th style={{ width: "100px" }}>Entry Date</th>
                        <th style={{ width: "100px", textAlign: "right" }}>Amount</th>
                        <th style={{ width: "120px" }}>DD/Cheque</th>
                        <th style={{ width: "60px", textAlign: "center" }}>Closed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advances.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="pay-empty">
                            No unadjusted advances found for this supplier.
                          </td>
                        </tr>
                      ) : (
                        advances.map((adv, idx) => (
                          <tr key={adv.keyId}>
                            <td>{idx + 1}</td>
                            <td>{adv.entry_no}</td>
                            <td>{adv.entry_date}</td>
                            <td style={{ textAlign: "right" }}>{adv.amount}</td>
                            <td>{adv.dd_cheque}</td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="checkbox"
                                checked={adv.closed || false}
                                onChange={() => toggleAdvanceRow(idx)}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Add / Less */}
            {bottomTab === "add_less" && (
              <div className="pay-subtab-content">
                <div className="pay-panel-header">
                  <span className="pay-panel-title">Add / Less Adjustments</span>
                  <button type="button" className="pay-sub-btn" onClick={addAddLessRow}>
                    + Add Charge
                  </button>
                </div>
                <div className="pay-grid-wrap pay-addless-grid">
                  <table className="pay-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>#</th>
                        <th style={{ width: "120px" }}>Particulars</th>
                        <th style={{ width: "40px" }}>Type</th>
                        <th style={{ width: "55px", textAlign: "right" }}>Percent</th>
                        <th style={{ width: "75px", textAlign: "right" }}>AmountOn</th>
                        <th style={{ width: "75px", textAlign: "right" }}>Amount</th>
                        <th style={{ width: "60px", textAlign: "right" }}>RoundOff</th>
                        <th style={{ width: "80px", textAlign: "right" }}>NetAmount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addLessDetails.map((al, idx) => (
                        <tr key={al.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <select
                              className="pay-cell-select"
                              value={al.particulars}
                              onChange={(e) => updateAddLessField(idx, "particulars", e.target.value)}
                            >
                              <option value="Discount">Discount</option>
                              <option value="Hamali">Hamali</option>
                              <option value="Freight">Freight</option>
                              <option value="Interest">Interest</option>
                              <option value="Round Off">Round Off</option>
                            </select>
                          </td>
                          <td>
                            <select
                              className="pay-cell-select"
                              value={al.type}
                              onChange={(e) => updateAddLessField(idx, "type", e.target.value)}
                            >
                              <option value="-">-</option>
                              <option value="+">+</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="pay-cell-input"
                              value={al.percent}
                              onChange={(e) => updateAddLessField(idx, "percent", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="pay-cell-input"
                              value={al.amount_on}
                              onChange={(e) => updateAddLessField(idx, "amount_on", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="pay-cell-input"
                              value={al.amount}
                              onChange={(e) => updateAddLessField(idx, "amount", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="pay-cell-input"
                              value={al.round_off}
                              onChange={(e) => updateAddLessField(idx, "round_off", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "right", fontWeight: "600" }}>{al.net_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Summary Sidebar */}
          <div className="pay-summary-sidebar">
            <div className="pay-summary-row">
              <label>SUB TOTAL</label>
              <input type="text" className="pay-inp pay-ro" readOnly value={subTotal.toFixed(2)} />
            </div>
            <div className="pay-summary-row">
              <label>LESS DISC</label>
              <input type="text" className="pay-inp pay-ro" readOnly value={lessDisc.toFixed(2)} />
            </div>
            <div className="pay-summary-row">
              <label>LESS CREDIT</label>
              <input type="text" className="pay-inp pay-ro" readOnly value={lessCredit.toFixed(2)} />
            </div>
            <div className="pay-summary-row">
              <label>LESS ADVANCE</label>
              <input type="text" className="pay-inp pay-ro" readOnly value={lessAdvance.toFixed(2)} />
            </div>
            <div className="pay-summary-row">
              <label>LESS INTEREST</label>
              <input type="text" className="pay-inp pay-ro" readOnly value={lessInterest.toFixed(2)} />
            </div>
            <div className="pay-summary-row">
              <label>ADD/LESS</label>
              <input type="text" className="pay-inp pay-ro" readOnly value={totalAddLess.toFixed(2)} />
            </div>
            <div className="pay-summary-row pay-net-amount-row">
              <label>NET AMOUNT</label>
              <input type="text" className="pay-inp pay-net-inp" readOnly value={grandNetAmount} />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="pay-footer-action-bar">
          <button
            type="button"
            className="pay-win-btn pay-btn-ok"
            onClick={handleSave}
            disabled={loading}
          >
            💾 OK
          </button>
          <button
            type="button"
            className="pay-win-btn pay-btn-close"
            onClick={onExit}
          >
            ❌ Close
          </button>
        </div>
      </fieldset>
    </div>
  );
}
