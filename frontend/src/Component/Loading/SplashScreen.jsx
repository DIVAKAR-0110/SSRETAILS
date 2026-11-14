// src/Component/Loading/SplashScreen.jsx
import React from "react";
import "./splash.css";

export default function SplashScreen() {
  return (
    <div className="splash-root">
      {/* Background ambient orbs in warm bronze & gold */}
      <div className="splash-glow splash-glow-1" />
      <div className="splash-glow splash-glow-2" />

      <div className="splash-card">
        {/* Top gold accent line */}
        <div className="splash-top-line" />

        <div className="splash-logo-wrap">
          <div className="splash-emblem">
            <svg
              className="splash-svg-icon"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="32"
                y="6"
                width="36"
                height="36"
                rx="6"
                transform="rotate(45 32 6)"
                fill="url(#goldGradient)"
                stroke="#8c5b3c"
                strokeWidth="2"
              />
              <circle cx="32" cy="32" r="10" fill="#744e36" />
              <circle cx="32" cy="32" r="5" fill="#fdfbf7" />
              <defs>
                <linearGradient id="goldGradient" x1="14" y1="6" x2="50" y2="58" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffe08a" />
                  <stop offset="0.5" stopColor="#f4be52" />
                  <stop offset="1" stopColor="#b88628" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="splash-text">
          <h1 className="splash-title">SSRETAIL-GANESH TEXTILES</h1>
          <p className="splash-subtitle">
            Enterprise Retail Management &amp; Point of Sale System
          </p>
        </div>

        <div className="splash-progress">
          <div className="splash-bar">
            <div className="splash-bar-fill" />
          </div>
          <span className="splash-progress-label">
            Initializing master data &amp; transaction services...
          </span>
        </div>

        <div className="splash-footer">
          <span className="splash-badge">
            <span className="status-dot" /> Textile Suite v2.0
          </span>

        </div>
      </div>
    </div>
  );
}
