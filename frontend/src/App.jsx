import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./Component/Loading/SplashScreen";
import Login from "./Component/Login/Login";
import NewRegistration from "./Component/NewRegistration/NewRegistration";
import Dashboard from "./Component/Dashboard/Dashboard";
import Country from "./Component/Country/Country";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <SplashScreen />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/country" element={<Country />} />
            {/*<Route path="/state" element={<State />} /> */}
            {/*<Route path="/city" element={<City />} /> */}
            <Route path="/addnew" element={<NewRegistration />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}
