// frontend/src/Component/Transaction/GiftVoucher/GiftVoucherCancel.jsx
import React, { useState, useEffect } from "react";
import "./GiftVoucherCancel.css";

const GiftVoucherCancel = ({ onClose, onExit }) => {
  const [locations, setLocations] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [locationCode, setLocationCode] = useState(1);
  const [customerCode, setCustomerCode] = useState(0);
  const [entryDate, setEntryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [vouchers, setVouchers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load locations and customers
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const locRes = await fetch("/locations/");
        if (locRes.ok) {
          const locData = await locRes.json();
          const list = Array.isArray(locData) ? locData : locData.results || [];
          setLocations(list);
          if (list.length > 0) setLocationCode(list[0].code || 1);
        }

        const custRes = await fetch("/customers/");
        if (custRes.ok) {
          const custData = await custRes.json();
          const list = Array.isArray(custData) ? custData : custData.results || [];
          setCustomers(list);
        }
      } catch (err) {
        console.error("Master data fetch failed:", err);
      }
    };
    fetchMasters();
  }, []);

  // Load vouchers handler
  const handleLoad = async () => {
    try {
      setLoading(true);
      let url = `/api/gift-voucher-cancel/load-issued-vouchers/?location_code=${locationCode}`;
      if (customerCode && customerCode !== "0") {
        url += `&customer_code=${customerCode}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVouchers(Array.isArray(data) ? data : []);
        setSelectAll(false);
        if (Array.isArray(data) && data.length === 0) {
          alert("No active issued vouchers found for the selected criteria.");
        }
      }
    } catch (err) {
      console.error("Load vouchers error:", err);
      alert("Failed to load vouchers.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle single voucher selection
  const handleToggleSelect = (index) => {
    const updated = [...vouchers];
    updated[index].selected = !updated[index].selected;
    setVouchers(updated);
    setSelectAll(updated.every((v) => v.selected));
  };

  // Toggle select all
  const handleToggleSelectAll = (checked) => {
    setSelectAll(checked);
    const updated = vouchers.map((v) => ({ ...v, selected: checked }));
    setVouchers(updated);
  };

  // Ok handler (Cancel Selected)
  const handleOk = async () => {
    const selectedVouchers = vouchers.filter((v) => v.selected);
    if (selectedVouchers.length === 0) {
      alert("Please select at least one voucher to cancel.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to cancel the ${selectedVouchers.length} selected gift voucher(s)?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        vouchers: selectedVouchers.map((v) => ({
          entry_id: v.entry_id,
          voucher_no: v.voucher_no,
          amount: v.voucher_amount,
          days: v.validity_days,
        })),
        user_id: 1,
        cancel_date: entryDate,
      };

      const res = await fetch("/api/gift-voucher-cancel/cancel-vouchers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || "Vouchers cancelled successfully.");
        // Remove cancelled vouchers from table
        const remaining = vouchers.filter((v) => !v.selected);
        setVouchers(remaining);
        setSelectAll(false);
      } else {
        alert(data.message || "Failed to cancel vouchers.");
      }
    } catch (err) {
      console.error("Cancel vouchers error:", err);
      alert("Error cancelling vouchers.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else if (onExit) onExit();
  };

  return (
    <div className="gvc-container">
      <fieldset className="gvc-fieldset">
        <legend className="gvc-legend">Gift Voucher Cancel</legend>

        {/* Top Filter Controls */}
        <div className="gvc-filter-row">
          <div className="gvc-item">
            <span className="gvc-label">Location</span>
            <select
              className="gvc-select"
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

          <div className="gvc-item">
            <span className="gvc-label">Customer Name</span>
            <select
              className="gvc-select gvc-select-wide"
              value={customerCode}
              onChange={(e) => setCustomerCode(e.target.value)}
            >
              <option value="0">-- All Customers --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || `Customer #${c.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="gvc-item">
            <span className="gvc-label">Entry Date</span>
            <input
              type="date"
              className="gvc-input"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="gvc-btn-load"
            onClick={handleLoad}
            disabled={loading}
          >
            Load
          </button>
        </div>

        {/* Data Grid Table */}
        <div className="gvc-table-wrap">
          <table className="gvc-table">
            <thead>
              <tr>
                <th>Entry No</th>
                <th>ISSUE NO</th>
                <th>Voucher No</th>
                <th>Validity Days</th>
                <th>Voucher Amount</th>
                <th style={{ width: "60px" }}>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleToggleSelectAll(e.target.checked)}
                      disabled={vouchers.length === 0}
                    />
                    <span>Select</span>
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-records">
                    No vouchers loaded. Click 'Load' to fetch active issued vouchers.
                  </td>
                </tr>
              ) : (
                vouchers.map((v, idx) => (
                  <tr key={`${v.entry_id}-${v.voucher_no}`}>
                    <td>{v.entry_no}</td>
                    <td>{v.issue_no}</td>
                    <td style={{ fontWeight: 600 }}>{v.voucher_no}</td>
                    <td className="text-center">{v.validity_days}</td>
                    <td className="text-right">{v.voucher_amount.toFixed(2)}</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={v.selected || false}
                        onChange={() => handleToggleSelect(idx)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="gvc-actions">
          <button
            type="button"
            className="gvc-btn"
            onClick={handleOk}
            disabled={loading || vouchers.filter((v) => v.selected).length === 0}
          >
            Ok
          </button>
          <button
            type="button"
            className="gvc-btn"
            onClick={handleClose}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default GiftVoucherCancel;
