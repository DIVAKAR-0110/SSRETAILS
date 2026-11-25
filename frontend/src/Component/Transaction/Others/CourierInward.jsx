// frontend/src/Component/Transaction/Others/CourierInward.jsx
import React, { useState, useEffect } from "react";
import "./CourierInward.css";

const CourierInward = ({ onClose, onExit }) => {
  const [locations, setLocations] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [locationCode, setLocationCode] = useState(1);
  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [rows, setRows] = useState([
    {
      id: 1,
      courierCode: 0,
      courierName: "",
      courierType: "",
      courierFrom: "",
      fromName: "",
      podNo: "",
      podDate: new Date().toISOString().split("T")[0],
      employeeCode: 0,
      handOverTo: "",
      remarks: "",
    },
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load masters
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [locRes, courRes, empRes] = await Promise.all([
          fetch("/locations/"),
          fetch("/couriers/"),
          fetch("/employees/"),
        ]);
        if (locRes.ok) {
          const d = await locRes.json();
          const l = Array.isArray(d) ? d : d.results || [];
          setLocations(l);
          if (l.length > 0) setLocationCode(l[0].code || l[0].id || 1);
        }
        if (courRes.ok) {
          const d = await courRes.json();
          setCouriers(Array.isArray(d) ? d : d.results || []);
        }
        if (empRes.ok) {
          const d = await empRes.json();
          setEmployees(Array.isArray(d) ? d : d.results || []);
        }
      } catch (err) {
        console.error("Master data fetch failed:", err);
      }
    };
    fetchMasters();
  }, []);

  // Next entry no
  useEffect(() => {
    const fetchNextNo = async () => {
      try {
        const res = await fetch(`/api/courier-inward/next-entry-no/?location_code=${locationCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.next_entry_no) setEntryNo(data.next_entry_no);
        }
      } catch (err) {
        console.error("Next entry no error:", err);
      }
    };
    fetchNextNo();
  }, [locationCode]);

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        courierCode: 0,
        courierName: "",
        courierType: "",
        courierFrom: "",
        fromName: "",
        podNo: "",
        podDate: entryDate,
        employeeCode: 0,
        handOverTo: "",
        remarks: "",
      },
    ]);
  };

  const handleSave = async () => {
    const validItems = rows.filter((r) => r.podNo.trim() || r.courierName.trim() || r.fromName.trim());
    if (validItems.length === 0) {
      alert("Please enter at least one courier packet (POD No / Courier Name / From Name).");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/courier-inward/save-inward/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location_code: parseInt(locationCode, 10),
          entry_date: entryDate,
          items: validItems.map((r) => ({
            courier_code: parseInt(r.courierCode, 10) || 0,
            courier_name: r.courierName,
            courier_type: r.courierType || "STANDARD",
            courier_from: r.courierFrom,
            from_name: r.fromName,
            pod_no: r.podNo,
            pod_date: r.podDate,
            employee_code: parseInt(r.employeeCode, 10) || 0,
            remarks: r.remarks,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || `Courier Inward ${data.entry_no} saved successfully.`);
        setRows([
          {
            id: 1,
            courierCode: 0,
            courierName: "",
            courierType: "",
            courierFrom: "",
            fromName: "",
            podNo: "",
            podDate: entryDate,
            employeeCode: 0,
            handOverTo: "",
            remarks: "",
          },
        ]);
        const nextRes = await fetch(`/api/courier-inward/next-entry-no/?location_code=${locationCode}`);
        if (nextRes.ok) {
          const nd = await nextRes.json();
          if (nd.next_entry_no) setEntryNo(nd.next_entry_no);
        }
      } else {
        alert(data.message || "Failed to save Courier Inward.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving Courier Inward.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else if (onExit) onExit();
  };

  return (
    <div className="cinw-container">
      <fieldset className="cinw-fieldset">
        <legend className="cinw-legend">COURIER INWARD</legend>

        <div className="cinw-header-row">
          <div className="cinw-item">
            <span className="cinw-label">Location</span>
            <select
              className="cinw-select"
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

          <div className="cinw-item">
            <span className="cinw-label">EntryNo</span>
            <input type="text" className="cinw-input" value={entryNo} readOnly />
          </div>

          <div className="cinw-item">
            <span className="cinw-label">EntryDate</span>
            <input
              type="date"
              className="cinw-input"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      {/* Grid Table */}
      <div className="cinw-table-wrap">
        <table className="cinw-table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}></th>
              <th>CourierName</th>
              <th>CourierType</th>
              <th>CourierFrom</th>
              <th>FromName</th>
              <th>PodNo</th>
              <th>PodDate</th>
              <th>HandOverTo</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} onClick={() => setActiveIdx(idx)}>
                <td style={{ textAlign: "center", background: "#f7f4ed" }}>▸ {idx + 1}</td>
                <td>
                  <select
                    className="cinw-table-select"
                    value={r.courierCode}
                    onChange={(e) => {
                      const cId = e.target.value;
                      const cObj = couriers.find((c) => String(c.id || c.code) === cId);
                      handleRowChange(idx, "courierCode", cId);
                      handleRowChange(idx, "courierName", cObj ? cObj.name : "");
                    }}
                  >
                    <option value="0">-- Select Courier --</option>
                    {couriers.map((c) => (
                      <option key={c.id || c.code} value={c.id || c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="cinw-table-select"
                    value={r.courierType}
                    onChange={(e) => handleRowChange(idx, "courierType", e.target.value)}
                  >
                    <option value="">[SELECT]</option>
                    <option value="STANDARD">STANDARD</option>
                    <option value="EXPRESS">EXPRESS</option>
                    <option value="CARGO">CARGO</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="cinw-table-input"
                    value={r.courierFrom}
                    onChange={(e) => handleRowChange(idx, "courierFrom", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="cinw-table-input"
                    value={r.fromName}
                    onChange={(e) => handleRowChange(idx, "fromName", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="cinw-table-input"
                    value={r.podNo}
                    onChange={(e) => handleRowChange(idx, "podNo", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="cinw-table-input"
                    value={r.podDate}
                    onChange={(e) => handleRowChange(idx, "podDate", e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className="cinw-table-select"
                    value={r.employeeCode}
                    onChange={(e) => {
                      const empId = e.target.value;
                      const empObj = employees.find((emp) => String(emp.id) === empId);
                      handleRowChange(idx, "employeeCode", empId);
                      handleRowChange(idx, "handOverTo", empObj ? empObj.name : "");
                    }}
                  >
                    <option value="0">-- Hand Over To --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name || emp.employee_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="cinw-table-input"
                    value={r.remarks}
                    onChange={(e) => handleRowChange(idx, "remarks", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && idx === rows.length - 1) addRow();
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="cinw-actions">
        <button type="button" className="cinw-btn cinw-btn-ok" onClick={handleSave} disabled={loading}>
          💾 OK
        </button>
        <button type="button" className="cinw-btn cinw-btn-close" onClick={handleClose} disabled={loading}>
          ✖ Close
        </button>
      </div>
    </div>
  );
};

export default CourierInward;
