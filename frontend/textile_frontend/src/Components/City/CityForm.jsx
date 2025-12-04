// CityForm.jsx
import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import axios from "axios";
import "../../api.js";
import { BASE_URL } from "../../api.js";

const API_BASE = BASE_URL || "http://127.0.0.1:8000";

export default function CityForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    Name: "",
    ShortName: "",
    StateCode: "",
    StateName: "",
    CountryCode: "",
    CountryName: "",
    Active: true,
    UserID: 1,
  });

  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);

  useEffect(() => {
    // set form initial values on open / initialData change
    if (initialData) {
      setForm({
        Code: initialData.Code ?? "",
        Name: initialData.Name ?? "",
        ShortName: initialData.ShortName ?? "",
        StateCode: initialData.StateCode ?? initialData.StateCode?.Code ?? "",
        StateName: initialData.StateName ?? initialData.StateCode?.Name ?? "",
        CountryCode:
          initialData.CountryCode ??
          initialData.CountryCode ??
          initialData.CountryCode?.Code ??
          "",
        CountryName:
          initialData.CountryName ?? initialData.CountryCode?.Name ?? "",
        Active: initialData.Active ?? true,
        UserID: initialData.UserID ?? 1,
      });
    } else {
      setForm({
        Code: "",
        Name: "",
        ShortName: "",
        StateCode: "",
        StateName: "",
        CountryCode: "",
        CountryName: "",
        Active: true,
        UserID: 1,
      });
    }
  }, [initialData, open]);

  useEffect(() => {
    // load all states (Option A) ONCE
    const loadStates = async () => {
      try {
        setLoadingStates(true);
        const res = await axios.get(`${API_BASE}/state/report/`);
        // expecting { results: [...] } or { data: [...] } or { results: [...], ... }
        const data = res.data.data ?? res.data.results ?? res.data;
        // Ensure each state item has Code, Name, CountryCode and CountryName (from serializer)
        setStates(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed loading states");
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  // when state selection changes, auto fill country fields
  const onStateChange = (e) => {
    const stateCode = e.target.value;
    const st = states.find((s) => String(s.Code) === String(stateCode));
    if (st) {
      setForm((p) => ({
        ...p,
        StateCode: stateCode,
        StateName: st.Name ?? st.StateName ?? "",
        CountryCode: st.CountryCode ?? st.CountryCode?.Code ?? st.CountryCode,
        CountryName: st.CountryName ?? st.CountryCode?.Name ?? "",
      }));
    } else {
      setForm((p) => ({
        ...p,
        StateCode: stateCode,
        StateName: "",
        CountryCode: "",
        CountryName: "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const validateAndSubmit = () => {
    if (!form.Name?.trim()) return toast.error("City Name is required");
    if (!form.StateCode) return toast.error("Select State");
    // ensure CountryCode/countryName filled via state
    onSubmit({
      Code: form.Code,
      Name: form.Name,
      ShortName: form.ShortName,
      StateCode: form.StateCode,
      Active: form.Active,
      UserID: form.UserID,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content className="drawer panel">
          <div className="drawer-header">
            <h3>{form.Code ? "Edit City" : "Add City"}</h3>
            <button onClick={onClose} className="close-btn">
              ✕
            </button>
          </div>

          <div className="drawer-body">
            <label className="label">City Name</label>
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

            <label className="label">State</label>
            <select
              name="StateCode"
              value={form.StateCode}
              onChange={onStateChange}
              className="input"
            >
              <option value="">-- Select State --</option>
              {loadingStates ? (
                <option>Loading...</option>
              ) : (
                states.map((s) => (
                  <option key={s.Code} value={s.Code}>
                    {s.Name} {s.CountryName ? ` — ${s.CountryName}` : ""}
                  </option>
                ))
              )}
            </select>

            <label className="label">Country (auto)</label>
            <input
              name="CountryName"
              value={form.CountryName}
              readOnly
              className="input"
            />

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
