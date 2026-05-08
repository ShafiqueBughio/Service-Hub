"use client"
import React from 'react';
import PhoneInputWithCountry from 'react-phone-number-input/min';
import 'react-phone-number-input/style.css';

const PhoneInput = ({
  name,
  label,
  value,
  onChange,
  errors,
  verified = false,
  className = '',
}) => {
  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label className='text-sm font-medium text-gray-700'>{label}</label>
      )}
      <div className='relative'>
        <PhoneInputWithCountry
          international
          defaultCountry='US'
          value={value}
          onChange={onChange}
          className={`
            phone-input-custom
            ${verified ? 'pr-24' : ''}
            ${className}
          `}
        />
        {verified && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600 pointer-events-none'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
              <circle cx='12' cy='12' r='10' />
              <path d='M9 12l2 2 4-4' stroke='white' strokeWidth='2' fill='none' />
            </svg>
            <span className='text-xs font-medium'>Verified</span>
          </div>
        )}
      </div>
      {errors?.[name] && (
        <p className='text-red-500 text-sm mt-1'>{errors[name].message}</p>
      )}
    </div>
  );
};

export default PhoneInput;
