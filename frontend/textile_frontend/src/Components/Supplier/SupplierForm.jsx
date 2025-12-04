// SupplierForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../Employee/Employee.css";

const API_BASE = "http://127.0.0.1:8000";

export default function SupplierForm({ open, onClose, onSaved, initialData }) {
  const [titles, setTitles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [grades, setGrades] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [banks, setBanks] = useState([]);

  const emptyForm = {
    Code: "",
    TitleCode: "",
    Name: "",
    PrintName: "",
    ShortName: "",
    Address: "",
    CityCode: "",
    Pincode: "",
    Phoneno: "",
    Mobile: "",
    Fax: "",
    Email: "",
    Website: "",
    CstNo: "",
    CstDate: "",
    TinNo: "",
    TinDate: "",
    Panno: "",
    Tanno: "",
    CreditDays: 0,
    CreditLimit: 0,
    StandardDiscountOnBill: 0,
    AgentCode: "",
    AgentCommission: 0,
    CashDiscountDays: 0,
    CashDiscountPercent: 0,
    DebitDDCommission: false,
    DDCommissionPercent: 0,
    Profit: 0,
    InterestonDelay: 0,
    InterestonEarly: 0,
    CategoryCode: "",
    GroupCode: "",
    GradeCode: "",
    CompanyDepend: false,
    ECSTransfer: false,
    BankCode: "",
    Branch: "",
    AccountNo: "",
    IFPNNo: "",
    MICRCode: "",
    ChequeName: "",
    active: true,
    UserID: 1,
    AreaCode: "",
    LocationCode: "",
    AccHeadName: "",
    RepresendativeCode: "",
    DUEDAYS: 0,
    AccountHeadCode: "",
    SSAccHeadCode: "",
    GSTNO: "",
    BillDiscount: 0,
    ManualCashDiscPer: 0,
    ManualCashDays: 0,
  };

  const [form, setForm] = useState(emptyForm);

  // Load lookups when drawer opens
  useEffect(() => {
    if (!open) return;
    Promise.all([
      axios.get(`${API_BASE}/titles/`),
      axios.get(`${API_BASE}/supplier-groups/`),
      axios.get(`${API_BASE}/supplier-grades/`),
      axios.get(`${API_BASE}/supplier-categories/`),
      axios.get(`${API_BASE}/cities/`),
      axios.get(`${API_BASE}/locations/`),
      axios.get(`${API_BASE}/banks/`),
    ])
      .then(([t, g, gr, cat, ci, loc, ba]) => {
        setTitles(t.data);
        setGroups(g.data);
        setGrades(gr.data);
        setCategories(cat.data);
        setCities(ci.data);
        setLocations(loc.data);
        setBanks(ba.data);
      })
      .catch((err) => {
        console.error("LOOKUP LOAD ERROR:", err);
        toast.error("Failed to load lookups");
      });
  }, [open]);

  // When editing vs adding
  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        CstDate: initialData.CstDate
          ? initialData.CstDate.substring(0, 10)
          : "",
        TinDate: initialData.TinDate
          ? initialData.TinDate.substring(0, 10)
          : "",
      });
    } else {
      setForm(emptyForm);
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
    // Requireds
    if (!form.Name.trim()) return toast.error("Name required");
    if (!form.TitleCode) return toast.error("Title required");
    if (!form.CityCode) return toast.error("City required");
    if (!form.LocationCode) return toast.error("Location required");
    if (!form.GroupCode) return toast.error("Group required");
    if (!form.GradeCode) return toast.error("Grade required");
    if (!form.CategoryCode) return toast.error("Category required");
    if (!form.BankCode) return toast.error("Bank required");

    try {
      const num = (v) =>
        v === "" || v === null || v === undefined ? 0 : Number(v);

      const payload = {
        TitleCode: Number(form.TitleCode),
        Name: form.Name.trim(),
        PrintName: form.PrintName || "",
        ShortName: form.ShortName || "",
        Address: form.Address || "",
        CityCode: form.CityCode ? Number(form.CityCode) : null,
        Pincode: form.Pincode || "",
        Phoneno: form.Phoneno || "",
        Mobile: form.Mobile || "",
        Fax: form.Fax || "",
        Email: form.Email || "",
        Website: form.Website || "",
        CstNo: form.CstNo || "",
        CstDate: form.CstDate || null,
        TinNo: form.TinNo || "",
        TinDate: form.TinDate || null,
        Panno: form.Panno || "",
        Tanno: form.Tanno || "",
        CreditDays: num(form.CreditDays),
        CreditLimit: num(form.CreditLimit),
        StandardDiscountOnBill: num(form.StandardDiscountOnBill),
        AgentCode: form.AgentCode ? Number(form.AgentCode) : null,
        AgentCommission: num(form.AgentCommission),
        CashDiscountDays: num(form.CashDiscountDays),
        CashDiscountPercent: num(form.CashDiscountPercent),
        DebitDDCommission: !!form.DebitDDCommission,
        DDCommissionPercent: num(form.DDCommissionPercent),
        Profit: num(form.Profit),
        InterestonDelay: num(form.InterestonDelay),
        InterestonEarly: num(form.InterestonEarly),
        CategoryCode: form.CategoryCode ? Number(form.CategoryCode) : null,
        GroupCode: Number(form.GroupCode),
        GradeCode: Number(form.GradeCode),
        CompanyDepend: !!form.CompanyDepend,
        ECSTransfer: !!form.ECSTransfer,
        BankCode: Number(form.BankCode),
        Branch: form.Branch || "",
        AccountNo: form.AccountNo || "",
        IFPNNo: form.IFPNNo || "",
        MICRCode: form.MICRCode || "",
        ChequeName: form.ChequeName || "",
        active: !!form.active,
        UserID: Number(form.UserID) || 1,
        AreaCode: form.AreaCode || "",
        LocationCode: form.LocationCode ? Number(form.LocationCode) : null,
        AccHeadName: form.AccHeadName || "",
        RepresendativeCode: form.RepresendativeCode
          ? Number(form.RepresendativeCode)
          : null,
        DUEDAYS: form.DUEDAYS ? Number(form.DUEDAYS) : null,
        AccountHeadCode: form.AccountHeadCode
          ? Number(form.AccountHeadCode)
          : null,
        SSAccHeadCode: form.SSAccHeadCode ? Number(form.SSAccHeadCode) : null,
        GSTNO: form.GSTNO || "",
        BillDiscount: num(form.BillDiscount),
        ManualCashDiscPer: num(form.ManualCashDiscPer),
        ManualCashDays: num(form.ManualCashDays),
      };

      if (form.Code) payload.Code = Number(form.Code); // update

      await axios.post(`${API_BASE}/supplier/add/`, payload);
      toast.success(form.Code ? "Supplier updated" : "Supplier created");
      onSaved && onSaved();
      onClose();
    } catch (err) {
      console.error("SUPPLIER SAVE ERROR:", err.response?.data || err.message);
      toast.error("Save failed");
    }
  };

  if (!open) return null;

  return (
    <div className="erp-drawer-backdrop">
      <div className="erp-drawer">
        {/* Header */}
        <div className="erp-drawer-header">
          <div>
            <h2 className="erp-drawer-title">
              {form.Code ? "Edit Supplier" : "Add Supplier"}
            </h2>
            <p className="erp-drawer-subtitle">
              Maintain supplier master details and commercial terms.
            </p>
          </div>
          <button className="erp-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="erp-drawer-body">
          {/* LEFT column */}
          <div className="erp-column">
            <div className="erp-section">
              <h3 className="erp-section-title">Location & Basic</h3>
              <div className="erp-field-grid">
                <div className="erp-field">
                  <label>
                    Title<span className="req">*</span>
                  </label>
                  <select
                    name="TitleCode"
                    value={form.TitleCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {titles.map((t) => (
                      <option key={t.Code} value={t.Code}>
                        {t.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-field">
                  <label>
                    City<span className="req">*</span>
                  </label>
                  <select
                    name="CityCode"
                    value={form.CityCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {cities.map((c) => (
                      <option key={c.Code} value={c.Code}>
                        {c.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-field">
                  <label>
                    Location<span className="req">*</span>
                  </label>
                  <select
                    name="LocationCode"
                    value={form.LocationCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {locations.map((l) => (
                      <option key={l.Code} value={l.Code}>
                        {l.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-field">
                  <label>Area Code</label>
                  <input
                    name="AreaCode"
                    value={form.AreaCode || ""}
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
                <div className="erp-field">
                  <label>Print Name</label>
                  <input
                    name="PrintName"
                    value={form.PrintName || ""}
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
                  <label>Pincode</label>
                  <input
                    name="Pincode"
                    value={form.Pincode || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Phone</label>
                  <input
                    name="Phoneno"
                    value={form.Phoneno || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Fax</label>
                  <input
                    name="Fax"
                    value={form.Fax || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Mobile</label>
                  <input
                    name="Mobile"
                    value={form.Mobile || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Email</label>
                  <input
                    name="Email"
                    value={form.Email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field full">
                  <label>Website</label>
                  <input
                    name="Website"
                    value={form.Website || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT column */}
          <div className="erp-column">
            <div className="erp-section">
              <h3 className="erp-section-title">Tax & Registration</h3>
              <div className="erp-field-grid">
                <div className="erp-field">
                  <label>CST No</label>
                  <input
                    name="CstNo"
                    value={form.CstNo || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>CST Date</label>
                  <input
                    type="date"
                    name="CstDate"
                    value={form.CstDate || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>TIN No</label>
                  <input
                    name="TinNo"
                    value={form.TinNo || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>TIN Date</label>
                  <input
                    type="date"
                    name="TinDate"
                    value={form.TinDate || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>PAN No</label>
                  <input
                    name="Panno"
                    value={form.Panno || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>TAN No</label>
                  <input
                    name="Tanno"
                    value={form.Tanno || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field full">
                  <label>GST No</label>
                  <input
                    name="GSTNO"
                    value={form.GSTNO || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="erp-section">
              <h3 className="erp-section-title">Credit & Discount</h3>
              <div className="erp-field-grid">
                <div className="erp-field">
                  <label>Credit Days</label>
                  <input
                    type="number"
                    name="CreditDays"
                    value={form.CreditDays}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Credit Limit</label>
                  <input
                    type="number"
                    name="CreditLimit"
                    value={form.CreditLimit}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Std Discount %</label>
                  <input
                    type="number"
                    name="StandardDiscountOnBill"
                    value={form.StandardDiscountOnBill}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Agent Code</label>
                  <input
                    name="AgentCode"
                    value={form.AgentCode || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Agent Comm %</label>
                  <input
                    type="number"
                    name="AgentCommission"
                    value={form.AgentCommission}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Cash Disc Days</label>
                  <input
                    type="number"
                    name="CashDiscountDays"
                    value={form.CashDiscountDays}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Cash Disc %</label>
                  <input
                    type="number"
                    name="CashDiscountPercent"
                    value={form.CashDiscountPercent}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field checkbox-row full">
                  <label>Debit DD Commission</label>
                  <input
                    type="checkbox"
                    name="DebitDDCommission"
                    checked={!!form.DebitDDCommission}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>DD Comm %</label>
                  <input
                    type="number"
                    name="DDCommissionPercent"
                    value={form.DDCommissionPercent}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Profit %</label>
                  <input
                    type="number"
                    name="Profit"
                    value={form.Profit}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Interest Delay %</label>
                  <input
                    type="number"
                    name="InterestonDelay"
                    value={form.InterestonDelay}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Interest Early %</label>
                  <input
                    type="number"
                    name="InterestonEarly"
                    value={form.InterestonEarly}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="erp-section">
              <h3 className="erp-section-title">Bank & Classification</h3>
              <div className="erp-field-grid">
                <div className="erp-field">
                  <label>
                    Bank<span className="req">*</span>
                  </label>
                  <select
                    name="BankCode"
                    value={form.BankCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Bank</option>
                    {banks.map((b) => (
                      <option key={b.Code} value={b.Code}>
                        {b.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-field">
                  <label>Branch</label>
                  <input
                    name="Branch"
                    value={form.Branch || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Account No</label>
                  <input
                    name="AccountNo"
                    value={form.AccountNo || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>IFPN No</label>
                  <input
                    name="IFPNNo"
                    value={form.IFPNNo || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>MICR Code</label>
                  <input
                    name="MICRCode"
                    value={form.MICRCode || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field full">
                  <label>Cheque Name</label>
                  <input
                    name="ChequeName"
                    value={form.ChequeName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>
                    Group<span className="req">*</span>
                  </label>
                  <select
                    name="GroupCode"
                    value={form.GroupCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Group</option>
                    {groups.map((g) => (
                      <option key={g.Code} value={g.Code}>
                        {g.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-field">
                  <label>
                    Grade<span className="req">*</span>
                  </label>
                  <select
                    name="GradeCode"
                    value={form.GradeCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Grade</option>
                    {grades.map((gr) => (
                      <option key={gr.Code} value={gr.Code}>
                        {gr.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-field">
                  <label>
                    Category<span className="req">*</span>
                  </label>
                  <select
                    name="CategoryCode"
                    value={form.CategoryCode || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.Code} value={cat.Code}>
                        {cat.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-field full">
                  <label>Account Head Name</label>
                  <input
                    name="AccHeadName"
                    value={form.AccHeadName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Representative Code</label>
                  <input
                    name="RepresendativeCode"
                    value={form.RepresendativeCode || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Due Days</label>
                  <input
                    type="number"
                    name="DUEDAYS"
                    value={form.DUEDAYS}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Acc Head Code</label>
                  <input
                    name="AccountHeadCode"
                    value={form.AccountHeadCode || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>SS Acc Head Code</label>
                  <input
                    name="SSAccHeadCode"
                    value={form.SSAccHeadCode || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Bill Discount</label>
                  <input
                    type="number"
                    name="BillDiscount"
                    value={form.BillDiscount}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Manual Cash Disc %</label>
                  <input
                    type="number"
                    name="ManualCashDiscPer"
                    value={form.ManualCashDiscPer}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field">
                  <label>Manual Cash Days</label>
                  <input
                    type="number"
                    name="ManualCashDays"
                    value={form.ManualCashDays}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field checkbox-row full">
                  <label>Company Depend</label>
                  <input
                    type="checkbox"
                    name="CompanyDepend"
                    checked={!!form.CompanyDepend}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field checkbox-row full">
                  <label>ECS Transfer</label>
                  <input
                    type="checkbox"
                    name="ECSTransfer"
                    checked={!!form.ECSTransfer}
                    onChange={handleChange}
                  />
                </div>
                <div className="erp-field checkbox-row full">
                  <label>Active</label>
                  <input
                    type="checkbox"
                    name="active"
                    checked={!!form.active}
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
  );
}
