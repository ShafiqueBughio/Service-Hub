import React from "react";
import { MdCheckCircle } from 'react-icons/md';

const isValidEmail = (val) =>
  typeof val === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

const Input = ({
  type,
  name,
  register,
  placeholder,
  className,
  errors,
  icon,
  label,
  verified,  // pass true to always show verified badge
  watch,     // pass RHF watch to auto-show verified on valid email
}) => {
  const watchedValue = watch ? watch(name) : undefined;
  const showVerified =
    verified ||
    (type === 'email' && watchedValue && isValidEmail(watchedValue));

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          placeholder={placeholder}
          {...(register ? register(name) : {})}
          className={`
            border border-gray-300 rounded-lg
            py-2.5 text-sm outline-none
            focus:border-primary transition-colors
            w-full
            ${icon ? "pl-10" : "px-4"}
            ${showVerified ? "pr-24" : ""}
            ${className ?? ""}
          `}
        />

        {/* Verified badge */}
        {showVerified && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600 pointer-events-none'>
            <MdCheckCircle size={16} />
            <span className='text-xs font-medium'>Verified</span>
          </div>
        )}
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
