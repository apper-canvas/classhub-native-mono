import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  options, 
  placeholder, 
  required, 
  error, 
  className 
}) => {
  const fieldId = `field-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {type === "select" ? (
        <Select id={fieldId} value={value} onChange={onChange}>
          <option value="">{placeholder || "Select..."}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;