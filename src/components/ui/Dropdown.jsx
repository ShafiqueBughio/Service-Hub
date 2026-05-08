import React from 'react';

const Dropdown = ({
  name,
  label,
  register,
  errors,
  options = [],
  placeholder = 'Select an option',
  className = '',
}) => {
  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label className='text-sm font-medium text-gray-700'>{label}</label>
      )}
      <div className='relative'>
        <select
          {...register(name)}
          defaultValue=''
          className={`
            w-full border border-gray-300 rounded-lg
            px-4 py-2.5 text-sm outline-none
            focus:border-primary transition-colors
            appearance-none bg-white text-gray-700
            ${className}
          `}
        >
          <option value='' disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* chevron icon */}
        <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <polyline points='6 9 12 15 18 9' />
          </svg>
        </div>
      </div>
      {errors?.[name] && (
        <p className='text-red-500 text-sm mt-1'>{errors[name].message}</p>
      )}
    </div>
  );
};

export default Dropdown;
