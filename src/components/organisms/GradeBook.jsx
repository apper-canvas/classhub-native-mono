import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import GradePill from "@/components/molecules/GradePill";
import ApperIcon from "@/components/ApperIcon";

const GradeBook = ({ students, assignments, grades, onGradeUpdate }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

const getGrade = (studentId, assignmentId) => {
    return grades.find(g => g.Student_c?.Id === studentId && g.Assignment_c?.Id === assignmentId);
  };

  const handleCellClick = (studentId, assignmentId, currentScore) => {
    setEditingCell(`${studentId}-${assignmentId}`);
    setEditValue(currentScore || "");
  };

  const handleSaveGrade = (studentId, assignmentId) => {
    const score = parseFloat(editValue) || 0;
    onGradeUpdate(studentId, assignmentId, score);
    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyPress = (e, studentId, assignmentId) => {
    if (e.key === "Enter") {
      handleSaveGrade(studentId, assignmentId);
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setEditValue("");
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50">
                Student
              </th>
              {assignments.map((assignment) => (
<th key={assignment.Id} className="px-3 py-3 text-center min-w-[120px]">
                <div className="space-y-1">
                  <div className="font-semibold text-gray-700 text-sm">{assignment.Title_c}</div>
                  <div className="text-xs text-gray-500">{assignment.Points_c} pts</div>
                  <div className="text-xs text-gray-500">{assignment.Category_c}</div>
                </div>
              </th>
              ))}
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Average
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => {
const studentGrades = assignments.map(assignment => {
              const grade = getGrade(student.Id, assignment.Id);
              return grade ? grade.Score_c : 0;
            });
            
            const totalPoints = assignments.reduce((sum, assignment) => sum + assignment.Points_c, 0);
            const earnedPoints = assignments.reduce((sum, assignment) => {
              const grade = getGrade(student.Id, assignment.Id);
              return sum + (grade ? grade.Score_c : 0);
            }, 0);
            
            const average = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

              return (
                <tr key={student.Id} className="hover:bg-gray-50 transition-colors duration-150">
<td className="px-4 py-3 sticky left-0 bg-white border-r">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {student.FirstName_c?.[0]}{student.LastName_c?.[0]}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900 text-sm">
                        {student.FirstName_c} {student.LastName_c}
                      </div>
                      </div>
                    </div>
                  </td>
                  
                  {assignments.map((assignment) => {
                    const grade = getGrade(student.Id, assignment.Id);
                    const cellKey = `${student.Id}-${assignment.Id}`;
                    const isEditing = editingCell === cellKey;
                    
                    return (
                      <td key={assignment.Id} className="px-3 py-3 text-center">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyPress(e, student.Id, assignment.Id)}
                            onBlur={() => handleSaveGrade(student.Id, assignment.Id)}
                            className="w-16 text-center text-sm"
                            autoFocus
                            max={assignment.points}
                            min={0}
                          />
                        ) : (
<button
                          onClick={() => handleCellClick(student.Id, assignment.Id, grade?.Score_c)}
                          className="w-full p-2 rounded hover:bg-gray-100 transition-colors"
                        >
                          {grade ? (
                            <GradePill score={grade.Score_c} maxPoints={assignment.Points_c} />
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                            )}
                          </button>
                        )}
                      </td>
                    );
                  })}
                  
                  <td className="px-4 py-3 text-center">
                    <div className="font-bold text-lg">
                      {Math.round(average)}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default GradeBook;