import React from "react";

const Checkbox = ({
  name,
  register,
  label,
  className = "",
  errors,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...register(name)}
          className={`
            w-4 h-4 rounded border-gray-300
            text-primary focus:ring-primary
            cursor-pointer
            ${className}
          `}
        />

        <span className="text-sm text-gray-700">
          {label}
        </span>
      </label>

      {errors?.[name] && (
        <p className="text-red-500 text-sm">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default Checkbox;