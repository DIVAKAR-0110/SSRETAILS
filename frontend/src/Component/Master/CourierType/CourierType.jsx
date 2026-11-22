// frontend/src/Component/Master/CourierType/CourierType.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Tools from "../../Tools";
import Dialog from "../../Common/Dialog.jsx";
import "./CourierType.css";

const API_ROOT = "http://localhost:8000";

export default function CourierType({ adminId = 1, onExit }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [dialog, setDialog] = useState(null);

  // Load products list for the Product Grid
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        const res = await fetch(`${API_ROOT}/products/active/`);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Columns for listing view
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
        name: "active",
        label: "Active",
        type: "boolean",
      },
    ],
    []
  );

  // Custom Form matching Image 3 (Legacy ERP Item Category template layout)
  const renderCustomForm = useCallback(
    ({ formData, setFormData, handleChange, mode }) => {
      const isReadOnly = mode === "view";
      const selectedProducts = formData.selected_products || {};
      const defaultProductId = formData.default_product_id || null;
      const forAllProducts = !!formData.for_all_products;

      const handleUppercaseInput = (field, maxLen) => (e) => {
        const val = e.target.value.toUpperCase();
        if (maxLen && val.length > maxLen) return;
        setFormData((prev) => ({ ...prev, [field]: val }));
      };

      const handleProductSelectToggle = (productId) => {
        if (isReadOnly) return;
        setFormData((prev) => {
          const current = { ...(prev.selected_products || {}) };
          if (current[productId]) {
            delete current[productId];
          } else {
            current[productId] = true;
          }
          return { ...prev, selected_products: current };
        });
      };

      const handleDefaultProduct = (productId) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
          ...prev,
          default_product_id: prev.default_product_id === productId ? null : productId,
          selected_products: {
            ...(prev.selected_products || {}),
            [productId]: true,
          },
        }));
      };

      const handleForAllProductsToggle = (e) => {
        if (isReadOnly) return;
        const checked = e.target.checked;
        const newSelected = {};
        if (checked) {
          products.forEach((p) => {
            newSelected[p.id] = true;
          });
        }
        setFormData((prev) => ({
          ...prev,
          for_all_products: checked,
          selected_products: newSelected,
        }));
      };

      return (
        <div className="courier-type-container">
          <div className="courier-type-header-title">Item Category Master</div>

          {/* Top Inputs: Name & Short Name */}
          <div className="courier-type-top-fields">
            <div className="courier-type-field-row">
              <label className="courier-type-label courier-type-label-req">Name</label>
              <div className="courier-type-input-wrap">
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleUppercaseInput("name", 50)}
                  disabled={isReadOnly}
                  required
                  maxLength={50}
                  className="courier-type-input courier-type-input-upper"
                  placeholder="COURIER TYPE NAME"
                />
                <span className="courier-type-badge">
                  {`${(formData.name || "").length}/50`}
                </span>
              </div>
            </div>

            <div className="courier-type-field-row">
              <label className="courier-type-label courier-type-label-req">Short Name</label>
              <div className="courier-type-input-wrap">
                <input
                  type="text"
                  name="shortname"
                  value={formData.shortname || ""}
                  onChange={handleUppercaseInput("shortname", 25)}
                  disabled={isReadOnly}
                  required
                  maxLength={25}
                  className="courier-type-input courier-type-input-upper"
                  placeholder="SHORT NAME"
                />
                <span className="courier-type-badge">
                  {`${(formData.shortname || "").length}/25`}
                </span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="courier-type-grid-wrap">
            <div className="courier-type-grid-scroll">
              <table className="courier-type-table">
                <thead>
                  <tr>
                    <th style={{ width: "45px", textAlign: "center" }}>#</th>
                    <th>Product</th>
                    <th style={{ width: "70px", textAlign: "center" }}>Select</th>
                    <th style={{ width: "80px", textAlign: "center" }}>IsDefault</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "12px", color: "#888" }}>
                        {loadingProducts ? "Loading products..." : "No products available."}
                      </td>
                    </tr>
                  ) : (
                    products.map((prod, idx) => {
                      const isSelected = !!selectedProducts[prod.id];
                      const isDefault = defaultProductId === prod.id;
                      return (
                        <tr
                          key={prod.id}
                          className={isSelected ? "selected-row" : ""}
                        >
                          <td style={{ textAlign: "center", color: "#666" }}>
                            {idx + 1}
                          </td>
                          <td style={{ fontWeight: isSelected ? 600 : 400 }}>
                            {prod.name}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleProductSelectToggle(prod.id)}
                              disabled={isReadOnly}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={isDefault}
                              onChange={() => handleDefaultProduct(prod.id)}
                              disabled={isReadOnly}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disc% Input Row */}
          <div className="courier-type-disc-row">
            <label className="courier-type-label" style={{ width: "70px" }}>Disc%</label>
            <input
              type="number"
              step="0.01"
              name="discount_percent"
              value={formData.discount_percent || "0.00"}
              onChange={(e) =>
                setFormData((p) => ({ ...p, discount_percent: e.target.value }))
              }
              disabled={isReadOnly}
              className="courier-type-disc-input"
            />
          </div>

          {/* Bottom Checkboxes */}
          <div className="courier-type-bottom-row">
            <label className="courier-type-check-label">
              <input
                type="checkbox"
                checked={forAllProducts}
                onChange={handleForAllProductsToggle}
                disabled={isReadOnly}
              />
              For All Product
            </label>

            <label className="courier-type-check-label">
              <input
                type="checkbox"
                name="active"
                checked={formData.active !== undefined ? !!formData.active : true}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, active: e.target.checked }))
                }
                disabled={isReadOnly}
              />
              Active
            </label>
          </div>
        </div>
      );
    },
    [products, loadingProducts]
  );

  return (
    <>
      <Tools
        title="Courier Type Mas"
        columns={columns}
        apiBase={`${API_ROOT}/courier-types/`}
        extraPayload={{ admin_id: adminId }}
        customForm={renderCustomForm}
        modalWidth="540px"
        onExit={onExit}
      />

      {dialog && (
        <Dialog
          isOpen={dialog.isOpen}
          title={dialog.title}
          message={dialog.message}
          type={dialog.type}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          onConfirm={dialog.onConfirm}
          onCancel={() => setDialog(null)}
        />
      )}
    </>
  );
}
