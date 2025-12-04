import React from "react";
import "./Navbar1.css";
import cmplogo from "../assets/react.svg";

export default function Navbar1() {
  const premiumERPStyle = {
    height: "48px",
    margin: "10px 20px",
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FFFFFF",
    padding: "5px",
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={cmplogo} className={premiumERPStyle} alt="SS" />
        <h1>SSRetails</h1>
        <h5>Easy Textile Management</h5>
      </div>
    </nav>
  );
}
