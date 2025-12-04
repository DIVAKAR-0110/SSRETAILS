export default function CountryReportGrid({ data, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-50 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Country Report – Grid View</h2>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-4 bg-blue-600 text-white p-2 rounded-t">
        <div>Code</div>
        <div>Name</div>
        <div>Short Name</div>
        <div>Active</div>
      </div>

      {data.map((c) => (
        <div
          key={c.Code}
          className="grid grid-cols-4 p-2 border-b hover:bg-gray-100"
        >
          <div>{c.Code}</div>
          <div>{c.Name}</div>
          <div>{c.ShortName}</div>
          <div>{c.Active ? "Yes" : "No"}</div>
        </div>
      ))}
    </div>
  );
}
