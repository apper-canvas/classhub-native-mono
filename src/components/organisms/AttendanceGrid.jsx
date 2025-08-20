import React from "react";
import { format, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import Card from "@/components/atoms/Card";
import AttendanceCell from "@/components/molecules/AttendanceCell";

const AttendanceGrid = ({ students, attendance, currentWeek, onAttendanceUpdate }) => {
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 })
  }).filter(day => day.getDay() !== 0 && day.getDay() !== 6); // Exclude weekends

  const getAttendanceStatus = (studentId, date) => {
const record = attendance.find(
      a => a.Student_c?.Id === studentId && 
      format(new Date(a.Date_c), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    return record?.Status_c || "";
  };

  const cycleAttendanceStatus = (currentStatus) => {
    const statuses = ["", "present", "absent", "late", "excused"];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  const handleStatusUpdate = (studentId, date, currentStatus) => {
    const newStatus = cycleAttendanceStatus(currentStatus);
    onAttendanceUpdate(studentId, date, newStatus);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Week of {format(weekDays[0], "MMM d, yyyy")}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50">
                Student
              </th>
              {weekDays.map((day) => (
                <th key={day.toISOString()} className="px-4 py-4 text-center">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-700">
                      {format(day, "EEE")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(day, "M/d")}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
<tr key={student.Id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 sticky left-0 bg-white border-r">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {student.FirstName_c?.[0]}{student.LastName_c?.[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">
                      {student.FirstName_c} {student.LastName_c}
                    </div>
                    <div className="text-sm text-gray-500">{student.StudentId_c}</div>
                    </div>
                  </div>
                </td>
{weekDays.map((day) => {
                const status = getAttendanceStatus(student.Id, day);
                return (
                  <td key={day.toISOString()} className="px-4 py-4 text-center">
                    <AttendanceCell
                      status={status}
                      onClick={() => handleStatusUpdate(student.Id, day, status)}
                      studentName={`${student.FirstName_c} ${student.LastName_c}`}
                      date={format(day, "MMM d")}
                    />
                  </td>
                );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Excused</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceGrid;