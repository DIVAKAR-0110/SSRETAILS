// src/Component/Master/JobWork/ConsumptionMaster/ConsumptionMaster.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../../Tools";
import "./ConsumptionMaster.css";

const API_BASE = "http://localhost:8000/job-work/consumptions/";
const LOCATIONS_API = "http://localhost:8000/locations/";
const CHARGE_HEADS_API = "http://localhost:8000/job-work/charge-heads/";
const PRODUCTS_LOOKUP_API = "http://localhost:8000/job-work/lookups/products/";
const ITEMS_LOOKUP_API = "http://localhost:8000/job-work/lookups/items/";

export default function ConsumptionMaster({ adminId, onExit }) {
  const [locations, setLocations] = useState([]);
  const [chargeHeads, setChargeHeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadMasters() {
      try {
        const [locRes, chRes, prodRes, itemRes] = await Promise.all([
          fetch(LOCATIONS_API).catch(() => ({ json: () => [] })),
          fetch(CHARGE_HEADS_API).catch(() => ({ json: () => [] })),
          fetch(PRODUCTS_LOOKUP_API).catch(() => ({ json: () => [] })),
          fetch(ITEMS_LOOKUP_API).catch(() => ({ json: () => [] })),
        ]);

        const [locData, chData, prodData, itemData] = await Promise.all([
          locRes.json().catch(() => []),
          chRes.json().catch(() => []),
          prodRes.json().catch(() => []),
          itemRes.json().catch(() => []),
        ]);

        if (isMounted) {
          setLocations(Array.isArray(locData) ? locData : []);
          setChargeHeads(Array.isArray(chData) ? chData : []);
          setProducts(Array.isArray(prodData) ? prodData : []);
          setItems(Array.isArray(itemData) ? itemData : []);
        }
      } catch (err) {
        console.error("Failed to load consumption masters:", err);
      }
    }
    loadMasters();
    return () => {
      isMounted = false;
    };
  }, []);

  // Columns for the Tools data table
  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "Supplier Name",
        required: true,
      },
      {
        name: "shortname",
        label: "Short Name",
      },
      {
        name: "charges_count",
        label: "Charges Defined",
        type: "number",
      },
      {
        name: "consumptions_count",
        label: "Consumptions Defined",
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

      // If opening an existing supplier and child grids not loaded yet, fetch full details
      if (formData.id && formData.charges === undefined) {
        fetch(`${API_BASE}${formData.id}/`)
          .then((res) => res.json())
          .then((d) => {
            setFormData((prev) => ({
              ...prev,
              location_id: prev.location_id || locations[0]?.id || 0,
              charges: d.charges || [],
              consumptions: d.consumptions || [],
            }));
          })
          .catch((err) => console.error("Error loading consumption details:", err));
      }

      const chargesList = formData.charges || [];
      const consumptionsList = formData.consumptions || [];

      // Charges row operations
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
        <div className="consumption-form-box">
          <fieldset className="consumption-fieldset">
            <legend className="consumption-legend">Consumption Master</legend>

            {/* Header: Location & Supplier */}
            <div className="consumption-header-row">
              <div className="consumption-field">
                <label className="consumption-label">Location</label>
                <select
                  className="consumption-select"
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

              <div className="consumption-field">
                <label className="consumption-label">Supplier:</label>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#7a4f32" }}>
                  {formData.name || "-"} {formData.shortname ? `(${formData.shortname})` : ""}
                </span>
              </div>
            </div>

            {/* Grids Container */}
            <div className="consumption-grids-box">
              {/* 1. CHARGES DETAILS */}
              <div>
                <div className="consumption-section-header">
                  <span>Charge Details ({chargesList.length})</span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      className="consumption-btn-sm"
                      onClick={addCharge}
                    >
                      + Add Charge
                    </button>
                  )}
                </div>
                <div className="consumption-grid-wrapper">
                  <table className="consumption-table">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>#</th>
                        <th>Charge Head</th>
                        <th style={{ width: "110px", textAlign: "right" }}>Charge</th>
                        {!isReadOnly && <th style={{ width: "35px" }}>Act</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {chargesList.length === 0 ? (
                        <tr>
                          <td colSpan={isReadOnly ? 3 : 4} style={{ textAlign: "center", padding: "8px", color: "#888" }}>
                            No charges defined. Click "+ Add Charge" to add rows.
                          </td>
                        </tr>
                      ) : (
                        chargesList.map((ch, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>
                              <select
                                className="consumption-grid-select"
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
                                className="consumption-input"
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
                                  className="consumption-btn-del"
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
                <div className="consumption-grid-footer">
                  <span>Total Charge:</span>
                  <span>{totalCharge.toFixed(2)}</span>
                </div>
              </div>

              {/* 2. CONSUMPTION DETAILS */}
              <div>
                <div className="consumption-section-header">
                  <span>Consumption Details ({consumptionsList.length})</span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      className="consumption-btn-sm"
                      onClick={addConsumption}
                    >
                      + Add Consumption
                    </button>
                  )}
                </div>
                <div className="consumption-grid-wrapper">
                  <table className="consumption-table">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>#</th>
                        <th>Product</th>
                        <th>Item</th>
                        <th style={{ width: "100px", textAlign: "right" }}>Cons/Pcs</th>
                        <th style={{ width: "70px", textAlign: "center" }}>Display</th>
                        {!isReadOnly && <th style={{ width: "35px" }}>Act</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {consumptionsList.length === 0 ? (
                        <tr>
                          <td colSpan={isReadOnly ? 5 : 6} style={{ textAlign: "center", padding: "8px", color: "#888" }}>
                            No consumption details defined. Click "+ Add Consumption" to add rows.
                          </td>
                        </tr>
                      ) : (
                        consumptionsList.map((cs, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>
                              <select
                                className="consumption-grid-select"
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
                                className="consumption-grid-select"
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
                                className="consumption-input"
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
                                  className="consumption-btn-del"
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
                <div className="consumption-grid-footer">
                  <span>Total Cons/Pcs:</span>
                  <span>{totalConsumption.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      );
    },
    [locations, chargeHeads, products, items]
  );

  return (
    <Tools
      title="Consumption Master"
      columns={columns}
      apiBase={API_BASE}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth="900px"
      onExit={onExit}
    />
  );
}
