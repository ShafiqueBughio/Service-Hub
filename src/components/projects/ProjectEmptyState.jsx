import React from 'react';
import { MdWorkOutline } from 'react-icons/md';

const ProjectEmptyState = ({ tab }) => {
  const messages = {
    pending:   'No pending projects yet.',
    active:    'No active projects at the moment.',
    completed: 'No completed projects yet.',
    cancelled: 'No cancelled projects.',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
        <MdWorkOutline size={32} className="text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">{messages[tab] ?? 'No projects found.'}</p>
    </div>
  );
};

export default ProjectEmptyState;
