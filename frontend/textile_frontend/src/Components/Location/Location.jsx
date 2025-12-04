import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Tools from "../Tools";
import LocationForm from "./LocationForm";
import ReportLocationView from "./ReportLocationView";
import Navbar2 from "../Navbar2";
import { useParams } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export default function Location() {
  const admin_id = useParams();
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState([]);

  const loadAll = async () => {
    const res = await axios.get(`${API_BASE}/location/`);
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
    await axios.delete(`${API_BASE}/location/delete/${selected.Code}/`);
    toast.success("Deleted");
    setSelected(null);
    await loadAll();
  };
  const onView = () => {
    if (!selected) return toast.error("Select a row to view");
    toast(JSON.stringify(selected, null, 2), { duration: 5000 });
  };
  const onReport = async () => {
    const res = await axios.get(`${API_BASE}/location/`);
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
        <h2>Location Master</h2>
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
                <th>Short</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>PIN/ZIP</th>
                <th>Phone</th>
                <th>Mobile</th>
                <th>Fax</th>
                <th>Email</th>
                <th>Website</th>
                <th>TIN No</th>
                <th>TIN Date</th>
                <th>CST No</th>
                <th>CST Date</th>
                <th>Area Code</th>
                <th>Server</th>
                <th>DbName</th>
                <th>Mode</th>
                <th>Protocol</th>
                <th>Main</th>
                <th>AccDb</th>
                <th>IP</th>
                <th>Upload</th>
                <th>Active</th>
                <th>UserID</th>
              </tr>
            </thead>
            <tbody>
              {all.map((loc) => (
                <tr
                  key={loc.Code}
                  className={selected?.Code === loc.Code ? "selected" : ""}
                  onClick={() =>
                    setSelected(selected?.Code === loc.Code ? null : loc)
                  }
                >
                  <td>{loc.Code}</td>
                  <td>{loc.Name}</td>
                  <td>{loc.ShortName}</td>
                  <td>{loc.Address}</td>
                  <td>{loc.City?.Name || ""}</td>
                  <td>{loc.StateName || ""}</td>
                  <td>{loc.CountryName || ""}</td>
                  <td>{loc.Pincode}</td>
                  <td>{loc.Phoneno}</td>
                  <td>{loc.Mobile}</td>
                  <td>{loc.Fax}</td>
                  <td>{loc.Email}</td>
                  <td>{loc.WebSite}</td>
                  <td>{loc.TinNo}</td>
                  <td>{loc.TinDate}</td>
                  <td>{loc.CstNo}</td>
                  <td>{loc.CstDate}</td>
                  <td>{loc.AreaCode}</td>
                  <td>{loc.ServerName}</td>
                  <td>{loc.DbName}</td>
                  <td>{loc.ServerMode}</td>
                  <td>{loc.Protocol}</td>
                  <td>{loc.MainServer ? "Yes" : "No"}</td>
                  <td>{loc.AccDbName}</td>
                  <td>{loc.IPAddress}</td>
                  <td>{loc.UploadData ? "Yes" : "No"}</td>
                  <td>{loc.Active ? "Yes" : "No"}</td>
                  <td>{loc.UserID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <LocationForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadAll();
          }}
          initialData={formData}
        />

        {reportOpen && (
          <ReportLocationView
            data={reportData}
            onClose={() => setReportOpen(false)}
            theme="metal"
          />
        )}
      </div>
    </>
  );
}
