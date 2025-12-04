import Navbar2 from "../Navbar2";
import "./Employee.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export default function EmployeeForm({ open, onClose, onSaved, initialData }) {
  const [form, setForm] = useState({
    Code: "",
    LocationCode: "",
    DepartmentCode: "",
    FloorCode: "",
    TitleCode: "",
    Name: "",
    ShortName: "",
    Address: "",
    CityCode: "",
    Pincode: "",
    DOB: "",
    DOJ: "",
    Phoneno: "",
    Mobile: "",
    Email: "",
    Panno: "",
    CommissionAllowed: false,
    CommissionPercent: 0,
    LoginUser: false,
    UserGroupCode: "",
    Password: "",
    AllowSalesDiscount: false,
    Active: true,
    SkinName: "DEFAULT",
    UserID: 1,
    AllowViewActualSales: false,
    ISADMIN: false,
  });

  const admin_id = useParams();

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        DOB: initialData.DOB ? initialData.DOB.substr(0, 10) : "",
        DOJ: initialData.DOJ ? initialData.DOJ.substr(0, 10) : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, Code: "" }));
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
    if (!form.LocationCode) return toast.error("LocationCode required");

    try {
      const payload = { ...form };
      if (!payload.Code) delete payload.Code;
      delete payload.CreatedDateTime;

      const toNumOrNull = (v) =>
        v === "" || v === null || v === undefined ? null : v;
      payload.CommissionPercent = toNumOrNull(payload.CommissionPercent);

      await axios.post(`${API_BASE}/employee/add/`, payload);
      toast.success(payload.Code ? "Updated" : "Created");
      onSaved && onSaved();
    } catch (err) {
      console.error("EMPLOYEE SAVE ERROR:", err.response?.data || err.message);
      toast.error("Save failed");
    }
  };

  if (!open) return null;

  return (
    <>
      <Navbar2 admin_id={admin_id} />
      <br />
      <br />
      <div className="erp-drawer-backdrop">
        <div className="erp-drawer">
          {/* Header */}
          <div className="erp-drawer-header">
            <div>
              <h2 className="erp-drawer-title">
                {form.Code ? "Edit Employee" : "Add Employee"}
              </h2>
              <p className="erp-drawer-subtitle">
                Maintain employee master details for textile operations.
              </p>
            </div>
            <button className="erp-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="erp-drawer-body">
            {/* Left column */}
            <div className="erp-column">
              <div className="erp-section">
                <h3 className="erp-section-title">Basic Details</h3>
                <div className="erp-field-grid">
                  <div className="erp-field">
                    <label>
                      Location Code<span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      name="LocationCode"
                      value={form.LocationCode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Department Code</label>
                    <input
                      type="number"
                      name="DepartmentCode"
                      value={form.DepartmentCode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Floor Code</label>
                    <input
                      type="number"
                      name="FloorCode"
                      value={form.FloorCode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Title Code</label>
                    <input
                      type="number"
                      name="TitleCode"
                      value={form.TitleCode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field full">
                    <label>
                      Name<span className="req">*</span>
                    </label>
                    <input
                      name="Name"
                      value={form.Name || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Short Name</label>
                    <input
                      name="ShortName"
                      value={form.ShortName || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="erp-section">
                <h3 className="erp-section-title">Contact & Address</h3>
                <div className="erp-field-grid">
                  <div className="erp-field full">
                    <label>Address</label>
                    <textarea
                      rows={3}
                      name="Address"
                      value={form.Address || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>City Code</label>
                    <input
                      type="number"
                      name="CityCode"
                      value={form.CityCode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Pincode</label>
                    <input
                      type="number"
                      name="Pincode"
                      value={form.Pincode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>DOB</label>
                    <input
                      type="date"
                      name="DOB"
                      value={form.DOB || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>DOJ</label>
                    <input
                      type="date"
                      name="DOJ"
                      value={form.DOJ || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Phone</label>
                    <input
                      type="number"
                      name="Phoneno"
                      value={form.Phoneno || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Mobile</label>
                    <input
                      type="number"
                      name="Mobile"
                      value={form.Mobile || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field full">
                    <label>Email</label>
                    <input
                      type="email"
                      name="Email"
                      value={form.Email || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="erp-column">
              <div className="erp-section">
                <h3 className="erp-section-title">Payroll & Commission</h3>
                <div className="erp-field-grid">
                  <div className="erp-field">
                    <label>PAN No</label>
                    <input
                      name="Panno"
                      value={form.Panno || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field checkbox-row full">
                    <label>Commission Allowed</label>
                    <input
                      type="checkbox"
                      name="CommissionAllowed"
                      checked={!!form.CommissionAllowed}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Commission %</label>
                    <input
                      type="number"
                      step="0.00001"
                      name="CommissionPercent"
                      value={form.CommissionPercent}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="erp-section">
                <h3 className="erp-section-title">Login & Rights</h3>
                <div className="erp-field-grid">
                  <div className="erp-field checkbox-row full">
                    <label>Login User</label>
                    <input
                      type="checkbox"
                      name="LoginUser"
                      checked={!!form.LoginUser}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>User Group Code</label>
                    <input
                      type="number"
                      name="UserGroupCode"
                      value={form.UserGroupCode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Password</label>
                    <input
                      type="password"
                      name="Password"
                      value={form.Password || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field checkbox-row full">
                    <label>Allow Sales Discount</label>
                    <input
                      type="checkbox"
                      name="AllowSalesDiscount"
                      checked={!!form.AllowSalesDiscount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field checkbox-row full">
                    <label>Allow View Cost</label>
                    <input
                      type="checkbox"
                      name="AllowViewActualSales"
                      checked={!!form.AllowViewActualSales}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field checkbox-row full">
                    <label>Is Admin</label>
                    <input
                      type="checkbox"
                      name="ISADMIN"
                      checked={!!form.ISADMIN}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>Skin Name</label>
                    <input
                      name="SkinName"
                      value={form.SkinName || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field">
                    <label>User ID</label>
                    <input
                      type="number"
                      name="UserID"
                      value={form.UserID || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="erp-field checkbox-row full">
                    <label>Active</label>
                    <input
                      type="checkbox"
                      name="Active"
                      checked={!!form.Active}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="erp-drawer-footer">
            <button className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={save}>
              {form.Code ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
