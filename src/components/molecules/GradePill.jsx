import React from "react";
import Badge from "@/components/atoms/Badge";

const GradePill = ({ score, maxPoints }) => {
  const percentage = maxPoints > 0 ? (score / maxPoints) * 100 : 0;
  let grade = "F";
  
  if (percentage >= 90) grade = "A";
  else if (percentage >= 80) grade = "B";
  else if (percentage >= 70) grade = "C";
  else if (percentage >= 60) grade = "D";

  return (
    <div className="flex items-center gap-2">
      <Badge variant={grade}>
        {grade}
      </Badge>
      <span className="text-sm text-gray-600">
        {score}/{maxPoints} ({Math.round(percentage)}%)
      </span>
    </div>
  );
};

export default GradePill;