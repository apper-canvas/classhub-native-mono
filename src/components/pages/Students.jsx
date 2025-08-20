import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError("Failed to load students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

useEffect(() => {
const filtered = students.filter(student => 
      `${student.first_name_c} ${student.last_name_c}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email_c?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        const updated = await studentService.update(editingStudent.Id, studentData);
        if (updated) {
          setStudents(students.map(s => s.Id === editingStudent.Id ? updated : s));
          toast.success("Student updated successfully!");
        }
      } else {
        const newStudent = await studentService.create(studentData);
        if (newStudent) {
          setStudents([...students, newStudent]);
          toast.success("Student added successfully!");
        }
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save student");
      console.error(err);
    }
  };

const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const success = await studentService.delete(studentId);
        if (success) {
          setStudents(students.filter(s => s.Id !== studentId));
          toast.success("Student deleted successfully!");
        }
      } catch (err) {
        toast.error("Failed to delete student");
        console.error(err);
      }
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-gray-600 mt-2">Manage your student roster and information</p>
        </div>
        <Button variant="primary" onClick={handleAddStudent}>
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search students by name, ID, or email..."
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          description={searchTerm ? 
            "Try adjusting your search terms to find students." : 
            "Get started by adding your first student to the roster."
          }
          icon="Users"
          actionLabel={!searchTerm ? "Add Student" : undefined}
          onAction={!searchTerm ? handleAddStudent : undefined}
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      )}

      <StudentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
    </div>
  );
};

export default Students;