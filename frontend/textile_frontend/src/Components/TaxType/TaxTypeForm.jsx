import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./TaxType.css";
const API_BASE = "http://127.0.0.1:8000";

export default function TaxTypeForm({ open, onClose, onSaved, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    EntryType: "",
    Name: "",
    ShortName: "",
    TaxPercent: "",
    TaxOn: 0,
    Include: false,
    Active: true,
    CreatedDateTime: "",
    UserID: 1,
    isDiscount: false,
    AllowSales: true,
    AllowPurchase: true,
    AccHeadName: "",
    AccountPost: false,
    AccountHeadCode: 0,
    AccountSalesHeadCode: 0,
    SSPurAccHeadCode: 0,
    SSSalAccHeadCode: 0,
    TaxAmtCalType: "",
    AllowTaxAmtCal: false,
    CommodityCode: "",
    Section: "",
    LocalCategory: "",
    OtherCategory: "",
    ImportCategory: "",
    Category: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    } else {
      setForm((prev) => ({
        ...prev,
        Code: "",
        Name: "",
        ShortName: "",
        TaxPercent: "",
        TaxOn: 0,
        Include: false,
        Active: true,
        isDiscount: false,
        AllowSales: true,
        AllowPurchase: true,
      }));
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
    if (!form.Name?.trim()) return toast.error("Name required");
    if (form.TaxPercent === "" || form.TaxPercent === null)
      return toast.error("Tax Percent required");

    try {
      const payload = { ...form };
      if (!payload.Code) delete payload.Code;
      delete payload.CreatedDateTime;
      await axios.post(`${API_BASE}/taxtype/add/`, payload);
      toast.success(payload.Code ? "Updated" : "Created");
      onSaved && onSaved();
      onClose && onClose();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  if (!open) return null;

  return (
    <div
      className="drawer panel animate tax-type-drawer"
      style={{ maxWidth: 960 }}
    >
      <div className="drawer-header">
        <h2>{form.Code ? "Edit Tax Type" : "Add Tax Type"}</h2>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="drawer-subtitle">
        Maintain tax type master used across purchase and sales documents.
      </div>

      <div className="tax-type-grid">
        {/* LEFT: BASIC TAX DETAILS */}
        <div className="card-section">
          <div className="card-title">Basic Details</div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">Entry Type</label>
              <input
                name="EntryType"
                value={form.EntryType || ""}
                onChange={handleChange}
                className="input"
                placeholder="e.g. GST, VAT"
              />
            </div>
            <div className="form-field">
              <label className="label">
                Name <span className="required">*</span>
              </label>
              <input
                name="Name"
                value={form.Name || ""}
                onChange={handleChange}
                className="input"
                placeholder="Tax name"
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">Short Name</label>
              <input
                name="ShortName"
                value={form.ShortName || ""}
                onChange={handleChange}
                className="input"
                placeholder="Short label"
              />
            </div>
            <div className="form-field">
              <label className="label">
                Tax Percent <span className="required">*</span>
              </label>
              <input
                name="TaxPercent"
                type="number"
                step="0.00001"
                value={form.TaxPercent}
                onChange={handleChange}
                className="input"
                placeholder="0.00000"
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">Tax On</label>
              <input
                name="TaxOn"
                type="number"
                value={form.TaxOn}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
            <div className="form-field checkbox-group-column">
              <label className="label">Flags</label>
              <div className="checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="Include"
                    checked={!!form.Include}
                    onChange={handleChange}
                  />
                  <span>Include</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isDiscount"
                    checked={!!form.isDiscount}
                    onChange={handleChange}
                  />
                  <span>isDiscount</span>
                </label>
              </div>
              <div className="checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="AllowSales"
                    checked={!!form.AllowSales}
                    onChange={handleChange}
                  />
                  <span>Allow Sales</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="AllowPurchase"
                    checked={!!form.AllowPurchase}
                    onChange={handleChange}
                  />
                  <span>Allow Purchase</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="Active"
                    checked={!!form.Active}
                    onChange={handleChange}
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="card-subtitle">Classification</div>
          <div className="form-row two">
            <div className="form-field">
              <label className="label">Commodity Code</label>
              <input
                name="CommodityCode"
                value={form.CommodityCode || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="form-field">
              <label className="label">Section</label>
              <input
                name="Section"
                value={form.Section || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">Local Category</label>
              <input
                name="LocalCategory"
                value={form.LocalCategory || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="form-field">
              <label className="label">Other Category</label>
              <input
                name="OtherCategory"
                value={form.OtherCategory || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">Import Category</label>
              <input
                name="ImportCategory"
                value={form.ImportCategory || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="form-field">
              <label className="label">Category</label>
              <input
                name="Category"
                value={form.Category || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: ACCOUNT & CALCULATION */}
        <div className="card-section">
          <div className="card-title">Account & Posting</div>

          <div className="form-row">
            <div className="form-field">
              <label className="label">Acc Head Name</label>
              <input
                name="AccHeadName"
                value={form.AccHeadName || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">Account Head Code</label>
              <input
                name="AccountHeadCode"
                type="number"
                value={form.AccountHeadCode}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="form-field">
              <label className="label">Account Sales Head Code</label>
              <input
                name="AccountSalesHeadCode"
                type="number"
                value={form.AccountSalesHeadCode}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">SS Pur Acc Head Code</label>
              <input
                name="SSPurAccHeadCode"
                type="number"
                value={form.SSPurAccHeadCode}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="form-field">
              <label className="label">SS Sal Acc Head Code</label>
              <input
                name="SSSalAccHeadCode"
                type="number"
                value={form.SSSalAccHeadCode}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="form-row two">
            <div className="form-field">
              <label className="label">Tax Amt Cal Type</label>
              <input
                name="TaxAmtCalType"
                type="number"
                value={form.TaxAmtCalType || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="form-field checkbox-group-single">
              <label className="label">Options</label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="AccountPost"
                  checked={!!form.AccountPost}
                  onChange={handleChange}
                />
                <span>Account Post</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="AllowTaxAmtCal"
                  checked={!!form.AllowTaxAmtCal}
                  onChange={handleChange}
                />
                <span>Allow Tax Amt Cal</span>
              </label>
            </div>
          </div>

          <div className="card-meta">
            <span>Code: {form.Code || "New"}</span>
            <span>User: {form.UserID}</span>
          </div>
        </div>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={save}
          disabled={!form.Name?.trim() || form.TaxPercent === ""}
        >
          {form.Code ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
