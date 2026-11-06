"use client"
import React from 'react';
import { MdSearch } from 'react-icons/md';

/**
 * Reusable search bar for filtering projects.
 * @param {string}   value      — controlled input value
 * @param {Function} onChange   — called with new string value
 * @param {string}   placeholder
 */
const ProjectSearchBar = ({ value, onChange, placeholder = 'Search projects...' }) => (
  <div className="relative w-full">
    <MdSearch
      size={20}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none
        focus:border-primary transition-colors shadow-sm placeholder:text-gray-400"
    />
  </div>
);

export default ProjectSearchBar;
