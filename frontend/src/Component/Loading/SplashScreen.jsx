// src/Component/Loading/SplashScreen.jsx
import React from "react";
import "./splash.css";

export default function SplashScreen() {
  return (
    <div className="splash-root">
      <div className="splash-glow splash-glow-1" />
      <div className="splash-glow splash-glow-2" />

      <div className="splash-card">
        <div className="splash-logo-wrap">
          <div className="splash-cube">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="splash-text">
          <h1 className="splash-title">SSRetails Textiles</h1>
          <p className="splash-subtitle">
            Initializing inventory, billing and analytics modules...
          </p>
        </div>

        <div className="splash-progress">
          <div className="splash-bar">
            <div className="splash-bar-fill" />
          </div>
          <span className="splash-progress-label">Loading workspace</span>
        </div>

        <div className="splash-footer">
          <span className="badge">Textile Suite v1.0</span>
          <span className="badge badge-soft">
            Powered by React &amp; Django
          </span>
        </div>
      </div>
    </div>
  );
}
