// src/pages/State.jsx
import { useEffect, useState } from "react";
import Tools from "../Tools";

export default function State({ adminId, onExit }) {
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  useEffect(() => {
    async function loadCountries() {
      try {
        setLoadingCountries(true);
        const res = await fetch("http://localhost:8000/countries/");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries", err);
      } finally {
        setLoadingCountries(false);
      }
    }
    loadCountries();
  }, []);

  const columns = [
    {
      name: "name",
      label: "State Name",
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
      disableWhileLoading: loadingCountries,
      required: true,
    },
    {
      name: "active",
      label: "Active",
      type: "boolean",
    },
  ];

  return (
    <Tools
      title="State Master"
      columns={columns}
      apiBase="http://localhost:8000/states/"
      extraPayload={{ admin_id: adminId }}
      onExit={onExit}
    />
  );
}
