// src/pages/Floor.jsx
import { useEffect, useState } from "react";
import Tools from "../../../Tools";

export default function Floor({ adminId, onExit }) {
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    async function loadLocations() {
      try {
        setLoadingLocations(true);
        const res = await fetch("http://localhost:8000/locations/");
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Failed to load locations", err);
      } finally {
        setLoadingLocations(false);
      }
    }
    loadLocations();
  }, []);

  const columns = [
    {
      name: "location_id",
      label: "Location",
      type: "select",
      options: locations.map((loc) => ({
        value: loc.id,
        label: loc.name,
      })),
      disableWhileLoading: loadingLocations,
      required: false,
    },
    {
      name: "name",
      label: "Floor Name",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "ENTER FLOOR NAME",
      transform: (value) => value.toUpperCase(),
    },
    {
      name: "shortname",
      label: "Short Name",
      type: "text",
      required: true,
      maxLength: 25,
      placeholder: "ENTER SHORT CODE",
      transform: (value) => value.toUpperCase(),
    },
    {
      name: "active",
      label: "Active",
      type: "boolean",
      default: true,
    },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_at is auto_now_add in model
  };

  return (
    <Tools
      title="Floor Master"
      columns={columns}
      apiBase="http://localhost:8000/floors/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
