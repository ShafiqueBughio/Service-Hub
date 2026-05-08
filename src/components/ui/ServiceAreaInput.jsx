"use client"
import React, { useState, lazy, Suspense } from 'react';
import { MdOutlineMyLocation } from 'react-icons/md';

// lazy load map to avoid SSR issues with Leaflet
const MapPicker = lazy(() => import('./MapPicker'));

const ServiceAreaInput = ({ value, onChange, error }) => {
  const [mapOpen, setMapOpen] = useState(false);

  const handleConfirm = (location) => {
    onChange?.(location);
    setMapOpen(false);
  };

  return (
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-700'>Service Areas</label>
      <div className='relative'>
        <input
          type='text'
          placeholder='Click the map icon to select location'
          value={value?.address || ''}
          onChange={(e) => onChange?.({ ...value, address: e.target.value })}
          className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none pr-10 transition-colors
            ${error ? 'border-red-400' : 'border-gray-300 focus:border-primary'}
          `}
        />
        <button
          type='button'
          onClick={() => setMapOpen(true)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/70 transition-colors'
          title='Open map to select location'
        >
          <MdOutlineMyLocation size={20} />
        </button>
      </div>
      {error && <p className='text-red-500 text-sm'>{error}</p>}

      {/* map modal — lazy loaded */}
      {mapOpen && (
        <Suspense fallback={null}>
          <MapPicker
            isOpen={mapOpen}
            onClose={() => setMapOpen(false)}
            onConfirm={handleConfirm}
            initialPosition={value?.lat ? { lat: value.lat, lng: value.lng } : null}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ServiceAreaInput;
