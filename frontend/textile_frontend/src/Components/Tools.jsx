// Tools.jsx
import React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  RefreshCcw,
  LogOut,
} from "lucide-react";

export default function Tools({
  onAdd,
  onEdit,
  onDelete,
  onView,
  onReport,
  onRefresh,
  onExit,
}) {
  return (
    <div className="tools-bar">
      <button className="tool" onClick={onAdd} title="Add">
        <Plus className="tool-icon" /> <span className="tool-label">Add</span>
      </button>

      <button className="tool" onClick={onEdit} title="Edit">
        <Pencil className="tool-icon" />{" "}
        <span className="tool-label">Edit</span>
      </button>

      <button className="tool danger" onClick={onDelete} title="Delete">
        <Trash2 className="tool-icon" />{" "}
        <span className="tool-label">Delete</span>
      </button>

      <button className="tool" onClick={onView} title="View">
        <Eye className="tool-icon" /> <span className="tool-label">View</span>
      </button>

      <button className="tool" onClick={onReport} title="Report">
        <FileText className="tool-icon" />{" "}
        <span className="tool-label">Report</span>
      </button>

      <button className="tool" onClick={onRefresh} title="Refresh">
        <RefreshCcw className="tool-icon" />{" "}
        <span className="tool-label">Refresh</span>
      </button>

      <button className="tool" onClick={onExit} title="Exit">
        <LogOut className="tool-icon" />{" "}
        <span className="tool-label">Exit</span>
      </button>
    </div>
  );
}
