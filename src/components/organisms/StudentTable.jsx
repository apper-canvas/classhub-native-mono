import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StudentTable = ({ students, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-medium text-gray-700 hover:text-gray-900"
    >
      {children}
      <ApperIcon 
        name={sortField === field ? (sortDirection === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
        className="h-4 w-4" 
      />
    </button>
  );

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
                <SortButton field="lastName">Student</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="studentId">ID</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="grade">Grade</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="email">Email</SortButton>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
{sortedStudents.map((student) => (
            <tr key={student.Id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {student.FirstName_c?.[0]}{student.LastName_c?.[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">
                      {student.FirstName_c} {student.LastName_c}
                    </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-gray-600">{student.studentId}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="primary">{student.grade}</Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{student.email}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(student)}
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(student.Id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default StudentTable;