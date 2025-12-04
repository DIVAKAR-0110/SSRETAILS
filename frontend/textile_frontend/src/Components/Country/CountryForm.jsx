import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";

export default function CountryForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    Name: "",
    ShortName: "",
    Active: true,
    UserID: 1,
  });

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
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = () => {
    if (!form.Name.trim()) {
      toast.error("Country name is required");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content className="drawer panel">
          <div className="drawer-header">
            <h3>{form.Code ? "Edit Country" : "Add Country"}</h3>
            <button onClick={onClose} className="close-btn">
              ✕
            </button>
          </div>

          <div className="drawer-body">
            <label className="label">Country Name</label>
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
            <button className="btn btn-primary" onClick={handleSubmit}>
              {form.Code ? "Update" : "Save"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
