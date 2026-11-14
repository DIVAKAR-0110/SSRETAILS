// src/Component/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Navbar from "../Navbar/Navbar.jsx";
import Tools from "../Tools.jsx";

// 1. General Masters
import Country from "../Master/General/Country/Country.jsx";
import State from "../Master/General/State/State.jsx";
import City from "../Master/General/City/City.jsx";
import Title from "../Master/General/Title/Title.jsx";
import Grade from "../Master/General/Grade/Grade.jsx";
import Group from "../Master/General/Group/Group.jsx";
import Category from "../Master/General/Category/Category.jsx";
import Relation from "../Master/General/Relation/Relation.jsx";
import Religion from "../Master/General/Religion/Religion.jsx";
import Occupation from "../Master/General/Occupation/Occupation.jsx";
import Bank from "../Master/General/Bank/Bank.jsx";
import Employee from "../Master/General/Employee/Employee.jsx";
import TaxType from "../Master/General/TaxType/TaxType.jsx";
import SystemMas from "../Master/General/System/SystemMas.jsx";
import Counter from "../Master/General/Counter/Counter.jsx";
import SystemCounterIntegration from "../Master/General/SystemCounterIngestion/SystemCounterIntegration.jsx";
import CounterGroup1 from "../Master/General/CounterGroup1/CounterGroup1.jsx";
import GiftVoucher from "../Master/General/GiftVoucher/GiftVoucher.jsx";
import PaymentMode from "../Master/General/PaymentMode/PaymentMode.jsx";
import DiscountType from "../Master/General/DiscountType/DiscountType.jsx";
import IncomeAndExpense from "../Master/General/IncomeAndExpense/IncomeAndExpense.jsx";
import Department from "../Master/General/Department/Department.jsx";
import Floor from "../Master/General/Floor/Floor.jsx";
import TransferMode from "../Master/General/TransferMode/TransferMode.jsx";
import Star from "../Master/General/Star/Star.jsx";

// 2. Location
import Location from "../Master/Location/Location.jsx";

// 3. Tally
import GroupHead from "../Master/Tally/GroupHead/GroupHead.jsx";
import AccountHead from "../Master/Tally/AccountHead/AccountHead.jsx";

// 4. Item Definition -> Item Categories
import Brand from "../Master/ItemDefinition/ItemCategories/Brand/Brand.jsx";
import Type from "../Master/ItemDefinition/ItemCategories/Type/Type.jsx";
import Style from "../Master/ItemDefinition/ItemCategories/Style/Style.jsx";
import Pattern from "../Master/ItemDefinition/ItemCategories/Pattern/Pattern.jsx";
import Color from "../Master/ItemDefinition/ItemCategories/Color/Color.jsx";
import FloorCategory from "../Master/ItemDefinition/ItemCategories/Floor/FloorCategory.jsx";
import Section from "../Master/ItemDefinition/ItemCategories/Section/Section.jsx";
import SectionGroup from "../Master/ItemDefinition/ItemCategories/SectionGroup/SectionGroup.jsx";
import HsnCode from "../Master/ItemDefinition/ItemCategories/HsnCode/HsnCode.jsx";
import Sizeorder from "../Master/ItemDefinition/ItemCategories/Size Order/Sizeorder.jsx";

// Helper function to format tab title like classic ERP (e.g. "Location Listing", "Supplier Listing")
function getTabTitle(label) {
  if (!label) return "Listing";
  if (label.endsWith(" Listing")) return label;
  const clean = label.replace(/\s+Master$/i, "");
  return `${clean} Listing`;
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const adminFromState = location.state?.admin || null;
  const stored = !adminFromState
    ? JSON.parse(localStorage.getItem("admin") || "null")
    : null;
  const admin = adminFromState || stored;

  // Multi-Tab MDI State
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!admin) {
      navigate("/", { replace: true });
    }
  }, [admin, navigate]);

  const adminId = admin ? admin.id : null;

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/", { replace: true });
  };

  // Open a new tab or focus existing one
  const handleNavigate = useCallback((label) => {
    setTabs((prev) => {
      if (!prev.includes(label)) {
        return [...prev, label];
      }
      return prev;
    });
    setActiveTab(label);
  }, []);

  // Close specific tab
  const handleCloseTab = useCallback((tabToClose) => {
    setTabs((prev) => {
      const idx = prev.indexOf(tabToClose);
      const nextTabs = prev.filter((t) => t !== tabToClose);

      if (activeTab === tabToClose) {
        if (nextTabs.length > 0) {
          const newIdx = Math.max(0, idx - 1);
          setActiveTab(nextTabs[newIdx]);
        } else {
          setActiveTab(null);
        }
      }
      return nextTabs;
    });
  }, [activeTab]);

  // Global shortcut to close active tab (Ctrl+F4 / Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCloseKey =
        e.key === "Escape" ||
        ((e.ctrlKey || e.metaKey) && (e.key === "F4" || e.keyCode === 115));

      if (isCloseKey && activeTab) {
        e.preventDefault();
        e.stopPropagation();
        handleCloseTab(activeTab);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, handleCloseTab]);

  // Protect against accidental browser window close when tabs are open
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (tabs.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [tabs.length]);

  if (!admin) return null;

  // Render component for each tab
  const renderScreenComponent = (tabKey) => {
    const onExit = () => handleCloseTab(tabKey);

    switch (tabKey) {
      // General
      case "Country":
        return <Country adminId={adminId} onExit={onExit} />;
      case "State":
        return <State adminId={adminId} onExit={onExit} />;
      case "City":
        return <City adminId={adminId} onExit={onExit} />;
      case "Title":
        return <Title adminId={adminId} onExit={onExit} />;
      case "Grade":
        return <Grade adminId={adminId} onExit={onExit} />;
      case "Group":
        return <Group adminId={adminId} onExit={onExit} />;
      case "Category":
        return <Category adminId={adminId} onExit={onExit} />;
      case "Relation":
        return <Relation adminId={adminId} onExit={onExit} />;
      case "Religion":
        return <Religion adminId={adminId} onExit={onExit} />;
      case "Occupation":
        return <Occupation adminId={adminId} onExit={onExit} />;
      case "Bank":
        return <Bank adminId={adminId} onExit={onExit} />;
      case "Employee":
        return <Employee adminId={adminId} onExit={onExit} />;
      case "Tax Type":
        return <TaxType adminId={adminId} onExit={onExit} />;
      case "System":
        return <SystemMas adminId={adminId} onExit={onExit} />;
      case "Counter":
        return <Counter adminId={adminId} onExit={onExit} />;
      case "System Counter Integration 2":
        return <SystemCounterIntegration adminId={adminId} onExit={onExit} />;
      case "Counter Group 1":
        return <CounterGroup1 adminId={adminId} onExit={onExit} />;
      case "Gift Voucher":
      case "Gift voucher":
        return <GiftVoucher adminId={adminId} onExit={onExit} />;
      case "Payment Mode":
        return <PaymentMode adminId={adminId} onExit={onExit} />;
      case "Discount Type":
        return <DiscountType adminId={adminId} onExit={onExit} />;
      case "Income and Expenses 3":
        return <IncomeAndExpense adminId={adminId} onExit={onExit} />;
      case "Department":
        return <Department adminId={adminId} onExit={onExit} />;
      case "Floor":
        return <Floor adminId={adminId} onExit={onExit} />;
      case "Transfer Mode":
        return <TransferMode adminId={adminId} onExit={onExit} />;
      case "Star":
        return <Star adminId={adminId} onExit={onExit} />;

      // Location
      case "Location":
        return <Location adminId={adminId} onExit={onExit} />;

      // Tally
      case "Group Head":
        return <GroupHead adminId={adminId} onExit={onExit} />;
      case "Account Head":
        return <AccountHead adminId={adminId} onExit={onExit} />;

      // Item Categories
      case "Brand":
        return <Brand adminId={adminId} onExit={onExit} />;
      case "Type":
        return <Type adminId={adminId} onExit={onExit} />;
      case "Style":
        return <Style adminId={adminId} onExit={onExit} />;
      case "Pattern":
        return <Pattern adminId={adminId} onExit={onExit} />;
      case "Color":
        return <Color adminId={adminId} onExit={onExit} />;
      case "Floor Category":
      case "Floors":
        return <FloorCategory adminId={adminId} onExit={onExit} />;
      case "Section":
        return <Section adminId={adminId} onExit={onExit} />;
      case "Section Group":
        return <SectionGroup adminId={adminId} onExit={onExit} />;
      case "Hsn Code":
        return <HsnCode adminId={adminId} onExit={onExit} />;
      case "Size Order":
        return <Sizeorder adminId={adminId} onExit={onExit} />;

      // Fallback for all other unmapped masters (Supplier, Agent, Customer, etc.)
      default:
        return (
          <Tools
            title={tabKey}
            columns={[
              { name: "code", label: "CODE" },
              { name: "name", label: "NAME", required: true, transform: (v) => v.toUpperCase() },
              { name: "shortname", label: "SHORT NAME", transform: (v) => v.toUpperCase() },
              { name: "active", label: "ACTIVE", type: "boolean" },
            ]}
            apiBase={`http://localhost:8000/${tabKey.toLowerCase().replace(/\s+/g, "_")}/`}
            extraPayload={{ admin_id: adminId }}
            onExit={onExit}
          />
        );
    }
  };

  return (
    <div className="dash-root">
      {/* 1. Menu Bar */}
      <Navbar onNavigate={handleNavigate} onLogout={handleLogout} />

      {/* 2. MDI Multi-Tab Strip (Image 1) */}
      {tabs.length > 0 && (
        <div className="erp-tab-strip">
          <div className="erp-tabs-scroll-area">
            {tabs.map((tabKey) => {
              const isActive = tabKey === activeTab;
              const tabTitle = getTabTitle(tabKey);
              return (
                <div
                  key={tabKey}
                  className={`erp-tab ${isActive ? "active" : ""}`}
                  onClick={() => setActiveTab(tabKey)}
                  title={tabTitle}
                >
                  <span className="erp-tab-title">{tabTitle}</span>
                  {isActive && (
                    <button
                      className="erp-tab-close"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTab(tabKey);
                      }}
                      title="Close Tab (Ctrl+F4)"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Far-Right Tabstrip Close Control (Image 1 & Image 2) */}
          <div className="erp-tabstrip-controls">
            <button
              className="erp-tabstrip-close-btn"
              onClick={() => activeTab && handleCloseTab(activeTab)}
              title="Close Active Tab (Ctrl+F4)"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <main className="dash-body">
        {tabs.length === 0 ? (
          <div className="erp-desktop-canvas">
            <div className="erp-desktop-watermark">
              <span className="watermark-logo">❖</span>
              <h2>SSRETAIL-GANESH TEXTILES</h2>
              <p>Ready. Select an option from Master, Transaction, or Reports menu.</p>
            </div>
          </div>
        ) : (
          tabs.map((tabKey) => (
            <div
              key={tabKey}
              className="erp-tab-content-panel"
              style={{
                display: tabKey === activeTab ? "flex" : "none",
                height: "100%",
                width: "100%",
              }}
            >
              {renderScreenComponent(tabKey)}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
