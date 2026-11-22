// src/Component/Common/Dialog.jsx
import React, { useEffect, useRef } from "react";
import "./Dialog.css";

export default function Dialog({
  isOpen,
  title = "CONFIRMATION",
  message,
  type = "confirm", // "confirm" | "danger" | "info" | "alert"
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus();
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onCancel?.();
        } else if (e.key === "Enter") {
          e.stopPropagation();
          onConfirm?.();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const headerClass = type === "danger" ? "danger" : type === "info" ? "info" : "";

  return (
    <div className="erp-dialog-overlay" onClick={onCancel}>
      <div className="erp-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className={`erp-dialog-header ${headerClass}`}>
          <div className="erp-dialog-title-wrapper">
            <span className="erp-dialog-icon">
              {type === "danger" ? "⚠️" : type === "info" ? "ℹ️" : "❓"}
            </span>
            <span className="erp-dialog-title">{title}</span>
          </div>
          <button
            type="button"
            className="erp-dialog-close"
            onClick={onCancel}
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        <div className="erp-dialog-body">
          <div className="erp-dialog-message">{message}</div>
        </div>

        <div className="erp-dialog-footer">
          {type !== "alert" && type !== "info" && (
            <button
              type="button"
              className="erp-dialog-btn erp-dialog-btn-cancel"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            ref={confirmBtnRef}
            className={`erp-dialog-btn ${
              type === "danger" ? "erp-dialog-btn-danger" : "erp-dialog-btn-primary"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
