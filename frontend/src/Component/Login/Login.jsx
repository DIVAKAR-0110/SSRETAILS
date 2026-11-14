// src/Component/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE = "http://127.0.0.1:8000";

export default function Login({ onSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value, maxLength } = e.target;
    const trimmed = maxLength ? value.slice(0, maxLength) : value;
    const finalVal = name === "email" ? trimmed.toLowerCase() : trimmed;
    setForm((prev) => ({
      ...prev,
      [name]: finalVal,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const newErr = {};

    if (!form.email.trim()) {
      newErr.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErr.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErr.password = "Password is required";
    } else if (form.password.length < 6) {
      newErr.password = "Minimum 6 characters required";
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch(`${API_BASE}/admin_login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Invalid credentials. Please verify your email and password.");
      } else {
        localStorage.setItem("admin", JSON.stringify(data.data));
        if (onSuccess) onSuccess(data.data);
        navigate("/dashboard", { state: { admin: data.data }, replace: true });
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setServerError("Unable to reach backend server. Please verify Django is running on port 8000.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-root">
      {/* Background Watermark */}
      <div className="auth-bg-watermark">
        <span>SSRETAIL - GANESH TEXTILES</span>
      </div>

      <div className="auth-card">
        {/* Windows ERP Dialog Header */}
        <div className="auth-window-header">
          <div className="auth-header-left">
            <span className="auth-header-icon">❖</span>
            <span className="auth-header-title">SSRETAIL - User Authentication</span>
          </div>
          <div className="auth-header-badge">SECURE ERP LOGIN</div>
        </div>

        <div className="auth-content">
          <header className="auth-header">
            <div className="auth-logo-circle">GT</div>
            <div>
              <h1 className="auth-title">SSRETAIL-GANESH TEXTILES</h1>
              <p className="auth-subtitle">
                Retail Management &amp; Enterprise Resource Planning
              </p>
            </div>
          </header>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">User Email / Login ID</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={120}
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "input error" : "input"}
                placeholder="e.g. rdivakar0110@gmail.com"
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  maxLength={32}
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? "input error" : "input"}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            {serverError && (
              <div className="server-error-box">
                <span className="error-icon">⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            <button className="auth-btn" type="submit" disabled={submitting}>
              {submitting ? "Authenticating..." : "Sign In to ERP System"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}