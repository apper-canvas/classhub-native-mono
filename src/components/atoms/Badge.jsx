import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-700",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-700",
    A: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    B: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    C: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    D: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800",
    F: "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
export default Badge;