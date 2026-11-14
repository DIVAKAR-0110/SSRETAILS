// src/pages/City.jsx
import { useEffect, useState, useMemo } from "react";
import Tools from "../../../Tools";

export default function City({ adminId, onExit }) {
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);

  // Load state masters for dropdown
  useEffect(() => {
    async function loadStates() {
      try {
        setLoadingStates(true);
        const res = await fetch("http://localhost:8000/states/");
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load state master", err);
      } finally {
        setLoadingStates(false);
      }
    }
    loadStates();
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "name",
        label: "City Name",
        type: "text",
        required: true,
        maxLength: 50,
        placeholder: "ENTER CITY NAME",
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
        name: "state_id",
        label: "State",
        type: "select",
        options: states.map((s) => ({
          value: s.id,
          label: s.name,
        })),
        disableWhileLoading: loadingStates,
        required: true,
      },
      {
        name: "active",
        label: "Active",
        type: "boolean",
        default: true,
      },
    ],
    [states, loadingStates]
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
