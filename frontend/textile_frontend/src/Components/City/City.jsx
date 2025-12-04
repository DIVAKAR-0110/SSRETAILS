// City.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

import Tools from "../Tools.jsx";
import CityForm from "./CityForm.jsx";
import ReportCityView from "./ReportCityView.jsx";
import "./City.css";
import "../../css/theme.css";
import "../../css/row-highlight.css";
import "../../css/hover-effects.css";
import "../../api.js";
import { BASE_URL } from "../../api.js";
import Navbar2 from "../Navbar2.jsx";

const API_BASE = BASE_URL || "http://127.0.0.1:8000";

export default function City() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const { admin_id } = useParams();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("Name"); 
  const [filters, setFilters] = useState({
    Code: "",
    Name: "",
    ShortName: "",
    State: "",
    Active: "",
  });

  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);

  const [theme, setTheme] = useState("metal");

  const loadPage = async () => {
    try {
      const params = { page, page_size: pageSize, search, ordering };
      if (filters.Code) params.Code = filters.Code;
      if (filters.Name) params.Name = filters.Name;
      if (filters.ShortName) params.ShortName = filters.ShortName;
      if (filters.Active) params.Active = filters.Active;

      const res = await axios.get(`${API_BASE}/city/`, { params });
      setRows(res.data.results || []);
      setTotal(res.data.total ?? res.data.count ?? 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed loading cities");
    }
  };

  useEffect(() => {
    loadPage();
  }, [page, search, ordering, filters]);

  // Tools
  const onAdd = () => {
    setFormData(null);
    setFormOpen(true);
  };
  const onEdit = () => {
    if (!selected) return toast.error("Select a city to edit");
    setFormData(selected);
    setFormOpen(true);
  };
  const onView = () => {
    if (!selected) return toast.error("Select a city to view");
    toast(JSON.stringify(selected, null, 2), { duration: 4000 });
  };
  const onDelete = async () => {
    if (!selected) return toast.error("Select a city to delete");
    if (!window.confirm(`Delete ${selected.Name}?`)) return;
    try {
      await axios.delete(`${API_BASE}/city/${selected.Code}/`);
      toast.success("Deleted");
      setSelected(null);
      loadPage();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };
  const onRefresh = () => {
    loadPage();
    toast.success("Refreshed");
  };
  const onExit = () => {
    window.history.back();
  };

  const onReport = async () => {
    try {
      const res = await axios.get(`${API_BASE}/city/report/`);
      setReportData(res.data.results ?? res.data);
      setReportOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Report fetch failed");
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (payload.Code) {
        await axios.put(`${API_BASE}/city/${payload.Code}/`, payload);
        toast.success("Updated");
      } else {
        await axios.post(`${API_BASE}/city/`, payload);
        toast.success("Created");
      }
      setFormOpen(false);
      setSelected(null);
      loadPage();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const setFilterValue = (k, v) => {
    setFilters((prev) => ({ ...prev, [k]: v }));
    setPage(1);
  };

  const toggleSort = (field) => {
    setOrdering((prev) => {
      const base = prev.replace(/^-/, "");
      if (base === field) return prev.startsWith("-") ? field : "-" + field;
      return field;
    });
    setPage(1);
  };

  return (
    <>
      <Navbar2 admin_id={admin_id} />
      <br />
      <br />

      <div className={`city-page theme-${theme}`}>
        <Toaster position="top-right" />
        <h2 style={{ fontFamily: "-moz-initial" }}> CITY</h2>
        <div className="top-row">
          <div className="left-tools">
            <Tools
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onReport={onReport}
              onRefresh={onRefresh}
              onExit={onExit}
            />
          </div>

          <div className="theme-switcher">
            <div className="theme-icons">
              <button
                className={`theme-icon ${theme === "blue" ? "active" : ""}`}
                onClick={() => setTheme("blue")}
                title="Blue Theme"
              >
                🌊
              </button>
              <button
                className={`theme-icon ${theme === "gray" ? "active" : ""}`}
                onClick={() => setTheme("gray")}
                title="Gray Theme"
              >
                ⬜
              </button>
              <button
                className={`theme-icon ${theme === "metal" ? "active" : ""}`}
                onClick={() => setTheme("metal")}
                title="ERP Metallic"
              >
                ⬜⚙
              </button>
            </div>
          </div>
        </div>

        <div className="filters-row">
          <input
            placeholder="Global search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input search-input"
          />
          <div className="column-filters">
            <input
              placeholder="Filter Code"
              value={filters.Code}
              onChange={(e) => setFilterValue("Code", e.target.value)}
              className="input small"
            />
            <input
              placeholder="Filter Name"
              value={filters.Name}
              onChange={(e) => setFilterValue("Name", e.target.value)}
              className="input medium"
            />
            <input
              placeholder="Filter ShortName"
              value={filters.ShortName}
              onChange={(e) => setFilterValue("ShortName", e.target.value)}
              className="input small"
            />
            <select
              value={filters.Active}
              onChange={(e) => setFilterValue("Active", e.target.value)}
              className="input small"
            >
              <option value="">All</option>
              <option value="True">Active</option>
              <option value="False">Inactive</option>
            </select>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setFilters({
                  Code: "",
                  Name: "",
                  ShortName: "",
                  State: "",
                  Active: "",
                });
                setSearch("");
                setPage(1);
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("Code")} className="clickable">
                  Code{" "}
                  {ordering.replace("-", "") === "Code"
                    ? ordering.startsWith("-")
                      ? "↓"
                      : "↑"
                    : ""}
                </th>
                <th onClick={() => toggleSort("Name")} className="clickable">
                  Name{" "}
                  {ordering.replace("-", "") === "Name"
                    ? ordering.startsWith("-")
                      ? "↓"
                      : "↑"
                    : ""}
                </th>
                <th
                  onClick={() => toggleSort("ShortName")}
                  className="clickable"
                >
                  Short Name{" "}
                  {ordering.replace("-", "") === "ShortName"
                    ? ordering.startsWith("-")
                      ? "↓"
                      : "↑"
                    : ""}
                </th>
                <th
                  onClick={() => toggleSort("StateCode__Name")}
                  className="clickable"
                >
                  State{" "}
                  {ordering.replace("-", "") === "StateCode__Name"
                    ? ordering.startsWith("-")
                      ? "↓"
                      : "↑"
                    : ""}
                </th>
                <th onClick={() => toggleSort("Active")} className="clickable">
                  Active{" "}
                  {ordering.replace("-", "") === "Active"
                    ? ordering.startsWith("-")
                      ? "↓"
                      : "↑"
                    : ""}
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.Code}
                  className={`data-row ${
                    selected?.Code === r.Code ? "selected" : ""
                  }`}
                  onClick={() =>
                    setSelected((prev) => (prev?.Code === r.Code ? null : r))
                  }
                >
                  <td>{r.Code}</td>
                  <td>{r.Name}</td>
                  <td>{r.ShortName}</td>
                  <td>{r.StateName ?? (r.StateCode?.Name || "")}</td>
                  <td>{r.Active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <div className="page-info">Page {page}</div>
          <button className="btn" onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
          <div className="total-info">Total: {total}</div>
        </div>

        <CityForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
          initialData={formData}
        />
        {reportOpen && (
          <ReportCityView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme={theme}
          />
        )}
      </div>
    </>
  );
}
