// frontend/src/Component/Transaction/Settlement/ManualVoucherCancel.jsx
import React, { useState, useEffect } from "react";
import "./ManualVoucherCancel.css";

const ManualVoucherCancel = ({ onClose, onExit }) => {
  const [entryDate, setEntryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [activeVouchers, setActiveVouchers] = useState([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState("");

  const [voucherDetail, setVoucherDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load active manual vouchers whenever entryDate changes
  useEffect(() => {
    const fetchActiveVouchers = async () => {
      try {
        setLoading(true);
        setSelectedVoucherId("");
        setVoucherDetail(null);

        const res = await fetch(`/api/manual-voucher-cancel/active-vouchers/?date=${entryDate}`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];
          setActiveVouchers(list);
          if (list.length > 0) {
            setSelectedVoucherId(list[0].entry_id);
          }
        }
      } catch (err) {
        console.error("Failed to load active manual vouchers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveVouchers();
  }, [entryDate]);

  // Load voucher details when selected voucher changes
  useEffect(() => {
    if (!selectedVoucherId) {
      setVoucherDetail(null);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/manual-voucher-cancel/voucher-details/?entry_id=${selectedVoucherId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.voucher) {
            setVoucherDetail(data.voucher);
          }
        }
      } catch (err) {
        console.error("Failed to fetch voucher details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [selectedVoucherId]);

  // Save (Cancel Manual Voucher) handler
  const handleSave = async () => {
    if (!selectedVoucherId) {
      alert("Please select a Voucher No to cancel.");
      return;
    }

    const currentVch = activeVouchers.find((v) => v.entry_id === selectedVoucherId);
    const vchNo = currentVch ? currentVch.entry_no : selectedVoucherId;

    if (
      !window.confirm(
        `Are you sure you want to cancel Manual Voucher ${vchNo}?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/manual-voucher-cancel/cancel-voucher/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry_id: selectedVoucherId,
          user_id: 1,
          cancel_date: entryDate,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || `Manual voucher ${vchNo} cancelled successfully.`);
        // Remove from list
        const remaining = activeVouchers.filter((v) => v.entry_id !== selectedVoucherId);
        setActiveVouchers(remaining);
        if (remaining.length > 0) {
          setSelectedVoucherId(remaining[0].entry_id);
        } else {
          setSelectedVoucherId("");
          setVoucherDetail(null);
        }
      } else {
        alert(data.message || "Failed to cancel manual voucher.");
      }
    } catch (err) {
      console.error("Cancel voucher error:", err);
      alert("Error cancelling manual voucher.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else if (onExit) onExit();
  };

  const totalAmount = voucherDetail ? parseFloat(voucherDetail.voucher_amount || 0) : 0.0;

  return (
    <div className="mvc-container">
      {/* Top Controls */}
      <div className="mvc-top-section">
        <div className="mvc-row">
          <span className="mvc-label">EntryDate</span>
          <input
            type="date"
            className="mvc-input"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
        </div>

        <div className="mvc-row">
          <span className="mvc-label">Voucher No</span>
          <select
            className="mvc-select"
            value={selectedVoucherId}
            onChange={(e) => setSelectedVoucherId(e.target.value)}
          >
            {activeVouchers.length === 0 ? (
              <option value="">-- No Active Vouchers --</option>
            ) : (
              activeVouchers.map((v) => (
                <option key={v.entry_id} value={v.entry_id}>
                  {v.entry_no}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Section Title */}
      <div className="mvc-section-title">Voucher Details</div>

      {/* Data Table */}
      <div className="mvc-table-wrap">
        <table className="mvc-table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}></th>
              <th>Cashier</th>
              <th>IssueSettlementNo</th>
              <th>IssueSettlementDate</th>
              <th>VoucherAmount</th>
            </tr>
          </thead>
          <tbody>
            {!voucherDetail ? (
              <tr>
                <td colSpan="5" className="no-records">
                  {selectedVoucherId ? "Loading voucher details..." : "Select a Voucher No to view details."}
                </td>
              </tr>
            ) : (
              <tr>
                <td className="mvc-row-idx">▸ 1</td>
                <td>{voucherDetail.cashier_name || "N/A"}</td>
                <td>{voucherDetail.issue_settlement_no || "N/A"}</td>
                <td className="text-center">{voucherDetail.issue_settlement_date || "N/A"}</td>
                <td className="text-right">{parseFloat(voucherDetail.voucher_amount || 0).toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary: Total Voucher Amount */}
      <div className="mvc-summary-row">
        <span className="mvc-summary-label">Total Voucher Amount</span>
        <input
          type="text"
          className="mvc-summary-input"
          value={totalAmount.toFixed(2)}
          readOnly
        />
      </div>

      {/* Action Buttons */}
      <div className="mvc-actions">
        <button
          type="button"
          className="mvc-btn mvc-btn-save"
          onClick={handleSave}
          disabled={loading || !selectedVoucherId}
        >
          Save
        </button>
        <button
          type="button"
          className="mvc-btn mvc-btn-close"
          onClick={handleClose}
          disabled={loading}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ManualVoucherCancel;
