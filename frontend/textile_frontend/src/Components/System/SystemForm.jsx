import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = "http://127.0.0.1:8000";
import "./System.css";
export default function SystemForm({ open, onClose, onSaved, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    LocationCode: "",
    Name: "",
    ShortName: "",
    MACID: "",
    PrintFunctionCode: "",
    GroupBillPrefix: "",
    Seperator: "",
    NoLength: "",
    LastNo: "",
    Active: true,
    UserID: 1,
    FloorCode: "",
    ReturnSystem: "",
    SettlementPrintFunctionCode: "",
    SysRefNo: "",
    AllowScheme: false,
    PRINTERPORTCODE: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    } else {
      setForm((prev) => ({
        ...prev,
        Code: "",
        Name: "",
        ShortName: "",
        Active: true,
        AllowScheme: false,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const save = async () => {
    if (!form.Name?.trim()) return toast.error("Name required");
    if (!form.LocationCode) return toast.error("Location Code required");

    try {
      const payload = { ...form };
      if (!payload.Code) delete payload.Code;

      const toIntOrNull = (v) =>
        v === "" || v === null || v === undefined ? null : Number(v);

      payload.LocationCode = Number(payload.LocationCode);
      payload.NoLength = toIntOrNull(payload.NoLength);
      payload.LastNo = toIntOrNull(payload.LastNo);
      payload.PrintFunctionCode = toIntOrNull(payload.PrintFunctionCode);
      payload.FloorCode = toIntOrNull(payload.FloorCode);
      payload.ReturnSystem = toIntOrNull(payload.ReturnSystem);
      payload.SettlementPrintFunctionCode = toIntOrNull(
        payload.SettlementPrintFunctionCode
      );
      payload.PRINTERPORTCODE = toIntOrNull(payload.PRINTERPORTCODE);
      payload.UserID = Number(payload.UserID || 1);

      console.log("SYSTEM PAYLOAD:", payload);
      await axios.post(`${API_BASE}/system/add/`, payload);
      toast.success(payload.Code ? "Updated" : "Created");
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      console.error("SYSTEM SAVE ERROR:", err.response?.data || err.message);
      toast.error("Save failed");
    }
  };

  if (!open) return null;

  return (
    <div
      className="drawer panel animate system-drawer"
      style={{ maxWidth: 960, margin: "40px auto" }}
    >
      <div className="drawer-header">
        <h2>{form.Code ? "Edit System" : "Add System"}</h2>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="drawer-subtitle">
        Maintain billing system configuration for each POS / workstation.
      </div>

      <div className="system-grid">
        {/* LEFT: BASIC DETAILS */}
        <div className="card-section">
          <div className="card-title">Basic Details</div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">
                Location Code <span className="required">*</span>
              </label>
              <input
                name="LocationCode"
                value={form.LocationCode || ""}
                onChange={handleChange}
                className="input"
                placeholder="Location"
              />
            </div>
            <div className="form-field">
              <label className="label">Floor Code</label>
              <input
                name="FloorCode"
                type="number"
                value={form.FloorCode || ""}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">
                Name <span className="required">*</span>
              </label>
              <input
                name="Name"
                value={form.Name || ""}
                onChange={handleChange}
                className="input"
                placeholder="System name"
              />
            </div>
            <div className="form-field">
              <label className="label">Short Name</label>
              <input
                name="ShortName"
                value={form.ShortName || ""}
                onChange={handleChange}
                className="input"
                placeholder="Short label"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="label">MAC ID</label>
              <input
                name="MACID"
                value={form.MACID || ""}
                onChange={handleChange}
                className="input"
                placeholder="System MAC address"
              />
            </div>
          </div>

          <div className="card-subtitle">Numbering</div>
          <div className="form-row two">
            <div className="form-field">
              <label className="label">Group Bill Prefix</label>
              <input
                name="GroupBillPrefix"
                value={form.GroupBillPrefix || ""}
                onChange={handleChange}
                className="input"
                placeholder="Prefix"
              />
            </div>
            <div className="form-field">
              <label className="label">Separator</label>
              <input
                name="Seperator"
                value={form.Seperator || ""}
                onChange={handleChange}
                className="input"
                placeholder="- / ."
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">No Length</label>
              <input
                name="NoLength"
                type="number"
                value={form.NoLength || ""}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
            <div className="form-field">
              <label className="label">Last No</label>
              <input
                name="LastNo"
                type="number"
                value={form.LastNo || ""}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="label">System Ref No</label>
              <input
                name="SysRefNo"
                value={form.SysRefNo || ""}
                onChange={handleChange}
                className="input"
                placeholder="Internal reference"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="Active"
                  checked={!!form.Active}
                  onChange={handleChange}
                />
                <span>Active</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="AllowScheme"
                  checked={!!form.AllowScheme}
                  onChange={handleChange}
                />
                <span>Allow Scheme</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT: PRINTING & FUNCTIONS */}
        <div className="card-section">
          <div className="card-title">Print & Functions</div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">Print Function Code</label>
              <input
                name="PrintFunctionCode"
                type="number"
                value={form.PrintFunctionCode || ""}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
            <div className="form-field">
              <label className="label">Settlement Print Function</label>
              <input
                name="SettlementPrintFunctionCode"
                type="number"
                value={form.SettlementPrintFunctionCode || ""}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">Return System</label>
              <input
                name="ReturnSystem"
                type="number"
                value={form.ReturnSystem || ""}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
            <div className="form-field">
              <label className="label">Printer Port Code</label>
              <input
                name="PRINTERPORTCODE"
                type="number"
                value={form.PRINTERPORTCODE || ""}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="card-subtitle">Meta</div>
          <div className="form-row two">
            <div className="form-field">
              <label className="label">Code</label>
              <input
                name="Code"
                value={form.Code || ""}
                className="input"
                readOnly
                placeholder="Auto"
              />
            </div>
            <div className="form-field">
              <label className="label">User ID</label>
              <input
                name="UserID"
                type="number"
                value={form.UserID || ""}
                onChange={handleChange}
                className="input"
                disabled
              />
            </div>
          </div>

          <div className="card-meta">
            <span>System: {form.Name || "New"}</span>
            <span>Location: {form.LocationCode || "-"}</span>
          </div>
        </div>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={save}
          disabled={!form.Name?.trim() || !form.LocationCode}
        >
          {form.Code ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
