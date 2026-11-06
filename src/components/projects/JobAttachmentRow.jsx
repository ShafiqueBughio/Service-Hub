import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { MdDownload, MdImage } from 'react-icons/md';

/**
 * Single attachment row with icon + name + download button.
 * @param {{ url: string, type?: string }} attachment
 * @param {number} index
 */
const JobAttachmentRow = ({ attachment, index }) => {
  const isPdf  = attachment?.type === 'pdf' || attachment?.url?.toLowerCase().includes('.pdf');
  const name   = attachment?.url?.split('/').pop()?.split('?')[0] || `File ${index + 1}`;

  return (
    <a
      href={attachment?.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-primary/30 transition-colors group"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
        ${isPdf ? 'bg-red-50' : 'bg-blue-50'}`}>
        {isPdf
          ? <FaFilePdf size={18} className="text-red-500" />
          : <MdImage size={18} className="text-blue-500" />
        }
      </div>
      <span className="flex-1 text-sm text-gray-700 truncate">{name}</span>
      <MdDownload size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
    </a>
  );
};

export default JobAttachmentRow;
