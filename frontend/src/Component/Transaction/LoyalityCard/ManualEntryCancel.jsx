// frontend/src/Component/Transaction/LoyalityCard/ManualEntryCancel.jsx
import React, { useState, useEffect } from "react";
import "./ManualEntryCancel.css";

const ManualEntryCancel = ({ onClose }) => {
  const [cancelType, setCancelType] = useState("Redemption"); // "Redemption" | "Manual"
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [entryDate, setEntryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [candidateEntries, setCandidateEntries] = useState([]);
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Load employees list on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/employees/");
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.results || [];
          setEmployees(list);
          if (list.length > 0) {
            setSelectedEmployee(list[0].id || list[0].pk || "");
          }
        }
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch candidate entries whenever cancelType changes
  useEffect(() => {
    const fetchCandidateEntries = async () => {
      try {
        setLoading(true);
        setSelectedEntryId("");
        const res = await fetch(
          `/api/manual-entry-cancel/candidate-entries/?type=${encodeURIComponent(cancelType)}`
        );
        if (res.ok) {
          const data = await res.json();
          setCandidateEntries(Array.isArray(data) ? data : []);
          if (Array.isArray(data) && data.length > 0) {
            setSelectedEntryId(data[0].entry_id);
          }
        }
      } catch (err) {
        console.error("Failed to load candidate entries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidateEntries();
  }, [cancelType]);

  // Handle Ok (Cancel Entry)
  const handleOk = async () => {
    if (!selectedEntryId) {
      alert("Please select an Entryno to cancel.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to cancel the selected ${cancelType} entry?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        cancel_type: cancelType,
        entry_id: selectedEntryId,
        user_id: selectedEmployee ? parseInt(selectedEmployee, 10) : 1,
        cancel_date: entryDate,
      };

      const res = await fetch("/api/manual-entry-cancel/cancel-entry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ text: data.message || "Entry cancelled successfully!", type: "success" });
        alert(data.message || `${cancelType} entry cancelled successfully.`);

        // Refresh candidate entries
        const refreshed = candidateEntries.filter(
          (item) => item.entry_id !== selectedEntryId
        );
        setCandidateEntries(refreshed);
        setSelectedEntryId(refreshed.length > 0 ? refreshed[0].entry_id : "");
      } else {
        setStatusMsg({ text: data.message || "Cancellation failed.", type: "error" });
        alert(data.message || "Failed to cancel entry.");
      }
    } catch (err) {
      console.error("Cancel entry error:", err);
      setStatusMsg({ text: "Error cancelling entry.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="manual-container">
      <fieldset className="manual-fieldset">
        <legend className="manual-legend">Manual Cancel</legend>

        {/* Top Radio Panel */}
        <div className="manual-radio-panel">
          <label className="manual-radio-item">
            <input
              type="radio"
              name="cancelType"
              value="Redemption"
              checked={cancelType === "Redemption"}
              onChange={() => setCancelType("Redemption")}
            />
            <span>Redemption</span>
          </label>
          <label className="manual-radio-item">
            <input
              type="radio"
              name="cancelType"
              value="Manual"
              checked={cancelType === "Manual"}
              onChange={() => setCancelType("Manual")}
            />
            <span>Manual</span>
          </label>
        </div>

        {/* Form Fields */}
        <div className="manual-form">
          {/* Employee Row */}
          <div className="manual-row">
            <span className="manual-label">Employee</span>
            <div className="manual-control">
              <select
                className="manual-select"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name || emp.employee_name || `Employee #${emp.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Entry Date Row */}
          <div className="manual-row">
            <span className="manual-label">Entry Date</span>
            <div className="manual-control">
              <input
                type="date"
                className="manual-date-input"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>
          </div>

          {/* Entryno Row */}
          <div className="manual-row">
            <span className="manual-label">Entryno</span>
            <div className="manual-control">
              <select
                className="manual-select"
                value={selectedEntryId}
                onChange={(e) => setSelectedEntryId(e.target.value)}
              >
                {candidateEntries.length === 0 ? (
                  <option value="">-- No pending entries to cancel --</option>
                ) : (
                  candidateEntries.map((item) => (
                    <option key={item.entry_id} value={item.entry_id}>
                      {item.display}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg.text && (
          <div className={`manual-status ${statusMsg.type}`}>
            {statusMsg.text}
          </div>
        )}

        {/* Actions Row */}
        <div className="manual-actions">
          <button
            type="button"
            className="manual-btn"
            onClick={handleOk}
            disabled={loading || candidateEntries.length === 0}
          >
            Ok
          </button>
          <button
            type="button"
            className="manual-btn"
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

export default ManualEntryCancel;
