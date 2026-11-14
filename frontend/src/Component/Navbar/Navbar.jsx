// src/Component/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { TOP_MENUS } from "./menuConfig";
import "./Navbar.css";

// Recursive Menu Item Component for arbitrary submenu depth
function MenuItem({ item, onLeafClick }) {
  // 1. Plain string item -> leaf
  if (typeof item === "string") {
    return (
      <div
        className="erp-menu-row leaf-row"
        onClick={(e) => {
          e.stopPropagation();
          onLeafClick(item);
        }}
      >
        <span className="row-label">{item}</span>
      </div>
    );
  }

  // 2. Object item
  const hasSub = Boolean(item.hasSubmenu && item.items && item.items.length > 0);
  const label = item.label;
  const target = item.target || label;

  if (!hasSub) {
    return (
      <div
        className="erp-menu-row leaf-row"
        onClick={(e) => {
          e.stopPropagation();
          onLeafClick(target);
        }}
      >
        <span className="row-label">{label}</span>
      </div>
    );
  }

  // 3. Parent item with flyout submenu
  return (
    <div className="erp-menu-row parent-row">
      <span className="row-label">{label}</span>
      <span className="arrow-indicator">▶</span>

      {/* Flyout Submenu */}
      <div className={`erp-dropdown-menu flyout ${item.isLongList ? "scrollable" : ""}`}>
        {item.items.map((subItem, idx) => (
          <MenuItem
            key={typeof subItem === "string" ? subItem : subItem.label || idx}
            item={subItem}
            onLeafClick={onLeafClick}
          />
        ))}
      </div>
    </div>
  );
}

export default function Navbar({ onNavigate, onLogout }) {
  const [openTop, setOpenTop] = useState(null); // e.g. "master"
  const navRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenTop(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTopClick = (topKey) => {
    setOpenTop((prev) => (prev === topKey ? null : topKey));
  };

  const handleLeafClick = (label) => {
    setOpenTop(null);
    if (label === "Log Off" || label === "Exit Application") {
      if (onLogout) onLogout();
      return;
    }
    if (onNavigate) {
      onNavigate(label);
    }
  };

  return (
    <div className="nav-container" ref={navRef}>
      {/* Top Menu Tabs Bar */}
      <div className="erp-menubar">
        <div className="erp-menu-left">
          {TOP_MENUS.map((menu) => {
            const isOpen = openTop === menu.key;
            return (
              <div key={menu.key} className="erp-menu-item-wrapper">
                <button
                  className={`erp-menu-btn ${isOpen ? "active" : ""}`}
                  onClick={() => handleTopClick(menu.key)}
                  onMouseEnter={() => {
                    if (openTop) {
                      setOpenTop(menu.key);
                    }
                  }}
                >
                  {menu.label}
                </button>

                {/* Level 1 Dropdown */}
                {isOpen && menu.items && (
                  <div className="erp-dropdown-menu level-1">
                    {menu.items.map((item, idx) => (
                      <MenuItem
                        key={typeof item === "string" ? item : item.label || idx}
                        item={item}
                        onLeafClick={handleLeafClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="erp-menu-right">
          <button
            className="erp-menu-exit-btn"
            onClick={onLogout}
            title="Log out of application"
          >
            Log Off
          </button>
        </div>
      </div>
    </div>
  );
}
