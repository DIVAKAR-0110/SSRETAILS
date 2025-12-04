// src/components/CountryReadOnly.jsx
import React, { useEffect, useState } from "react";
import { authFetch } from "./auth";

export default function CountryReadOnly({
  mode = "html",
  onClose,
  filters = {},
  ordering = "",
  focus,
}) {
  const [data, setData] = useState([]);
  const API = "http://127.0.0.1:8000/api/country/";

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams();
      if (ordering) params.append("ordering", ordering);
      params.append("page_size", 1000);
      Object.keys(filters).forEach((k) => {
        if (filters[k]) params.append(`filter_${k}`, filters[k]);
      });
      const res = await authFetch(`${API}?${params.toString()}`);
      if (res.ok) {
        const j = await res.json();
        setData(j.results || []);
      } else {
        alert("Failed to load report");
      }
    };
    fetchData();
  }, [filters, ordering]);

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-start justify-center p-6">
      <div className="bg-white w-full max-w-5xl rounded shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Report — {mode === "grid" ? "Grid View" : "HTML List"}
          </h3>
          <button className="px-3 py-1 border rounded" onClick={onClose}>
            Back
          </button>
        </div>

        {mode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.map((d) => (
              <div
                key={d.Code}
                className={`p-3 border rounded ${
                  focus === d.Code ? "ring-2 ring-sky-400" : ""
                }`}
              >
                <div className="text-sm text-gray-500">#{d.Code}</div>
                <div className="font-semibold">{d.Name}</div>
                <div className="text-sm">{d.ShortName}</div>
                <div className="text-xs text-gray-600">
                  Active: {d.Active ? "Yes" : "No"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-auto max-h-[60vh]">
            <table className="min-w-full divide-y">
              <thead>
                <tr>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">ShortName</th>
                  <th className="px-3 py-2">Active</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr
                    key={d.Code}
                    className={focus === d.Code ? "bg-sky-100" : ""}
                  >
                    <td className="px-3 py-2">{d.Code}</td>
                    <td className="px-3 py-2">{d.Name}</td>
                    <td className="px-3 py-2">{d.ShortName}</td>
                    <td className="px-3 py-2">{d.Active ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
