// src/Component/Master/Company/Company.jsx
import { useEffect, useState } from "react";
import Tools from "../../Tools";

export default function Company({ adminId, onExit }) {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);

  useEffect(() => {
    async function fetchLookups() {
      try {
        setLoadingLookups(true);
        const [cityRes, stateRes] = await Promise.all([
          fetch("http://localhost:8000/cities/"),
          fetch("http://localhost:8000/states/"),
        ]);
        if (cityRes.ok) {
          const cityData = await cityRes.json();
          setCities(cityData);
        }
        if (stateRes.ok) {
          const stateData = await stateRes.json();
          setStates(stateData);
        }
      } catch (err) {
        console.error("Failed to load cities or states for Company Master", err);
      } finally {
        setLoadingLookups(false);
      }
    }
    fetchLookups();
  }, []);

  const columns = [
    {
      name: "name",
      label: "Company Name",
      type: "text",
      maxLength: 50,
      required: true,
      placeholder: "ENTER COMPANY NAME",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "shortname",
      label: "Short Name",
      type: "text",
      maxLength: 25,
      required: true,
      placeholder: "ENTER SHORT CODE",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "print_name",
      label: "Print Name",
      type: "text",
      maxLength: 50,
      placeholder: "ENTER PRINT NAME",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "city_name",
      label: "City",
      type: "text",
      readOnly: true,
    },
    {
      name: "gst_no",
      label: "GST NO",
      type: "text",
      maxLength: 30,
      placeholder: "ENTER GSTIN",
      transform: (val) => val.toUpperCase(),
    },
    {
      name: "phoneno",
      label: "Phone No",
      type: "text",
      maxLength: 50,
      placeholder: "ENTER PHONE",
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
  }) {
    const disabled = mode === "view";

    // Lookup auto-fill state and country based on selected city
    const selectedCity = cities.find(
      (c) => String(c.id) === String(formData.city_id)
    );
    const resolvedStateName =
      selectedCity?.state_name || formData.state_name || "";
    const selectedState = states.find(
      (s) =>
        String(s.id) === String(selectedCity?.state_id) ||
        s.name === resolvedStateName
    );
    const resolvedCountryName =
      selectedState?.country_name ||
      formData.country_name ||
      (resolvedStateName ? "INDIA" : "");

    const handleTextChange = (e, maxLen) => {
      let val = e.target.value;
      if (maxLen && val.length > maxLen) {
        val = val.slice(0, maxLen);
      }
      setFormData((prev) => ({ ...prev, [e.target.name]: val }));
    };

    const handleCityChange = (e) => {
      const cityId = e.target.value ? parseInt(e.target.value, 10) : 0;
      const cityObj = cities.find((c) => String(c.id) === String(cityId));
      const stateObj = states.find(
        (s) => String(s.id) === String(cityObj?.state_id)
      );

      setFormData((prev) => ({
        ...prev,
        city_id: cityId,
        city_name: cityObj ? cityObj.name : "",
        state_name: cityObj ? cityObj.state_name : "",
        country_name: stateObj ? stateObj.country_name : (cityObj ? "INDIA" : ""),
      }));
    };

    // Helper for date string display (YYYY-MM-DD)
    const formatDateForInput = (val) => {
      if (!val) return "";
      return String(val).slice(0, 10);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* 2-Column Symmetrical Layout matching legacy .NET form */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* ================= LEFT COLUMN ================= */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Name */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Company Name <span className="req">*</span></label>
                <span className="erp-char-limit-badge">
                  {(formData.name || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="name"
                className="erp-input"
                value={formData.name || ""}
                onChange={handleChange}
                maxLength={50}
                required
                disabled={disabled}
                placeholder="ENTER COMPANY NAME"
                autoFocus={mode === "add"}
              />
            </div>

            {/* Short Name */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Short Name <span className="req">*</span></label>
                <span className="erp-char-limit-badge">
                  {(formData.shortname || "").length} / 25
                </span>
              </div>
              <input
                type="text"
                name="shortname"
                className="erp-input"
                value={formData.shortname || ""}
                onChange={handleChange}
                maxLength={25}
                required
                disabled={disabled}
                placeholder="ENTER SHORT CODE"
              />
            </div>

            {/* Print Name */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Print Name</label>
                <span className="erp-char-limit-badge">
                  {(formData.print_name || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="print_name"
                className="erp-input"
                value={formData.print_name || ""}
                onChange={handleChange}
                maxLength={50}
                disabled={disabled}
                placeholder="ENTER PRINT NAME"
              />
            </div>

            {/* Address */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Address</label>
                <span className="erp-char-limit-badge">
                  {(formData.address || "").length} / 400
                </span>
              </div>
              <textarea
                name="address"
                className="erp-input"
                value={formData.address || ""}
                onChange={(e) => handleTextChange(e, 400)}
                maxLength={400}
                disabled={disabled}
                rows={2}
                placeholder="ENTER REGISTERED OFFICE ADDRESS"
                style={{ resize: "vertical", minHeight: "48px" }}
              />
            </div>

            {/* Print Address */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Print Address</label>
                <span className="erp-char-limit-badge">
                  {(formData.print_address || "").length} / 400
                </span>
              </div>
              <textarea
                name="print_address"
                className="erp-input"
                value={formData.print_address || ""}
                onChange={(e) => handleTextChange(e, 400)}
                maxLength={400}
                disabled={disabled}
                rows={2}
                placeholder="ENTER PRINT ADDRESS FOR INVOICES"
                style={{ resize: "vertical", minHeight: "48px" }}
              />
            </div>

            {/* City Dropdown */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>City</label>
              </div>
              <select
                name="city_id"
                className="erp-input"
                value={formData.city_id ?? ""}
                onChange={handleCityChange}
                disabled={disabled || loadingLookups}
              >
                <option value="">-- Select --</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State & Country (Side-by-side auto-populated) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>State</label>
                </div>
                <input
                  type="text"
                  className="erp-input"
                  value={resolvedStateName}
                  readOnly
                  placeholder="Auto from City"
                  style={{ background: "#f5efe6", color: "#66513c" }}
                />
              </div>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>Country</label>
                </div>
                <input
                  type="text"
                  className="erp-input"
                  value={resolvedCountryName}
                  readOnly
                  placeholder="Auto Country"
                  style={{ background: "#f5efe6", color: "#66513c" }}
                />
              </div>
            </div>

            {/* PIN/ZIP Code */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>PIN/ZIP Code</label>
                <span className="erp-char-limit-badge">
                  {(formData.pincode || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="pincode"
                className="erp-input"
                value={formData.pincode || ""}
                onChange={handleChange}
                maxLength={50}
                disabled={disabled}
                placeholder="ENTER PINCODE"
              />
            </div>

            {/* Phone No */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Phone No.</label>
                <span className="erp-char-limit-badge">
                  {(formData.phoneno || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="phoneno"
                className="erp-input"
                value={formData.phoneno || ""}
                onChange={handleChange}
                maxLength={50}
                disabled={disabled}
                placeholder="ENTER PHONE NO."
              />
            </div>

            {/* Mobile No */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Mobile No.</label>
                <span className="erp-char-limit-badge">
                  {(formData.mobile || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="mobile"
                className="erp-input"
                value={formData.mobile || ""}
                onChange={handleChange}
                maxLength={50}
                disabled={disabled}
                placeholder="ENTER MOBILE NO."
              />
            </div>

            {/* Fax No */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>FAX No.</label>
                <span className="erp-char-limit-badge">
                  {(formData.fax || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="fax"
                className="erp-input"
                value={formData.fax || ""}
                onChange={handleChange}
                maxLength={50}
                disabled={disabled}
                placeholder="ENTER FAX NO."
              />
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Email Id */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Email Id.</label>
                <span className="erp-char-limit-badge">
                  {(formData.email || "").length} / 50
                </span>
              </div>
              <input
                type="email"
                name="email"
                className="erp-input"
                value={formData.email || ""}
                onChange={(e) => handleTextChange(e, 50)}
                maxLength={50}
                disabled={disabled}
                placeholder="company@domain.com"
              />
            </div>

            {/* Website */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Website</label>
                <span className="erp-char-limit-badge">
                  {(formData.website || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="website"
                className="erp-input"
                value={formData.website || ""}
                onChange={(e) => handleTextChange(e, 50)}
                maxLength={50}
                disabled={disabled}
                placeholder="www.company.com"
              />
            </div>

            {/* TIN & TIN Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px" }}>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>TIN</label>
                  <span className="erp-char-limit-badge">
                    {(formData.tin_no || "").length} / 50
                  </span>
                </div>
                <input
                  type="text"
                  name="tin_no"
                  className="erp-input"
                  value={formData.tin_no || ""}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={disabled}
                  placeholder="ENTER TIN NO."
                />
              </div>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>TIN Date</label>
                </div>
                <input
                  type="date"
                  name="tin_date"
                  className="erp-input"
                  value={formatDateForInput(formData.tin_date)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tin_date: e.target.value || null,
                    }))
                  }
                  disabled={disabled}
                />
              </div>
            </div>

            {/* CST No & CST Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px" }}>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>CST No.</label>
                  <span className="erp-char-limit-badge">
                    {(formData.cst_no || "").length} / 50
                  </span>
                </div>
                <input
                  type="text"
                  name="cst_no"
                  className="erp-input"
                  value={formData.cst_no || ""}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={disabled}
                  placeholder="ENTER CST NO."
                />
              </div>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>CST Date</label>
                </div>
                <input
                  type="date"
                  name="cst_date"
                  className="erp-input"
                  value={formatDateForInput(formData.cst_date)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cst_date: e.target.value || null,
                    }))
                  }
                  disabled={disabled}
                />
              </div>
            </div>

            {/* Area Code */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>Area Code</label>
                <span className="erp-char-limit-badge">
                  {(formData.area_code || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="area_code"
                className="erp-input"
                value={formData.area_code || ""}
                onChange={handleChange}
                maxLength={50}
                disabled={disabled}
                placeholder="ENTER AREA CODE"
              />
            </div>

            {/* PAN & TAN */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>PAN</label>
                  <span className="erp-char-limit-badge">
                    {(formData.pan_no || "").length} / 50
                  </span>
                </div>
                <input
                  type="text"
                  name="pan_no"
                  className="erp-input"
                  value={formData.pan_no || ""}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={disabled}
                  placeholder="ENTER PAN"
                />
              </div>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>TAN</label>
                  <span className="erp-char-limit-badge">
                    {(formData.tan_no || "").length} / 50
                  </span>
                </div>
                <input
                  type="text"
                  name="tan_no"
                  className="erp-input"
                  value={formData.tan_no || ""}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={disabled}
                  placeholder="ENTER TAN"
                />
              </div>
            </div>

            {/* PF No & ESI No */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>PF No.</label>
                  <span className="erp-char-limit-badge">
                    {(formData.pf_no || "").length} / 50
                  </span>
                </div>
                <input
                  type="text"
                  name="pf_no"
                  className="erp-input"
                  value={formData.pf_no || ""}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={disabled}
                  placeholder="ENTER PF NO."
                />
              </div>
              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>ESI No.</label>
                  <span className="erp-char-limit-badge">
                    {(formData.esi_no || "").length} / 50
                  </span>
                </div>
                <input
                  type="text"
                  name="esi_no"
                  className="erp-input"
                  value={formData.esi_no || ""}
                  onChange={handleChange}
                  maxLength={50}
                  disabled={disabled}
                  placeholder="ENTER ESI NO."
                />
              </div>
            </div>

            {/* IE Code */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>IE Code</label>
                <span className="erp-char-limit-badge">
                  {(formData.ie_code || "").length} / 50
                </span>
              </div>
              <input
                type="text"
                name="ie_code"
                className="erp-input"
                value={formData.ie_code || ""}
                onChange={handleChange}
                maxLength={50}
                disabled={disabled}
                placeholder="ENTER IMPORT EXPORT CODE"
              />
            </div>

            {/* Greetings Line (Framed Panel) */}
            <div className="erp-framed-group">
              <div className="erp-framed-title">Greetings Line</div>

              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>Sales Greeting</label>
                  <span className="erp-char-limit-badge">
                    {(formData.greetings || "").length} / 500
                  </span>
                </div>
                <input
                  type="text"
                  name="greetings"
                  className="erp-input"
                  value={formData.greetings || ""}
                  onChange={(e) => handleTextChange(e, 500)}
                  maxLength={500}
                  disabled={disabled}
                  placeholder="ENTER SALES GREETING"
                />
              </div>

              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>Return Greeting</label>
                  <span className="erp-char-limit-badge">
                    {(formData.ret_greetings || "").length} / 500
                  </span>
                </div>
                <input
                  type="text"
                  name="ret_greetings"
                  className="erp-input"
                  value={formData.ret_greetings || ""}
                  onChange={(e) => handleTextChange(e, 500)}
                  maxLength={500}
                  disabled={disabled}
                  placeholder="ENTER RETURN GREETING"
                />
              </div>

              <div className="erp-form-group">
                <div className="erp-form-label-row">
                  <label>Settlement Greeting</label>
                  <span className="erp-char-limit-badge">
                    {(formData.set_greetings || "").length} / 500
                  </span>
                </div>
                <input
                  type="text"
                  name="set_greetings"
                  className="erp-input"
                  value={formData.set_greetings || ""}
                  onChange={(e) => handleTextChange(e, 500)}
                  maxLength={500}
                  disabled={disabled}
                  placeholder="ENTER SETTLEMENT GREETING"
                />
              </div>
            </div>

            {/* GST NO */}
            <div className="erp-form-group">
              <div className="erp-form-label-row">
                <label>GST NO</label>
                <span className="erp-char-limit-badge">
                  {(formData.gst_no || "").length} / 30
                </span>
              </div>
              <input
                type="text"
                name="gst_no"
                className="erp-input"
                value={formData.gst_no || ""}
                onChange={handleChange}
                maxLength={30}
                disabled={disabled}
                placeholder="29AAAAA0000A1Z5"
              />
            </div>
          </div>
        </div>

        {/* ===== BOTTOM ROW: Active Status ===== */}
        <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #e8dfd2" }}>
          <label className="erp-form-checkbox">
            <input
              type="checkbox"
              name="active"
              checked={
                formData.active !== undefined ? !!formData.active : true
              }
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, active: e.target.checked }))
              }
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
      title="Company Master"
      apiBase="http://localhost:8000/companies/"
      columns={columns}
      extraPayload={extraPayload}
      onExit={onExit}
      customForm={renderCustomForm}
      modalWidth="company"
    />
  );
}
