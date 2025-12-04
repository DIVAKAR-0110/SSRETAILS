import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = "http://127.0.0.1:8000";

export default function IncomeExpenseForm({
  open,
  onClose,
  onSaved,
  initialData,
}) {
  const [form, setForm] = useState({
    Code: "",
    Name: "",
    Shortname: "",
    Active: true,
    UserID: 1,
    HeadType: true, // true = Income, false = Expense
    AccountHeadName: "",
    AccountPost: false,
    AccountHeadCode: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    } else {
      setForm({
        Code: "",
        Name: "",
        Shortname: "",
        Active: true,
        UserID: 1,
        HeadType: true,
        AccountHeadName: "",
        AccountPost: false,
        AccountHeadCode: "",
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

    try {
      const payload = { ...form };
      if (!payload.Code) delete payload.Code;
      await axios.post(`${API_BASE}/incomeexpense/add/`, payload);
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
      style={{ maxWidth: 750, margin: "40px auto" }}
    >
      <div className="form-header">
        <h2>{form.Code ? "Edit Income/Expense" : "Add Income/Expense"}</h2>
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

      <label>Shortname</label>
      <input
        name="Shortname"
        value={form.Shortname || ""}
        onChange={handleChange}
        className="input"
      />

      <label>Type</label>
      <select
        name="HeadType"
        value={form.HeadType ? "1" : "0"}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, HeadType: e.target.value === "1" }))
        }
        className="input"
      >
        <option value="1">Income</option>
        <option value="0">Expense</option>
      </select>

      <label>Account Head Name</label>
      <input
        name="AccountHeadName"
        value={form.AccountHeadName || ""}
        onChange={handleChange}
        className="input"
      />

      <label>Account Head Code</label>
      <input
        name="AccountHeadCode"
        type="number"
        value={form.AccountHeadCode || ""}
        onChange={handleChange}
        className="input"
      />

      <label>Account Post</label>
      <input
        type="checkbox"
        name="AccountPost"
        checked={!!form.AccountPost}
        onChange={handleChange}
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
