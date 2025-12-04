import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Tools from "../Tools";
import BankForm from "./BankForm";
import ReportBankView from "./ReportBankView";
import Navbar2 from "../Navbar2";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../api";

const API_BASE = BASE_URL || "http://127.0.0.1:8000";

export default function Bank() {
  const { admin_id } = useParams();
  const [all, setAll] = useState([]);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("Name");
  const [filters, setFilters] = useState({
    Code: "",
    Name: "",
    Shortname: "",
    CardServiceCharge: "",
    Active: "",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [theme, setTheme] = useState("metal");

  const loadAll = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bank/`);
      setAll(res.data);
    } catch (err) {
      toast.error("Failed to load banks");
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
          (r.Shortname || "").toLowerCase().includes(s) ||
          String(r.Code).includes(s)
      );
    }
    if (filters.Code)
      arr = arr.filter((r) => String(r.Code) === String(filters.Code));
    if (filters.Name)
      arr = arr.filter((r) =>
        (r.Name || "").toLowerCase().includes(filters.Name.toLowerCase())
      );
    if (filters.Shortname)
      arr = arr.filter((r) =>
        (r.Shortname || "")
          .toLowerCase()
          .includes(filters.Shortname.toLowerCase())
      );
    if (filters.CardServiceCharge)
      arr = arr.filter(
        (r) => String(r.CardServiceCharge) === String(filters.CardServiceCharge)
      );
    if (filters.Active) {
      const want = filters.Active.toLowerCase();
      arr = arr.filter((r) => (r.Active ? "true" : "false").startsWith(want));
    }
    // Sorting
    const dir = ordering.startsWith("-") ? -1 : 1;
    const key = ordering.replace("-", "");
    arr.sort((a, b) => {
      const A = ((a[key] ?? "") + "").toLowerCase();
      const B = ((b[key] ?? "") + "").toLowerCase();
      if (A < B) return -1 * dir;
      if (A > B) return 1 * dir;
      return 0;
    });
    // Pagination
    const start = (page - 1) * pageSize;
    setRows(arr.slice(start, start + pageSize));
  }, [all, page, pageSize, search, ordering, filters]);

  // Toolbar handlers
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
      await axios.delete(`${API_BASE}/bank/delete/${selected.Code}/`);
      toast.success("Deleted");
      setSelected(null);
      await loadAll();
    } catch (err) {
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
      const res = await axios.get(`${API_BASE}/bank/`);
      setReportData(res.data);
      setReportOpen(true);
    } catch (err) {
      toast.error("Report failed");
    }
  };

  const handleSubmit = async (payload) => {
    // Remove CreatedDateTime before POST
    delete payload.CreatedDateTime;
    try {
      await axios.post(`${API_BASE}/bank/add/`, payload);
      toast.success(payload.Code ? "Updated" : "Created");
      setFormOpen(false);
      setSelected(null);
      await loadAll();
    } catch (err) {
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

  const totalFiltered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return all.filter((r) => {
      if (
        s &&
        !(
          (r.Name || "").toLowerCase().includes(s) ||
          (r.Shortname || "").toLowerCase().includes(s) ||
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
        filters.Shortname &&
        !(r.Shortname || "")
          .toLowerCase()
          .includes(filters.Shortname.toLowerCase())
      )
        return false;
      if (
        filters.CardServiceCharge &&
        String(r.CardServiceCharge) !== String(filters.CardServiceCharge)
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
      <div className={`grade-page theme-${theme}`}>
        <Toaster position="top-right" />
        <h2 style={{ fontFamily: "-moz-initial" }}> BANK MAS</h2>
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
              placeholder="Filter Short Name"
              value={filters.Shortname}
              onChange={(e) => setFilterValue("Shortname", e.target.value)}
              className="input small"
            />
            <input
              placeholder="Filter Charge"
              value={filters.CardServiceCharge}
              onChange={(e) =>
                setFilterValue("CardServiceCharge", e.target.value)
              }
              className="input small"
            />
            <select
              value={filters.Active}
              onChange={(e) => setFilterValue("Active", e.target.value)}
              className="input small"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setFilters({
                  Code: "",
                  Name: "",
                  Shortname: "",
                  CardServiceCharge: "",
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
                  onClick={() => toggleSort("Shortname")}
                  className="clickable"
                >
                  Short Name{" "}
                  {ordering.replace("-", "") === "Shortname"
                    ? ordering.startsWith("-")
                      ? "↓"
                      : "↑"
                    : ""}
                </th>
                <th
                  onClick={() => toggleSort("CardServiceCharge")}
                  className="clickable"
                >
                  Service Charge{" "}
                  {ordering.replace("-", "") === "CardServiceCharge"
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
                  <td>{r.Shortname}</td>
                  <td>{r.CardServiceCharge}</td>
                  <td>{r.Active ? "Yes" : "No"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
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
        <BankForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadAll();
          }}
          initialData={formData}
        />
        {reportOpen && (
          <ReportBankView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme={theme}
          />
        )}
      </div>
    </>
  );
}
