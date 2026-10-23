"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdOutlineUpload, MdClose } from "react-icons/md";

const toPreviewUrl = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof File) return URL.createObjectURL(value);
  return value.preview || value.url || null;
};

/**
 * Single identity document uploader (CNIC front / back).
 * value: File | { file, preview } | string URL | null
 */
const IdentityDocUpload = ({
  label,
  value,
  onChange,
  error,
  accept = "image/*",
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(() => toPreviewUrl(value));

  useEffect(() => {
    const next = toPreviewUrl(value);
    setPreview(next);

    if (value instanceof File) {
      return () => URL.revokeObjectURL(next);
    }
  }, [value]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    onChange?.(file);
  };

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div
        className={`relative w-full aspect-[3/2] border-2 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-2 transition-colors
          ${error ? "border-red-400 bg-red-50" : "border-primary/40 bg-blue-50"}
        `}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={label || "document"}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange?.(null)}
              className="absolute top-1.5 right-1.5 w-7 h-7 bg-gray-800/70 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors z-10"
              aria-label={`Remove ${label || "document"}`}
            >
              <MdClose size={14} className="text-white cursor-pointer" />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-medium text-white bg-black/60 px-3 py-1 rounded-full z-10 cursor-pointer"
            >
              Replace
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 hover:bg-blue-100/60 transition-colors cursor-pointer"
          >
            <MdOutlineUpload size={28} className="text-primary" />
            <span className="text-sm text-gray-500 px-2 text-center">
              Upload {label}
            </span>
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default IdentityDocUpload;
