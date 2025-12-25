// src/Component/Login/NewRegistration.jsx
import React, { useState } from "react";
import "./NewRegistration.css";

const API_BASE = "http://127.0.0.1:8000";

export default function NewRegistration({ onSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, maxLength } = e.target;
    const trimmed = maxLength ? value.slice(0, maxLength) : value;
    setForm((prev) => ({
      ...prev,
      [name]: trimmed,
      [name]: value.toLowerCase(),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
    setServerSuccess("");
  };

  const validate = () => {
    const newErr = {};

    if (!form.username.trim()) {
      newErr.username = "Username is required";
    } else if (form.username.length < 4) {
      newErr.username = "Min 4 characters";
    }

    if (!form.email.trim()) {
      newErr.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErr.email = "Enter a valid email";
    }

    if (!form.password) {
      newErr.password = "Password is required";
    } else if (form.password.length < 6) {
      newErr.password = "Min 6 characters";
    }

    if (form.confirm !== form.password) {
      newErr.confirm = "Passwords do not match";
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    setServerSuccess("");

    try {
      const res = await fetch(`${API_BASE}/admin_register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.message || "Registration failed. Check fields and try again."
        );
      } else {
        setServerSuccess("Administrator created. You can now login.");
        setForm({ username: "", email: "", password: "", confirm: "" });
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setServerError("Unable to reach server. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo-circle">SS</div>
          <div>
            <h1 className="auth-title">New Administrator</h1>
            <p className="auth-subtitle">
              Create an ERP administrator account for SSRetails.
            </p>
          </div>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              maxLength={120}
              value={form.username}
              onChange={handleChange}
              className={errors.username ? "input error" : "input"}
              placeholder="e.g. superadmin"
              required
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              maxLength={120}
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input error" : "input"}
              placeholder="admin@ssretails.com"
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="two-col">
            <div className="field">
              <label htmlFor="reg-password">Password</label>
              <div className="password-wrap">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  maxLength={32}
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? "input error" : "input"}
                  placeholder="Min 6 characters"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="confirm">Confirm</label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                maxLength={32}
                value={form.confirm}
                onChange={handleChange}
                className={errors.confirm ? "input error" : "input"}
                placeholder="Re‑enter password"
                required
              />
              {errors.confirm && (
                <span className="error-text">{errors.confirm}</span>
              )}
            </div>
          </div>

          {serverError && <p className="server-error">{serverError}</p>}
          {serverSuccess && <p className="server-success">{serverSuccess}</p>}

          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
