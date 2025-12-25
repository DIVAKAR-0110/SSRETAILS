// src/pages/SystemCounterIntegration.jsx
import { useEffect, useState } from "react";
import Tools from "../Tools";

export default function SystemCounterIntegration({ adminId, onExit }) {
  const [counters, setCounters] = useState([]);
  const [systems, setSystems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  async function loadMasters() {
    try {
      setLoadingMasters(true);
      const [cRes, sRes, lRes] = await Promise.all([
        fetch("http://localhost:8000/counters/"),
        fetch("http://localhost:8000/system-mas/"),
        fetch("http://localhost:8000/locations/"),
      ]);

      if (!cRes.ok || !sRes.ok || !lRes.ok) {
        console.error(
          "Masters API failed",
          cRes.status,
          sRes.status,
          lRes.status
        );
        return;
      }

      const [cData, sData, lData] = await Promise.all([
        cRes.json(),
        sRes.json(),
        lRes.json(),
      ]);
      setCounters(cData);
      setSystems(sData);
      setLocations(lData);
    } catch (err) {
      console.error("Failed to load System-Counter masters", err);
    } finally {
      setLoadingMasters(false);
    }
  }

  useEffect(() => {
    loadMasters();
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
      disableWhileLoading: loadingMasters,
      required: false,
    },
    {
      name: "counter_id",
      label: "Counter",
      type: "select",
      options: counters.map((c) => ({
        value: c.id,
        label: c.name,
      })),
      disableWhileLoading: loadingMasters,
      required: true,
    },
    {
      name: "system_id",
      label: "System",
      type: "select",
      options: systems.map((s) => ({
        value: s.id, // or s.code if system_id is a string code
        label: s.name,
      })),
      disableWhileLoading: loadingMasters,
      required: true,
    },
  ];

  const extraPayload = {
    admin_id: adminId,
  };

  return (
    <Tools
      title="System–Counter Integration"
      columns={columns}
      apiBase="http://localhost:8000/system-counter-integrations/"
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
