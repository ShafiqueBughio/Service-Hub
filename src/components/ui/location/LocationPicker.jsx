
"use client";

import { useState } from "react";
import {
  MdOutlineMyLocation,
  MdAdd,
  MdClose,
  MdLocationOn,
} from "react-icons/md";

import LocationMapModal from "./LocationMapModal";

const LocationPicker = ({
  value,
  onChange,
  multiple = false,
  label,
  placeholder,
  error,
  disabled = false,
}) => {
  const [mapOpen, setMapOpen] = useState(false);

  // Single mode: one location object or null.
  // Multiple mode: array of location objects.
  const locations = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value
      ? [value]
      : [];

  const handleConfirm = (location) => {
    if (!location?.address) return;

    if (!multiple) {
      onChange?.(location);
      setMapOpen(false);
      return;
    }

    const isDuplicate = locations.some((area) => {
      if (
        area.lat == null ||
        area.lng == null ||
        location.lat == null ||
        location.lng == null
      ) {
        return (
          area.address?.trim().toLowerCase() ===
          location.address.trim().toLowerCase()
        );
      }

      return (
        Math.abs(Number(area.lat) - Number(location.lat)) < 0.0001 &&
        Math.abs(Number(area.lng) - Number(location.lng)) < 0.0001
      );
    });

    if (!isDuplicate) {
      onChange?.([...locations, location]);
    }

    setMapOpen(false);
  };

  const handleRemove = (index) => {
    if (multiple) {
      onChange?.(locations.filter((_, i) => i !== index));
    } else {
      onChange?.(null);
    }
  };

  const initialPosition =
    !multiple && value?.lat != null && value?.lng != null
      ? { lat: value.lat, lng: value.lng }
      : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-gray-700">
          {label || (multiple ? "Service Areas" : "Location")}
        </label>

        {(multiple) && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setMapOpen(true)}
            className="flex items-center gap-1 rounded-full border
              border-primary/30 px-3 py-1.5 text-xs text-primary
              transition-colors hover:bg-primary/5
              disabled:cursor-not-allowed disabled:opacity-50"
          >
            {multiple && <MdAdd size={14} />}
            {multiple && "Add area"}
          </button>
        )}
      </div>

      {locations.length === 0 ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setMapOpen(true)}
          className={`flex w-full items-center justify-center gap-2
            rounded-xl border border-dashed px-4 py-6 text-sm
            transition-colors disabled:opacity-50 cursor-pointer ${
              error
                ? "border-red-400 bg-red-50/40 text-red-500"
                : "border-gray-300 bg-gray-50 text-gray-500 hover:border-primary/40 hover:text-primary"
            }`}
        >
          <MdOutlineMyLocation size={18} />
          {placeholder ||
            (multiple
              ? "Select service areas on map"
              : "Select location on map")}
        </button>
      ) : (
        <ul className="flex flex-col gap-2">
          {locations.map((location, index) => (
            <li
              key={`${location.lat}-${location.lng}-${index}`}
              className="flex items-start gap-2 rounded-xl border
                border-gray-200 bg-white px-3 py-3"
            >
              <MdLocationOn
                size={20}
                className="mt-0.5 shrink-0 text-primary"
              />

              <div className="min-w-0 flex-1">
                <p className="break-words text-sm text-gray-800">
                  {location.address || "—"}
                </p>

                {location.lat != null && location.lng != null && (
                  <p className="mt-1 font-mono text-xs text-gray-400">
                    {Number(location.lat).toFixed(5)},{" "}
                    {Number(location.lng).toFixed(5)}
                  </p>
                )}

                {!multiple && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setMapOpen(true)}
                    className="mt-2 text-xs font-medium text-primary hover:underline cursor-pointer"
                  >
                    Change location
                  </button>
                )}
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={() => handleRemove(index)}
                aria-label="Remove location"
                className="flex h-7 w-7 shrink-0 items-center
                  justify-center rounded-full text-gray-400
                  transition-colors hover:bg-red-50 hover:text-red-500
                  disabled:opacity-50"
              >
                <MdClose size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <LocationMapModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        onConfirm={handleConfirm}
        initialPosition={initialPosition}
      />
    </div>
  );
};

export default LocationPicker;
