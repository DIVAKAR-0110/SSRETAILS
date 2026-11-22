// frontend/src/Component/Master/ItemDefinition/Product/Product.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./Product.css";

const API_ROOT = "http://localhost:8000";

const CATEGORY_DEFS = [
  { code: 1, label: "Category 1", name: "BRAND", endpoint: "brand" },
  { code: 2, label: "Category 2", name: "TYPE", endpoint: "type" },
  { code: 3, label: "Category 3", name: "STYLE", endpoint: "style" },
  { code: 4, label: "Category 4", name: "PATTERN", endpoint: "pattern" },
  { code: 5, label: "Category 5", name: "COLOR", endpoint: "color" },
  { code: 6, label: "Category 6", name: "HSN CODE", endpoint: "hsn_code" },
  { code: 7, label: "Category 7", name: "FLOOR", endpoint: "floor_category" },
  { code: 8, label: "Section", name: "SECTION", endpoint: "section" },
  { code: 9, label: "Section Group", name: "SECTION GROUP", endpoint: "section_group" },
  { code: 10, label: "Size Order", name: "SIZE ORDER", endpoint: "sizeorder" },
];

export default function Product({ adminId = 1, onExit }) {
  // Lookups state
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [existingProducts, setExistingProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState({});
  const [activeTab, setActiveTab] = useState("general");

  // Load Lookups on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [itemsRes, typesRes, uomsRes, activeProdRes] = await Promise.all([
          fetch(`${API_ROOT}/items/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/item-types/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/uoms/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/products/active/`).then((r) => r.json()).catch(() => []),
        ]);

        if (isMounted) {
          setItems(Array.isArray(itemsRes) ? itemsRes : []);
          setItemTypes(Array.isArray(typesRes) ? typesRes : []);
          setUoms(Array.isArray(uomsRes) ? uomsRes : []);
          setExistingProducts(Array.isArray(activeProdRes) ? activeProdRes : []);
        }

        // Fetch category values for 1..10
        const catPromises = CATEGORY_DEFS.map((cat) =>
          fetch(`${API_ROOT}/${cat.endpoint}/`)
            .then((r) => r.json())
            .then((data) => ({ code: cat.code, data: Array.isArray(data) ? data : [] }))
            .catch(() => ({ code: cat.code, data: [] }))
        );
        const catResults = await Promise.all(catPromises);
        if (isMounted) {
          const map = {};
          catResults.forEach((res) => {
            map[res.code] = res.data;
          });
          setCategoryOptions(map);
        }
      } catch (err) {
        console.error("Error loading product lookups:", err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Product Name",
        type: "text",
        required: true,
        maxLength: 50,
      },
      {
        name: "shortname",
        label: "Short Name",
        type: "text",
        required: true,
        maxLength: 25,
      },
      {
        name: "item_name",
        label: "Item",
        type: "text",
      },
      {
        name: "item_type_name",
        label: "Item Type",
        type: "text",
      },
      {
        name: "product_sale_rate",
        label: "Sale Rate",
        type: "number",
      },
      {
        name: "base_uom_name",
        label: "Base UOM",
        type: "text",
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

  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      const handleTextChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: name === "name" || name === "shortname" || name === "print_name" || name === "star_item" || name === "hsn_code"
            ? value.toUpperCase()
            : value,
        }));
      };

      const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value === "" ? "" : Number(value),
        }));
      };

      const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      };

      const handleLoadExisting = async (e) => {
        const prodId = e.target.value;
        if (!prodId) return;
        try {
          const res = await fetch(`${API_ROOT}/products/${prodId}/`);
          if (res.ok) {
            const data = await res.json();
            setFormData((prev) => ({
              ...prev,
              item_code: data.item_code || prev.item_code,
              item_type_code: data.item_type_code || prev.item_type_code,
              base_uom_code: data.base_uom_code || prev.base_uom_code,
              purchase_uom_code: data.purchase_uom_code || prev.purchase_uom_code,
              sales_uom_code: data.sales_uom_code || prev.sales_uom_code,
              barcode_type: data.barcode_type || prev.barcode_type,
              last_bit_length: data.last_bit_length || prev.last_bit_length,
              decimal_length_in_rate: data.decimal_length_in_rate || prev.decimal_length_in_rate,
              stock_maintain: data.stock_maintain !== undefined ? data.stock_maintain : prev.stock_maintain,
              allow_sales: data.allow_sales !== undefined ? data.allow_sales : prev.allow_sales,
              allow_sales_rate_edit: data.allow_sales_rate_edit !== undefined ? data.allow_sales_rate_edit : prev.allow_sales_rate_edit,
              round_off: data.round_off !== undefined ? data.round_off : prev.round_off,
              product_sale_rate: data.product_sale_rate || prev.product_sale_rate,
              sales_disc_per: data.sales_disc_per || prev.sales_disc_per,
              category_values: data.category_values || [],
            }));
          }
        } catch (err) {
          console.error("Failed to copy from existing product:", err);
        }
      };

      const handleCategoryValueSelect = (catCode, valId) => {
        const currentVals = Array.isArray(formData.category_values) ? [...formData.category_values] : [];
        const filtered = currentVals.filter((v) => v.item_category_code !== catCode);
        if (valId) {
          filtered.push({
            item_category_code: catCode,
            item_category_value_code: Number(valId),
            is_default: true,
          });
        }
        setFormData((prev) => ({
          ...prev,
          category_values: filtered,
        }));
      };

      const getSelectedCatValue = (catCode) => {
        if (!Array.isArray(formData.category_values)) return "";
        const found = formData.category_values.find((v) => v.item_category_code === catCode);
        return found ? found.item_category_value_code : "";
      };

      return (
        <div className="product-form-container">
          <div className="product-form-tabs">
            <button
              type="button"
              className={`product-tab-btn ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              General & Options
            </button>
            <button
              type="button"
              className={`product-tab-btn ${activeTab === "categories" ? "active" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              Category Details & Unit Setup
            </button>
          </div>

          {activeTab === "general" && (
            <div className="product-two-col-layout">
              {/* Left Column: Primary Details & Options */}
              <div>
                <fieldset className="product-fieldset">
                  <legend className="product-legend">Product Details</legend>

                  <div className="product-form-row">
                    <label className="product-form-label required">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="product-form-input"
                      value={formData.name || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                      required
                    />
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label required">Short Name</label>
                    <input
                      type="text"
                      name="shortname"
                      className="product-form-input"
                      value={formData.shortname || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={25}
                      required
                    />
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Print Name</label>
                    <input
                      type="text"
                      name="print_name"
                      className="product-form-input"
                      value={formData.print_name || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={50}
                    />
                  </div>

                  {!isReadOnly && (
                    <div className="product-form-row">
                      <label className="product-form-label">Load From Existing</label>
                      <select className="product-form-select" onChange={handleLoadExisting} defaultValue="">
                        <option value="">[SELECT]</option>
                        {existingProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="product-form-row">
                    <label className="product-form-label required">Item Name</label>
                    <select
                      name="item_code"
                      className="product-form-select"
                      value={formData.item_code || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                      required
                    >
                      <option value="">[SELECT]</option>
                      {items.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label required">Item Type</label>
                    <select
                      name="item_type_code"
                      className="product-form-select"
                      value={formData.item_type_code || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                      required
                    >
                      <option value="">[SELECT]</option>
                      {itemTypes.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Barcode Type</label>
                    <select
                      name="barcode_type"
                      className="product-form-select"
                      value={formData.barcode_type || "Unique"}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                    >
                      <option value="Unique">Unique</option>
                      <option value="Batch">Batch</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Barcode Count</label>
                    <input
                      type="number"
                      name="barcode_count"
                      className="product-form-input"
                      value={formData.barcode_count ?? 0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Jump Ratio</label>
                    <input
                      type="number"
                      name="jump_ratio"
                      className="product-form-input"
                      value={formData.jump_ratio ?? 0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Decimal In Rate</label>
                    <input
                      type="number"
                      name="decimal_length_in_rate"
                      className="product-form-input"
                      value={formData.decimal_length_in_rate ?? 2}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Star Item</label>
                    <input
                      type="text"
                      name="star_item"
                      className="product-form-input"
                      value={formData.star_item || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={10}
                    />
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">HSN CODE</label>
                    <input
                      type="text"
                      name="hsn_code"
                      className="product-form-input"
                      value={formData.hsn_code || ""}
                      onChange={handleTextChange}
                      disabled={isReadOnly}
                      maxLength={15}
                    />
                  </div>
                </fieldset>

                <fieldset className="product-fieldset" style={{ marginTop: "12px" }}>
                  <legend className="product-legend">Options</legend>
                  <div className="product-options-grid">
                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="allow_sales"
                        checked={formData.allow_sales ?? true}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Allow Sales
                    </label>

                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="stock_maintain"
                        checked={formData.stock_maintain ?? true}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Stock Maintain
                    </label>

                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="allow_sales_rate_edit"
                        checked={formData.allow_sales_rate_edit ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Allow Sales Rate Edit
                    </label>

                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="fixed_or_variable_sal_rate"
                        checked={formData.fixed_or_variable_sal_rate ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Variable Sales Rate
                    </label>

                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="batch_no"
                        checked={formData.batch_no ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Batch No
                    </label>

                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="secondary_qty"
                        checked={formData.secondary_qty ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Secondary Qty
                    </label>

                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="repackable"
                        checked={formData.repackable ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Repackable
                    </label>

                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="manufacture_details"
                        checked={formData.manufacture_details ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Manufacture Details
                    </label>

                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="core_item"
                        checked={formData.core_item ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Core Item
                    </label>

                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active ?? true}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Active
                    </label>
                  </div>
                </fieldset>
              </div>

              {/* Right Column: Round Off, Rates, Image */}
              <div>
                <fieldset className="product-fieldset">
                  <legend className="product-legend">Round Off Setup</legend>
                  <div className="product-form-row">
                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="round_off"
                        checked={formData.round_off ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Round Off Enabled
                    </label>
                  </div>

                  {formData.round_off && (
                    <>
                      <div className="product-form-row">
                        <label className="product-form-label">Round Off Type</label>
                        <div className="product-radio-group">
                          <label className="product-checkbox-label">
                            <input
                              type="radio"
                              name="round_off_type"
                              value="0"
                              checked={Number(formData.round_off_type) === 0}
                              onChange={() => setFormData((p) => ({ ...p, round_off_type: 0 }))}
                              disabled={isReadOnly}
                            />
                            Amt Round
                          </label>
                          <label className="product-checkbox-label">
                            <input
                              type="radio"
                              name="round_off_type"
                              value="1"
                              checked={Number(formData.round_off_type) === 1}
                              onChange={() => setFormData((p) => ({ ...p, round_off_type: 1 }))}
                              disabled={isReadOnly}
                            />
                            Amt End
                          </label>
                        </div>
                      </div>

                      <div className="product-form-row">
                        <label className="product-form-label">Round Calc Type</label>
                        <div className="product-radio-group">
                          <label className="product-checkbox-label">
                            <input
                              type="radio"
                              name="round_calc_type"
                              value="0"
                              checked={Number(formData.round_calc_type) === 0}
                              onChange={() => setFormData((p) => ({ ...p, round_calc_type: 0 }))}
                              disabled={isReadOnly}
                            />
                            Normal
                          </label>
                          <label className="product-checkbox-label">
                            <input
                              type="radio"
                              name="round_calc_type"
                              value="1"
                              checked={Number(formData.round_calc_type) === 1}
                              onChange={() => setFormData((p) => ({ ...p, round_calc_type: 1 }))}
                              disabled={isReadOnly}
                            />
                            Upper
                          </label>
                          <label className="product-checkbox-label">
                            <input
                              type="radio"
                              name="round_calc_type"
                              value="2"
                              checked={Number(formData.round_calc_type) === 2}
                              onChange={() => setFormData((p) => ({ ...p, round_calc_type: 2 }))}
                              disabled={isReadOnly}
                            />
                            Lower
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </fieldset>

                <fieldset className="product-fieldset" style={{ marginTop: "12px" }}>
                  <legend className="product-legend">Rate & Discount Details</legend>
                  <div className="product-form-row">
                    <label className="product-form-label">Sale Rate (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="product_sale_rate"
                      className="product-form-input"
                      value={formData.product_sale_rate ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Sales Discount (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="sales_disc_per"
                      className="product-form-input"
                      value={formData.sales_disc_per ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Addl Sales Disc (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="add_sales_disc_per"
                      className="product-form-input"
                      value={formData.add_sales_disc_per ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                    <label className="product-checkbox-label" style={{ marginLeft: "8px" }}>
                      <input
                        type="checkbox"
                        name="add_sales_disc_per_include"
                        checked={formData.add_sales_disc_per_include ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Include
                    </label>
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Loyalty Card Disc (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="loyalty_card_disc"
                      className="product-form-input"
                      value={formData.loyalty_card_disc ?? 0.0}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    />
                    <label className="product-checkbox-label" style={{ marginLeft: "8px" }}>
                      <input
                        type="checkbox"
                        name="loyalty_card_disc_include"
                        checked={formData.loyalty_card_disc_include ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Include
                    </label>
                  </div>
                </fieldset>

                <fieldset className="product-fieldset" style={{ marginTop: "12px" }}>
                  <legend className="product-legend">Image Setup</legend>
                  <div className="product-form-row">
                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="image_display"
                        checked={formData.image_display ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Image Display
                    </label>
                  </div>
                  {formData.image_display && (
                    <div className="product-form-row">
                      <label className="product-form-label">Image Name</label>
                      <input
                        type="text"
                        name="image_name"
                        className="product-form-input"
                        value={formData.image_name || ""}
                        onChange={handleTextChange}
                        disabled={isReadOnly}
                        maxLength={50}
                      />
                    </div>
                  )}
                  <div className="product-image-box">No image data</div>
                </fieldset>
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div>
              {/* Category 1..10 Grid */}
              <fieldset className="product-fieldset">
                <legend className="product-legend">Category Details</legend>
                <div className="product-table-wrapper">
                  <table className="product-grid-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>#</th>
                        <th style={{ width: "140px" }}>Category</th>
                        <th style={{ width: "160px" }}>Master Name</th>
                        <th>Selected Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CATEGORY_DEFS.map((cat, idx) => {
                        const options = categoryOptions[cat.code] || [];
                        const selectedVal = getSelectedCatValue(cat.code);
                        return (
                          <tr key={cat.code}>
                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                            <td><strong>{cat.label}</strong></td>
                            <td>{cat.name}</td>
                            <td>
                              <select
                                className="product-inline-input"
                                value={selectedVal}
                                onChange={(e) => handleCategoryValueSelect(cat.code, e.target.value)}
                                disabled={isReadOnly}
                              >
                                <option value="">[NONE / NOT SELECTED]</option>
                                {options.map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.name} ({opt.shortname})
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </fieldset>

              {/* Unit Details & Salesman Incentive */}
              <div className="product-two-col-layout" style={{ marginTop: "14px" }}>
                <fieldset className="product-fieldset">
                  <legend className="product-legend">Unit Details</legend>
                  <div className="product-form-row">
                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="unit_conversion"
                        checked={formData.unit_conversion ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Unit Conversion Enabled
                    </label>
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Base UOM</label>
                    <select
                      name="base_uom_code"
                      className="product-form-select"
                      value={formData.base_uom_code || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    >
                      <option value="">[SELECT]</option>
                      {uoms.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.shortname})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Purchase UOM</label>
                    <select
                      name="purchase_uom_code"
                      className="product-form-select"
                      value={formData.purchase_uom_code || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    >
                      <option value="">[SELECT]</option>
                      {uoms.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.shortname})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="product-form-row">
                    <label className="product-form-label">Sales UOM</label>
                    <select
                      name="sales_uom_code"
                      className="product-form-select"
                      value={formData.sales_uom_code || ""}
                      onChange={handleNumberChange}
                      disabled={isReadOnly}
                    >
                      <option value="">[SELECT]</option>
                      {uoms.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.shortname})
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>

                <fieldset className="product-fieldset">
                  <legend className="product-legend">Salesman Incentive & Margin</legend>
                  <div className="product-form-row">
                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="margin_setup_reqd"
                        checked={formData.margin_setup_reqd ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Margin Setup Required
                    </label>
                  </div>

                  <div className="product-form-row">
                    <label className="product-checkbox-label">
                      <input
                        type="checkbox"
                        name="salesman_incentive"
                        checked={formData.salesman_incentive ?? false}
                        onChange={handleCheckboxChange}
                        disabled={isReadOnly}
                      />
                      Salesman Incentive Enabled
                    </label>
                  </div>

                  {formData.salesman_incentive && (
                    <>
                      <div className="product-form-row">
                        <label className="product-checkbox-label">
                          <input
                            type="checkbox"
                            name="incentive_qty_based"
                            checked={formData.incentive_qty_based ?? false}
                            onChange={handleCheckboxChange}
                            disabled={isReadOnly}
                          />
                          Quantity Based Incentive
                        </label>
                      </div>

                      <div className="product-form-row">
                        <label className="product-form-label">Percentage (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="incentive_percentage"
                          className="product-form-input"
                          value={formData.incentive_percentage ?? 0.0}
                          onChange={handleNumberChange}
                          disabled={isReadOnly}
                        />
                      </div>

                      <div className="product-form-row">
                        <label className="product-form-label">Amount (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="incentive_amount"
                          className="product-form-input"
                          value={formData.incentive_amount ?? 0.0}
                          onChange={handleNumberChange}
                          disabled={isReadOnly}
                        />
                      </div>
                    </>
                  )}
                </fieldset>
              </div>
            </div>
          )}
        </div>
      );
    },
    [activeTab, existingProducts, items, itemTypes, uoms, categoryOptions]
  );

  return (
    <Tools
      title="Product Master"
      columns={columns}
      apiBase={`${API_ROOT}/products/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="1100px"
      onExit={onExit}
    />
  );
}
