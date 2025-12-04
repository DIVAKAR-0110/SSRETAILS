import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = "http://127.0.0.1:8000";

export default function LocationForm({ open, onClose, onSaved, initialData }) {
  const [cities, setCities] = useState([]);
  const [stateName, setStateName] = useState("");
  const [countryName, setCountryName] = useState("");

  const [form, setForm] = useState({
    Code: "",
    Name: "",
    ShortName: "",
    Address: "",
    CityCode: "",
    Phoneno: "",
    Mobile: "",
    Fax: "",
    Email: "",
    WebSite: "",
    TinNo: "",
    TinDate: "",
    AreaCode: "",
    CstNo: "",
    CstDate: "",
    Active: true,
    UserID: 1,
    Pincode: "",
    ServerName: "",
    ServerUID: "",
    DbName: "",
    ServerPwd: "",
    ServerMode: "",
    Protocol: "",
    MainServer: false,
    AccDbName: "",
    IPAddress: "",
    UploadData: false,
  });

  useEffect(() => {
    axios.get(`${API_BASE}/cities/`).then((res) => setCities(res.data));
    axios.get("http://127.0.0.1:8000/cities/").then((r) => console.log(r.data));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        CityCode: initialData.City
          ? initialData.City.Code
          : initialData.CityCode || "",
      }));
      if (initialData.StateName) setStateName(initialData.StateName);
      if (initialData.CountryName) setCountryName(initialData.CountryName);
    } else {
      setForm((prev) => ({ ...prev, Code: "" }));
      setStateName("");
      setCountryName("");
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "CityCode") {
      const city = cities.find((c) => String(c.Code) === String(value));
      if (city) {
        setStateName(city.StateName || "");
        setCountryName(city.CountryName || "");
      } else {
        setStateName("");
        setCountryName("");
      }
    }
  };

  const save = async () => {
    if (!form.Name) return toast.error("Name required");
    if (!form.CityCode) return toast.error("City required");
    if (!form.Pincode) return toast.error("PIN/ZIP Code required");

    try {
      const payload = { ...form };
      if (!payload.Code) delete payload.Code;
      delete payload.CreatedDateTime; // backend handles
      await axios.post(`${API_BASE}/location/add/`, payload);
      toast.success(payload.Code ? "Updated" : "Created");
      onSaved && onSaved();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Save failed");
    }
  };

  if (!open) return null;

  return (
    <div
      className="drawer panel animate"
      style={{ width: "550px", margin: "40px auto" }}
    >
      <div className="form-header">
        <h2>{form.Code ? "Edit Location" : "Add Location"}</h2>
        <button className="close-icon-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 480px", minWidth: 420 }}>
          <label>Name</label>
          <input
            name="Name"
            value={form.Name || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Short Name</label>
          <input
            name="ShortName"
            value={form.ShortName || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Address</label>
          <textarea
            name="Address"
            value={form.Address || ""}
            onChange={handleChange}
            className="input"
            rows={3}
          />
          <br />

          <label>City</label>
          <select
            name="CityCode"
            value={form.CityCode || ""}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.Code} value={c.Code}>
                {c.Name}
              </option>
            ))}
          </select>
          <br />

          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>State</label>
              <input
                value={stateName}
                readOnly
                className="input"
                style={{ background: "#f4f4f4" }}
              />
            </div>
            <br />

            <div style={{ flex: 1 }}>
              <label>Country</label>
              <input
                value={countryName}
                readOnly
                className="input"
                style={{ background: "#f4f4f4" }}
              />
            </div>
            <br />
          </div>
          <br />

          <label>PIN / ZIP Code</label>
          <input
            name="Pincode"
            value={form.Pincode || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Phone No.</label>
          <input
            name="Phoneno"
            value={form.Phoneno || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Mobile No.</label>
          <input
            name="Mobile"
            value={form.Mobile || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Fax No.</label>
          <input
            name="Fax"
            value={form.Fax || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Email Id.</label>
          <input
            name="Email"
            value={form.Email || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Website</label>
          <input
            name="WebSite"
            value={form.WebSite || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>TIN No.</label>
          <input
            name="TinNo"
            value={form.TinNo || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>TIN Date</label>
          <input
            name="TinDate"
            type="date"
            value={form.TinDate ? form.TinDate.substr(0, 10) : ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>CST No.</label>
          <input
            name="CstNo"
            value={form.CstNo || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>CST Date</label>
          <input
            name="CstDate"
            type="date"
            value={form.CstDate ? form.CstDate.substr(0, 10) : ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Area Code</label>
          <input
            name="AreaCode"
            value={form.AreaCode || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <div style={{ marginTop: 8 }}>
            <label style={{ marginRight: 16 }}>
              <input
                type="checkbox"
                name="MainServer"
                checked={!!form.MainServer}
                onChange={handleChange}
              />{" "}
              Main Server
            </label>
            <label>
              <input
                type="checkbox"
                name="UploadData"
                checked={!!form.UploadData}
                onChange={handleChange}
              />{" "}
              Upload Data
            </label>
          </div>
          <br />

          <div style={{ marginTop: 8 }}>
            <label>
              <input
                type="checkbox"
                name="Active"
                checked={!!form.Active}
                onChange={handleChange}
              />{" "}
              Active
            </label>
          </div>
        </div>
        <br />

        {/* RIGHT COLUMN – SERVER / DB SETTINGS */}
        <div style={{ flex: "1 1 420px", minWidth: 380 }}>
          <h4 style={{ marginBottom: 8 }}>Server Details</h4>

          <label>Server Name</label>
          <input
            name="ServerName"
            value={form.ServerName || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Server UID</label>
          <input
            name="ServerUID"
            value={form.ServerUID || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Server Password</label>
          <input
            name="ServerPwd"
            type="password"
            value={form.ServerPwd || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Database Name</label>
          <input
            name="DbName"
            value={form.DbName || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Accounting DB Name</label>
          <input
            name="AccDbName"
            value={form.AccDbName || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Server Mode</label>
          <input
            name="ServerMode"
            value={form.ServerMode || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>Protocol</label>
          <input
            name="Protocol"
            value={form.Protocol || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>IP Address</label>
          <input
            name="IPAddress"
            value={form.IPAddress || ""}
            onChange={handleChange}
            className="input"
          />
          <br />

          <label>User ID</label>
          <input
            name="UserID"
            type="number"
            value={form.UserID || ""}
            onChange={handleChange}
            className="input"
            disabled
          />
          <br />
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={save}
          style={{ marginLeft: 16 }}
        >
          {form.Code ? "Update" : "Save"}
        </button>
        <br />
        <br />
      </div>
    </div>
  );
}
