"use client";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CiLock } from "react-icons/ci";

const InputPassword = ({
  name,
  register,
  placeholder,
  className,
  errors,
  label,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        {/* Lock Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2  text-lg">
          <CiLock size={20}/>
        </div>

        {/* Input */}
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register(name)}
          className={`
            border border-gray-300 rounded-lg
            py-2.5 text-sm outline-none
            focus:border-primary transition-colors
            w-full pl-10 pr-10
            ${className}
          `}
        />

        {/* Eye Icon */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FiEye /> : <FiEyeOff />}
        </button>
      </div>

      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default InputPassword;