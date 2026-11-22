// frontend/src/Component/Master/ItemDefinition/ROL/ROL.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./ROL.css";

const API_ROOT = "http://localhost:8000";

export default function ROL({ adminId = 1, onExit }) {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Load lookups on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [prodRes, locRes, supRes] = await Promise.all([
          fetch(`${API_ROOT}/products/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/locations/`).then((r) => r.json()).catch(() => []),
          fetch(`${API_ROOT}/suppliers/`).then((r) => r.json()).catch(() => []),
        ]);

        if (isMounted) {
          setProducts(Array.isArray(prodRes) ? prodRes : []);
          setLocations(Array.isArray(locRes) ? locRes : []);
          setSuppliers(Array.isArray(supRes) ? supRes : []);
        }
      } catch (err) {
        console.error("Error loading ROL lookups:", err);
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
        name: "product_name",
        label: "Product",
        type: "text",
      },
      {
        name: "item_name",
        label: "Item",
        type: "text",
      },
      {
        name: "base_uom_name",
        label: "UOM",
        type: "text",
      },
      {
        name: "location_name",
        label: "Location",
        type: "text",
      },
      {
        name: "supplier_name",
        label: "Supplier",
        type: "text",
      },
      {
        name: "min_stk",
        label: "Min Stock",
        type: "number",
      },
      {
        name: "max_stk",
        label: "Max Stock",
        type: "number",
      },
      {
        name: "rol_qty",
        label: "Order Qty",
        type: "number",
      },
    ],
    []
  );

  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";

      // Selected product object to display joined Item & UOM
      const selectedProd = products.find(
        (p) => Number(p.id) === Number(formData.product_code)
      );

      // Selected location object
      const selectedLoc = locations.find(
        (l) => Number(l.id) === Number(formData.location_code)
      );

      const handleProductSelect = (e) => {
        const prodId = Number(e.target.value) || 0;
        const prod = products.find((p) => Number(p.id) === prodId);
        setFormData((prev) => ({
          ...prev,
          product_code: prodId,
          item_code: prod ? prod.item_code : 0,
        }));
      };

      const handleLocationSelect = (e) => {
        const locId = Number(e.target.value) || 0;
        setFormData((prev) => ({
          ...prev,
          location_code: locId,
        }));
      };

      const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value === "" ? "" : Number(value),
        }));
      };

      return (
        <div className="rol-form-container">
          {/* 1. PRODUCT DETAILS Section */}
          <fieldset className="rol-fieldset">
            <legend className="rol-legend">Product Details</legend>
            <div className="rol-table-wrapper">
              <table className="rol-grid-table">
                <thead>
                  <tr>
                    <th style={{ width: "35%" }}>Product *</th>
                    <th style={{ width: "25%" }}>Item</th>
                    <th style={{ width: "15%" }}>UOM</th>
                    <th style={{ width: "25%" }}>Location *</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        name="product_code"
                        className="rol-form-select"
                        value={formData.product_code || ""}
                        onChange={handleProductSelect}
                        disabled={isReadOnly}
                        required
                      >
                        <option value="">[SELECT PRODUCT]</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.shortname})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="rol-form-input"
                        value={selectedProd ? selectedProd.item_name || "" : ""}
                        disabled
                        placeholder="AUTO-FILLED"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="rol-form-input"
                        value={selectedProd ? selectedProd.base_uom_name || "" : ""}
                        disabled
                        placeholder="AUTO-FILLED"
                      />
                    </td>
                    <td>
                      <select
                        name="location_code"
                        className="rol-form-select"
                        value={formData.location_code || ""}
                        onChange={handleLocationSelect}
                        disabled={isReadOnly}
                        required
                      >
                        <option value="">[SELECT LOCATION]</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </fieldset>

          {/* 2. STOCK DETAILS Section */}
          <fieldset className="rol-fieldset">
            <legend className="rol-legend">Stock Details</legend>
            <div className="rol-table-wrapper">
              <table className="rol-grid-table">
                <thead>
                  <tr>
                    <th style={{ width: "18%" }}>Location</th>
                    <th style={{ width: "22%" }}>Supplier</th>
                    <th style={{ width: "12%" }}>Price From</th>
                    <th style={{ width: "12%" }}>Price To</th>
                    <th style={{ width: "12%" }}>Min Stock</th>
                    <th style={{ width: "12%" }}>Max Stock</th>
                    <th style={{ width: "12%" }}>Order Qty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        className="rol-form-input"
                        value={selectedLoc ? selectedLoc.name : "[NO LOCATION]"}
                        disabled
                      />
                    </td>
                    <td>
                      <select
                        name="supplier_code"
                        className="rol-form-select"
                        value={formData.supplier_code || ""}
                        onChange={handleNumberChange}
                        disabled={isReadOnly}
                      >
                        <option value="0">[SELECT SUPPLIER]</option>
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        name="rate_from"
                        className="rol-form-input"
                        value={formData.rate_from ?? 0.0}
                        onChange={handleNumberChange}
                        disabled={isReadOnly}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        name="rate_to"
                        className="rol-form-input"
                        value={formData.rate_to ?? 0.0}
                        onChange={handleNumberChange}
                        disabled={isReadOnly}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="1"
                        name="min_stk"
                        className="rol-form-input"
                        value={formData.min_stk ?? 0}
                        onChange={handleNumberChange}
                        disabled={isReadOnly}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="1"
                        name="max_stk"
                        className="rol-form-input"
                        value={formData.max_stk ?? 0}
                        onChange={handleNumberChange}
                        disabled={isReadOnly}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="1"
                        name="rol_qty"
                        className="rol-form-input"
                        value={formData.rol_qty ?? 0}
                        onChange={handleNumberChange}
                        disabled={isReadOnly}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>
      );
    },
    [products, locations, suppliers]
  );

  return (
    <Tools
      title="ROL Master"
      columns={columns}
      apiBase={`${API_ROOT}/rols/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="960px"
      onExit={onExit}
    />
  );
}
