// src/pages/City.jsx
import { useEffect, useState, useMemo } from "react";
import Tools from "../Tools";

export default function City({ adminId, onExit }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(false);

  // load all countries and states once
  useEffect(() => {
    async function loadMasters() {
      try {
        setLoadingMaster(true);
        const [cRes, sRes] = await Promise.all([
          fetch("http://localhost:8000/countries/"),
          fetch("http://localhost:8000/states/"),
        ]);
        const [cData, sData] = await Promise.all([cRes.json(), sRes.json()]);
        setCountries(cData);
        setStates(sData);
      } catch (err) {
        console.error("Failed to load country/state masters", err);
      } finally {
        setLoadingMaster(false);
      }
    }
    loadMasters();
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "City Name",
        required: true,
        transform: (value) => value.toUpperCase(),
      },
      {
        name: "shortname",
        label: "Short Name",
        required: true,
        transform: (value) => value.toUpperCase(),
      },
      {
        name: "country_id",
        label: "Country",
        type: "select",
        options: countries.map((c) => ({
          value: c.id,
          label: c.name,
        })),
        disableWhileLoading: loadingMaster,
        required: true,
      },
      {
        name: "state_id",
        label: "State",
        type: "select",
        options: states.map((s) => ({
          value: s.id,
          label: s.name,
          country_id: s.country_id, // used for filtering
        })),
        disableWhileLoading: loadingMaster,
        required: true,
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
      },
    ],
    [countries, states, loadingMaster]
  );

  return (
    <Tools
      title="City Master"
      columns={columns}
      apiBase="http://localhost:8000/cities/"
      extraPayload={{ admin_id: adminId }}
      onExit={onExit}
    />
  );
}
