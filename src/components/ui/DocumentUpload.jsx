"use client"
import React, { useRef } from 'react';
import { MdOutlineUpload } from 'react-icons/md';

const DocumentUpload = ({ label, value, onChange, error, accept = '.pdf,.doc,.docx,image/*' }) => {
  const inputRef = useRef(null);

  // derive filename from value prop (File object) or local state
  const fileName = value?.name ?? null;

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange?.(file);
  };

  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label className='text-sm font-medium text-gray-700'>{label}</label>
      )}
      <button
        type='button'
        onClick={() => inputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-2 transition-colors
          ${error ? 'border-red-400 bg-red-50' : 'border-primary/40 bg-blue-50 hover:bg-blue-100'}
        `}
      >
        <MdOutlineUpload size={28} className='text-primary' />
        {fileName ? (
          <span className='text-sm text-primary font-medium text-center break-all'>{fileName}</span>
        ) : (
          <span className='text-sm text-gray-500'>Upload PDF</span>
        )}
      </button>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        className='hidden'
        onChange={handleChange}
      />
    </div>
  );
};

export default DocumentUpload;
