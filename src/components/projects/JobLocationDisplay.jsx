import React from 'react';
import { MdLocationOn } from 'react-icons/md';

/**
 * Read-only location display with OSM map.
 * Reusable anywhere a job/contractor location needs to be shown.
 * @param {string} address
 * @param {string|number} lat
 * @param {string|number} lng
 */
const JobLocationDisplay = ({ address, lat, lng }) => {
  const hasCoords = lat != null && lng != null && lat !== '' && lng !== '';

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-bold text-gray-900">Location</h3>
      {address && (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MdLocationOn size={16} className="text-primary shrink-0" />
          <span>{address}</span>
        </div>
      )}
      {hasCoords ? (
        <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200">
          <iframe
            title="job-location"
            width="100%"
            height="100%"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(lng) - 0.05},${Number(lat) - 0.05},${Number(lng) + 0.05},${Number(lat) + 0.05}&layer=mapnik&marker=${lat},${lng}`}
            className="w-full h-full"
          />
        </div>
      ) : address ? (
        <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center">
          <MdLocationOn size={32} className="text-gray-300" />
        </div>
      ) : null}
    </div>
  );
};

export default JobLocationDisplay;
