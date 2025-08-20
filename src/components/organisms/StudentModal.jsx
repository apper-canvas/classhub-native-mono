import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const StudentModal = ({ isOpen, onClose, onSave, student }) => {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    grade: "",
    marks: ""
  });

useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.first_name_c || "",
        lastName: student.last_name_c || "",
        email: student.email_c || "",
        studentId: student.student_id_c || "",
        grade: student.grade_c || "",
        marks: student.marks_c || ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        studentId: "",
        grade: "",
        marks: ""
      });
    }
  }, [student, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? "Edit Student" : "Add Student"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="First Name"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              required
            />
            <FormField
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              required
            />
          </div>

          <FormField
            label="Student ID"
            value={formData.studentId}
            onChange={handleChange("studentId")}
            required
          />

          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            required
          />

<FormField
            label="Grade Level"
            type="select"
            value={formData.grade}
            onChange={handleChange("grade")}
            options={[
              { value: "9", label: "9th Grade" },
              { value: "10", label: "10th Grade" },
              { value: "11", label: "11th Grade" },
              { value: "12", label: "12th Grade" }
            ]}
            required
          />

          <FormField
            label="Marks"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.marks}
            onChange={handleChange("marks")}
            placeholder="Enter marks (0-100)"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              {student ? "Update" : "Add"} Student
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;