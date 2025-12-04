export default function CountryReportHTML({ data, onClose }) {
  return (
    <div className="fixed inset-0 bg-white p-8 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Country Report – HTML View</h2>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Code</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Short Name</th>
            <th className="border p-2">Active</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c) => (
            <tr key={c.Code}>
              <td className="border p-2">{c.Code}</td>
              <td className="border p-2">{c.Name}</td>
              <td className="border p-2">{c.ShortName}</td>
              <td className="border p-2">{c.Active ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
