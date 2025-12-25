// src/pages/SystemMas.jsx
import { useEffect, useState } from "react";
import Tools from "../Tools";

export default function SystemMas({ adminId, onExit }) {
  const [locations, setLocations] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  useEffect(() => {
    async function loadMasters() {
      try {
        setLoadingMasters(true);
        const [locRes, floorRes] = await Promise.all([
          fetch("http://localhost:8000/locations/"),
          fetch("http://localhost:8000/floors/"),
        ]);
        const [locData, floorData] = await Promise.all([
          locRes.json(),
          floorRes.json(),
        ]);
        setLocations(locData);
        setFloors(floorData);
      } catch (err) {
        console.error("Failed to load masters", err);
      } finally {
        setLoadingMasters(false);
      }
    }
    loadMasters(); // ✅ FIXED: was loadLocations()
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
      required: true,
    },
    { name: "name", label: "System Name", required: true },
    { name: "short_name", label: "Short Name", required: true },
    { name: "mac_id", label: "MAC ID" },
    {
      name: "print_function_code",
      label: "Print Function Code",
      type: "number",
    },
    { name: "group_bill_prefix", label: "Group Bill Prefix" },
    { name: "seperator", label: "Separator" },
    {
      name: "no_length",
      label: "No Length",
      type: "number",
      step: "1",
    },
    { name: "last_no", label: "Last No" },
    {
      name: "floor_code",
      label: "Floor",
      type: "select",
      options: floors.map((flo) => ({
        // ✅ FIXED: floors.map
        value: flo.id,
        label: flo.name,
      })),
      disableWhileLoading: loadingMasters,
      required: false, // ✅ Made optional since Floor API might not exist yet
    },
    {
      name: "return_system",
      label: "Return System",
      type: "number",
      step: "1",
    },
    {
      name: "settlement_print_function_code",
      label: "Settlement Print Code",
      type: "number",
    },
    { name: "sys_ref_no", label: "System Ref No" },
    { name: "printer_port_code", label: "Printer Port Code", type: "number" },
    { name: "active", label: "Active", type: "boolean" },
    { name: "allow_scheme", label: "Allow Scheme", type: "boolean" },
  ];

  const extraPayload = {
    admin_id: adminId,
  };

  return (
    <Tools
      title="System Master"
      columns={columns}
      apiBase="http://localhost:8000/system-mas/" // ✅ FIXED: added /api/
      extraPayload={extraPayload}
      onExit={onExit}
    />
  );
}
