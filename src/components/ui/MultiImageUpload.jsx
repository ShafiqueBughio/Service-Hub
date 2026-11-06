"use client"
import React, { useRef } from 'react';
import { MdOutlineUpload, MdDelete } from 'react-icons/md';
import { FaFilePdf, FaFileAlt } from 'react-icons/fa';

/**
 * @param {string} accept — file types to allow (default: "image/*")
 *                          Pass "image/*,.pdf,.doc,.docx" for job attachments.
 *                          All existing usages without this prop keep image-only behaviour.
 */
const MultiImageUpload = ({ value = [], onChange, error, label, accept = 'image/*' }) => {
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    onChange?.([...value, ...newPreviews]);
    e.target.value = '';
  };

  const handleRemove = (idx) => {
    onChange?.(value.filter((_, i) => i !== idx));
  };

  // Determine if an item is an image for preview purposes
  const isImage = (item) => {
    if (item.file) {
      return item.file.type?.startsWith('image/');
    }
    // Existing URL — guess by extension
    const url = item.url || '';
    return /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url);
  };

  const isPdf = (item) => {
    if (item.file) return item.file.type === 'application/pdf';
    return /\.pdf(\?|$)/i.test(item.url || '');
  };

  return (
    <div className='flex flex-col gap-3'>
      {label && (
        <label className='text-sm font-medium text-gray-700'>{label}</label>
      )}

      {/* Previews */}
      {value.length > 0 && (
        <div className='grid grid-cols-3 gap-2'>
          {value.map((item, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl overflow-hidden bg-gray-100
                ${idx === 0 && accept === 'image/*' ? 'row-span-2 col-span-1' : ''}
              `}
              style={{ aspectRatio: idx === 0 && accept === 'image/*' ? '1 / 2' : '1 / 1' }}
            >
              {isImage(item) ? (
                <img
                  src={item.url}
                  alt={`file-${idx}`}
                  className='w-full h-full object-cover'
                />
              ) : isPdf(item) ? (
                <div className='w-full h-full flex flex-col items-center justify-center gap-1 bg-red-50'>
                  <FaFilePdf size={28} className='text-red-500' />
                  <span className='text-[10px] text-gray-500 truncate px-1 max-w-full'>
                    {item.file?.name || 'PDF'}
                  </span>
                </div>
              ) : (
                <div className='w-full h-full flex flex-col items-center justify-center gap-1 bg-gray-50'>
                  <FaFileAlt size={28} className='text-gray-400' />
                  <span className='text-[10px] text-gray-500 truncate px-1 max-w-full'>
                    {item.file?.name || 'File'}
                  </span>
                </div>
              )}

              <button
                type='button'
                onClick={() => handleRemove(idx)}
                className='absolute top-1.5 right-1.5 w-7 h-7 bg-gray-800/70 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer'
              >
                <MdDelete size={14} className='text-white' />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload box */}
      <button
        type='button'
        onClick={() => inputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-2 transition-colors
          ${error ? 'border-red-400 bg-red-50' : 'border-primary/40 bg-blue-50 hover:bg-blue-100'}
        `}
      >
        <MdOutlineUpload size={28} className='text-primary' />
        <span className='text-sm text-gray-500'>
          {accept === 'image/*' ? 'Upload Images' : 'Upload Documents or Photos'}
        </span>
      </button>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <input
        ref={inputRef}
        type='file'
        accept={accept}
        multiple
        className='hidden'
        onChange={handleFiles}
      />
    </div>
  );
};

export default MultiImageUpload;
