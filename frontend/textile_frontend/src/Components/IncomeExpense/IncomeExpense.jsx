import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Tools from "../Tools";
import IncomeExpenseForm from "./IncomeExpenseForm";
import ReportIncomeExpenseView from "./ReportIncomeExpenseView";
import Navbar2 from "../Navbar2";
import { useParams } from "react-router-dom";

import "../../css/theme.css";
import "../../css/row-highlight.css";
import "../../css/hover-effects.css";

const API_BASE = "http://127.0.0.1:8000";

export default function IncomeExpense() {
  const admin_id = useParams();
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);

  const loadAll = async () => {
    const res = await axios.get(`${API_BASE}/incomeexpense/`);
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
    await axios.delete(`${API_BASE}/incomeexpense/delete/${selected.Code}/`);
    toast.success("Deleted");
    setSelected(null);
    await loadAll();
  };
  const onView = () => {
    if (!selected) return toast.error("Select a row to view");
    toast(JSON.stringify(selected, null, 2), { duration: 4000 });
  };
  const onReport = async () => {
    const res = await axios.get(`${API_BASE}/incomeexpense/`);
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
      <br />
      <br />
      <div className="grade-page">
        <Toaster position="top-right" />
        <h2 style={{ fontFamily: "fantasy" }}>Income / Expense Master</h2>
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
                <th>Name</th>
                <th>Shortname</th>
                <th>Type</th>
                <th>Acc Head Name</th>
                <th>Acc Post</th>
                <th>Acc Head Code</th>
                <th>Active</th>
                <th>UserID</th>
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
                  <td>{r.Name}</td>
                  <td>{r.Shortname}</td>
                  <td>{r.HeadType ? "Income" : "Expense"}</td>
                  <td>{r.AccountHeadName}</td>
                  <td>{r.AccountPost ? "Yes" : "No"}</td>
                  <td>{r.AccountHeadCode}</td>
                  <td>{r.Active ? "Yes" : "No"}</td>
                  <td>{r.UserID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <IncomeExpenseForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadAll();
          }}
          initialData={formData}
        />

        {reportOpen && (
          <ReportIncomeExpenseView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme="metal"
          />
        )}
      </div>
    </>
  );
}
