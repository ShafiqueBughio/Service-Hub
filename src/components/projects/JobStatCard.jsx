import React from 'react';

/**
 * Single stat tile used in the job detail page.
 * @param {string} value  — bold top text
 * @param {string} label  — small label below
 */
const JobStatCard = ({ value, label }) => (
  <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col items-center justify-center gap-0.5 text-center">
    <p className="text-base font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

export default JobStatCard;
