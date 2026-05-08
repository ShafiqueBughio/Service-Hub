"use client"
import React, { useState } from 'react';

const ServicesTagInput = ({ value = [], onChange, error }) => {
  const [input, setInput] = useState('');

  const addService = () => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange?.([...value, trimmed]);
    setInput('');
  };

  const removeService = (tag) => {
    onChange?.(value.filter((s) => s !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addService();
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium text-gray-700'>Services</label>
      <input
        type='text'
        placeholder='Enter Services'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addService}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors
          ${error ? 'border-red-400' : 'border-gray-300 focus:border-primary'}
        `}
      />
      {/* tags */}
      {value.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {value.map((tag) => (
            <span
              key={tag}
              className='flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full'
            >
              {tag}
              <button
                type='button'
                onClick={() => removeService(tag)}
                className='text-red-400 hover:text-red-600 font-bold leading-none'
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
};

export default ServicesTagInput;
