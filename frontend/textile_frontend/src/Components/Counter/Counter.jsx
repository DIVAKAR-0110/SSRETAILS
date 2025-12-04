import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Tools from "../Tools";
import CounterForm from "./CounterForm";
import ReportCounterView from "./ReportCounterView";
import Navbar2 from "../Navbar2";
import { useParams } from "react-router-dom";
import "./Counter.css";

const API_BASE = "http://127.0.0.1:8000";

export default function Counter() {
  const admin_id = useParams();
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);

  const loadAll = async () => {
    const res = await axios.get(`${API_BASE}/counter/`);
    setAll(res.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onAdd = () => {
    setFormData(null);
    setFormOpen(true);
  };
  const onEdit = () => {
    if (!selected) return toast.error("Select a row to edit");
    setFormData(selected);
    setFormOpen(true);
  };
  const onDelete = async () => {
    if (!selected) return toast.error("Select a row to delete");
    if (!window.confirm(`Delete ${selected.Name}?`)) return;
    await axios.delete(`${API_BASE}/counter/delete/${selected.Code}/`);
    toast.success("Deleted");
    setSelected(null);
    await loadAll();
  };
  const onView = () => {
    if (!selected) return toast.error("Select a row to view");
    toast(JSON.stringify(selected, null, 2), { duration: 4000 });
  };
  const onReport = async () => {
    const res = await axios.get(`${API_BASE}/counter/`);
    setReportData(res.data);
    setReportOpen(true);
  };
  const onRefresh = async () => {
    await loadAll();
    toast.success("Refreshed");
  };
  const onExit = () => window.history.back();

  return (
    <>
      <Navbar2 admin_id={admin_id} />
      <div className="grade-page">
        <Toaster position="top-right" />
        <h2 style={{ fontFamily: "sans-serif" }}>Counter Master</h2>
        <Tools
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onReport={onReport}
          onRefresh={onRefresh}
          onExit={onExit}
        />

        <div style={{ overflowX: "auto", marginTop: 16 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>LocationCode</th>
                <th>Name</th>
                <th>Short Name</th>
                <th>CounterGroupCode</th>
                <th>SectionCode</th>
                <th>CounterOrder</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {all.map((r) => (
                <tr
                  key={r.Code}
                  className={selected?.Code === r.Code ? "selected" : ""}
                  onClick={() =>
                    setSelected(selected?.Code === r.Code ? null : r)
                  }
                >
                  <td>{r.Code}</td>
                  <td>{r.LocationCode}</td>
                  <td>{r.Name}</td>
                  <td>{r.ShortName}</td>
                  <td>{r.CounterGroupCode}</td>
                  <td>{r.SectionCode}</td>
                  <td>{r.CounterOrder}</td>
                  <td>{r.Active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CounterForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadAll();
          }}
          initialData={formData}
        />

        {reportOpen && (
          <ReportCounterView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme="metal"
          />
        )}
      </div>
    </>
  );
}
