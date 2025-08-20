import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import GradeBook from "@/components/organisms/GradeBook";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";
import { toast } from "react-toastify";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadGradesData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, assignmentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      setError("Failed to load grades data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  const filteredAssignments = selectedCategory === "all" 
    ? assignments 
    : assignments.filter(a => a.category === selectedCategory);

  const categories = [...new Set(assignments.map(a => a.category))];

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setShowModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowModal(true);
  };

  const handleSaveAssignment = async (assignmentData) => {
    try {
      if (editingAssignment) {
        const updated = await assignmentService.update(editingAssignment.Id, assignmentData);
        setAssignments(assignments.map(a => a.Id === editingAssignment.Id ? updated : a));
        toast.success("Assignment updated successfully!");
      } else {
        const newAssignment = await assignmentService.create(assignmentData);
        setAssignments([...assignments, newAssignment]);
        toast.success("Assignment added successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save assignment");
      console.error(err);
    }
  };

  const handleGradeUpdate = async (studentId, assignmentId, score) => {
    try {
      const existingGrade = grades.find(g => 
        g.studentId === studentId && g.assignmentId === assignmentId
      );

      if (existingGrade) {
        const updated = await gradeService.update(existingGrade.Id, {
          ...existingGrade,
          score,
          submittedDate: new Date().toISOString()
        });
        setGrades(grades.map(g => g.Id === existingGrade.Id ? updated : g));
      } else {
        const newGrade = await gradeService.create({
          studentId,
          assignmentId,
          score,
          submittedDate: new Date().toISOString()
        });
        setGrades([...grades, newGrade]);
      }
      
      toast.success("Grade updated successfully!");
    } catch (err) {
      toast.error("Failed to update grade");
      console.error(err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadGradesData} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Grades
          </h1>
          <p className="text-gray-600 mt-2">Manage assignments and track student performance</p>
        </div>
        <Button variant="primary" onClick={handleAddAssignment}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Calculator" className="h-4 w-4 mr-2" />
            Calculate Final Grades
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export Gradebook
          </Button>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <Empty
          title="No assignments found"
          description={selectedCategory === "all" ? 
            "Get started by creating your first assignment." :
            "No assignments found for this category. Try selecting a different category or add a new assignment."
          }
          icon="BookOpen"
          actionLabel="Add Assignment"
          onAction={handleAddAssignment}
        />
      ) : (
        <GradeBook
          students={students}
          assignments={filteredAssignments}
          grades={grades}
          onGradeUpdate={handleGradeUpdate}
        />
      )}

      <AssignmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAssignment}
        assignment={editingAssignment}
      />
    </div>
  );
};

export default Grades;