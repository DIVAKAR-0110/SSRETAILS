import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Tools from "../Tools";
import SystemForm from "./SystemForm";
import ReportSystemView from "./ReportSystemView";
import Navbar2 from "../Navbar2";
import { useParams } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export default function System() {
  const admin_id = useParams();
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);

  const loadAll = async () => {
    const res = await axios.get(`${API_BASE}/system/`);
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
    await axios.delete(`${API_BASE}/system/delete/${selected.Code}/`);
    toast.success("Deleted");
    setSelected(null);
    await loadAll();
  };
  const onView = () => {
    if (!selected) return toast.error("Select a row to view");
    toast(JSON.stringify(selected, null, 2), { duration: 4000 });
  };
  const onReport = async () => {
    const res = await axios.get(`${API_BASE}/system/`);
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
      <br />
      <div className="grade-page">
        <Toaster position="top-right" />
        <h2 style={{ fontFamily: "sans-serif" }}>System Master</h2>
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
                <th>MACID</th>
                <th>PrintFunc</th>
                <th>GroupBillPrefix</th>
                <th>Separator</th>
                <th>NoLength</th>
                <th>LastNo</th>
                <th>FloorCode</th>
                <th>ReturnSystem</th>
                <th>SettlePrintFunc</th>
                <th>SysRefNo</th>
                <th>AllowScheme</th>
                <th>PrinterPort</th>
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
                  <td>{r.MACID}</td>
                  <td>{r.PrintFunctionCode}</td>
                  <td>{r.GroupBillPrefix}</td>
                  <td>{r.Seperator}</td>
                  <td>{r.NoLength}</td>
                  <td>{r.LastNo}</td>
                  <td>{r.FloorCode}</td>
                  <td>{r.ReturnSystem}</td>
                  <td>{r.SettlementPrintFunctionCode}</td>
                  <td>{r.SysRefNo}</td>
                  <td>{r.AllowScheme ? "Yes" : "No"}</td>
                  <td>{r.PRINTERPORTCODE}</td>
                  <td>{r.Active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SystemForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadAll();
          }}
          initialData={formData}
        />

        {reportOpen && (
          <ReportSystemView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme="metal"
          />
        )}
      </div>
    </>
  );
}
