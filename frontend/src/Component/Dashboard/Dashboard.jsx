// src/Component/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Navbar from "../Navbar/Navbar.jsx";
import Tools from "../Tools.jsx";
import Dialog from "../Common/Dialog.jsx";

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

// 2. Location & Company
import Location from "../Master/Location/Location.jsx";
import Company from "../Master/Company/Company.jsx";

// 2.1 Purchase Type & Document Type
import PurchaseType from "../Master/PurchaseType/PurchaseType.jsx";
import DocumentType from "../Master/DocumentType/DocumentType.jsx";
import CourierType from "../Master/CourierType/CourierType.jsx";

// 2.2 Job Work
import JobWorkChargeHead from "../Master/JobWork/JobWorkChargeHead/JobWorkChargeHead.jsx";
import Tailor from "../Master/JobWork/Tailor/Tailor.jsx";
import ConsumptionMaster from "../Master/JobWork/ConsumptionMaster/ConsumptionMaster.jsx";

// 3. Tally
import GroupHead from "../Master/Tally/GroupHead/GroupHead.jsx";
import AccountHead from "../Master/Tally/AccountHead/AccountHead.jsx";

// 3.1 Accounts
import AccountsGroupHead from "../Master/Accounts/AccountsGroupHead/AccountsGroupHead.jsx";
import Naration from "../Master/Accounts/Naration/Naration.jsx";
import TransactionHead from "../Master/Accounts/TransactionHead/TransactionHead.jsx";

// 4. Item Definition -> Item Categories & Core Masters
import ItemCategory from "../Master/ItemDefinition/ItemCategories/ItemCategory.jsx";
import Item from "../Master/ItemDefinition/Item/Item.jsx";
import UOM from "../Master/ItemDefinition/UOM/UOM.jsx";
import Product from "../Master/ItemDefinition/Product/Product.jsx";
import CommodityCode from "../Master/ItemDefinition/CommodityCode/CommodityCode.jsx";
import ROL from "../Master/ItemDefinition/ROL/ROL.jsx";

// 5. Intractors
import Supplier from "../Master/Intractors/Supplier/Supplier.jsx";
import Agent from "../Master/Intractors/Agent/Agent.jsx";
import Manufacture from "../Master/Intractors/Manufacture/Manufacture.jsx";
import Customer from "../Master/Intractors/Customer/Customer.jsx";
import Courier from "../Master/Intractors/Courier/Courier.jsx";
import Transport from "../Master/Intractors/Transport/Transport.jsx";

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
  const [dialog, setDialog] = useState(null);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!admin) {
      navigate("/", { replace: true });
    }
  }, [admin, navigate]);

  const adminId = admin ? admin.id : null;

  const handleLogout = useCallback(() => {
    setDialog({
      isOpen: true,
      title: "Confirm Log Off",
      message: "Are you sure you want to log off and exit SSRetails ERP?",
      type: "confirm",
      confirmText: "Log Off",
      cancelText: "Cancel",
      onConfirm: () => {
        setDialog(null);
        localStorage.removeItem("admin");
        navigate("/", { replace: true });
      },
      onCancel: () => setDialog(null),
    });
  }, [navigate]);

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
      case "System Master":
      case "SystemMas":
        return <SystemMas adminId={adminId} onExit={onExit} />;
      case "Counter":
      case "Counters":
      case "Counter Master":
        return <Counter adminId={adminId} onExit={onExit} />;
      case "System Counter Integration 2":
      case "System Counter Integration":
      case "System-Counter Integration":
        return <SystemCounterIntegration adminId={adminId} onExit={onExit} />;
      case "Counter Group 1":
      case "Counter Group":
      case "Counter Group Master":
        return <CounterGroup1 adminId={adminId} onExit={onExit} />;
      case "Gift Voucher":
      case "Gift voucher":
        return <GiftVoucher adminId={adminId} onExit={onExit} />;
      case "Payment Mode":
        return <PaymentMode adminId={adminId} onExit={onExit} />;
      case "Discount Type":
        return <DiscountType adminId={adminId} onExit={onExit} />;
      case "Income and Expenses 3":
      case "Income and Expenses":
      case "Income And Expense":
      case "Income and Expense":
        return <IncomeAndExpense adminId={adminId} onExit={onExit} />;
      case "Department":
        return <Department adminId={adminId} onExit={onExit} />;
      case "Floor":
        return <Floor adminId={adminId} onExit={onExit} />;
      case "Transfer Mode":
        return <TransferMode adminId={adminId} onExit={onExit} />;
      case "Star":
        return <Star adminId={adminId} onExit={onExit} />;

      // Location & Company
      case "Location":
        return <Location adminId={adminId} onExit={onExit} />;
      case "Company":
        return <Company adminId={adminId} onExit={onExit} />;

      // Purchase Type & Document Type
      case "Purchase Type":
        return <PurchaseType adminId={adminId} onExit={onExit} />;
      case "Document Type":
        return <DocumentType adminId={adminId} onExit={onExit} />;
      case "Courier Type":
      case "Courier Type Mas":
        return <CourierType adminId={adminId} onExit={onExit} />;

      // Job Work
      case "Job Work Charged Header":
      case "Job Work Charged Head":
      case "Job Work Charge Head":
        return <JobWorkChargeHead adminId={adminId} onExit={onExit} />;
      case "Tailor Mas":
      case "Tailor":
      case "Tailor Master":
        return <Tailor adminId={adminId} onExit={onExit} />;
      case "Consumption Master":
      case "Consumption":
        return <ConsumptionMaster adminId={adminId} onExit={onExit} />;

      // Tally
      case "Group Head":
        return <GroupHead adminId={adminId} onExit={onExit} />;
      case "Account Head":
        return <AccountHead adminId={adminId} onExit={onExit} />;

      // Accounts
      case "Accounts Group Head":
      case "Account Group Head":
        return <AccountsGroupHead adminId={adminId} onExit={onExit} />;
      case "Naration":
        return <Naration adminId={adminId} onExit={onExit} />;
      case "Transaction Head":
        return <TransactionHead adminId={adminId} onExit={onExit} />;

      // Item Definition Masters
      case "Item":
      case "Item Master":
        return <Item adminId={adminId} onExit={onExit} />;
      case "UOM":
      case "UOM Master":
        return <UOM adminId={adminId} onExit={onExit} />;
      case "Product":
      case "Product Master":
        return <Product adminId={adminId} onExit={onExit} />;
      case "Commodity Code":
      case "Commodity code":
      case "Commodity Code Master":
      case "Commudity Code":
        return <CommodityCode adminId={adminId} onExit={onExit} />;
      case "ROL":
      case "ROL Master":
        return <ROL adminId={adminId} onExit={onExit} />;

      // Intractors
      case "Supplier":
      case "Supplier Master":
        return <Supplier adminId={adminId} onExit={onExit} />;
      case "Agent":
      case "Agent Master":
        return <Agent adminId={adminId} onExit={onExit} />;
      case "Manufacture":
      case "Manufacture Master":
        return <Manufacture adminId={adminId} onExit={onExit} />;
      case "Customer":
      case "Customer Master":
        return <Customer adminId={adminId} onExit={onExit} />;
      case "Courier":
      case "Courier Master":
      case "courier":
        return <Courier adminId={adminId} onExit={onExit} />;
      case "Transport":
      case "Transport Master":
      case "transport":
        return <Transport adminId={adminId} onExit={onExit} />;

      // Item Categories (Unified ItemCategory component)
      case "Brand":
      case "Type":
      case "Style":
      case "Pattern":
      case "Color":
      case "Floor":
      case "Floor Category":
      case "Floors":
      case "Section":
      case "Section Group":
      case "Hsn Code":
      case "Size Order":
        return <ItemCategory categoryKey={tabKey} adminId={adminId} onExit={onExit} />;

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

      {/* Reusable ERP Dialog Box */}
      {dialog && (
        <Dialog
          isOpen={dialog.isOpen}
          title={dialog.title}
          message={dialog.message}
          type={dialog.type}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          onConfirm={dialog.onConfirm}
          onCancel={dialog.onCancel}
        />
      )}
    </div>
  );
}
