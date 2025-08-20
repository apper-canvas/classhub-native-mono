import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick, currentPath }) => {
  const getPageTitle = (path) => {
    switch (path) {
      case "/": return "Dashboard";
      case "/students": return "Students";
      case "/grades": return "Grades";
      case "/attendance": return "Attendance";
      default: return "ClassHub";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-3"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {getPageTitle(currentPath)}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar 
            placeholder="Search students, assignments..."
            className="hidden sm:block w-80"
          />
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <ApperIcon name="Bell" className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;