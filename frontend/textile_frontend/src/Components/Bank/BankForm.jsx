import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import axios from "axios";
const API_BASE = "http://127.0.0.1:8000";

export default function BankForm({ open, onClose, onSaved, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    Name: "",
    Shortname: "",
    CardServiceCharge: "",
    Active: true,
    UserID: 1,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData)
      setForm({
        Code: initialData.Code ?? "",
        Name: initialData.Name ?? "",
        Shortname: initialData.Shortname ?? "",
        CardServiceCharge: initialData.CardServiceCharge ?? "",
        Active: initialData.Active ?? true,
        UserID: initialData.UserID ?? 1,
      });
    else
      setForm({
        Code: "",
        Name: "",
        Shortname: "",
        CardServiceCharge: "",
        Active: true,
        UserID: 1,
      });
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const save = async () => {
    if (!form.Name || !form.Name.trim()) return toast.error("Name required");
    if (!form.CardServiceCharge || isNaN(Number(form.CardServiceCharge)))
      return toast.error("Card Service Charge required");
    try {
      setSaving(true);
      const payload = { ...form };
      if (!payload.Code) delete payload.Code;
      delete payload.CreatedDateTime;
      console.log(payload);

      const res = await axios.post(`${API_BASE}/bank/add/`, payload);
      if (res.data.success) {
        toast.success("Saved");
        onSaved && onSaved();
      } else {
        toast.error("Save failed: " + JSON.stringify(res.data));
      }
    } catch (err) {
      toast.error("Save failed" + err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="drawer panel animate">
          <Dialog.Title>
            {form.Code ? "Edit Bank" : "Add Bank"}
            <button onClick={onClose} className="close-btn">
              ✕
            </button>
          </Dialog.Title>
          <Dialog.Description>
            Please fill all required fields.
          </Dialog.Description>
          <div className="drawer-body">
            <label className="label">Name</label>
            <input
              name="Name"
              value={form.Name}
              onChange={handleChange}
              className="input"
              autoFocus
            />
            <label className="label">Short Name</label>
            <input
              name="Shortname"
              value={form.Shortname}
              onChange={handleChange}
              className="input"
            />
            <label className="label">Card Service Charge</label>
            <input
              name="CardServiceCharge"
              value={form.CardServiceCharge}
              onChange={handleChange}
              className="input"
              type="number"
              step="0.01"
            />
            <label className="label checkbox-label">
              <input
                type="checkbox"
                name="Active"
                checked={form.Active}
                onChange={handleChange}
              />{" "}
              <span>Active</span>
            </label>
          </div>
          <div className="drawer-footer">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : form.Code ? "Update" : "Save"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
