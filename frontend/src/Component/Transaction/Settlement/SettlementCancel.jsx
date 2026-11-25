// frontend/src/Component/Transaction/Settlement/SettlementCancel.jsx
import React, { useState, useEffect } from "react";
import "./SettlementCancel.css";

const SettlementCancel = ({ onClose, onExit }) => {
  const [entryDate, setEntryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [activeSettlements, setActiveSettlements] = useState([]);
  const [selectedSettlementId, setSelectedSettlementId] = useState("");

  const [bills, setBills] = useState([]);
  const [discAmt, setDiscAmt] = useState(0.0);
  const [roundOff, setRoundOff] = useState(0.0);
  const [netAmount, setNetAmount] = useState(0.0);

  const [loading, setLoading] = useState(false);

  // Load active settlements whenever entryDate changes
  useEffect(() => {
    const fetchActiveSettlements = async () => {
      try {
        setLoading(true);
        setSelectedSettlementId("");
        setBills([]);
        setDiscAmt(0.0);
        setRoundOff(0.0);
        setNetAmount(0.0);

        const res = await fetch(`/api/settlement-cancel/active-settlements/?date=${entryDate}`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];
          setActiveSettlements(list);
          if (list.length > 0) {
            setSelectedSettlementId(list[0].entry_id);
          }
        }
      } catch (err) {
        console.error("Failed to load active settlements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveSettlements();
  }, [entryDate]);

  // Load settlement details when selected settlement changes
  useEffect(() => {
    if (!selectedSettlementId) {
      setBills([]);
      setDiscAmt(0.0);
      setRoundOff(0.0);
      setNetAmount(0.0);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/settlement-cancel/settlement-details/?entry_id=${selectedSettlementId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setBills(data.bills || []);
            if (data.header) {
              setDiscAmt(data.header.disc_amt || 0.0);
              setRoundOff(data.header.round_off || 0.0);
              setNetAmount(data.header.net_amount || 0.0);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch settlement details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [selectedSettlementId]);

  // Calculate total bills amount
  const totalBillAmount = bills.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);

  // Save (Cancel Settlement) handler
  const handleSave = async () => {
    if (!selectedSettlementId) {
      alert("Please select a Settlement No to cancel.");
      return;
    }

    const currentSet = activeSettlements.find((s) => s.entry_id === selectedSettlementId);
    const setNo = currentSet ? currentSet.entry_no : selectedSettlementId;

    if (
      !window.confirm(
        `Are you sure you want to cancel Settlement ${setNo}? This will revert settled bills to un-settled status.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/settlement-cancel/cancel-settlement/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry_id: selectedSettlementId,
          user_id: 1,
          cancel_date: entryDate,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || `Settlement ${setNo} cancelled successfully.`);
        // Remove from list
        const remaining = activeSettlements.filter((s) => s.entry_id !== selectedSettlementId);
        setActiveSettlements(remaining);
        if (remaining.length > 0) {
          setSelectedSettlementId(remaining[0].entry_id);
        } else {
          setSelectedSettlementId("");
          setBills([]);
          setDiscAmt(0.0);
          setRoundOff(0.0);
          setNetAmount(0.0);
        }
      } else {
        alert(data.message || "Failed to cancel settlement.");
      }
    } catch (err) {
      console.error("Cancel settlement error:", err);
      alert("Error cancelling settlement.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else if (onExit) onExit();
  };

  return (
    <div className="setcan-container">
      {/* Top Controls */}
      <div className="setcan-top-section">
        <div className="setcan-row">
          <span className="setcan-label">Entry Date</span>
          <input
            type="date"
            className="setcan-input"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
        </div>

        <div className="setcan-row">
          <span className="setcan-label">Settlement No</span>
          <select
            className="setcan-select"
            value={selectedSettlementId}
            onChange={(e) => setSelectedSettlementId(e.target.value)}
          >
            {activeSettlements.length === 0 ? (
              <option value="">-- No Active Settlements --</option>
            ) : (
              activeSettlements.map((s) => (
                <option key={s.entry_id} value={s.entry_id}>
                  {s.entry_no}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Settlement Details Header */}
      <div className="setcan-section-title">Settlement Details:</div>

      {/* Data Table */}
      <div className="setcan-table-wrap">
        <table className="setcan-table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}></th>
              <th>Bill No</th>
              <th>Entry Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-records">
                  {selectedSettlementId ? "No bills associated with this settlement." : "Select a Settlement No to view details."}
                </td>
              </tr>
            ) : (
              bills.map((b, idx) => (
                <tr key={`${b.bill_no}-${idx}`}>
                  <td className="setcan-row-idx">▸ {idx + 1}</td>
                  <td>{b.bill_no}</td>
                  <td className="text-center">{b.entry_date}</td>
                  <td className="text-right">{parseFloat(b.amount || 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Total */}
      <div className="setcan-table-footer">
        <div className="setcan-footer-box">{totalBillAmount.toFixed(2)}</div>
      </div>

      {/* Summary Row */}
      <div className="setcan-summary-row">
        <div className="setcan-summary-item">
          <span className="setcan-summary-label">DISC. AMOUNT</span>
          <input
            type="text"
            className="setcan-summary-input"
            value={discAmt.toFixed(2)}
            readOnly
          />
        </div>

        <div className="setcan-summary-item">
          <span className="setcan-summary-label">ROUND OFF</span>
          <input
            type="text"
            className="setcan-summary-input"
            value={roundOff.toFixed(2)}
            readOnly
          />
        </div>

        <div className="setcan-summary-item">
          <span className="setcan-summary-label">NET AMOUNT</span>
          <input
            type="text"
            className="setcan-summary-input"
            value={netAmount.toFixed(2)}
            readOnly
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="setcan-actions">
        <button
          type="button"
          className="setcan-btn setcan-btn-save"
          onClick={handleSave}
          disabled={loading || !selectedSettlementId}
        >
          Save
        </button>
        <button
          type="button"
          className="setcan-btn setcan-btn-close"
          onClick={handleClose}
          disabled={loading}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettlementCancel;
