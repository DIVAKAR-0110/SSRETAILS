import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = "http://127.0.0.1:8000";

export default function SystemCounterForm({
  open,
  onClose,
  onSaved,
  initialData,
}) {
  const [form, setForm] = useState({
    Code: "",
    CounterCode: "",
    CounterType: "",
    UserID: 1,
    LocationCode: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    } else {
      setForm({
        Code: "",
        CounterCode: "",
        CounterType: "",
        UserID: 1,
        LocationCode: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const save = async () => {
    if (!form.CounterCode) return toast.error("CounterCode required");
    if (!form.CounterType) return toast.error("CounterType required");
    if (!form.LocationCode) return toast.error("LocationCode required");

    try {
      const payload = { ...form };
      if (!payload.Code) delete payload.Code;
      // UserEntryDateTime is auto_now_add in backend
      await axios.post(`${API_BASE}/systemcounter/add/`, payload);
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
      style={{ maxWidth: 600, margin: "40px auto" }}
    >
      <div className="form-header">
        <h2>{form.Code ? "Edit System Counter" : "Add System Counter"}</h2>
        <button className="close-icon-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <label>Location Code</label>
      <input
        name="LocationCode"
        value={form.LocationCode || ""}
        onChange={handleChange}
        className="input"
      />

      <label>Counter Code</label>
      <input
        name="CounterCode"
        value={form.CounterCode || ""}
        onChange={handleChange}
        className="input"
      />

      <label>Counter Type</label>
      <input
        name="CounterType"
        value={form.CounterType || ""}
        onChange={handleChange}
        className="input"
      />

      <label>User ID</label>
      <input
        name="UserID"
        type="number"
        value={form.UserID || ""}
        onChange={handleChange}
        className="input"
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
