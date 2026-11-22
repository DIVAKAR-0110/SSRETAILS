// frontend/src/Component/Master/ItemDefinition/ItemCategories/ItemCategory.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Tools from "../../../Tools";
import "./ItemCategory.css";

const API_ROOT = "http://localhost:8000";

const CATEGORY_CONFIGS = {
  brand: {
    id: 1,
    title: "BRAND MASTER",
    endpoint: "brand",
    hasProductGrid: true,
    hasDisc: true,
    discField: "allow_fixed_disc_amt",
  },
  type: {
    id: 2,
    title: "TYPE MASTER",
    endpoint: "type",
    hasProductGrid: true,
    hasDisc: true,
  },
  style: {
    id: 3,
    title: "STYLE MASTER",
    endpoint: "style",
    hasProductGrid: true,
    hasDisc: true,
  },
  pattern: {
    id: 4,
    title: "PATTERN MASTER",
    endpoint: "pattern",
    hasProductGrid: true,
    hasDisc: true,
  },
  color: {
    id: 5,
    title: "COLOR MASTER",
    endpoint: "color",
    hasProductGrid: true,
    hasDisc: true,
  },
  "hsn code": {
    id: 6,
    title: "HSN CODE MASTER",
    endpoint: "hsn_code",
    hasProductGrid: true,
    hasDisc: true,
  },
  hsncode: {
    id: 6,
    title: "HSN CODE MASTER",
    endpoint: "hsn_code",
    hasProductGrid: true,
    hasDisc: true,
  },
  floor: {
    id: 7,
    title: "FLOOR CATEGORY MASTER",
    endpoint: "floor_category",
    hasProductGrid: true,
    hasDisc: true,
  },
  "floor category": {
    id: 7,
    title: "FLOOR CATEGORY MASTER",
    endpoint: "floor_category",
    hasProductGrid: true,
    hasDisc: true,
  },
  floors: {
    id: 7,
    title: "FLOOR CATEGORY MASTER",
    endpoint: "floor_category",
    hasProductGrid: true,
    hasDisc: true,
  },
  section: {
    id: 8,
    title: "SECTION MASTER",
    endpoint: "section",
    hasProductGrid: false,
    hasSquareFeet: true,
  },
  "section group": {
    id: 9,
    title: "SECTION GROUP MASTER",
    endpoint: "section_group",
    hasProductGrid: true,
    hasDisc: true,
  },
  sectiongroup: {
    id: 9,
    title: "SECTION GROUP MASTER",
    endpoint: "section_group",
    hasProductGrid: true,
    hasDisc: true,
  },
  "size order": {
    id: 10,
    title: "SIZE ORDER MASTER",
    endpoint: "sizeorder",
    hasProductGrid: false,
    hasSizeOrder: true,
  },
  sizeorder: {
    id: 10,
    title: "SIZE ORDER MASTER",
    endpoint: "sizeorder",
    hasProductGrid: false,
    hasSizeOrder: true,
  },
};

export default function ItemCategory({ categoryKey = "brand", adminId = 0, onExit }) {
  const normalizedKey = (categoryKey || "brand").toString().trim().toLowerCase();
  const config = CATEGORY_CONFIGS[normalizedKey] || CATEGORY_CONFIGS["brand"];

  // Cache of active products for product grid
  const [activeProducts, setActiveProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    if (!config.hasProductGrid) return;
    let isMounted = true;
    const fetchActiveProducts = async () => {
      try {
        setProductsLoading(true);
        const res = await fetch(`${API_ROOT}/products/active/`);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        if (isMounted) {
          setActiveProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching active products:", err);
      } finally {
        if (isMounted) setProductsLoading(false);
      }
    };
    fetchActiveProducts();
    return () => {
      isMounted = false;
    };
  }, [config.hasProductGrid]);

  // Define listing columns based on category configuration
  const columns = useMemo(() => {
    const cols = [
      {
        name: "name",
        label: "Name",
        required: true,
        transform: (v) => (v ? v.toString().toUpperCase() : ""),
      },
      {
        name: "shortname",
        label: "Short Name",
        required: true,
        transform: (v) => (v ? v.toString().toUpperCase() : ""),
      },
    ];

    if (config.hasDisc && config.discField) {
      cols.push({
        name: config.discField,
        label: "Fixed Disc Amt",
        type: "number",
      });
    }

    if (config.hasSquareFeet) {
      cols.push({
        name: "square_feet",
        label: "Square Feet",
        type: "number",
      });
    }

    if (config.hasSizeOrder) {
      cols.push({
        name: "size_order",
        label: "Size Order",
        type: "number",
      });
    }

    cols.push({
      name: "active",
      label: "Active",
      type: "boolean",
    });

    return cols;
  }, [config]);

  // Custom modal form that reproduces the exact legacy .NET ERP layout
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      return (
        <ItemCategoryFormInner
          config={config}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          mode={mode}
          activeProducts={activeProducts}
          productsLoading={productsLoading}
        />
      );
    },
    [config, activeProducts, productsLoading]
  );

  return (
    <Tools
      title={config.title}
      columns={columns}
      apiBase={`${API_ROOT}/${config.endpoint}/`}
      extraPayload={{ admin_id: adminId }}
      customForm={renderCustomForm}
      modalWidth={config.hasProductGrid ? "680px" : "480px"}
      onExit={onExit}
    />
  );
}

/**
 * Inner Form Component handling Product Grid, For All Products toggle,
 * Disc%, Square Feet, Size Order, and Active Status.
 */
function ItemCategoryFormInner({
  config,
  formData,
  setFormData,
  handleChange,
  mode,
  activeProducts,
  productsLoading,
}) {
  const isReadOnly = mode === "view";
  const [forAllProducts, setForAllProducts] = useState(mode === "add");
  const [mappingsLoaded, setMappingsLoaded] = useState(false);

  // Initialize or fetch product mappings
  useEffect(() => {
    if (!config.hasProductGrid) return;
    if (activeProducts.length === 0) return;

    let isMounted = true;

    const setupMappings = async () => {
      // 1. ADD mode: default all products to selected, is_default: false
      if (mode === "add") {
        if (!formData.product_mappings || formData.product_mappings.length === 0) {
          const initMappings = activeProducts.map((p) => ({
            product_code: p.id,
            name: p.name,
            select: true,
            is_default: false,
          }));
          setFormData((prev) => ({
            ...prev,
            product_mappings: initMappings,
            allow_fixed_disc_amt: prev.allow_fixed_disc_amt || "0.00",
            active: prev.active !== undefined ? prev.active : true,
          }));
          setForAllProducts(true);
        }
        setMappingsLoaded(true);
        return;
      }

      // 2. EDIT / VIEW mode: fetch existing mappings from DB
      if (formData.id && !mappingsLoaded) {
        try {
          const res = await fetch(
            `${API_ROOT}/category-product-mappings/?category_id=${config.id}&value_id=${formData.id}`
          );
          const savedMappings = res.ok ? await res.json() : {};

          if (isMounted) {
            let allSelected = true;
            const merged = activeProducts.map((p) => {
              const saved = savedMappings[p.id];
              const isSelected = !!saved?.select;
              if (!isSelected) allSelected = false;
              return {
                product_code: p.id,
                name: p.name,
                select: isSelected,
                is_default: !!saved?.is_default,
              };
            });

            setFormData((prev) => ({
              ...prev,
              product_mappings: merged,
            }));
            setForAllProducts(allSelected && merged.length > 0);
            setMappingsLoaded(true);
          }
        } catch (err) {
          console.error("Error loading category mappings:", err);
        }
      }
    };

    setupMappings();

    return () => {
      isMounted = false;
    };
  }, [config.hasProductGrid, config.id, activeProducts, mode, formData.id, mappingsLoaded, setFormData]);

  // Handle single product row select toggle
  const handleProductSelectToggle = (idx) => {
    if (isReadOnly) return;
    const updated = [...(formData.product_mappings || [])];
    if (!updated[idx]) return;
    updated[idx] = {
      ...updated[idx],
      select: !updated[idx].select,
      is_default: !updated[idx].select ? updated[idx].is_default : false,
    };
    const allChecked = updated.every((item) => item.select);
    setForAllProducts(allChecked);
    setFormData((prev) => ({ ...prev, product_mappings: updated }));
  };

  // Handle single product row isDefault toggle
  const handleProductDefaultToggle = (idx) => {
    if (isReadOnly) return;
    const updated = [...(formData.product_mappings || [])];
    if (!updated[idx]) return;
    const newDefault = !updated[idx].is_default;
    updated[idx] = {
      ...updated[idx],
      is_default: newDefault,
      select: newDefault ? true : updated[idx].select,
    };
    setFormData((prev) => ({ ...prev, product_mappings: updated }));
  };

  // Handle "For All Product" batch toggle
  const handleToggleAllProducts = () => {
    if (isReadOnly) return;
    const nextVal = !forAllProducts;
    setForAllProducts(nextVal);
    const updated = (formData.product_mappings || []).map((item) => ({
      ...item,
      select: nextVal,
      is_default: nextVal ? item.is_default : false,
    }));
    setFormData((prev) => ({ ...prev, product_mappings: updated }));
  };

  return (
    <div className="item-cat-modal-container">
      <div className="item-cat-header-title">ITEM CATEGORY MASTER</div>

      {/* Top Header Fields: Name & Short Name */}
      <div className="item-cat-top-fields">
        <div className="item-cat-field-row">
          <label className="item-cat-field-label">Name</label>
          <div className="item-cat-field-input-wrap">
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                if (val.length <= 50) {
                  setFormData((prev) => ({ ...prev, name: val }));
                }
              }}
              disabled={isReadOnly}
              required
              maxLength={50}
              className="item-cat-input"
              placeholder="CATEGORY NAME"
            />
            <span className="item-cat-badge">{`${(formData.name || "").length}/50`}</span>
          </div>
        </div>

        <div className="item-cat-field-row">
          <label className="item-cat-field-label">Short Name</label>
          <div className="item-cat-field-input-wrap">
            <input
              type="text"
              name="shortname"
              value={formData.shortname || ""}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                if (val.length <= 25) {
                  setFormData((prev) => ({ ...prev, shortname: val }));
                }
              }}
              disabled={isReadOnly}
              required
              maxLength={25}
              className="item-cat-input"
              placeholder="SHORT NAME"
            />
            <span className="item-cat-badge">{`${(formData.shortname || "").length}/25`}</span>
          </div>
        </div>

        {/* Section Extra Field: Square Feet */}
        {config.hasSquareFeet && (
          <div className="item-cat-field-row">
            <label className="item-cat-field-label">Square Feet</label>
            <div className="item-cat-field-input-wrap">
              <input
                type="number"
                step="0.01"
                min="0"
                name="square_feet"
                value={formData.square_feet ?? "0.00"}
                onChange={handleChange}
                disabled={isReadOnly}
                className="item-cat-input item-cat-input-number"
              />
            </div>
          </div>
        )}

        {/* Size Order Extra Field: Size Order */}
        {config.hasSizeOrder && (
          <div className="item-cat-field-row">
            <label className="item-cat-field-label">Size Order</label>
            <div className="item-cat-field-input-wrap">
              <input
                type="number"
                step="1"
                name="size_order"
                value={formData.size_order ?? "0"}
                onChange={handleChange}
                disabled={isReadOnly}
                className="item-cat-input item-cat-input-number"
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Mapping Grid (Layout A) */}
      {config.hasProductGrid && (
        <div className="item-cat-grid-wrapper">
          <div className="item-cat-grid-scroll">
            {productsLoading ? (
              <div className="item-cat-loading-grid">Loading products list...</div>
            ) : (
              <table className="item-cat-product-table">
                <thead>
                  <tr>
                    <th className="item-cat-col-num">#</th>
                    <th className="item-cat-col-prod">Product</th>
                    <th className="item-cat-col-check">Select</th>
                    <th className="item-cat-col-check">IsDefault</th>
                  </tr>
                </thead>
                <tbody>
                  {(formData.product_mappings || []).map((row, idx) => (
                    <tr
                      key={row.product_code || idx}
                      className={`item-cat-row ${row.select ? "item-cat-row-selected" : ""}`}
                      onClick={() => handleProductSelectToggle(idx)}
                    >
                      <td className="item-cat-col-num">{idx + 1}</td>
                      <td className="item-cat-col-prod">{row.name}</td>
                      <td
                        className="item-cat-col-check"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={!!row.select}
                          onChange={() => handleProductSelectToggle(idx)}
                          disabled={isReadOnly}
                        />
                      </td>
                      <td
                        className="item-cat-col-check"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={!!row.is_default}
                          onChange={() => handleProductDefaultToggle(idx)}
                          disabled={isReadOnly}
                        />
                      </td>
                    </tr>
                  ))}
                  {(!formData.product_mappings || formData.product_mappings.length === 0) && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "12px", color: "#888" }}>
                        No products available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Footer Controls Row */}
      <div className="item-cat-footer-row">
        {config.hasDisc && (
          <div className="item-cat-disc-group">
            <label className="item-cat-disc-label">Disc%</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name={config.discField || "allow_fixed_disc_amt"}
              value={formData[config.discField || "allow_fixed_disc_amt"] ?? "0.00"}
              onChange={handleChange}
              disabled={isReadOnly}
              className="item-cat-input item-cat-input-number"
              style={{ width: "90px" }}
            />
          </div>
        )}

        <div className="item-cat-checkbox-group">
          {config.hasProductGrid && (
            <label className="item-cat-checkbox-label">
              <input
                type="checkbox"
                checked={forAllProducts}
                onChange={handleToggleAllProducts}
                disabled={isReadOnly}
              />
              For All Product
            </label>
          )}

          <label className="item-cat-checkbox-label">
            <input
              type="checkbox"
              name="active"
              checked={formData.active !== undefined ? !!formData.active : true}
              onChange={(e) => {
                if (isReadOnly) return;
                setFormData((prev) => ({ ...prev, active: e.target.checked }));
              }}
              disabled={isReadOnly}
            />
            Active
          </label>
        </div>
      </div>
    </div>
  );
}
