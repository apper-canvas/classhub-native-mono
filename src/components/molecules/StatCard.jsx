import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, change, changeType, icon, gradient, className }) => {
  const gradients = {
    blue: "from-blue-500 to-purple-600",
    green: "from-green-500 to-teal-600",
    orange: "from-orange-500 to-red-600",
    purple: "from-purple-500 to-indigo-600"
  };

  return (
    <Card className={cn("p-6 transition-all duration-300 hover:scale-105", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {value}
          </p>
          {change && (
            <div className={cn(
              "flex items-center mt-2 text-sm",
              changeType === "positive" ? "text-green-600" : 
              changeType === "negative" ? "text-red-600" : "text-gray-500"
            )}>
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : 
                      changeType === "negative" ? "TrendingDown" : "Minus"} 
                className="h-4 w-4 mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-gradient-to-r shadow-lg",
          gradients[gradient] || gradients.blue
        )}>
          <ApperIcon name={icon} className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;