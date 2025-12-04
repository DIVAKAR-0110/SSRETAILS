// GradeForm.jsx
import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../api";

const API_BASE = BASE_URL || "http://127.0.0.1:8000";

export default function GradeForm({ open, onClose, onSaved, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    Name: "",
    ShortName: "",
    Active: true,
    UserID: 1,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        Code: initialData.Code ?? "",
        Name: initialData.Name ?? "",
        ShortName: initialData.ShortName ?? "",
        Active: initialData.Active ?? true,
        UserID: initialData.UserID ?? 1,
      });
    } else {
      setForm({
        Code: "",
        Name: "",
        ShortName: "",
        Active: true,
        UserID: 1,
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async () => {
    if (!form.Name || !form.Name.trim()) {
      toast.error("Name required");
      return;
    }

    try {
      setSaving(true);
      // Backend expects POST to /grade/add/ with optional Code to update
      await axios.post(`${API_BASE}/grade/add/`, form);
      toast.success(form.Code ? "Updated" : "Created");
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content className="drawer panel animate">
          <div className="drawer-header">
            <h3>{form.Code ? "Edit Grade" : "Add Grade"}</h3>
            <button onClick={onClose} className="close-btn">
              ✕
            </button>
          </div>

          <div className="drawer-body">
            <label className="label">Name</label>
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
