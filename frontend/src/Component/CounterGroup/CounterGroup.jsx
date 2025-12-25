// src/pages/CounterGroup.jsx
import { useEffect, useState } from "react";
import Tools from "../Tools";

export default function CounterGroup({ adminId, onExit }) {
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
      name: "location_code",
      label: "Location",
      type: "select",
      options: locations.map((loc) => ({
        value: loc.id, // saved to location_code
        label: loc.name, // shown in dropdown
      })),
      disableWhileLoading: loadingLocations,
      required: false,
    },
    { name: "name", label: "Counter Group Name", required: true },
    { name: "short_name", label: "Short Name", required: true },
    { name: "active", label: "Active", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
    // created_datetime is auto_now_add on model
  };

  return (
    <Tools
      title="Counter Group Master"
      columns={columns}
      apiBase="http://localhost:8000/counter-groups/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
