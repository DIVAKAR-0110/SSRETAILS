// Category.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import Tools from "../Tools";
import CategoryForm from "./CategoryForm";
import ReportCategoryView from "./ReportCategoryView";

import "../../css/theme.css";
import "../../css/row-highlight.css";
import "../../css/hover-effects.css";
import Navbar2 from "../Navbar2";
import { BASE_URL } from "../../api";
import { useParams } from "react-router-dom";

const API_BASE = BASE_URL || "http://127.0.0.1:8000";

export default function Category() {
  const [all, setAll] = useState([]);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const admin_id = useParams();
  // UI
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("Name");
  const [filters, setFilters] = useState({
    Code: "",
    Name: "",
    ShortName: "",
    Active: "",
  });

  // form & report
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);

  // theme
  const [theme, setTheme] = useState("metal");

  const loadAll = async () => {
    try {
      const res = await axios.get(`${API_BASE}/category/report/`);
      const data = res.data?.results ?? res.data ?? [];
      setAll(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    let arr = [...all];
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      arr = arr.filter(
        (r) =>
          (r.Name || "").toLowerCase().includes(s) ||
          (r.ShortName || "").toLowerCase().includes(s) ||
          String(r.Code).includes(s)
      );
    }
    if (filters.Code)
      arr = arr.filter((r) => String(r.Code) === String(filters.Code));
    if (filters.Name)
      arr = arr.filter((r) =>
        (r.Name || "").toLowerCase().includes(filters.Name.toLowerCase())
      );
    if (filters.ShortName)
      arr = arr.filter((r) =>
        (r.ShortName || "")
          .toLowerCase()
          .includes(filters.ShortName.toLowerCase())
      );
    if (filters.Active) {
      const want = filters.Active.toLowerCase();
      arr = arr.filter((r) => (r.Active ? "true" : "false").startsWith(want));
    }

    const dir = ordering.startsWith("-") ? -1 : 1;
    const key = ordering.replace("-", "");
    arr.sort((a, b) => {
      const A = ("" + (a[key] ?? "")).toLowerCase();
      const B = ("" + (b[key] ?? "")).toLowerCase();
      if (A < B) return -1 * dir;
      if (A > B) return 1 * dir;
      return 0;
    });

    const start = (page - 1) * pageSize;
    setRows(arr.slice(start, start + pageSize));
  }, [all, page, pageSize, search, ordering, filters]);

  // Tools actions
  const onAdd = () => {
    setFormData(null);
    setFormOpen(true);
  };
  const onEdit = () => {
    if (!selected) return toast.error("Select a row to edit");
    setFormData(selected);
    setFormOpen(true);
  };
  const onView = () => {
    if (!selected) return toast.error("Select a row to view");
    toast(JSON.stringify(selected, null, 2), { duration: 4000 });
  };
  const onDelete = async () => {
    if (!selected) return toast.error("Select a row to delete");
    if (!window.confirm(`Delete ${selected.Name}?`)) return;
    try {
      await axios.delete(`${API_BASE}/category/${selected.Code}/`);
      toast.success("Deleted");
      setSelected(null);
      await loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };
  const onRefresh = async () => {
    await loadAll();
    toast.success("Refreshed");
  };
  const onExit = () => window.history.back();
  const onReport = async () => {
    try {
      const res = await axios.get(`${API_BASE}/category/report/`);
      const data = res.data?.results ?? res.data ?? [];
      setReportData(Array.isArray(data) ? data : []);
      setReportOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Report failed");
    }
  };

  const handleSubmit = async (payload) => {
    try {
      await axios.post(`${API_BASE}/category/`, payload);
      toast.success(payload.Code ? "Updated" : "Created");
      setFormOpen(false);
      setSelected(null);
      await loadAll();
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
      if (base === field) {
        return prev.startsWith("-") ? field : "-" + field;
      }
      return field;
    });
    setPage(1);
  };

  const totalFiltered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return all.filter((r) => {
      if (
        s &&
        !(
          (r.Name || "").toLowerCase().includes(s) ||
          (r.ShortName || "").toLowerCase().includes(s) ||
          String(r.Code).includes(s)
        )
      )
        return false;
      if (filters.Code && String(r.Code) !== String(filters.Code)) return false;
      if (
        filters.Name &&
        !(r.Name || "").toLowerCase().includes(filters.Name.toLowerCase())
      )
        return false;
      if (
        filters.ShortName &&
        !(r.ShortName || "")
          .toLowerCase()
          .includes(filters.ShortName.toLowerCase())
      )
        return false;
      if (
        filters.Active &&
        !(r.Active ? "true" : "false").startsWith(filters.Active.toLowerCase())
      )
        return false;
      return true;
    }).length;
  }, [all, search, filters]);

  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  return (
    <>
      <Navbar2 admin_id={admin_id} />
      <br />
      <br />
      <div className={`category-page theme-${theme}`}>
        <Toaster position="top-right" />
        <h2 style={{ fontFamily: "sans-serif" }}>Category</h2>
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
                ⚙
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
                setFilters({ Code: "", Name: "", ShortName: "", Active: "" });
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
                  <td>{r.Active ? "Yes" : "No"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    No records
                  </td>
                </tr>
              )}
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
          <div className="page-info">
            Page {page} / {totalPages}
          </div>
          <button
            className="btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
          <div className="total-info">Total: {totalFiltered}</div>
        </div>

        <CategoryForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadAll();
          }}
          initialData={formData}
        />
        {reportOpen && (
          <ReportCategoryView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme={theme}
          />
        )}
      </div>
    </>
  );
}
