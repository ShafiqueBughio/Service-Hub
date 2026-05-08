import React from 'react';

const TextArea = ({
  name,
  label,
  register,
  errors,
  placeholder = '',
  rows = 5,
  className = '',
}) => {
  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label className='text-sm font-medium text-gray-700'>{label}</label>
      )}
      <textarea
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full border border-gray-300 rounded-lg
          px-4 py-3 text-sm outline-none resize-none
          focus:border-primary transition-colors
          ${errors?.[name] ? 'border-red-400' : ''}
          ${className}
        `}
      />
      {errors?.[name] && (
        <p className='text-red-500 text-sm'>{errors[name].message}</p>
      )}
    </div>
  );
};

export default TextArea;
