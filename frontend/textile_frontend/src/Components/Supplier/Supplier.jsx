// Supplier.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "./Supplier.css";
import Tools from "../Tools";
import SupplierForm from "./SupplierForm";
import ReportSupplierView from "./ReportSupplierView";
import { useParams } from "react-router-dom";
import Navbar2 from "../Navbar2";

const API_BASE = "http://127.0.0.1:8000";
const PAGE_SIZE = 10;

export default function Supplier() {
  const admin_id = useParams();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [hoveredCode, setHoveredCode] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadAll = async () => {
    try {
      const res = await axios.get(`${API_BASE}/supplier/`);
      setRows(res.data);
      setPage(1);
      setSelected(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load suppliers");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onAdd = () => {
    setFormData(null);
    setDrawerOpen(true);
  };

  const onEdit = () => {
    if (!selected) return toast.error("Select a supplier to edit");
    setFormData(selected);
    setDrawerOpen(true);
  };

  const onDelete = async () => {
    if (!selected) return toast.error("Select a supplier to delete");
    if (!window.confirm(`Delete ${selected.Name}?`)) return;
    try {
      await axios.delete(`${API_BASE}/supplier/delete/${selected.Code}/`);
      toast.success("Deleted");
      await loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const onView = () => {
    if (!selected) return toast.error("Select a supplier to view");
    toast(JSON.stringify(selected, null, 2), { duration: 6000 });
  };

  const onReport = async () => {
    try {
      const res = await axios.get(`${API_BASE}/supplier/`);
      setReportData(res.data);
      setReportOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load report");
    }
  };

  const onRefresh = async () => {
    await loadAll();
    toast.success("Refreshed");
  };

  const onExit = () => window.history.back();

  // Filtered rows (use correct field names from backend)
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        (r.Name || "").toLowerCase().includes(s) ||
        (r.ShortName || "").toLowerCase().includes(s) ||
        (r.city_name || "").toLowerCase().includes(s) ||
        (r.location_name || "").toLowerCase().includes(s) ||
        String(r.Code).includes(s)
    );
  }, [rows, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  return (
    <>
      <Navbar2 admin_id={admin_id} />
      <br />
      <br />
      <div className="page">
        <Toaster position="top-right" />
        <h2 style={{ fontFamily: "monospace" }}>Suppliers</h2>

        <Tools
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onReport={onReport}
          onRefresh={onRefresh}
          onExit={onExit}
        />

        <div className="table-toolbar">
          <div className="search-global">
            <input
              placeholder="Global search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Name</th>
                <th>Short</th>
                <th>Print</th>
                <th>City</th>
                <th>Location</th>
                <th>Group</th>
                <th>Grade</th>
                <th>Category</th>
                <th>Mobile</th>
                <th>Credit Days</th>
                <th>Credit Limit</th>
                <th>Std Disc%</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const isSelected = selected?.Code === r.Code;
                const isHovered = hoveredCode === r.Code;

                return (
                  <tr
                    key={r.Code}
                    className={isSelected ? "selected" : ""}
                    onClick={() => setSelected(isSelected ? null : r)}
                    onMouseEnter={() => setHoveredCode(r.Code)}
                    onMouseLeave={() => setHoveredCode(null)}
                    style={{
                      backgroundColor:
                        isHovered || isSelected ? "#c5ff00" : "transparent",
                    }}
                  >
                    <td>{r.Code}</td>
                    <td>{r.title_name || ""}</td>
                    <td>{r.Name || ""}</td>
                    <td>{r.ShortName || ""}</td>
                    <td>{r.PrintName || ""}</td>
                    <td>{r.city_name || ""}</td>
                    <td>{r.location_name || ""}</td>
                    <td>{r.group_name || ""}</td>
                    <td>{r.grade_name || ""}</td>
                    <td>{r.category_name || ""}</td>
                    <td>{r.Mobile || ""}</td>
                    <td>{r.CreditDays ?? ""}</td>
                    <td>{r.CreditLimit ?? ""}</td>
                    <td>{r.StandardDiscountOnBill ?? ""}</td>
                    <td>{r.active ? "Yes" : "No"}</td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={15} style={{ textAlign: "center", padding: 16 }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageSafe === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageSafe === totalPages}
          >
            Next
          </button>
          <span className="page-info">
            Page {pageSafe} of {totalPages} &nbsp; | &nbsp; Total:{" "}
            {filtered.length}
          </span>
        </div>

        <SupplierForm
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSaved={() => {
            setDrawerOpen(false);
            loadAll();
          }}
          initialData={formData}
        />

        {reportOpen && (
          <ReportSupplierView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme="metal"
          />
        )}
      </div>
    </>
  );
}
