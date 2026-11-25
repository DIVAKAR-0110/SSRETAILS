// frontend/src/Component/Transaction/LoyalityCard/LoyaltyBlock.jsx
import React, { useState } from "react";
import "./LoyaltyBlock.css";

const LoyaltyBlock = ({ onClose }) => {
  const [option, setOption] = useState("Issue"); // "Issue" | "Block" | "Merge"
  const [entryDate, setEntryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [loyaltyCardNo, setLoyaltyCardNo] = useState("");
  const [customer, setCustomer] = useState("");
  const [customerCode, setCustomerCode] = useState(0);
  const [mergeCardNo, setMergeCardNo] = useState("");
  const [reason, setReason] = useState("Card Issued");
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Auto-update default reason when option changes
  const handleOptionChange = (newOpt) => {
    setOption(newOpt);
    if (newOpt === "Issue") {
      setReason("Card Issued");
      setMergeCardNo("");
    } else if (newOpt === "Block") {
      setReason("Card Blocked");
      setMergeCardNo("");
    } else if (newOpt === "Merge") {
      setReason("Card Merged");
    }
  };

  // Card lookup on blur or Enter
  const handleCardLookup = async () => {
    const trimmed = loyaltyCardNo.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/loyalty-card-update/lookup/?card_no=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.found && data.card) {
          if (data.card.customer_name) {
            setCustomer(data.card.customer_name);
          }
          if (data.card.customer_code) {
            setCustomerCode(data.card.customer_code);
          }
          if (data.card.reason && !reason) {
            setReason(data.card.reason);
          }
          setStatusMsg({
            text: `Card loaded: ${trimmed} (Status: ${data.card.cancel ? "Blocked" : data.card.issued ? "Issued" : "Active"})`,
            type: "success",
          });
        } else {
          setStatusMsg({
            text: data.message || `Card ${trimmed} not found in database.`,
            type: "error",
          });
        }
      }
    } catch (err) {
      console.error("Card lookup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save handler
  const handleSave = async () => {
    const trimmedCard = loyaltyCardNo.trim();
    if (!trimmedCard) {
      alert("Please enter Loyalty CardNo.");
      return;
    }
    if (option === "Merge" && !mergeCardNo.trim()) {
      alert("Please enter Merge CardNo for merging.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        option: option,
        date: entryDate,
        loyalty_card_no: trimmedCard,
        customer_code: customerCode,
        customer_name: customer.trim(),
        merge_card_no: mergeCardNo.trim(),
        reason: reason.trim(),
        user_id: 1,
      };

      const res = await fetch("/api/loyalty-card-update/update-card/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ text: data.message || "Saved successfully!", type: "success" });
        alert(data.message || `Card ${trimmedCard} updated successfully (${option}).`);
      } else {
        setStatusMsg({ text: data.message || "Failed to save.", type: "error" });
        alert(data.message || "Failed to update loyalty card.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setStatusMsg({ text: "Error saving loyalty card.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    setLoyaltyCardNo("");
    setCustomer("");
    setCustomerCode(0);
    setMergeCardNo("");
    handleOptionChange("Issue");
    setStatusMsg({ text: "", type: "" });
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="loyalty-container">
      <fieldset className="loyalty-fieldset">
        <legend className="loyalty-legend">Loyalty Card</legend>

        <div className="loyalty-form">
          {/* Option Radio Row */}
          <div className="loyalty-row">
            <span className="loyalty-label">Option</span>
            <div className="loyalty-control">
              <div className="loyalty-radio-group">
                <label className="loyalty-radio-label">
                  <input
                    type="radio"
                    name="loyaltyOption"
                    value="Issue"
                    checked={option === "Issue"}
                    onChange={() => handleOptionChange("Issue")}
                  />
                  <span>Issue</span>
                </label>
                <label className="loyalty-radio-label">
                  <input
                    type="radio"
                    name="loyaltyOption"
                    value="Block"
                    checked={option === "Block"}
                    onChange={() => handleOptionChange("Block")}
                  />
                  <span>Block</span>
                </label>
                <label className="loyalty-radio-label">
                  <input
                    type="radio"
                    name="loyaltyOption"
                    value="Merge"
                    checked={option === "Merge"}
                    onChange={() => handleOptionChange("Merge")}
                  />
                  <span>Merge</span>
                </label>
              </div>
            </div>
          </div>

          {/* Date Row */}
          <div className="loyalty-row">
            <span className="loyalty-label">Date</span>
            <div className="loyalty-control">
              <input
                type="date"
                className="loyalty-date-input"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>
          </div>

          {/* Loyalty CardNo Row */}
          <div className="loyalty-row">
            <span className="loyalty-label">Loyalty CardNo</span>
            <div className="loyalty-control">
              <input
                type="text"
                className="loyalty-input"
                value={loyaltyCardNo}
                onChange={(e) => setLoyaltyCardNo(e.target.value)}
                onBlur={handleCardLookup}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCardLookup();
                }}
                placeholder="Enter Card No..."
              />
            </div>
          </div>

          {/* Customer Row */}
          <div className="loyalty-row">
            <span className="loyalty-label">Customer</span>
            <div className="loyalty-control">
              <input
                type="text"
                className="loyalty-input"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Customer Name or Code"
              />
            </div>
          </div>

          {/* Merge CardNo Row */}
          <div className="loyalty-row">
            <span className="loyalty-label">Merge CardNo</span>
            <div className="loyalty-control">
              <input
                type="text"
                className="loyalty-input"
                value={mergeCardNo}
                onChange={(e) => setMergeCardNo(e.target.value)}
                disabled={option !== "Merge"}
                placeholder={option === "Merge" ? "Enter Target Card No..." : ""}
              />
            </div>
          </div>

          {/* Reason Row */}
          <div className="loyalty-row">
            <span className="loyalty-label">Reason</span>
            <div className="loyalty-control">
              <input
                type="text"
                className="loyalty-input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter Reason..."
              />
            </div>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg.text && (
          <div className={`loyalty-status ${statusMsg.type}`}>
            {statusMsg.text}
          </div>
        )}

        {/* Buttons Row */}
        <div className="loyalty-actions">
          <button
            type="button"
            className="loyalty-btn"
            onClick={handleSave}
            disabled={loading}
          >
            Save
          </button>
          <button
            type="button"
            className="loyalty-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default LoyaltyBlock;
