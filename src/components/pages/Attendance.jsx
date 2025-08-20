import React, { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek } from "date-fns";
import Button from "@/components/atoms/Button";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { toast } from "react-toastify";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load attendance data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const handleAttendanceUpdate = async (studentId, date, status) => {
    try {
      const dateString = format(date, "yyyy-MM-dd");
      const existingRecord = attendance.find(
        a => a.studentId === studentId && 
        format(new Date(a.date), "yyyy-MM-dd") === dateString
      );

      if (existingRecord) {
        if (status === "") {
          // Delete the record if status is empty
          await attendanceService.delete(existingRecord.Id);
          setAttendance(attendance.filter(a => a.Id !== existingRecord.Id));
        } else {
          // Update existing record
          const updated = await attendanceService.update(existingRecord.Id, {
            ...existingRecord,
            status
          });
          setAttendance(attendance.map(a => a.Id === existingRecord.Id ? updated : a));
        }
      } else if (status !== "") {
        // Create new record
        const newRecord = await attendanceService.create({
          studentId,
          date: date.toISOString(),
          status,
          notes: ""
        });
        setAttendance([...attendance, newRecord]);
      }
      
      toast.success("Attendance updated successfully!");
    } catch (err) {
      toast.error("Failed to update attendance");
      console.error(err);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const isCurrentWeek = () => {
    const now = new Date();
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const selectedWeekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return format(currentWeekStart, "yyyy-MM-dd") === format(selectedWeekStart, "yyyy-MM-dd");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAttendanceData} />;

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Attendance
          </h1>
          <p className="text-gray-600 mt-2">Track daily attendance for your students</p>
        </div>
        <Empty
          title="No students found"
          description="Add students to your roster before taking attendance."
          icon="Calendar"
          actionLabel="Go to Students"
          onAction={() => window.location.href = "/students"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Attendance
          </h1>
          <p className="text-gray-600 mt-2">Track daily attendance for your students</p>
        </div>
        
        <div className="flex items-center gap-2">
          {!isCurrentWeek() && (
            <Button variant="outline" onClick={goToCurrentWeek}>
              <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
              Current Week
            </Button>
          )}
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-gradient-to-r from-surface to-gray-100 p-4 rounded-xl">
        <Button
          variant="ghost"
          onClick={goToPreviousWeek}
        >
          <ApperIcon name="ChevronLeft" className="h-5 w-5 mr-2" />
          Previous Week
        </Button>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Week of {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), "MMMM d, yyyy")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Click on cells to mark attendance (P = Present, A = Absent, L = Late, E = Excused)
          </p>
        </div>
        
        <Button
          variant="ghost"
          onClick={goToNextWeek}
        >
          Next Week
          <ApperIcon name="ChevronRight" className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Attendance Grid */}
      <AttendanceGrid
        students={students}
        attendance={attendance}
        currentWeek={currentWeek}
        onAttendanceUpdate={handleAttendanceUpdate}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center">
            <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-green-600">Weekly Present</p>
              <p className="font-semibold text-green-800">
                {attendance.filter(a => {
                  const attendanceWeek = startOfWeek(new Date(a.date), { weekStartsOn: 1 });
                  const selectedWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
                  return format(attendanceWeek, "yyyy-MM-dd") === format(selectedWeek, "yyyy-MM-dd") && 
                         a.status === "present";
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
          <div className="flex items-center">
            <ApperIcon name="XCircle" className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <p className="text-sm text-red-600">Weekly Absent</p>
              <p className="font-semibold text-red-800">
                {attendance.filter(a => {
                  const attendanceWeek = startOfWeek(new Date(a.date), { weekStartsOn: 1 });
                  const selectedWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
                  return format(attendanceWeek, "yyyy-MM-dd") === format(selectedWeek, "yyyy-MM-dd") && 
                         a.status === "absent";
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <div className="flex items-center">
            <ApperIcon name="Clock" className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm text-yellow-600">Weekly Late</p>
              <p className="font-semibold text-yellow-800">
                {attendance.filter(a => {
                  const attendanceWeek = startOfWeek(new Date(a.date), { weekStartsOn: 1 });
                  const selectedWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
                  return format(attendanceWeek, "yyyy-MM-dd") === format(selectedWeek, "yyyy-MM-dd") && 
                         a.status === "late";
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center">
            <ApperIcon name="Shield" className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-blue-600">Weekly Excused</p>
              <p className="font-semibold text-blue-800">
                {attendance.filter(a => {
                  const attendanceWeek = startOfWeek(new Date(a.date), { weekStartsOn: 1 });
                  const selectedWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
                  return format(attendanceWeek, "yyyy-MM-dd") === format(selectedWeek, "yyyy-MM-dd") && 
                         a.status === "excused";
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;