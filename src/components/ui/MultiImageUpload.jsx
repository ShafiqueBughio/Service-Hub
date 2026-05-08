"use client"
import React, { useRef } from 'react';
import { MdOutlineUpload, MdDelete } from 'react-icons/md';

const MultiImageUpload = ({ value = [], onChange, error, label }) => {
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    onChange?.([...value, ...newPreviews]);
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleRemove = (idx) => {
    const updated = value.filter((_, i) => i !== idx);
    onChange?.(updated);
  };

  return (
    <div className='flex flex-col gap-3'>
      {label && (
        <label className='text-sm font-medium text-gray-700'>{label}</label>
      )}

      {/* image grid — only shown when images exist */}
      {value.length > 0 && (
        <div className='grid grid-cols-3 gap-2'>
          {/* first image — spans 2 rows on mobile to look like the design */}
          {value.map((item, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl overflow-hidden bg-gray-100
                ${idx === 0 ? 'row-span-2 col-span-1' : ''}
              `}
              style={{ aspectRatio: idx === 0 ? '1 / 2' : '1 / 1' }}
            >
              <img
                src={item.url}
                alt={`portfolio-${idx}`}
                className='w-full h-full object-cover'
              />
              {/* delete button */}
              <button
                type='button'
                onClick={() => handleRemove(idx)}
                className='absolute top-1.5 right-1.5 w-7 h-7 bg-gray-800/70 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors'
              >
                <MdDelete size={14} className='text-white' />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* upload box */}
      <button
        type='button'
        onClick={() => inputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-2 transition-colors
          ${error ? 'border-red-400 bg-red-50' : 'border-primary/40 bg-blue-50 hover:bg-blue-100'}
        `}
      >
        <MdOutlineUpload size={28} className='text-primary' />
        <span className='text-sm text-gray-500'>Upload Images</span>
      </button>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        multiple
        className='hidden'
        onChange={handleFiles}
      />
    </div>
  );
};

export default MultiImageUpload;
