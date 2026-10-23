"use client";

import React, { useState, lazy, Suspense } from "react";
import { MdOutlineMyLocation, MdAdd, MdClose, MdLocationOn } from "react-icons/md";

// lazy load map to avoid SSR issues with Leaflet
const MapPicker = lazy(() => import("./MapPicker"));

/**
 * Multi service-area picker.
 * value: Array<{ address: string, lat: number|null, lng: number|null }>
 */
const ServiceAreaInput = ({ value = [], onChange, error }) => {
  const [mapOpen, setMapOpen] = useState(false);
  const areas = Array.isArray(value) ? value : [];

  const handleConfirm = (location) => {
    if (!location?.address) {
      setMapOpen(false);
      return;
    }

    const isDuplicate = areas.some(
      (a) =>
        a.lat != null &&
        location.lat != null &&
        Math.abs(Number(a.lat) - Number(location.lat)) < 0.0001 &&
        Math.abs(Number(a.lng) - Number(location.lng)) < 0.0001
    );

    if (!isDuplicate) {
      onChange?.([...areas, location]);
    }
    setMapOpen(false);
  };

  const removeArea = (index) => {
    onChange?.(areas.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-gray-700">
          Service Areas
        </label>
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="flex items-center gap-1 text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors cursor-pointer"
        >
          <MdAdd size={14} />
          Add area
        </button>
      </div>

      {areas.length === 0 ? (
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className={`w-full flex items-center justify-center gap-2 border border-dashed rounded-xl px-4 py-6 text-sm transition-colors cursor-pointer
            ${error ? "border-red-400 text-red-500 bg-red-50/40" : "border-gray-300 text-gray-500 hover:border-primary/40 hover:text-primary bg-gray-50"}
          `}
        >
          <MdOutlineMyLocation size={18} />
          Select service area on map
        </button>
      ) : (
        <ul className="flex flex-col gap-2">
          {areas.map((area, index) => (
            <li
              key={`${area.lat}-${area.lng}-${index}`}
              className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5"
            >
              <MdLocationOn
                size={18}
                className="text-primary shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 leading-snug break-words">
                  {area.address || "—"}
                </p>
                {area.lat != null && area.lng != null && (
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                    {Number(area.lat).toFixed(5)}, {Number(area.lng).toFixed(5)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeArea(index)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                aria-label="Remove service area"
              >
                <MdClose size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {mapOpen && (
        <Suspense fallback={null}>
          <MapPicker
            isOpen={mapOpen}
            onClose={() => setMapOpen(false)}
            onConfirm={handleConfirm}
            initialPosition={null}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ServiceAreaInput;
