import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import Navbar1 from "./Navbar1";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/admin_login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        navigate(`/dashboard/${data.admin_id}`);
      } else {
        setError(data.message);
      }
    } catch (error) {
      alert("There is a problem in Backend Server!");
      console.error("Fetch error:", error);
    }
  };

  return (
    <>
      <Navbar1 />

      <div className="login-container">
        <div className="login-card">
          <h2>Admin Login</h2>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password with Eye Icon */}
            <div className="form-group password-wrapper">
              <label>Password</label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span className="eye-icon" onClick={togglePassword}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <button type="submit" className="login-btn">
              <span>Login</span>
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </>
  );
}
