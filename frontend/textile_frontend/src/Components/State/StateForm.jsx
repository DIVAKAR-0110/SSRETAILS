// StateForm.jsx
import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function StateForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    Name: "",
    ShortName: "",
    CountryCode: "",
    Active: true,
    UserID: 1,
  });

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  useEffect(() => {
    // initialize form
    if (initialData) {
      setForm({
        Code: initialData.Code ?? "",
        Name: initialData.Name ?? "",
        ShortName: initialData.ShortName ?? "",
        CountryCode:
          initialData.CountryCode ?? initialData.CountryCode?.Code ?? "",
        Active: initialData.Active ?? true,
        UserID: initialData.UserID ?? 1,
      });
    } else {
      setForm({
        Code: "",
        Name: "",
        ShortName: "",
        CountryCode: "",
        Active: true,
        UserID: 1,
      });
    }
  }, [initialData, open]);

  useEffect(() => {
    // load all countries once (Option A)
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        const res = await axios.get(`${API_BASE}/country/report/`);
        // backend returns { columns: [...], data: [...] } or { results: [...] } depending on implementation
        const data = res.data.data ?? res.data.results ?? res.data;
        setCountries(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const validateAndSubmit = () => {
    if (!form.Name?.trim()) return toast.error("State Name is required");
    if (!form.CountryCode) return toast.error("Select Country");
    onSubmit(form);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content className="drawer panel">
          <div className="drawer-header">
            <h3>{form.Code ? "Edit State" : "Add State"}</h3>
            <button onClick={onClose} className="close-btn">
              ✕
            </button>
          </div>

          <div className="drawer-body">
            <label className="label">State Name</label>
            <input
              name="Name"
              value={form.Name}
              onChange={handleChange}
              className="input"
            />

            <label className="label">Short Name</label>
            <input
              name="ShortName"
              value={form.ShortName}
              onChange={handleChange}
              className="input"
            />

            <label className="label">Country</label>
            <select
              name="CountryCode"
              value={form.CountryCode}
              onChange={handleChange}
              className="input"
            >
              <option value="">-- Select Country --</option>
              {loadingCountries ? (
                <option>Loading...</option>
              ) : (
                countries.map((c) => (
                  // backend country objects expected to have Code and Name
                  <option key={c.Code} value={c.Code}>
                    {c.Name}
                  </option>
                ))
              )}
            </select>

            <label className="label checkbox-label">
              <input
                type="checkbox"
                name="Active"
                checked={form.Active}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
          </div>

          <div className="drawer-footer">
            <button onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={validateAndSubmit} className="btn btn-primary">
              {form.Code ? "Update" : "Save"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
