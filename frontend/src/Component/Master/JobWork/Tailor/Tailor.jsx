// src/Component/Master/JobWork/Tailor/Tailor.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./Tailor.css";

const API_BASE = "http://localhost:8000/job-work/tailors/";
const LOCATIONS_API = "http://localhost:8000/locations/";
const CITIES_API = "http://localhost:8000/cities/";
const BANKS_API = "http://localhost:8000/banks/";
const CHARGE_HEADS_API = "http://localhost:8000/job-work/charge-heads/";
const PRODUCTS_LOOKUP_API = "http://localhost:8000/job-work/lookups/products/";
const ITEMS_LOOKUP_API = "http://localhost:8000/job-work/lookups/items/";

export default function Tailor({ adminId, onExit }) {
  // Lookups data
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [banks, setBanks] = useState([]);
  const [chargeHeads, setChargeHeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [contactOpen, setContactOpen] = useState(true);

  // Load all lookups once
  useEffect(() => {
    let isMounted = true;
    async function loadMasters() {
      try {
        const [locRes, cityRes, bankRes, chRes, prodRes, itemRes] = await Promise.all([
          fetch(LOCATIONS_API).catch(() => ({ json: () => [] })),
          fetch(CITIES_API).catch(() => ({ json: () => [] })),
          fetch(BANKS_API).catch(() => ({ json: () => [] })),
          fetch(CHARGE_HEADS_API).catch(() => ({ json: () => [] })),
          fetch(PRODUCTS_LOOKUP_API).catch(() => ({ json: () => [] })),
          fetch(ITEMS_LOOKUP_API).catch(() => ({ json: () => [] })),
        ]);

        const [locData, cityData, bankData, chData, prodData, itemData] = await Promise.all([
          locRes.json().catch(() => []),
          cityRes.json().catch(() => []),
          bankRes.json().catch(() => []),
          chRes.json().catch(() => []),
          prodRes.json().catch(() => []),
          itemRes.json().catch(() => []),
        ]);

        if (isMounted) {
          setLocations(Array.isArray(locData) ? locData : []);
          setCities(Array.isArray(cityData) ? cityData : []);
          setBanks(Array.isArray(bankData) ? bankData : []);
          setChargeHeads(Array.isArray(chData) ? chData : []);
          setProducts(Array.isArray(prodData) ? prodData : []);
          setItems(Array.isArray(itemData) ? itemData : []);
        }
      } catch (err) {
        console.error("Failed to load lookups for tailor:", err);
      }
    }
    loadMasters();
    return () => {
      isMounted = false;
    };
  }, []);

  // Columns for the Tools data table view
  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Name",
        required: true,
        maxLength: 50,
        transform: (v) => (v ? v.toString().toUpperCase() : ""),
      },
      {
        name: "shortname",
        label: "Short Name",
        required: true,
        maxLength: 25,
        transform: (v) => (v ? v.toString().toUpperCase() : ""),
      },
      {
        name: "city_name",
        label: "City",
      },
      {
        name: "mobile",
        label: "Mobile",
      },
      {
        name: "commission_percent",
        label: "Commission %",
        type: "number",
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
        default: true,
      },
    ],
    []
  );

  // Custom Form inside Tools modal
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      // If editing existing record and child grids not loaded yet, fetch full record
      if (formData.id && formData.contacts === undefined) {
        fetch(`${API_BASE}${formData.id}/`)
          .then((res) => res.json())
          .then((d) => {
            setFormData((prev) => ({
              ...prev,
              location_id: d.location_id || 0,
              name: d.name || "",
              shortname: d.shortname || "",
              address: d.address || "",
              city_id: d.city_id || 0,
              state_name: d.state_name || "",
              country_name: d.country_name || "",
              pincode: d.pincode || "",
              phoneno: d.phoneno || "",
              mobile: d.mobile || "",
              fax: d.fax || "",
              email: d.email || "",
              website: d.website || "",
              tinno: d.tinno || "",
              tindate: d.tindate ? d.tindate.substring(0, 10) : "",
              cstno: d.cstno || "",
              cstdate: d.cstdate ? d.cstdate.substring(0, 10) : "",
              area_code: d.area_code || "",
              panno: d.panno || "",
              tanno: d.tanno || "",
              service_tax_no: d.service_tax_no || "",
              commission_percent: d.commission_percent || 0,
              ecs_transfer: Boolean(d.ecs_transfer),
              cheque_name: d.cheque_name || "",
              bank_id: d.bank_id || 0,
              branch: d.branch || "",
              account_no: d.account_no || "",
              ifpn_no: d.ifpn_no || "",
              micr_code: d.micr_code || "",
              active: d.active !== undefined ? d.active : true,
              contacts: d.contacts || [],
              charges: d.charges || [],
              consumptions: d.consumptions || [],
            }));
          })
          .catch((err) => console.error("Error loading tailor details:", err));
      }

      // Input handlers
      const handleUppercase = (field, maxLen) => (e) => {
        const val = e.target.value.toUpperCase();
        if (maxLen && val.length > maxLen) return;
        setFormData((prev) => ({ ...prev, [field]: val }));
      };

      const handleStandard = (field, maxLen) => (e) => {
        const val = e.target.value;
        if (maxLen && val.length > maxLen) return;
        setFormData((prev) => ({ ...prev, [field]: val }));
      };

      const handleCheckbox = (field) => (e) => {
        if (isReadOnly) return;
        setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
      };

      // City selection auto-populates State and Country
      const handleCitySelect = (e) => {
        if (isReadOnly) return;
        const cId = parseInt(e.target.value, 10) || 0;
        const selectedCity = cities.find((c) => c.id === cId);
        setFormData((prev) => ({
          ...prev,
          city_id: cId,
          state_name: selectedCity ? selectedCity.state_name || "" : "",
          country_name: selectedCity ? selectedCity.country_name || "" : "",
        }));
      };

      // Contacts row operations
      const contactsList = formData.contacts || [];
      const addContact = () => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          contacts: [
            ...(prev.contacts || []),
            {
              name: "",
              shortname: "",
              gender: "MALE",
              designation: "",
              dob: "",
              doa: "",
              address: "",
              city_id: 0,
              phoneno: "",
              extension_no: "",
              mobile: "",
              fax: "",
              email: "",
            },
          ],
        }));
      };

      const updateContact = (idx, field, val) => {
        if (isReadOnly) return;
        const updated = [...(formData.contacts || [])];
        updated[idx][field] = val;
        setFormData((prev) => ({ ...prev, contacts: updated }));
      };

      const removeContact = (idx) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          contacts: (prev.contacts || []).filter((_, i) => i !== idx),
        }));
      };

      // Charges row operations
      const chargesList = formData.charges || [];
      const addCharge = () => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          charges: [
            ...(prev.charges || []),
            {
              charge_head_id: chargeHeads.length > 0 ? chargeHeads[0].id : 0,
              charge: 0,
            },
          ],
        }));
      };

      const updateCharge = (idx, field, val) => {
        if (isReadOnly) return;
        const updated = [...(formData.charges || [])];
        updated[idx][field] = val;
        setFormData((prev) => ({ ...prev, charges: updated }));
      };

      const removeCharge = (idx) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          charges: (prev.charges || []).filter((_, i) => i !== idx),
        }));
      };

      // Consumptions row operations
      const consumptionsList = formData.consumptions || [];
      const addConsumption = () => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          consumptions: [
            ...(prev.consumptions || []),
            {
              product_id: products.length > 0 ? products[0].id : 0,
              item_id: items.length > 0 ? items[0].id : 0,
              design_no: "",
              cons_pcs: 0,
            },
          ],
        }));
      };

      const updateConsumption = (idx, field, val) => {
        if (isReadOnly) return;
        const updated = [...(formData.consumptions || [])];
        updated[idx][field] = val;
        setFormData((prev) => ({ ...prev, consumptions: updated }));
      };

      const removeConsumption = (idx) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          consumptions: (prev.consumptions || []).filter((_, i) => i !== idx),
        }));
      };

      const totalCharge = chargesList.reduce((sum, c) => sum + (parseFloat(c.charge) || 0), 0);
      const totalConsumption = consumptionsList.reduce((sum, cs) => sum + (parseFloat(cs.cons_pcs) || 0), 0);

      return (
        <div className="tailor-form-container">
          <fieldset className="tailor-fieldset">
            <legend className="tailor-legend">TAILOR MASTER</legend>

            <div className="tailor-grid-2col">
              {/* LEFT COLUMN */}
              <div className="tailor-col">
                {/* Location */}
                <div className="tailor-row">
                  <label className="tailor-label">Location</label>
                  <div className="tailor-input-wrap">
                    <select
                      className="tailor-select"
                      disabled={isReadOnly}
                      value={formData.location_id ?? (locations[0]?.id || 0)}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location_id: Number(e.target.value) }))}
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name */}
                <div className="tailor-row">
                  <label className="tailor-label tailor-label-req">Name</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      required
                      maxLength={50}
                      value={formData.name || ""}
                      onChange={handleUppercase("name", 50)}
                      placeholder="ENTER TAILOR NAME"
                      autoFocus
                    />
                    <span className="tailor-char-badge">{(formData.name || "").length}/50</span>
                  </div>
                </div>

                {/* Short Name */}
                <div className="tailor-row">
                  <label className="tailor-label tailor-label-req">Short Name</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      required
                      maxLength={25}
                      value={formData.shortname || ""}
                      onChange={handleUppercase("shortname", 25)}
                      placeholder="ENTER SHORT NAME"
                    />
                    <span className="tailor-char-badge">{(formData.shortname || "").length}/25</span>
                  </div>
                </div>

                {/* Address */}
                <div className="tailor-row" style={{ alignItems: "flex-start" }}>
                  <label className="tailor-label" style={{ paddingTop: "4px" }}>Address</label>
                  <div className="tailor-input-wrap">
                    <textarea
                      className="tailor-textarea"
                      disabled={isReadOnly}
                      maxLength={400}
                      value={formData.address || ""}
                      onChange={handleUppercase("address", 400)}
                      placeholder="ENTER ADDRESS"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="tailor-row">
                  <label className="tailor-label">City</label>
                  <div className="tailor-input-wrap">
                    <select
                      className="tailor-select"
                      disabled={isReadOnly}
                      value={formData.city_id || ""}
                      onChange={handleCitySelect}
                    >
                      <option value="">[SELECT]</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* State & Country Auto-Fill */}
                <div className="tailor-row">
                  <label className="tailor-label">State</label>
                  <div className="tailor-inline-group">
                    <input
                      type="text"
                      className="tailor-input tailor-input-readonly"
                      value={formData.state_name || ""}
                      readOnly
                      placeholder="STATE"
                    />
                    <span style={{ fontSize: "11px", fontWeight: "600" }}>Country</span>
                    <input
                      type="text"
                      className="tailor-input tailor-input-readonly"
                      value={formData.country_name || ""}
                      readOnly
                      placeholder="COUNTRY"
                    />
                  </div>
                </div>

                {/* PIN/ZIP Code */}
                <div className="tailor-row">
                  <label className="tailor-label">PIN/ZIP Code</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.pincode || ""}
                      onChange={handleStandard("pincode", 50)}
                    />
                  </div>
                </div>

                {/* Phone No */}
                <div className="tailor-row">
                  <label className="tailor-label">Phone No.</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.phoneno || ""}
                      onChange={handleStandard("phoneno", 50)}
                    />
                  </div>
                </div>

                {/* Mobile No */}
                <div className="tailor-row">
                  <label className="tailor-label">Mobile No.</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.mobile || ""}
                      onChange={handleStandard("mobile", 50)}
                    />
                  </div>
                </div>

                {/* Fax No */}
                <div className="tailor-row">
                  <label className="tailor-label">Fax No.</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.fax || ""}
                      onChange={handleStandard("fax", 50)}
                    />
                  </div>
                </div>

                {/* Email Id */}
                <div className="tailor-row">
                  <label className="tailor-label">Email Id.</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="email"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.email || ""}
                      onChange={handleStandard("email", 50)}
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="tailor-row">
                  <label className="tailor-label">Website</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.website || ""}
                      onChange={handleStandard("website", 50)}
                    />
                  </div>
                </div>

                {/* TIN & TIN Date */}
                <div className="tailor-row">
                  <label className="tailor-label">TIN</label>
                  <div className="tailor-inline-group">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.tinno || ""}
                      onChange={handleStandard("tinno", 50)}
                    />
                    <span style={{ fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap" }}>TIN Date</span>
                    <input
                      type="date"
                      className="tailor-input"
                      disabled={isReadOnly}
                      value={formData.tindate ? formData.tindate.substring(0, 10) : ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, tindate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="tailor-col">
                {/* CST No & CST Date */}
                <div className="tailor-row">
                  <label className="tailor-label">CST No.</label>
                  <div className="tailor-inline-group">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.cstno || ""}
                      onChange={handleStandard("cstno", 50)}
                    />
                    <span style={{ fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap" }}>CST Date</span>
                    <input
                      type="date"
                      className="tailor-input"
                      disabled={isReadOnly}
                      value={formData.cstdate ? formData.cstdate.substring(0, 10) : ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cstdate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Area Code */}
                <div className="tailor-row">
                  <label className="tailor-label">Area Code</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.area_code || ""}
                      onChange={handleStandard("area_code", 50)}
                    />
                  </div>
                </div>

                {/* PAN */}
                <div className="tailor-row">
                  <label className="tailor-label">PAN</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.panno || ""}
                      onChange={handleUppercase("panno", 50)}
                    />
                  </div>
                </div>

                {/* TAN */}
                <div className="tailor-row">
                  <label className="tailor-label">TAN</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.tanno || ""}
                      onChange={handleUppercase("tanno", 50)}
                    />
                  </div>
                </div>

                {/* Service Tax No */}
                <div className="tailor-row">
                  <label className="tailor-label">Service Tax No.</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="text"
                      className="tailor-input"
                      disabled={isReadOnly}
                      maxLength={50}
                      value={formData.service_tax_no || ""}
                      onChange={handleStandard("service_tax_no", 50)}
                    />
                  </div>
                </div>

                {/* Commission (%) */}
                <div className="tailor-row">
                  <label className="tailor-label">Commission (%)</label>
                  <div className="tailor-input-wrap">
                    <input
                      type="number"
                      step="0.01"
                      className="tailor-input"
                      disabled={isReadOnly}
                      value={formData.commission_percent ?? 0}
                      onChange={(e) => setFormData((prev) => ({ ...prev, commission_percent: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                {/* BANK DETAILS PANEL */}
                <div className="tailor-bank-panel">
                  <div className="tailor-bank-title">BANK DETAILS</div>

                  <div className="tailor-row">
                    <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        disabled={isReadOnly}
                        checked={Boolean(formData.ecs_transfer)}
                        onChange={handleCheckbox("ecs_transfer")}
                      />
                      ECS Transfer
                    </label>
                  </div>

                  <div className="tailor-row">
                    <label className="tailor-label">Cheque Name</label>
                    <div className="tailor-input-wrap">
                      <input
                        type="text"
                        className="tailor-input"
                        disabled={isReadOnly}
                        maxLength={50}
                        value={formData.cheque_name || ""}
                        onChange={handleUppercase("cheque_name", 50)}
                      />
                    </div>
                  </div>

                  <div className="tailor-row">
                    <label className="tailor-label">Bank</label>
                    <div className="tailor-input-wrap">
                      <select
                        className="tailor-select"
                        disabled={isReadOnly}
                        value={formData.bank_id || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, bank_id: Number(e.target.value) || 0 }))}
                      >
                        <option value="">[SELECT]</option>
                        {banks.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="tailor-row">
                    <label className="tailor-label">Branch</label>
                    <div className="tailor-inline-group">
                      <input
                        type="text"
                        className="tailor-input"
                        disabled={isReadOnly}
                        maxLength={50}
                        value={formData.branch || ""}
                        onChange={handleUppercase("branch", 50)}
                        placeholder="Branch"
                      />
                      <span style={{ fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap" }}>Account No.</span>
                      <input
                        type="text"
                        className="tailor-input"
                        disabled={isReadOnly}
                        maxLength={50}
                        value={formData.account_no || ""}
                        onChange={handleStandard("account_no", 50)}
                      />
                    </div>
                  </div>

                  <div className="tailor-row">
                    <label className="tailor-label">IFPN No.</label>
                    <div className="tailor-inline-group">
                      <input
                        type="text"
                        className="tailor-input"
                        disabled={isReadOnly}
                        maxLength={50}
                        value={formData.ifpn_no || ""}
                        onChange={handleUppercase("ifpn_no", 50)}
                        placeholder="IFPN No."
                      />
                      <span style={{ fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap" }}>MICR Code</span>
                      <input
                        type="text"
                        className="tailor-input"
                        disabled={isReadOnly}
                        maxLength={50}
                        value={formData.micr_code || ""}
                        onChange={handleStandard("micr_code", 50)}
                      />
                    </div>
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="tailor-row" style={{ marginTop: "6px" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      disabled={isReadOnly}
                      checked={formData.active !== undefined ? Boolean(formData.active) : true}
                      onChange={handleCheckbox("active")}
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>

            {/* SUB-GRIDS SECTION */}
            <div className="tailor-subgrids">
              {/* 1. CONTACT DETAILS */}
              <div>
                <div
                  className="tailor-section-header"
                  onClick={() => setContactOpen(!contactOpen)}
                >
                  <span>{contactOpen ? "▲" : "▼"} CONTACT DETAILS ({contactsList.length})</span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      className="tailor-btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addContact();
                      }}
                    >
                      + Add Contact
                    </button>
                  )}
                </div>

                {contactOpen && (
                  <div className="tailor-grid-wrapper">
                    <table className="tailor-grid-table">
                      <thead>
                        <tr>
                          <th style={{ width: "25px" }}>#</th>
                          <th>Name</th>
                          <th>ShortName</th>
                          <th style={{ width: "65px" }}>Gender</th>
                          <th>Designation</th>
                          <th style={{ width: "95px" }}>DOB</th>
                          <th style={{ width: "95px" }}>DOA</th>
                          <th>Address</th>
                          <th style={{ width: "95px" }}>Phone No</th>
                          <th style={{ width: "60px" }}>Ext No</th>
                          <th style={{ width: "95px" }}>Mobile No</th>
                          <th style={{ width: "80px" }}>Fax No</th>
                          <th>Email Id.</th>
                          {!isReadOnly && <th style={{ width: "30px" }}>Act</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {contactsList.length === 0 ? (
                          <tr>
                            <td colSpan={isReadOnly ? 13 : 14} style={{ textAlign: "center", padding: "8px", color: "#888" }}>
                              No contacts added. Click "+ Add Contact" to add rows.
                            </td>
                          </tr>
                        ) : (
                          contactsList.map((c, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>
                                <input
                                  type="text"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.name || ""}
                                  onChange={(e) => updateContact(idx, "name", e.target.value.toUpperCase())}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.shortname || ""}
                                  onChange={(e) => updateContact(idx, "shortname", e.target.value.toUpperCase())}
                                />
                              </td>
                              <td>
                                <select
                                  className="tailor-subgrid-select"
                                  disabled={isReadOnly}
                                  value={c.gender || "MALE"}
                                  onChange={(e) => updateContact(idx, "gender", e.target.value)}
                                >
                                  <option value="MALE">MALE</option>
                                  <option value="FEMALE">FEMALE</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.designation || ""}
                                  onChange={(e) => updateContact(idx, "designation", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.dob ? c.dob.substring(0, 10) : ""}
                                  onChange={(e) => updateContact(idx, "dob", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.doa ? c.doa.substring(0, 10) : ""}
                                  onChange={(e) => updateContact(idx, "doa", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.address || ""}
                                  onChange={(e) => updateContact(idx, "address", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.phoneno || ""}
                                  onChange={(e) => updateContact(idx, "phoneno", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.extension_no || ""}
                                  onChange={(e) => updateContact(idx, "extension_no", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.mobile || ""}
                                  onChange={(e) => updateContact(idx, "mobile", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.fax || ""}
                                  onChange={(e) => updateContact(idx, "fax", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="email"
                                  className="tailor-subgrid-input"
                                  disabled={isReadOnly}
                                  value={c.email || ""}
                                  onChange={(e) => updateContact(idx, "email", e.target.value)}
                                />
                              </td>
                              {!isReadOnly && (
                                <td>
                                  <button
                                    type="button"
                                    className="tailor-btn-del"
                                    onClick={() => removeContact(idx)}
                                  >
                                    ✕
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 2 & 3: CHARGES DETAILS & CONSUMPTION DETAILS */}
              <div className="tailor-dual-grids">
                {/* CHARGES DETAILS */}
                <div>
                  <div className="tailor-section-header">
                    <span>CHARGES DETAILS ({chargesList.length})</span>
                    {!isReadOnly && (
                      <button
                        type="button"
                        className="tailor-btn-sm"
                        onClick={addCharge}
                      >
                        + Add Charge
                      </button>
                    )}
                  </div>
                  <div className="tailor-grid-wrapper" style={{ maxHeight: "150px" }}>
                    <table className="tailor-grid-table">
                      <thead>
                        <tr>
                          <th style={{ width: "25px" }}>#</th>
                          <th>Charge Head</th>
                          <th style={{ width: "90px", textAlign: "right" }}>Charge</th>
                          {!isReadOnly && <th style={{ width: "30px" }}>Act</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {chargesList.length === 0 ? (
                          <tr>
                            <td colSpan={isReadOnly ? 3 : 4} style={{ textAlign: "center", padding: "8px", color: "#888" }}>
                              No charges. Click "+ Add Charge".
                            </td>
                          </tr>
                        ) : (
                          chargesList.map((ch, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>
                                <select
                                  className="tailor-subgrid-select"
                                  disabled={isReadOnly}
                                  value={ch.charge_head_id || 0}
                                  onChange={(e) => updateCharge(idx, "charge_head_id", parseInt(e.target.value, 10))}
                                >
                                  <option value={0}>[SELECT CHARGE HEAD]</option>
                                  {chargeHeads.map((h) => (
                                    <option key={h.id} value={h.id}>
                                      {h.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="tailor-subgrid-input"
                                  style={{ textAlign: "right" }}
                                  disabled={isReadOnly}
                                  value={ch.charge ?? 0}
                                  onChange={(e) => updateCharge(idx, "charge", parseFloat(e.target.value) || 0)}
                                />
                              </td>
                              {!isReadOnly && (
                                <td>
                                  <button
                                    type="button"
                                    className="tailor-btn-del"
                                    onClick={() => removeCharge(idx)}
                                  >
                                    ✕
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="tailor-grid-footer">
                    <span>Total Charge:</span>
                    <span>{totalCharge.toFixed(2)}</span>
                  </div>
                </div>

                {/* CONSUMPTION DETAILS */}
                <div>
                  <div className="tailor-section-header">
                    <span>CONSUMPTION DETAILS ({consumptionsList.length})</span>
                    {!isReadOnly && (
                      <button
                        type="button"
                        className="tailor-btn-sm"
                        onClick={addConsumption}
                      >
                        + Add Consumption
                      </button>
                    )}
                  </div>
                  <div className="tailor-grid-wrapper" style={{ maxHeight: "150px" }}>
                    <table className="tailor-grid-table">
                      <thead>
                        <tr>
                          <th style={{ width: "25px" }}>#</th>
                          <th>Product</th>
                          <th>Item</th>
                          <th style={{ width: "70px", textAlign: "right" }}>Cons/Pcs</th>
                          <th style={{ width: "65px", textAlign: "center" }}>Display</th>
                          {!isReadOnly && <th style={{ width: "30px" }}>Act</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {consumptionsList.length === 0 ? (
                          <tr>
                            <td colSpan={isReadOnly ? 5 : 6} style={{ textAlign: "center", padding: "8px", color: "#888" }}>
                              No consumptions. Click "+ Add Consumption".
                            </td>
                          </tr>
                        ) : (
                          consumptionsList.map((cs, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>
                                <select
                                  className="tailor-subgrid-select"
                                  disabled={isReadOnly}
                                  value={cs.product_id || 0}
                                  onChange={(e) => updateConsumption(idx, "product_id", parseInt(e.target.value, 10))}
                                >
                                  <option value={0}>[SELECT]</option>
                                  {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <select
                                  className="tailor-subgrid-select"
                                  disabled={isReadOnly}
                                  value={cs.item_id || 0}
                                  onChange={(e) => updateConsumption(idx, "item_id", parseInt(e.target.value, 10))}
                                >
                                  <option value={0}>[SELECT]</option>
                                  {items.map((i) => (
                                    <option key={i.id} value={i.id}>
                                      {i.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="tailor-subgrid-input"
                                  style={{ textAlign: "right" }}
                                  disabled={isReadOnly}
                                  value={cs.cons_pcs ?? 0}
                                  onChange={(e) => updateConsumption(idx, "cons_pcs", parseFloat(e.target.value) || 0)}
                                />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <span style={{ fontSize: "11px", color: "#666" }}>...</span>
                              </td>
                              {!isReadOnly && (
                                <td>
                                  <button
                                    type="button"
                                    className="tailor-btn-del"
                                    onClick={() => removeConsumption(idx)}
                                  >
                                    ✕
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="tailor-grid-footer">
                    <span>Total Cons/Pcs:</span>
                    <span>{totalConsumption.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      );
    },
    [cities, locations, banks, chargeHeads, products, items, contactOpen]
  );

  return (
    <Tools
      title="Tailor Master"
      columns={columns}
      apiBase={API_BASE}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="1100px"
      onExit={onExit}
    />
  );
}
