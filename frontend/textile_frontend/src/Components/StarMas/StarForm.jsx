import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = "http://127.0.0.1:8000";

export default function StarForm({ open, onClose, onSaved, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    Starname: "",
    Starvalue: "",
    active: true,
    UserID: 1, // default admin ID
  });

  useEffect(() => {
    if (initialData) {
      // Map incoming data to form state (handles PascalCase from backend)
      setForm({
        Code: initialData.Code || "",
        Starname: initialData.Starname || "",
        Starvalue: initialData.Starvalue || "",
        active: initialData.active || true,
        UserID: initialData.UserID || 1,
      });
    } else {
      // Reset to defaults for new record
      setForm({
        Code: "",
        Starname: "",
        Starvalue: "",
        active: true,
        UserID: 1,
      });
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
    // Client-side validation
    if (!form.Starname.trim()) return toast.error("Star name required");
    if (!form.Starvalue || form.Starvalue === "")
      return toast.error("Star value required");

    try {
      const payload = {
        Starname: form.Starname.trim(),
        Starvalue: parseFloat(form.Starvalue), // Convert to number for DecimalField
        active: form.active,
        UserID: parseInt(form.UserID) || 1,
      };

      // Remove Code for new records (AutoField handled by backend)
      if (!form.Code) {
        delete payload.Code;
      } else {
        payload.Code = parseInt(form.Code);
      }

      await axios.post(`${API_BASE}/star/add/`, payload);
      toast.success(
        form.Code ? "Star updated successfully" : "Star created successfully"
      );
      onSaved && onSaved();
      onClose();
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.details || "Save failed";
      toast.error(typeof errorMsg === "string" ? errorMsg : "Save failed");
    }
  };

  if (!open) return null;

  return (
    <div
      className="drawer panel animate"
      style={{ maxWidth: 600, margin: "40px auto" }}
    >
      <div className="form-header">
        <h2>{form.Code ? "Edit Star" : "Add Star"}</h2>
        <button className="close-icon-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Code (read-only for edit, hidden for add) */}
      {form.Code && (
        <div>
          <label>Code</label>
          <input
            name="Code"
            value={form.Code}
            className="input"
            disabled
            style={{ backgroundColor: "#f3f4f6" }}
          />
        </div>
      )}

      <div>
        <label>Star Name *</label>
        <input
          name="Starname"
          value={form.Starname || ""}
          onChange={handleChange}
          className="input"
          placeholder="Enter star name"
        />
      </div>

      <div>
        <label>Star Value *</label>
        <input
          name="Starvalue"
          type="number"
          step="0.01"
          min="0"
          value={form.Starvalue || ""}
          onChange={handleChange}
          className="input"
          placeholder="0.00"
        />
      </div>

      <div>
        <label>Active</label>
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="active"
            checked={!!form.active}
            onChange={handleChange}
          />
          <span className="checkmark"></span>
        </label>
      </div>

      <div>
        <label>User ID</label>
        <input
          name="UserID"
          type="number"
          value={form.UserID || ""}
          onChange={handleChange}
          className="input"
          disabled
          style={{ backgroundColor: "#f3f4f6" }}
        />
      </div>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 12,
          justifyContent: "flex-end",
        }}
      >
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={save}>
          {form.Code ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
