// src/Component/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // shared for login + registration

const API_BASE = "https://ssretails-backend.onrender.com";

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
    setForm((prev) => ({
      ...prev,
      [name]: trimmed,
      [name]: value.toLowerCase(),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const newErr = {};

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
        setServerError(data.message || "Login failed");
        // window.location.href = `${API_BASE}/errorpage`;
        // return;
      } else {
        // you can store id/email in localStorage or context
        localStorage.setItem("admin", JSON.stringify(data.data));
        if (onSuccess) onSuccess(data.data);
        navigate("/dashboard", { state: { admin: data.data }, replace: true });
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setServerError("Unable to reach server. Try again.");
      window.location.href = `${API_BASE}/errorpage`;
      return;
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
            <h1 className="auth-title">Administrator Login</h1>
            <p className="auth-subtitle">
              Sign in to manage SSRetails textile operations.
            </p>
          </div>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={120}
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input error" : "input"}
              placeholder="admin@ssretails.com"
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
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {serverError && <p className="server-error">{serverError}</p>}

          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
