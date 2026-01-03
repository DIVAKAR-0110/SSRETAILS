// src/Component/Dashboard/Dashboard.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "../../assets/react.svg";

import Navbar from "../Navbar/Navbar.jsx";
import Country from "../Country/Country.jsx";
import State from "../State/State.jsx";
import City from "../City/City.jsx";
import Title from "../Title/Title.jsx";
import Grade from "../Grade/Grade.jsx";
import Group from "../Group/Group.jsx";
import Category from "../Category/Category.jsx";
import Relation from "../Relation/Relation.jsx";
import Religion from "../Religion/Religion.jsx";
import Occupation from "../Occupation/Occupation.jsx";
import Bank from "../Bank/Bank.jsx";
import CounterGroup from "../CounterGroup/CounterGroup.jsx";
import PaymentMode from "../PaymentMode/PaymentMode.jsx";
import DiscountType from "../DiscountType/DiscountType.jsx";
import Department from "../Department/Department.jsx";
import TransferMode from "../TransferMode/TransferMode.jsx";
import Star from "../Star/Star.jsx";
import Location from "../Location/Location.jsx";
import GroupHead from "../GroupHead/GroupHead.jsx";
import AccountHead from "../AccountHead/AccountHead.jsx";
import IncomeAndExpense from "../IncomeAndExpense/IncomeAndExpense.jsx";
import Counter from "../Counter/Counter.jsx";
import Floor from "../Floor/Floor.jsx";
import TaxType from "../TaxType/TaxType.jsx";
import SystemCounterIntegration from "../SystemCounterIngestion/SystemCounterIntegration.jsx";
import SystemMas from "../System/SystemMas.jsx";
import Employee from "../Employee/Employee.jsx";
import Brand from "../Brand/Brand.jsx";
import Type from "../Type/Type.jsx";
import Style from "../Style/Style.jsx";
import Pattern from "../Pattern/Pattern.jsx";
import Color from "../Color/Color.jsx";
import Floors from "../FloorItemCategory10/Floors.jsx";
import SectionGroup from "../SectionGroup/SectionGroup.jsx";
import Section from "../Section/Section.jsx";
import HsnCode from "../HsnCode/HsnCode.jsx";
import Sizeorder from "../Size Order/Sizeorder.jsx";
import GiftVoucher from "../GiftVoucher/GiftVoucher.jsx";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const adminFromState = location.state?.admin || null;
  const stored = !adminFromState
    ? JSON.parse(localStorage.getItem("admin") || "null")
    : null;
  const admin = adminFromState || stored;

  const [currentScreen, setCurrentScreen] = useState("Home");

  // if not logged in, redirect to login
  if (!admin) {
    navigate("/login", { replace: true });
    return null;
  }

  const adminId = admin.id;

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/", { replace: true });
  };

  const handleNavigate = (label) => {
    // label comes from Navbar leaf click, e.g. "Country"
    setCurrentScreen(label);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "Country":
        return <Country adminId={adminId} />;
      case "State":
        return <State adminId={adminId} />;
      case "City":
        return <City adminId={adminId} />;
      case "Title":
        return <Title adminId={adminId} />;
      case "Grade":
        return <Grade adminId={adminId} />;
      case "Group":
        return <Group adminId={adminId} />;
      case "Category":
        return <Category adminId={adminId} />;
      case "Religion":
        return <Religion adminId={adminId} />;
      case "Relation":
        return <Relation adminId={adminId} />;
      case "Occupation":
        return <Occupation adminId={adminId} />;
      case "Bank":
        return <Bank adminId={adminId} />;
      case "Counter Group 1":
        return <CounterGroup adminId={adminId} />;
      case "Counter":
        return <Counter adminId={adminId} />;
      case "Tax Type":
        return <TaxType adminId={adminId} />;
      case "System":
        return <SystemMas adminId={adminId} />;
      case "Employee":
        return <Employee adminId={adminId} />;
      // case "State": return <State adminId={adminId} />;
      // case "City": return <City adminId={adminId} />;
      case "System Counter Integration 2":
        return <SystemCounterIntegration adminId={adminId} />;
      case "Floor":
        return <Floor adminId={adminId} />;
      case "Gift voucher":
        return <GiftVoucher adminId={adminId} />;
      case "Payment Mode":
        return <PaymentMode adminId={adminId} />;
      case "Discount Type":
        return <DiscountType adminId={adminId} />;
      case "Department":
        return <Department adminId={adminId} />;
      case "Transfer Mode":
        return <TransferMode adminId={adminId} />;
      case "Star":
        return <Star adminId={adminId} />;
      case "Location":
        return <Location adminId={adminId} />;
      case "Group Head":
        return <GroupHead adminId={adminId} />;
      case "Account Head":
        return <AccountHead adminId={adminId} />;
      case "Income and Expenses 3":
        return <IncomeAndExpense adminId={adminId} />;
      case "Brand":
        return <Brand adminId={adminId} />;
      case "Type":
        return <Type adminId={adminId} />;
      case "Style":
        return <Style adminId={adminId} />;
      case "Pattern":
        return <Pattern adminId={adminId} />;
      case "Color":
        return <Color adminId={adminId} />;
      case "Floors":
        return <Floors adminId={adminId} />;
      case "Section":
        return <Section adminId={adminId} />;
      case "Section Group":
        return <SectionGroup adminId={adminId} />;
      case "Hsn Code":
        return <HsnCode adminId={adminId} />;
      case "Size Order":
        return <Sizeorder adminId={adminId} />;

      default:
        return (
          <div className="dash-placeholder">
            <h2>Dashboard</h2>
            <p>Select a module from Master / Tools menu to begin.</p>
          </div>
        );
    }
  };

  return (
    <div className="dash-root">
      {/* top admin bar */}
      <header className="dash-topbar">
        <div className="dash-brand">
          <span className="dash-logo">
            <img src={logo} alt="SS" />
          </span>
          <div className="dash-brand-text">
            <span className="dash-brand-title">SSRetails Textile</span>
            <span className="dash-brand-sub">ERP Console</span>
          </div>
        </div>

        <div className="dash-user">
          <div className="dash-user-avatar">
            {admin.username?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="dash-user-meta">
            <span className="dash-user-name">{admin.username}</span>
            <span className="dash-user-role">Administrator</span>
          </div>
          <button onClick={handleLogout} className="dash-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dash-main">
        <Navbar onNavigate={handleNavigate} />
        <div className="dash-content">{renderScreen()}</div>
      </div>
    </div>
  );
}
