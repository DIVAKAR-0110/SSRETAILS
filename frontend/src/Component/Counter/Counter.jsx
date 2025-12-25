// src/pages/Counter.jsx
import { useEffect, useState } from "react";
import Tools from "../Tools";

export default function Counter({ adminId, onExit }) {
  const [locations, setLocations] = useState([]);
  const [counterGroups, setCounterGroups] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  useEffect(() => {
    async function loadMasters() {
      try {
        setLoadingMasters(true);
        const [locRes, grpRes] = await Promise.all([
          fetch("http://localhost:8000/locations/"),
          fetch("http://localhost:8000/counter-groups/"),
        ]);
        const [locData, grpData] = await Promise.all([
          locRes.json(),
          grpRes.json(),
        ]);
        setLocations(locData);
        setCounterGroups(grpData);
      } catch (err) {
        console.error("Failed to load masters for Counter", err);
      } finally {
        setLoadingMasters(false);
      }
    }
    loadMasters();
  }, []);

  const columns = [
    {
      name: "location_id",
      label: "Location",
      type: "select",
      options: locations.map((l) => ({
        value: l.id, // stored in location_id
        label: l.name, // shown in dropdown
      })),
      disableWhileLoading: loadingMasters,
      required: false,
    },
    { name: "name", label: "Counter Name", required: true },
    { name: "short_name", label: "Short Name", required: true },
    {
      name: "counter_group_id",
      label: "Counter Group",
      type: "select",
      options: counterGroups.map((g) => ({
        value: g.id, // stored in counter_group_id
        label: g.name, // shown in dropdown
      })),
      disableWhileLoading: loadingMasters,
      required: false,
    },
    {
      name: "section_code",
      label: "Section Code",
    },
    {
      name: "counter_order",
      label: "Counter Order",
      type: "number",
      step: "1",
    },
    { name: "active", label: "Active", type: "boolean" },
  ];

  return (
    <Tools
      title="Counter Master"
      columns={columns}
      apiBase="http://localhost:8000/counters/"
      extraPayload={{ admin_id: adminId }}
      onExit={onExit}
    />
  );
}
