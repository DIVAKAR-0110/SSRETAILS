import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = "http://127.0.0.1:8000";

export default function DiscountTypeForm({
  open,
  onClose,
  onSaved,
  initialData,
}) {
  const [form, setForm] = useState({
    Code: "",
    Name: "",
    ShortName: "",
    Active: true,
    UserID: 1,
    DiscPer: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    } else {
      setForm({
        Code: "",
        Name: "",
        ShortName: "",
        Active: true,
        UserID: 1,
        DiscPer: "",
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
    if (!form.Name) return toast.error("Name required");
    if (form.DiscPer === "") return toast.error("Discount % required");

    try {
      const payload = { ...form };
      if (!payload.Code) delete payload.Code;
      await axios.post(`${API_BASE}/discounttype/add/`, payload);
      toast.success(payload.Code ? "Updated" : "Created");
      onSaved && onSaved();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Save failed");
    }
  };

  if (!open) return null;

  return (
    <div
      className="drawer panel animate"
      style={{ maxWidth: 650, margin: "40px auto" }}
    >
      <div className="form-header">
        <h2>{form.Code ? "Edit Discount Type" : "Add Discount Type"}</h2>
        <button className="close-icon-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <label>Name</label>
      <input
        name="Name"
        value={form.Name || ""}
        onChange={handleChange}
        className="input"
      />

      <label>Short Name</label>
      <input
        name="ShortName"
        value={form.ShortName || ""}
        onChange={handleChange}
        className="input"
      />

      <label>Discount %</label>
      <input
        name="DiscPer"
        type="number"
        step="0.01"
        value={form.DiscPer}
        onChange={handleChange}
        className="input"
      />

      <label>Active</label>
      <input
        type="checkbox"
        name="Active"
        checked={!!form.Active}
        onChange={handleChange}
      />

      <label>User ID</label>
      <input
        name="UserID"
        type="number"
        value={form.UserID || ""}
        onChange={handleChange}
        className="input"
        disabled
      />

      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={save}
          style={{ marginLeft: 16 }}
        >
          {form.Code ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
