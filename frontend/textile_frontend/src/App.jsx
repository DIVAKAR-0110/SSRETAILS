import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./Loading.css";
import { Toaster } from "react-hot-toast";
import "font-awesome/css/font-awesome.min.css";

import AdminLogin from "./Components/AdminLogin.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Country from "./Components/Country/Country.jsx";
import State from "./Components/State/State.jsx";
import City from "./Components/City/City.jsx";
import Title from "./Components/Title/Title.jsx";
import Grade from "./Components/Grade/Grade.jsx";
import Group from "./Components/Group/Group.jsx";
import Category from "./Components/Category/Category.jsx";
import Relation from "./Components/Relation/Relation.jsx";
import Religion from "./Components/Religion/Religion.jsx";
import Occupation from "./Components/Occupation/Occupation.jsx";
import Bank from "./Components/Bank/Bank.jsx";
import Location from "./Components/Location/Location.jsx";
import Floor from "./Components/Floor/Floor.jsx";
import TransferMode from "./Components/TransferMode/TransferMode.jsx";
import TaxType from "./Components/TaxType/TaxType.jsx";
import System from "./Components/System/System.jsx";
import Counter from "./Components/Counter/Counter.jsx";
import SystemCounter from "./Components/SystemCounter/SystemCounter.jsx";
import CounterGroup from "./Components/CounterGroup/CounterGroup.jsx";
import Giftvoucher from "./Components/Giftvoucher/Giftvoucher.jsx";
import PaymentMode from "./Components/PaymentMode/PaymentMode.jsx";
import DiscountType from "./Components/DiscountType/DiscountType.jsx";
import IncomeExpense from "./Components/IncomeExpense/IncomeExpense.jsx";
import Department from "./Components/Departments/Department.jsx";
import Star from "./Components/StarMas/Star.jsx";
import Employee from "./Components/Employee/Employee.jsx";
import Supplier from "./Components/Supplier/Supplier.jsx";
// ---------------- Loading Component ----------------
function Loading() {
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState("SSRetails");

  useEffect(() => {
    const texts = ["SSRetails", "SSRetails", "SSRetails", "SSRetails"];
    let currentIndex = 0;

    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setLoadingText(texts[currentIndex]);
    }, 2500);

    const timer = setTimeout(() => {
      navigate("/admin_login");
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
    };
  }, [navigate]);

  return (
    <div className="loading-container">
      <div className="textile-loading">
        <div className="loom-waves"></div>

        <div className="thread t1"></div>
        <div className="thread t2"></div>
        <div className="thread t3"></div>
        <div className="thread t4"></div>

        <div className="fabric"></div>
      </div>

      <h2 className="loading-text">{loadingText}</h2>
    </div>
  );
}

// ---------------- App Component ----------------
export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Loading />} />

        <Route path="/admin_login" element={<AdminLogin />} />

        <Route path="/dashboard/:admin_id" element={<Dashboard />} />

        <Route path="/:admin_id/country" element={<Country />} />
        <Route path="/:admin_id/state" element={<State />} />
        <Route path="/:admin_id/city" element={<City />} />
        <Route path="/:admin_id/title" element={<Title />} />
        <Route path="/:admin_id/grade" element={<Grade />} />
        <Route path="/:admin_id/group" element={<Group />} />
        <Route path="/:admin_id/category" element={<Category />} />
        <Route path="/:admin_id/relation" element={<Relation />} />
        <Route path="/:admin_id/religion" element={<Religion />} />
        <Route path="/:admin_id/occupation" element={<Occupation />} />
        <Route path="/:admin_id/bank" element={<Bank />} />
        <Route path="/:admin_id/employee" element={<Employee />} />
        <Route path="/:admin_id/tax-type" element={<TaxType />} />
        <Route path="/:admin_id/system" element={<System />} />
        <Route path="/:admin_id/counter" element={<Counter />} />
        <Route
          path="/:admin_id/system-counter-integration-2"
          element={<SystemCounter />}
        />
        <Route path="/:admin_id/counter-group-1" element={<CounterGroup />} />
        <Route path="/:admin_id/gift-voucher" element={<Giftvoucher />} />
        <Route path="/:admin_id/payment-mode" element={<PaymentMode />} />
        <Route path="/:admin_id/discount-type" element={<DiscountType />} />
        <Route
          path="/:admin_id/income-and-expenses-3"
          element={<IncomeExpense />}
        />
        <Route path="/:admin_id/department" element={<Department />} />
        <Route path="/:admin_id/floor" element={<Floor />} />
        <Route path="/:admin_id/transfer-mode" element={<TransferMode />} />
        <Route path="/:admin_id/star" element={<Star />} />

        <Route path="/:admin_id/supplier" element={<Supplier />} />

        <Route path="/:admin_id/location" element={<Location />} />

        <Route path="/:admin_id/supplier" element={<Supplier />} />
      </Routes>
    </>
  );
}
