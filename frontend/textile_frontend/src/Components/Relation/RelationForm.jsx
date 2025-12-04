import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../api";

const API_BASE = BASE_URL || "http://127.0.0.1:8000";

export default function RelationForm({ open, onClose, onSaved, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    Name: "",
    ShortName: "",
    Active: true,
    UserID: 1,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData)
      setForm({
        Code: initialData.Code ?? "",
        Name: initialData.Name ?? "",
        ShortName: initialData.ShortName ?? "",
        Active: initialData.Active ?? true,
        UserID: initialData.UserID ?? 1,
      });
    else
      setForm({ Code: "", Name: "", ShortName: "", Active: true, UserID: 1 });
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
    try {
      setSaving(true);
      const payload = { ...form };
      if (!payload.Code) delete payload.Code;
      const res = await axios.post(`${API_BASE}/relation/add/`, payload);

      if (res.data.success) {
        toast.success("Saved");
        onSaved && onSaved(); // This will trigger reload in parent
      } else {
        // Handle backend errors if any (very rare since serializer.is_valid() must be true now)
        toast.error("Save failed: " + JSON.stringify(res.data));
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        toast.error("Save failed: " + err.response.data.error);
      } else if (err.response?.data?.details) {
        toast.error(
          "Save failed: " + JSON.stringify(err.response.data.details)
        );
      } else {
        toast.error("Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="drawer panel animate">
            <Dialog.Title>
              {form.Code ? "Edit Relation" : "Add Relation"}
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
    </>
  );
}
