import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";
import { assignmentService } from "@/services/api/assignmentService";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData, gradesData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll(),
        assignmentService.getAll()
      ]);
      
      setStudents(studentsData);
      setAttendance(attendanceData);
      setGrades(gradesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

// Calculate statistics
  const totalStudents = students.length;
  
  const todayAttendance = attendance.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.Date_c).toDateString() === today;
  });
  const presentToday = todayAttendance.filter(a => a.Status_c === "present").length;
  const attendanceRate = totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(1) : 0;
  
  const totalAssignments = assignments.length;
  const totalGrades = grades.length;
  const averageGrade = totalGrades > 0 ? 
    assignments.reduce((sum, assignment) => {
      const assignmentGrades = grades.filter(g => g.Assignment_c?.Id === assignment.Id);
      const assignmentAverage = assignmentGrades.length > 0 ?
        assignmentGrades.reduce((gSum, grade) => gSum + grade.Score_c, 0) / assignmentGrades.length :
        0;
      return sum + (assignmentAverage / assignment.Points_c) * 100;
    }, 0) / assignments.length : 0;

  // Recent activity
  const recentGrades = grades
    .sort((a, b) => new Date(b.SubmittedDate_c) - new Date(a.SubmittedDate_c))
    .slice(0, 5)
    .map(grade => {
      const student = students.find(s => s.Id === grade.Student_c?.Id);
      const assignment = assignments.find(a => a.Id === grade.Assignment_c?.Id);
      return { ...grade, student, assignment };
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening in your classroom today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="primary">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="Users"
          gradient="blue"
          change="+2 this week"
          changeType="positive"
        />
        <StatCard
          title="Present Today"
          value={`${presentToday}/${totalStudents}`}
          icon="Calendar"
          gradient="green"
          change={`${attendanceRate}% rate`}
          changeType={attendanceRate >= 90 ? "positive" : "negative"}
        />
        <StatCard
          title="Class Average"
          value={`${Math.round(averageGrade)}%`}
          icon="TrendingUp"
          gradient="purple"
          change={averageGrade >= 80 ? "+2.5%" : "-1.2%"}
          changeType={averageGrade >= 80 ? "positive" : "negative"}
        />
        <StatCard
          title="Assignments"
          value={totalAssignments}
          icon="BookOpen"
          gradient="orange"
          change="3 due this week"
          changeType="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Grades</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ExternalLink" className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentGrades.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent grades to display</p>
            ) : (
recentGrades.map((grade) => (
              <div key={grade.Id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                    {grade.student?.FirstName_c?.[0]}{grade.student?.LastName_c?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {grade.student?.FirstName_c} {grade.student?.LastName_c}
                    </p>
                    <p className="text-sm text-gray-500">{grade.assignment?.Title_c}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {grade.Score_c}/{grade.assignment?.Points_c}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.round((grade.Score_c / grade.assignment?.Points_c) * 100)}%
                  </p>
                </div>
              </div>
            ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="primary" className="h-20 flex-col">
              <ApperIcon name="UserPlus" className="h-6 w-6 mb-2" />
              Add Student
            </Button>
            <Button variant="secondary" className="h-20 flex-col">
              <ApperIcon name="Calendar" className="h-6 w-6 mb-2" />
              Take Attendance
            </Button>
            <Button variant="accent" className="h-20 flex-col">
              <ApperIcon name="BookOpen" className="h-6 w-6 mb-2" />
              New Assignment
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ApperIcon name="BarChart3" className="h-6 w-6 mb-2" />
              View Reports
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg">
            <div className="flex items-center">
              <ApperIcon name="Clock" className="h-5 w-5 text-accent-600 mr-2" />
              <div>
                <p className="font-medium text-accent-800">Upcoming Deadlines</p>
                <p className="text-sm text-accent-600">3 assignments due this week</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Attendance</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{presentToday}</div>
            <div className="text-sm text-green-600">Present</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
<div className="text-2xl font-bold text-red-700">
            {todayAttendance.filter(a => a.Status_c === "absent").length}
          </div>
          <div className="text-sm text-red-600">Absent</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">
            {todayAttendance.filter(a => a.Status_c === "late").length}
          </div>
          <div className="text-sm text-yellow-600">Late</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">
            {todayAttendance.filter(a => a.Status_c === "excused").length}
            </div>
            <div className="text-sm text-blue-600">Excused</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Attendance rate: <span className="font-semibold text-gray-900">{attendanceRate}%</span>
          </p>
          <Button variant="primary" size="sm">
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            Take Attendance
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;