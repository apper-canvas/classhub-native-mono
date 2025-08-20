import React from "react";
import Card from "@/components/atoms/Card";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 animate-pulse"></div>
              </div>
              <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse ml-4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
    </div>
  );
};

export default Loading;