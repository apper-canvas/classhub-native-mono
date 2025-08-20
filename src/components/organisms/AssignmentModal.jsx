import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const AssignmentModal = ({ isOpen, onClose, onSave, assignment }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    points: "",
    dueDate: "",
    weight: ""
  });

useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.Title_c || "",
        category: assignment.Category_c || "",
        points: assignment.Points_c || "",
        weight: assignment.Weight_c || "",
        dueDate: assignment.DueDate_c ? assignment.DueDate_c.split('T')[0] : ""
      });
    } else {
      setFormData({
        title: "",
        category: "",
        points: "",
        dueDate: "",
        weight: ""
      });
    }
  }, [assignment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      points: parseFloat(formData.points) || 0,
      weight: parseFloat(formData.weight) || 1,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date().toISOString()
    };
    onSave(data);
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
            {assignment ? "Edit Assignment" : "Add Assignment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Assignment Title"
            value={formData.title}
            onChange={handleChange("title")}
            placeholder="e.g., Math Quiz 1"
            required
          />

          <FormField
            label="Category"
            type="select"
            value={formData.category}
            onChange={handleChange("category")}
            options={[
              { value: "Quiz", label: "Quiz" },
              { value: "Test", label: "Test" },
              { value: "Homework", label: "Homework" },
              { value: "Project", label: "Project" },
              { value: "Participation", label: "Participation" }
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Points"
              type="number"
              value={formData.points}
              onChange={handleChange("points")}
              placeholder="100"
              required
            />
            <FormField
              label="Weight"
              type="number"
              value={formData.weight}
              onChange={handleChange("weight")}
              placeholder="1.0"
              required
            />
          </div>

          <FormField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={handleChange("dueDate")}
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              {assignment ? "Update" : "Add"} Assignment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal;