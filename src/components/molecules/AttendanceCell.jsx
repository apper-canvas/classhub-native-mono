import React from "react";
import { cn } from "@/utils/cn";

const AttendanceCell = ({ status, onClick, studentName, date }) => {
  const statusConfig = {
    present: { color: "bg-green-500", label: "P", tooltip: "Present" },
    absent: { color: "bg-red-500", label: "A", tooltip: "Absent" },
    late: { color: "bg-yellow-500", label: "L", tooltip: "Late" },
    excused: { color: "bg-blue-500", label: "E", tooltip: "Excused" },
    "": { color: "bg-gray-200", label: "", tooltip: "Not marked" }
  };

  const config = statusConfig[status] || statusConfig[""];

  return (
    <button
      onClick={() => onClick && onClick(status)}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:scale-110 shadow-sm",
        config.color,
        status === "" && "border-2 border-dashed border-gray-300 text-gray-400"
      )}
      title={`${studentName} - ${date} (${config.tooltip})`}
    >
      {config.label}
    </button>
  );
};

export default AttendanceCell;