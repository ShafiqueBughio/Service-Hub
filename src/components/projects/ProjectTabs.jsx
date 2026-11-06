"use client"
import React from 'react';

/**
 * Horizontal tab bar for project status filters.
 * @param {string}   active    — currently active tab key
 * @param {Function} onChange  — called with the new tab key
 * @param {object}   counts    — optional { pending: n, active: n, ... }
 */
const ProjectTabs = ({ active, onChange, counts = {},TABS }) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
    {TABS.map(({ key, label }) => {
      const isActive = active === key;
      const count    = counts[key];
      return (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer
            ${isActive
              ? 'bg-primary-gradient text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary'
            }`}
        >
          {label}
          {count != null && (
            <span className={`ml-1.5 text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
              ({count})
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default ProjectTabs;
