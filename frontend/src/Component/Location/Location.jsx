// src/pages/Location.jsx
import { useEffect, useState } from "react";
import Tools from "../Tools";

export default function Location({ adminId, onExit }) {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    async function loadCities() {
      try {
        setLoadingCities(true);
        const res = await fetch("http://localhost:8000/cities/");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Failed to load cities", err);
      } finally {
        setLoadingCities(false);
      }
    }
    loadCities();
  }, []);

  const columns = [
    { name: "name", label: "Location Name", required: true },
    { name: "shortname", label: "Short Name", required: true },
    { name: "address", label: "Address" },
    {
      name: "city_id",
      label: "City",
      type: "select",
      options: cities.map((city) => ({
        value: city.id, // saved to city_id
        label: city.name, // shown in dropdown
      })),
      disableWhileLoading: loadingCities,
      required: false,
    },
    { name: "phoneno", label: "Phone No" },
    { name: "mobile", label: "Mobile" },
    { name: "fax", label: "Fax" },
    { name: "email", label: "Email" },
    { name: "website", label: "Website" },
    { name: "tinno", label: "TIN No" },
    { name: "tindate", label: "TIN Date (ISO)" },
    { name: "areaid", label: "Area ID" },
    { name: "cstno", label: "CST No" },
    { name: "cstdate", label: "CST Date (ISO)" },
    { name: "pinid", label: "Pin ID" },
    { name: "servername", label: "Server Name" },
    { name: "serveruid", label: "Server UID" },
    { name: "dbname", label: "DB Name" },
    { name: "serverpwd", label: "Server Password" },
    { name: "servermode", label: "Server Mode" },
    { name: "protocol", label: "Protocol" },
    { name: "accdbname", label: "Accounts DB Name" },
    { name: "ipaddress", label: "IP Address" },
    { name: "active", label: "Active", type: "boolean" },
    { name: "mainserver", label: "Main Server", type: "boolean" },
    { name: "uploaddata", label: "Upload Data", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
  };

  return (
    <Tools
      title="Location Master"
      columns={columns}
      apiBase="http://localhost:8000/locations/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
