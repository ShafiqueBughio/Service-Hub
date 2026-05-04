import React from "react";

const Input = ({
  type,
  name,
  register,
  placeholder,
  className,
  errors,
  icon,
  label,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`
            border border-gray-300 rounded-lg 
            py-2.5 text-sm outline-none 
            focus:border-primary transition-colors
            w-full
            ${icon ? "pl-10" : "px-4"}
            ${className}
          `}
        />
      </div>

      {/* Error */}
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default Input;