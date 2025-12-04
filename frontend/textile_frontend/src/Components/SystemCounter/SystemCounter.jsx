import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Tools from "../Tools";
import SystemCounterForm from "./SystemCounterForm";
import ReportSystemCounterView from "./ReportSystemCounterView";
import { useParams } from "react-router-dom";
import Navbar2 from "../Navbar2";

const API_BASE = "http://127.0.0.1:8000";

export default function SystemCounter() {
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const admin_id = useParams();

  const loadAll = async () => {
    const res = await axios.get(`${API_BASE}/systemcounter/`);
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
    if (
      !window.confirm(
        `Delete ${selected.CounterType} - ${selected.CounterCode}?`
      )
    )
      return;
    await axios.delete(`${API_BASE}/systemcounter/delete/${selected.Code}/`);
    toast.success("Deleted");
    setSelected(null);
    await loadAll();
  };
  const onView = () => {
    if (!selected) return toast.error("Select a row to view");
    toast(JSON.stringify(selected, null, 2), { duration: 4000 });
  };
  const onReport = async () => {
    const res = await axios.get(`${API_BASE}/systemcounter/`);
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
      <Navbar2 />
      <br />
      <br />
      <div className="grade-page">
        <Toaster position="top-right" />
        <h2 style={{ fontFamily: "sans-serif" }}>System Counter Master</h2>
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
                <th>CounterCode</th>
                <th>CounterType</th>
                <th>UserID</th>
                <th>UserEntryDateTime</th>
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
                  <td>{r.CounterCode}</td>
                  <td>{r.CounterType}</td>
                  <td>{r.UserID}</td>
                  <td>{r.UserEntryDateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SystemCounterForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadAll();
          }}
          initialData={formData}
        />

        {reportOpen && (
          <ReportSystemCounterView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme="metal"
          />
        )}
      </div>
    </>
  );
}
