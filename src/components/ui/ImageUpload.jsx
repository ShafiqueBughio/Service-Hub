"use client"
import React, { useRef } from 'react';
import { MdOutlineCameraAlt } from 'react-icons/md';

const ImageUpload = ({ value, onChange, className = '', error, previewUrl }) => {
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange?.(file, url); // pass both file and preview url
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <button
        type='button'
        onClick={handleClick}
        className={`relative w-24 h-24 rounded-full overflow-hidden cursor-pointer focus:outline-none ring-2 transition-all ${
          error ? 'ring-red-400' : 'ring-3 ring-primary'
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt='profile'
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-primary-gradient'>
            <MdOutlineCameraAlt size={32} className='text-white' />
          </div>
        )}
        <div className='absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
          <MdOutlineCameraAlt size={24} className='text-white' />
        </div>
      </button>

      {error && (
        <p className='text-red-500 text-sm'>{error}</p>
      )}

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleChange}
      />
    </div>
  );
};

export default ImageUpload;
