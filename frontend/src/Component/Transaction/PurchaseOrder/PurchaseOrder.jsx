// frontend/src/Component/Transaction/PurchaseOrder/PurchaseOrder.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PurchaseOrder.css";

const API_ROOT = "http://localhost:8000";

export default function PurchaseOrder({ adminId = 1, onExit }) {
  // Active Tab: "general" | "details" | "summary"
  const [activeTab, setActiveTab] = useState("general");

  // Lookups
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);

  // Tab 1: General State
  const [locationId, setLocationId] = useState(1);
  const [companyId, setCompanyId] = useState(1);
  const [supplierId, setSupplierId] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  const [manualOrderNo, setManualOrderNo] = useState("");
  const [manualOrderDate, setManualOrderDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [representative, setRepresentative] = useState("");

  const [entryNo, setEntryNo] = useState("");
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [orderType, setOrderType] = useState("Regular");

  // Cash Discount Sub-grid
  const [cashDiscounts, setCashDiscounts] = useState([
    { id: 1, days: 0, discount_per: "0.00" },
  ]);

  // Tab 2: Details State
  const [itemDetails, setItemDetails] = useState([
    {
      id: 1,
      fixed_code: "",
      product_id: 1,
      product_name: "",
      item_id: 1,
      item_name: "",
      design_no: "",
      qty: "0.00",
      mtrs: "0.00",
      rate: "0.00",
      amount: "0.00",
      delivery_date: new Date().toISOString().split("T")[0],
      remarks: "",
      tax_code: 0,
      image_name: "",
    },
  ]);
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);

  // Size Details Sub-grid
  const [sizeDetails, setSizeDetails] = useState([
    {
      id: 1,
      mas_entry_order_id: 1,
      fixed_code: "",
      mtrs: "0.00",
      qty: "0.00",
      net_rate: "0.00",
      mrp: "0.00",
    },
  ]);

  // Tab 3: Summary State
  const [paymentTerms, setPaymentTerms] = useState("");
  const [remarks, setRemarks] = useState("");
  const [addLessDetails, setAddLessDetails] = useState([
    {
      id: 1,
      particulars: "Freight",
      type: "+",
      tax_percent: "0.00",
      tax_on_amount: "0.00",
      amount: "0.00",
      round_off: "0.00",
      net_amount: "0.00",
    },
  ]);

  // Bottom action bar
  const [selectedPreviousEntry, setSelectedPreviousEntry] = useState("");
  const [loading, setLoading] = useState(false);

  // Initial Lookups
  useEffect(() => {
    fetchLookups();
    fetchNextEntryNo(1);
    fetchPreviousOrders(1);
  }, []);

  const fetchLookups = async () => {
    try {
      const [locRes, compRes, supRes, taxRes] = await Promise.all([
        axios.get(`${API_ROOT}/locations/`),
        axios.get(`${API_ROOT}/companies/`),
        axios.get(`${API_ROOT}/suppliers/`),
        axios.get(`${API_ROOT}/tax-types/`),
      ]);
      setLocations(Array.isArray(locRes.data) ? locRes.data : locRes.data.results || []);
      setCompanies(Array.isArray(compRes.data) ? compRes.data : compRes.data.results || []);
      setSuppliers(Array.isArray(supRes.data) ? supRes.data : supRes.data.results || []);
      setTaxTypes(Array.isArray(taxRes.data) ? taxRes.data : taxRes.data.results || []);
    } catch (err) {
      console.error("Lookups load failed:", err);
    }
  };

  const fetchNextEntryNo = async (locId) => {
    try {
      const res = await axios.get(`${API_ROOT}/purchase-order/next-entry-no/?location_id=${locId || 1}`);
      setEntryNo(res.data.next_entry_no || "");
    } catch (err) {
      console.error("Next entry error:", err);
    }
  };

  const fetchPreviousOrders = async (locId) => {
    try {
      const res = await axios.get(`${API_ROOT}/purchase-order/previous-orders/?location_id=${locId || 1}`);
      setPreviousOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Previous orders load failed:", err);
    }
  };

  const handleSupplierChange = (val) => {
    setSupplierId(val);
    const found = suppliers.find((s) => String(s.supplier_id || s.id) === String(val));
    setSupplierAddress(found ? (found.address || found.address1 || "") : "");
  };

  // Add / Remove Cash Discount Row
  const addCashDiscountRow = () => {
    setCashDiscounts((prev) => [
      ...prev,
      { id: prev.length + 1, days: 0, discount_per: "0.00" },
    ]);
  };

  const updateCashDiscount = (idx, field, val) => {
    setCashDiscounts((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  // Add / Remove Item Row
  const addItemRow = () => {
    const nextId = itemDetails.length + 1;
    setItemDetails((prev) => [
      ...prev,
      {
        id: nextId,
        fixed_code: "",
        product_id: 1,
        product_name: "",
        item_id: 1,
        item_name: "",
        design_no: "",
        qty: "0.00",
        mtrs: "0.00",
        rate: "0.00",
        amount: "0.00",
        delivery_date: new Date().toISOString().split("T")[0],
        remarks: "",
        tax_code: 0,
        image_name: "",
      },
    ]);
    setSelectedItemIdx(nextId - 1);
  };

  const updateItemField = (idx, field, val) => {
    setItemDetails((prev) => {
      const copy = [...prev];
      const it = { ...copy[idx], [field]: val };
      if (field === "qty" || field === "rate") {
        const q = parseFloat(field === "qty" ? val : it.qty) || 0;
        const r = parseFloat(field === "rate" ? val : it.rate) || 0;
        it.amount = (q * r).toFixed(2);
      }
      copy[idx] = it;
      return copy;
    });
  };

  // Size Details Row Management
  const addSizeRow = () => {
    setSizeDetails((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        mas_entry_order_id: selectedItemIdx + 1,
        fixed_code: "",
        mtrs: "0.00",
        qty: "0.00",
        net_rate: "0.00",
        mrp: "0.00",
      },
    ]);
  };

  const updateSizeField = (idx, field, val) => {
    setSizeDetails((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  // Add / Less Details Row Management
  const addAddLessRow = () => {
    setAddLessDetails((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        particulars: "Freight",
        type: "+",
        tax_percent: "0.00",
        tax_on_amount: "0.00",
        amount: "0.00",
        round_off: "0.00",
        net_amount: "0.00",
      },
    ]);
  };

  const updateAddLessField = (idx, field, val) => {
    setAddLessDetails((prev) => {
      const copy = [...prev];
      const r = { ...copy[idx], [field]: val };
      const pct = parseFloat(r.tax_percent) || 0;
      const base = parseFloat(r.tax_on_amount) || 0;
      let amt = parseFloat(r.amount) || 0;
      if (pct > 0 && (field === "tax_percent" || field === "tax_on_amount")) {
        amt = (base * pct) / 100;
        r.amount = amt.toFixed(2);
      }
      const round = parseFloat(r.round_off) || 0;
      r.net_amount = (amt + round).toFixed(2);
      copy[idx] = r;
      return copy;
    });
  };

  // Calculation Totals
  const totalItemQty = itemDetails.reduce((sum, it) => sum + (parseFloat(it.qty) || 0), 0);
  const totalItemMtrs = itemDetails.reduce((sum, it) => sum + (parseFloat(it.mtrs) || 0), 0);
  const totalItemAmount = itemDetails.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);

  const totalSizeMtrs = sizeDetails.reduce((sum, sz) => sum + (parseFloat(sz.mtrs) || 0), 0);
  const totalSizeQty = sizeDetails.reduce((sum, sz) => sum + (parseFloat(sz.qty) || 0), 0);

  const totalAddLess = addLessDetails.reduce((sum, al) => {
    const amt = parseFloat(al.net_amount) || 0;
    return al.type === "-" ? sum - amt : sum + amt;
  }, 0);

  const grandTotalAmount = (totalItemAmount + totalAddLess).toFixed(2);

  // Load Previous Entry
  const handleLoadPreviousOrder = async (orderId) => {
    setSelectedPreviousEntry(orderId);
    if (!orderId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_ROOT}/purchase-order/${orderId}/`);
      const data = res.data;
      if (data) {
        setLocationId(data.location_id || 1);
        setCompanyId(data.company_id || 1);
        setSupplierId(data.supplier_id || "");
        setSupplierAddress(data.supplier_name ? `Supplier ID: ${data.supplier_id}` : "");
        setManualOrderNo(data.order_no || "");
        setManualOrderDate(data.order_date ? data.order_date.split("T")[0] : "");
        setRepresentative(data.rep_name || "");
        setEntryNo(data.entry_no || "");
        setEntryDate(data.entry_date ? data.entry_date.split("T")[0] : "");
        setOrderType(data.purchase_type || "Regular");
        setPaymentTerms(data.payment_terms || "");
        setRemarks(data.remarks || "");

        if (data.discount_details && data.discount_details.length > 0) {
          setCashDiscounts(data.discount_details.map((d, i) => ({ id: i + 1, ...d })));
        }
        if (data.item_details && data.item_details.length > 0) {
          setItemDetails(data.item_details.map((it, i) => ({ id: i + 1, ...it })));
        }
        if (data.add_less_details && data.add_less_details.length > 0) {
          setAddLessDetails(data.add_less_details.map((al, i) => ({ id: i + 1, ...al })));
        }
      }
    } catch (err) {
      console.error("Load order error:", err);
      alert("Failed to load purchase order details.");
    } finally {
      setLoading(false);
    }
  };

  // Save / Submit Purchase Order
  const handleSave = async () => {
    if (!supplierId) {
      alert("Please select a Supplier.");
      setActiveTab("general");
      return;
    }
    if (itemDetails.length === 0 || !itemDetails[0].qty) {
      alert("Please add at least one line item with Quantity.");
      setActiveTab("details");
      return;
    }

    const payload = {
      location_id: locationId,
      company_id: companyId,
      entry_date: entryDate,
      purchase_type: orderType,
      order_no: manualOrderNo,
      order_date: manualOrderDate,
      supplier_id: supplierId,
      rep_name: representative,
      payment_terms: paymentTerms,
      amount: grandTotalAmount,
      remarks: remarks,
      created_by: adminId,
      discount_details: cashDiscounts.map((cd, i) => ({
        entry_order_id: i + 1,
        days: parseInt(cd.days) || 0,
        discount_per: parseFloat(cd.discount_per) || 0,
      })),
      item_details: itemDetails.map((it, i) => ({
        entry_order_id: i + 1,
        fixed_code: it.fixed_code || "",
        product_id: parseInt(it.product_id) || 1,
        item_id: parseInt(it.item_id) || 1,
        design_no: it.design_no || "",
        qty: parseFloat(it.qty) || 0,
        mtrs: parseFloat(it.mtrs) || 0,
        rate: parseFloat(it.rate) || 0,
        amount: parseFloat(it.amount) || 0,
        mrp: parseFloat(it.mrp || it.rate) || 0,
        delivery_date: it.delivery_date,
        remarks: it.remarks || "",
      })),
      size_details: sizeDetails.map((sz, i) => ({
        mas_entry_order_id: sz.mas_entry_order_id || 1,
        entry_order_id: i + 1,
        fixed_code: sz.fixed_code || "",
        qty: parseFloat(sz.qty) || 0,
        mtrs: parseFloat(sz.mtrs) || 0,
        net_rate: parseFloat(sz.net_rate) || 0,
        mrp: parseFloat(sz.mrp) || 0,
      })),
      add_less_details: addLessDetails.map((al, i) => ({
        entry_order_id: i + 1,
        entry_type: "PO",
        tax_type_code: 1,
        add_or_less_type: al.type === "-",
        tax_percent: parseFloat(al.tax_percent) || 0,
        tax_on_amount: parseFloat(al.tax_on_amount) || 0,
        amount: parseFloat(al.amount) || 0,
        round_off: parseFloat(al.round_off) || 0,
        net_amount: parseFloat(al.net_amount) || 0,
      })),
    };

    try {
      setLoading(true);
      const res = await axios.post(`${API_ROOT}/purchase-order/`, payload);
      alert(`Purchase Order ${res.data.entry_no || entryNo} saved successfully!`);
      // Refresh form
      fetchNextEntryNo(locationId);
      fetchPreviousOrders(locationId);
      setActiveTab("general");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving Purchase Order: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="po-container">
      <fieldset className="po-fieldset">
        <legend className="po-legend">PURCHASE ORDER</legend>

        {/* SUB-TABS NAVIGATION */}
        <div className="po-tabstrip">
          <button
            type="button"
            className={`po-tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            type="button"
            className={`po-tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            type="button"
            className={`po-tab-btn ${activeTab === "summary" ? "active" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
        </div>

        {/* TAB 1: GENERAL */}
        {activeTab === "general" && (
          <div className="po-tab-content po-general-content">
            {/* Left Column */}
            <div className="po-gen-col-left">
              <div className="po-form-row">
                <label className="po-lbl">Location</label>
                <select
                  className="po-sel"
                  value={locationId}
                  onChange={(e) => {
                    const lId = Number(e.target.value);
                    setLocationId(lId);
                    fetchNextEntryNo(lId);
                    fetchPreviousOrders(lId);
                  }}
                >
                  {locations.map((l) => (
                    <option key={l.location_id || l.id} value={l.location_id || l.id}>
                      {l.location_name || l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="po-form-row">
                <label className="po-lbl">Company</label>
                <select
                  className="po-sel"
                  value={companyId}
                  onChange={(e) => setCompanyId(Number(e.target.value))}
                >
                  {companies.map((c) => (
                    <option key={c.company_id || c.id} value={c.company_id || c.id}>
                      {c.company_name || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="po-form-row">
                <label className="po-lbl">Supplier</label>
                <select
                  className="po-sel"
                  value={supplierId}
                  onChange={(e) => handleSupplierChange(e.target.value)}
                >
                  <option value="">-- SELECT SUPPLIER --</option>
                  {suppliers.map((s) => (
                    <option key={s.supplier_id || s.id} value={s.supplier_id || s.id}>
                      {s.supplier_name || s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="po-form-row">
                <label className="po-lbl">Address</label>
                <textarea
                  className="po-txt po-address-box"
                  readOnly
                  value={supplierAddress}
                  rows={3}
                />
              </div>

              <div className="po-form-row">
                <label className="po-lbl">Manual Order No.</label>
                <input
                  type="text"
                  className="po-inp"
                  value={manualOrderNo}
                  onChange={(e) => setManualOrderNo(e.target.value)}
                />
              </div>

              <div className="po-form-row">
                <label className="po-lbl">Manual Order Date</label>
                <input
                  type="date"
                  className="po-inp po-date-inp"
                  value={manualOrderDate}
                  onChange={(e) => setManualOrderDate(e.target.value)}
                />
              </div>

              <div className="po-form-row">
                <label className="po-lbl">Representative</label>
                <input
                  type="text"
                  className="po-inp"
                  value={representative}
                  onChange={(e) => setRepresentative(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="po-gen-col-right">
              <div className="po-form-row">
                <label className="po-lbl">Entry No.</label>
                <input
                  type="text"
                  className="po-inp po-ro"
                  readOnly
                  value={entryNo}
                />
              </div>

              <div className="po-form-row">
                <label className="po-lbl">Entry Date</label>
                <input
                  type="date"
                  className="po-inp po-date-inp"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                />
              </div>

              <div className="po-form-row">
                <label className="po-lbl">Order Type</label>
                <select
                  className="po-sel"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="Regular">Regular</option>
                  <option value="Festival">Festival</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* CASH DISCOUNT SUB-GRID */}
              <div className="po-cash-discount-panel">
                <div className="po-panel-header">
                  <span className="po-panel-title">CASH DISCOUNT</span>
                  <button type="button" className="po-sub-btn" onClick={addCashDiscountRow}>
                    + Add
                  </button>
                </div>
                <div className="po-grid-wrap po-cash-discount-grid">
                  <table className="po-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>#</th>
                        <th>Days</th>
                        <th>Percent (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cashDiscounts.map((cd, idx) => (
                        <tr key={cd.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <input
                              type="number"
                              className="po-cell-input"
                              value={cd.days}
                              onChange={(e) => updateCashDiscount(idx, "days", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="po-cell-input"
                              value={cd.discount_per}
                              onChange={(e) => updateCashDiscount(idx, "discount_per", e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILS */}
        {activeTab === "details" && (
          <div className="po-tab-content po-details-content">
            {/* Top Grid: Item Details */}
            <div className="po-details-section">
              <div className="po-panel-header">
                <span className="po-panel-title">ITEM DETAILS</span>
                <button type="button" className="po-sub-btn" onClick={addItemRow}>
                  + Add Item
                </button>
              </div>
              <div className="po-grid-wrap po-items-grid">
                <table className="po-table">
                  <thead>
                    <tr>
                      <th style={{ width: "25px" }}>#</th>
                      <th style={{ width: "80px" }}>Ref. Code</th>
                      <th style={{ width: "120px" }}>Product</th>
                      <th style={{ width: "120px" }}>Item</th>
                      <th style={{ width: "80px" }}>Design No.</th>
                      <th style={{ width: "65px", textAlign: "right" }}>Qty</th>
                      <th style={{ width: "65px", textAlign: "right" }}>Mtrs</th>
                      <th style={{ width: "70px", textAlign: "right" }}>Rate</th>
                      <th style={{ width: "80px", textAlign: "right" }}>Amount</th>
                      <th style={{ width: "95px" }}>Delivery Date</th>
                      <th style={{ width: "100px" }}>Remarks</th>
                      <th style={{ width: "45px", textAlign: "center" }}>Tax</th>
                      <th style={{ width: "75px", textAlign: "center" }}>Item Display</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemDetails.map((it, idx) => (
                      <tr
                        key={it.id}
                        className={selectedItemIdx === idx ? "po-sel-row" : ""}
                        onClick={() => setSelectedItemIdx(idx)}
                      >
                        <td>{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="po-cell-input"
                            value={it.fixed_code}
                            onChange={(e) => updateItemField(idx, "fixed_code", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="po-cell-input"
                            value={it.product_name}
                            onChange={(e) => updateItemField(idx, "product_name", e.target.value)}
                            placeholder="Product..."
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="po-cell-input"
                            value={it.item_name}
                            onChange={(e) => updateItemField(idx, "item_name", e.target.value)}
                            placeholder="Item..."
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="po-cell-input"
                            value={it.design_no}
                            onChange={(e) => updateItemField(idx, "design_no", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="po-cell-input"
                            value={it.qty}
                            onChange={(e) => updateItemField(idx, "qty", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="po-cell-input"
                            value={it.mtrs}
                            onChange={(e) => updateItemField(idx, "mtrs", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="po-cell-input"
                            value={it.rate}
                            onChange={(e) => updateItemField(idx, "rate", e.target.value)}
                          />
                        </td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>{it.amount}</td>
                        <td>
                          <input
                            type="date"
                            className="po-cell-input"
                            value={it.delivery_date}
                            onChange={(e) => updateItemField(idx, "delivery_date", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="po-cell-input"
                            value={it.remarks}
                            onChange={(e) => updateItemField(idx, "remarks", e.target.value)}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className="po-dots-btn"
                            onClick={() => alert(`Tax details for item ${idx + 1}`)}
                          >
                            ...
                          </button>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className="po-dots-btn"
                            onClick={() => alert(`Item display image for item ${idx + 1}`)}
                          >
                            ...
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Items Totals Bar */}
              <div className="po-grid-totals-bar">
                <span>Total Qty: {totalItemQty.toFixed(2)}</span>
                <span>Total Mtrs: {totalItemMtrs.toFixed(2)}</span>
                <span>Total Amount: {totalItemAmount.toFixed(2)}</span>
              </div>
              <div className="po-categories-display">
                <label>Categories:</label>
                <input type="text" className="po-inp po-ro" readOnly value="Standard Textile Sizing" />
              </div>
            </div>

            {/* Bottom Grid: Size Details */}
            <div className="po-details-section po-size-section">
              <div className="po-panel-header">
                <span className="po-panel-title">SIZE DETAILS</span>
                <button type="button" className="po-sub-btn" onClick={addSizeRow}>
                  + Add Size
                </button>
              </div>
              <div className="po-grid-wrap po-sizes-grid">
                <table className="po-table">
                  <thead>
                    <tr>
                      <th style={{ width: "25%" }}>Ref.Code</th>
                      <th style={{ width: "20%", textAlign: "right" }}>Mtrs</th>
                      <th style={{ width: "20%", textAlign: "right" }}>Qty</th>
                      <th style={{ width: "15%", textAlign: "right" }}>Rate</th>
                      <th style={{ width: "20%", textAlign: "right" }}>MRP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeDetails.map((sz, idx) => (
                      <tr key={sz.id}>
                        <td>
                          <input
                            type="text"
                            className="po-cell-input"
                            value={sz.fixed_code}
                            onChange={(e) => updateSizeField(idx, "fixed_code", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="po-cell-input"
                            value={sz.mtrs}
                            onChange={(e) => updateSizeField(idx, "mtrs", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="po-cell-input"
                            value={sz.qty}
                            onChange={(e) => updateSizeField(idx, "qty", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="po-cell-input"
                            value={sz.net_rate}
                            onChange={(e) => updateSizeField(idx, "net_rate", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="po-cell-input"
                            value={sz.mrp}
                            onChange={(e) => updateSizeField(idx, "mrp", e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="po-grid-totals-bar">
                <span>Total Mtrs: {totalSizeMtrs.toFixed(2)}</span>
                <span>Total Qty: {totalSizeQty.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUMMARY */}
        {activeTab === "summary" && (
          <div className="po-tab-content po-summary-content">
            {/* Top Grid: Item Summary Details */}
            <div className="po-summary-top-section">
              <span className="po-panel-title">ITEM SUMMARY DETAILS</span>
              <div className="po-grid-wrap po-summary-items-grid">
                <table className="po-table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>#</th>
                      <th>Product</th>
                      <th>Item</th>
                      <th>Design No</th>
                      <th style={{ textAlign: "right" }}>Qty</th>
                      <th style={{ textAlign: "right" }}>Mtrs</th>
                      <th style={{ textAlign: "right" }}>Rate</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemDetails.map((it, idx) => (
                      <tr key={it.id}>
                        <td>{idx + 1}</td>
                        <td>{it.product_name || "Textile Product"}</td>
                        <td>{it.item_name || "Textile Item"}</td>
                        <td>{it.design_no}</td>
                        <td style={{ textAlign: "right" }}>{it.qty}</td>
                        <td style={{ textAlign: "right" }}>{it.mtrs}</td>
                        <td style={{ textAlign: "right" }}>{it.rate}</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>{it.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="po-grid-totals-bar">
                <span>Total Items: {itemDetails.length}</span>
                <span>Total Qty: {totalItemQty.toFixed(2)}</span>
                <span>Total Amount: {totalItemAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Bottom Split: Terms & Add/Less */}
            <div className="po-summary-bottom-split">
              {/* Left Side: Payment Terms & Remarks */}
              <div className="po-summary-left-panel">
                <div className="po-textarea-group">
                  <label className="po-lbl-block">Payment Terms</label>
                  <textarea
                    className="po-txt po-summary-txt"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="po-textarea-group">
                  <label className="po-lbl-block">Remarks</label>
                  <textarea
                    className="po-txt po-summary-txt"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Right Side: Add / Less Details */}
              <div className="po-summary-right-panel">
                <div className="po-panel-header">
                  <span className="po-panel-title">ADD / LESS DETAILS</span>
                  <button type="button" className="po-sub-btn" onClick={addAddLessRow}>
                    + Add Charge
                  </button>
                </div>
                <div className="po-grid-wrap po-addless-grid">
                  <table className="po-table">
                    <thead>
                      <tr>
                        <th style={{ width: "25px" }}>#</th>
                        <th style={{ width: "100px" }}>Particulars</th>
                        <th style={{ width: "40px" }}>Type</th>
                        <th style={{ width: "50px", textAlign: "right" }}>(%)</th>
                        <th style={{ width: "70px", textAlign: "right" }}>Amount On</th>
                        <th style={{ width: "70px", textAlign: "right" }}>Amount</th>
                        <th style={{ width: "55px", textAlign: "right" }}>Round Off</th>
                        <th style={{ width: "70px", textAlign: "right" }}>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addLessDetails.map((al, idx) => (
                        <tr key={al.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <select
                              className="po-cell-select"
                              value={al.particulars}
                              onChange={(e) => updateAddLessField(idx, "particulars", e.target.value)}
                            >
                              <option value="Freight">Freight</option>
                              <option value="Hamali">Hamali</option>
                              <option value="GST 5%">GST 5%</option>
                              <option value="GST 12%">GST 12%</option>
                              <option value="Discount">Discount</option>
                              <option value="Other">Other</option>
                            </select>
                          </td>
                          <td>
                            <select
                              className="po-cell-select"
                              value={al.type}
                              onChange={(e) => updateAddLessField(idx, "type", e.target.value)}
                            >
                              <option value="+">+</option>
                              <option value="-">-</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="po-cell-input"
                              value={al.tax_percent}
                              onChange={(e) => updateAddLessField(idx, "tax_percent", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="po-cell-input"
                              value={al.tax_on_amount}
                              onChange={(e) => updateAddLessField(idx, "tax_on_amount", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="po-cell-input"
                              value={al.amount}
                              onChange={(e) => updateAddLessField(idx, "amount", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="po-cell-input"
                              value={al.round_off}
                              onChange={(e) => updateAddLessField(idx, "round_off", e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: "right", fontWeight: "600" }}>{al.net_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="po-grid-totals-bar po-grand-total-bar">
                  <span>Grand Total Net Amount: <strong>₹ {grandTotalAmount}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR */}
        <div className="po-footer-bar">
          <div className="po-prev-entry-group">
            <label className="po-lbl">Previous Entry No.</label>
            <select
              className="po-sel po-prev-sel"
              value={selectedPreviousEntry}
              onChange={(e) => handleLoadPreviousOrder(e.target.value)}
            >
              <option value="">-- SELECT PREVIOUS ORDER --</option>
              {previousOrders.map((po) => (
                <option key={po.entry_id} value={po.entry_id}>
                  {po.entry_no} ({po.supplier_name || "Supplier " + po.supplier_id}) - ₹{po.amount}
                </option>
              ))}
            </select>
          </div>

          <div className="po-action-buttons">
            <button
              type="button"
              className="po-btn"
              onClick={() => window.print()}
            >
              Print
            </button>
            <button
              type="button"
              className="po-btn"
              onClick={() => alert("Scanner interface ready.")}
            >
              Scan
            </button>
            <button
              type="button"
              className="po-btn po-btn-ok"
              onClick={handleSave}
              disabled={loading}
            >
              💾 OK
            </button>
            <button
              type="button"
              className="po-btn po-btn-close"
              onClick={onExit}
            >
              ❌ Close
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
