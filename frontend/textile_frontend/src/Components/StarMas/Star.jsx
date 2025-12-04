import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Tools from "../Tools";
import StarForm from "./StarForm";
import ReportStarView from "./ReportStarView";
import { useParams } from "react-router-dom";
import Navbar2 from "../Navbar2";

const API_BASE = "http://127.0.0.1:8000";

export default function Star() {
  const admin_id = useParams();
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);

  // Load all stars from backend
  const loadAll = async () => {
    try {
      const res = await axios.get(`${API_BASE}/star/`);
      setAll(res.data);
    } catch (error) {
      toast.error("Error loading stars");
    }
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
    if (!window.confirm(`Delete ${selected.Starname}?`)) return;
    try {
      await axios.delete(`${API_BASE}/star/delete/${selected.Code}/`);
      toast.success("Deleted");
      setSelected(null);
      await loadAll();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const onView = () => {
    if (!selected) return toast.error("Select a row to view");
    toast(JSON.stringify(selected, null, 2), { duration: 4000 });
  };

  const onReport = async () => {
    try {
      const res = await axios.get(`${API_BASE}/star/`);
      setReportData(res.data);
      setReportOpen(true);
    } catch {
      toast.error("Failed to load report data");
    }
  };

  const onRefresh = async () => {
    await loadAll();
    toast.success("Refreshed");
  };

  const onExit = () => window.history.back();

  return (
    <>
      <Navbar2 admin_id={admin_id} />
      <br />
      <br />
      <div className="grade-page">
        <Toaster position="top-right" />
        <h2 style={{ fontFamily: "cursive" }}>Star Master</h2>
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
                <th>Star Name</th>
                <th>Star Value</th>
                <th>Active</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {all.map((r) => (
                <tr
                  key={r.Code} // Unique key fix: Use Code with capital C
                  className={selected?.Code === r.Code ? "selected" : ""}
                  onClick={() =>
                    setSelected(selected?.Code === r.Code ? null : r)
                  }
                >
                  <td>{r.Code}</td>
                  <td>{r.Starname}</td>
                  <td>{r.Starvalue}</td>
                  <td>{r.active ? "Yes" : "No"}</td>
                  <td>{r.UserID ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <StarForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadAll();
          }}
          initialData={formData}
        />

        {reportOpen && (
          <ReportStarView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme="metal"
          />
        )}
      </div>
    </>
  );
}
