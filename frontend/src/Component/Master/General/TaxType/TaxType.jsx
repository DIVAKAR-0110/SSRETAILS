// src/Component/Master/General/TaxType/TaxType.jsx
import Tools from "../../../Tools";

export default function TaxType({ adminId, onExit }) {
  const TYPE_SELECT = "[SELECT]";
  const TYPE_TAX = "TAX TYPE";
  const TYPE_ADD_LESS = "ADD / LESS";

  const columns = [
    {
      name: "entry_type",
      label: "Type",
      type: "select",
      options: [
        { value: TYPE_SELECT, label: "[SELECT]" },
        { value: TYPE_TAX, label: "TAX TYPE" },
        { value: TYPE_ADD_LESS, label: "ADD / LESS" },
      ],
      required: true,
    },
    {
      name: "name",
      label: "Tax Name",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "ENTER TAX NAME",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "short_name",
      label: "Short Name",
      type: "text",
      maxLength: 25,
      required: true,
      placeholder: "ENTER SHORT CODE",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "tax_percent",
      label: "Rate (%)",
      type: "number",
      step: "0.00001",
      min: "0",
      placeholder: "0.00000",
      required: true,
    },
    {
      name: "active",
      label: "Active",
      type: "boolean",
      default: true,
    },
  ];

  const extraPayload = {
    admin_id: adminId,
  };

  function renderCustomForm({
    formData,
    setFormData,
    handleChange,
    mode,
    columns: cols,
  }) {
    const disabled = mode === "view";
    const currentType = formData.entry_type || TYPE_TAX;
    const isAddLess = currentType === TYPE_ADD_LESS;

    // Subtab title matching the legacy screenshots
    let tabBannerTitle = "TAX TYPE MASTER";
    if (currentType === TYPE_SELECT || !formData.entry_type) {
      tabBannerTitle = "SELECT TAX TYPE MASTER";
    } else if (isAddLess) {
      tabBannerTitle = "ADD OR LESS MASTER";
    }

    const handleTextUpper = (e, maxLen) => {
      let val = e.target.value.toUpperCase();
      if (maxLen && val.length > maxLen) {
        val = val.slice(0, maxLen);
      }
      setFormData((prev) => ({ ...prev, [e.target.name]: val }));
    };

    const handleRadioChange = (name, val) => {
      setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    return (
      <div className="erp-tax-form-wrapper">
        {/* Visual Tab Banner matching legacy .NET form */}
        <div className="erp-subtab-banner">
          <span className="erp-subtab-badge">TAB</span>
          <span>{tabBannerTitle}</span>
        </div>

        <div className="erp-two-col-layout" style={{ marginTop: "12px" }}>
          {/* ===== LEFT COLUMN: Rules & Calculation ===== */}
          <div className="erp-col-left">
            {/* 1. Type Dropdown */}
            <div className="erp-form-group">
              <label>Type <span className="req">*</span></label>
              <select
                name="entry_type"
                value={formData.entry_type || TYPE_TAX}
                onChange={handleChange}
                disabled={disabled}
                className="erp-input"
              >
                <option value={TYPE_SELECT}>[SELECT]</option>
                <option value={TYPE_TAX}>TAX TYPE</option>
                <option value={TYPE_ADD_LESS}>ADD / LESS</option>
              </select>
            </div>

            {/* 2. Name */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Name <span className="req">*</span></label>
                <span className="erp-char-limit-badge">
                  {(formData.name || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={(e) => handleTextUpper(e, 50)}
                disabled={disabled}
                maxLength={50}
                placeholder="ENTER NAME"
                className="erp-input"
                required
              />
            </div>

            {/* 3. Short Name */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Short Name <span className="req">*</span></label>
                <span className="erp-char-limit-badge">
                  {(formData.short_name || "").length} / 25
                </span>
              </div>
              <input
                type="text"
                name="short_name"
                value={formData.short_name || ""}
                onChange={(e) => handleTextUpper(e, 25)}
                disabled={disabled}
                maxLength={25}
                placeholder="ENTER SHORT CODE"
                className="erp-input"
                required
              />
            </div>

            {/* 4. Tax (%) / Add / Less (%) */}
            <div className="erp-form-group">
              <label>{isAddLess ? "Add / Less (%)" : "Tax (%)"} <span className="req">*</span></label>
              <div className="erp-input-suffix-wrapper">
                <input
                  type="number"
                  name="tax_percent"
                  value={formData.tax_percent ?? "0.00"}
                  onChange={handleChange}
                  disabled={disabled}
                  step="0.00001"
                  min="0"
                  placeholder="0.00000"
                  className="erp-input with-suffix"
                  required
                />
                <span className="erp-input-suffix">Perc (%)</span>
              </div>
            </div>

            {/* 5. Cal Type Framed Box */}
            <div className="erp-form-group">
              <label className="erp-matrix-check" style={{ marginBottom: "4px" }}>
                <input
                  type="checkbox"
                  name="allow_tax_amt_cal"
                  checked={!!formData.allow_tax_amt_cal}
                  onChange={handleCheckboxChange}
                  disabled={disabled}
                />
                <span>TaxAmt Cal Type</span>
              </label>

              <div className={`erp-framed-group ${!formData.allow_tax_amt_cal ? "disabled" : ""}`}>
                <span className="erp-framed-title">Cal Type</span>
                <div className="erp-radio-group">
                  <label className="erp-radio-label">
                    <input
                      type="radio"
                      name="tax_amt_cal_type"
                      value={1}
                      checked={Number(formData.tax_amt_cal_type ?? 1) === 1}
                      onChange={() => handleRadioChange("tax_amt_cal_type", 1)}
                      disabled={disabled || !formData.allow_tax_amt_cal}
                    />
                    <span>All</span>
                  </label>
                  <label className="erp-radio-label">
                    <input
                      type="radio"
                      name="tax_amt_cal_type"
                      value={2}
                      checked={Number(formData.tax_amt_cal_type) === 2}
                      onChange={() => handleRadioChange("tax_amt_cal_type", 2)}
                      disabled={disabled || !formData.allow_tax_amt_cal}
                    />
                    <span>PrevRow</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 6. Dynamic Radio: Tax Type (Item/Value) OR Add/Less (+/-) */}
            <div className="erp-form-group">
              <label>{isAddLess ? "Add/Less" : "Tax Type"}</label>
              <div className="erp-radio-group">
                {isAddLess ? (
                  <>
                    <label className="erp-radio-label">
                      <input
                        type="radio"
                        name="tax_on"
                        value={0}
                        checked={Number(formData.tax_on ?? 0) === 0}
                        onChange={() => handleRadioChange("tax_on", 0)}
                        disabled={disabled}
                      />
                      <span>+ (Addition)</span>
                    </label>
                    <label className="erp-radio-label">
                      <input
                        type="radio"
                        name="tax_on"
                        value={1}
                        checked={Number(formData.tax_on) === 1}
                        onChange={() => handleRadioChange("tax_on", 1)}
                        disabled={disabled}
                      />
                      <span>- (Deduction)</span>
                    </label>
                  </>
                ) : (
                  <>
                    <label className="erp-radio-label">
                      <input
                        type="radio"
                        name="tax_on"
                        value={0}
                        checked={Number(formData.tax_on ?? 0) === 0}
                        onChange={() => handleRadioChange("tax_on", 0)}
                        disabled={disabled}
                      />
                      <span>Item</span>
                    </label>
                    <label className="erp-radio-label">
                      <input
                        type="radio"
                        name="tax_on"
                        value={1}
                        checked={Number(formData.tax_on) === 1}
                        onChange={() => handleRadioChange("tax_on", 1)}
                        disabled={disabled}
                      />
                      <span>Value</span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* 7. Applicability Checkbox Matrix (2x2) */}
            <div className="erp-form-group">
              <label>Applicability</label>
              <div className="erp-checkbox-matrix">
                <label className="erp-matrix-check">
                  <input
                    type="checkbox"
                    name="include"
                    checked={!!formData.include}
                    onChange={handleCheckboxChange}
                    disabled={disabled}
                  />
                  <span>Include</span>
                </label>
                <label className="erp-matrix-check">
                  <input
                    type="checkbox"
                    name="is_discount"
                    checked={!!formData.is_discount}
                    onChange={handleCheckboxChange}
                    disabled={disabled}
                  />
                  <span>Discount</span>
                </label>
                <label className="erp-matrix-check">
                  <input
                    type="checkbox"
                    name="allow_purchase"
                    checked={!!formData.allow_purchase}
                    onChange={handleCheckboxChange}
                    disabled={disabled}
                  />
                  <span>Purchase</span>
                </label>
                <label className="erp-matrix-check">
                  <input
                    type="checkbox"
                    name="allow_sales"
                    checked={!!formData.allow_sales}
                    onChange={handleCheckboxChange}
                    disabled={disabled}
                  />
                  <span>Sales</span>
                </label>
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN: Statutory Classifications ===== */}
          <div className="erp-col-right">
            {/* 1. Commodity Code */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Commodity Code</label>
                <span className="erp-char-limit-badge">
                  {(formData.commodity_code || "").length} / 15
                </span>
              </div>
              <input
                type="text"
                name="commodity_code"
                value={formData.commodity_code || ""}
                onChange={(e) => handleTextUpper(e, 15)}
                disabled={disabled}
                maxLength={15}
                placeholder="COMMODITY CODE"
                className="erp-input"
              />
            </div>

            {/* 2. Section */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Section</label>
                <span className="erp-char-limit-badge">
                  {(formData.section || "").length} / 15
                </span>
              </div>
              <input
                type="text"
                name="section"
                value={formData.section || ""}
                onChange={(e) => handleTextUpper(e, 15)}
                disabled={disabled}
                maxLength={15}
                placeholder="SECTION"
                className="erp-input"
              />
            </div>

            {/* 3. Local Category */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Local Category</label>
                <span className="erp-char-limit-badge">
                  {(formData.local_category || "").length} / 15
                </span>
              </div>
              <input
                type="text"
                name="local_category"
                value={formData.local_category || ""}
                onChange={(e) => handleTextUpper(e, 15)}
                disabled={disabled}
                maxLength={15}
                placeholder="LOCAL CATEGORY"
                className="erp-input"
              />
            </div>

            {/* 4. Other Category */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Other Category</label>
                <span className="erp-char-limit-badge">
                  {(formData.other_category || "").length} / 15
                </span>
              </div>
              <input
                type="text"
                name="other_category"
                value={formData.other_category || ""}
                onChange={(e) => handleTextUpper(e, 15)}
                disabled={disabled}
                maxLength={15}
                placeholder="OTHER CATEGORY"
                className="erp-input"
              />
            </div>

            {/* 5. Import Category */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Import Category</label>
                <span className="erp-char-limit-badge">
                  {(formData.import_category || "").length} / 15
                </span>
              </div>
              <input
                type="text"
                name="import_category"
                value={formData.import_category || ""}
                onChange={(e) => handleTextUpper(e, 15)}
                disabled={disabled}
                maxLength={15}
                placeholder="IMPORT CATEGORY"
                className="erp-input"
              />
            </div>
          </div>
        </div>

        {/* ===== BOTTOM ROW: Active Status ===== */}
        <div className="erp-form-bottom-row">
          <label className="erp-matrix-check">
            <input
              type="checkbox"
              name="active"
              checked={formData.active !== undefined ? !!formData.active : true}
              onChange={handleCheckboxChange}
              disabled={disabled}
            />
            <span>Active</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <Tools
      title="Tax Type Master"
      columns={columns}
      apiBase="http://localhost:8000/tax-types/"
      extraPayload={extraPayload}
      modalWidth="wide"
      customForm={renderCustomForm}
      onExit={onExit}
    />
  );
}
